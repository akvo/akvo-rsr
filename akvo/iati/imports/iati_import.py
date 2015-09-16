# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

from .iati_import_activity import IatiImportActivity
from .utils import add_log
from akvo.utils import rsr_send_mail

from django.conf import settings
from django.core.files import File
from django.core.files.temp import NamedTemporaryFile
from django.db import transaction

from xml.etree import ElementTree

import datetime
import urllib2


class IatiImportProcess(object):
    def send_mail(self):
        """
        Send an email to the RSR admins (gathered from settings) and the user linked to the
        IATI import instance.
        """
        email_addresses = [email for _name, email in settings.ADMINS]
        email_addresses.append(self.user.email)

        rsr_send_mail(
            email_addresses,
            subject='iati_import/import_done_subject.txt',
            message='iati_import/import_done_message.html',
            subject_context={
                'iati_import': self.iati_import
            },
            msg_context={
                'iati_import': self.iati_import,
                'project_count': self.iati_import.iati_project_imports.count(),
                'projects_created': self.iati_import.iati_project_imports.filter(action=1).count(),
                'projects_updated': self.iati_import.iati_project_imports.filter(action=2).count(),
                'projects_published': self.iati_import.projects.published().count(),
                'critical_errors_log': self.iati_import.iati_import_logs.filter(severity=1),
                'warnings_log': self.iati_import.iati_import_logs.filter(severity__in=[2, 3]),
                'projects_log': self.iati_import.iati_project_imports.all()
            },
        )

    def set_start_date(self):
        """
        Set the start date of the IATI import.
        """
        self.iati_import.start_date = datetime.datetime.now()
        self.iati_import.save()

    def set_end_date(self):
        """
        Set the end date of the IATI import.
        """
        self.iati_import.end_date = datetime.datetime.now()
        self.iati_import.save()

    def set_status(self, status):
        """
        Set the status of the IATI import.

        :param status: Integer; based on the IATI import status codes
        """
        self.iati_import.status = status
        self.iati_import.save()

    def check_version(self):
        """
        Check if the version of the IATI XML file is specified and supported.
        """
        if 'version' in self.activities.attrib.keys():
            version = self.activities.attrib['version']
            if version in self.SUPPORTED_VERSIONS:
                return True
            else:
                add_log(self.iati_import, 'general', 'Version %s not supported' % version, None, 1)
                return False
        else:
            add_log(self.iati_import, 'general', 'No version specified', None, 1)
            return False

    def get_activities(self):
        """
        Get the activities from iati_import.local_file.

        :return: ElementTree; the root node of the XML
        """
        if self.file:
            try:
                parsed_xml = ElementTree.parse(self.file)
            except ElementTree.ParseError:
                add_log(self.iati_import, 'general', 'Not a valid XML file', None, 1)
                return False
            activities = parsed_xml.getroot()
            if activities.tag == 'iati-activities':
                activities_count = len(activities.findall('iati-activity'))
                add_log(self.iati_import, 'general',
                        'Retrieved %s activities' % str(activities_count) or '0', None, 0)
                return activities
            else:
                add_log(self.iati_import, 'general', 'Not a valid IATI XML file', None, 1)
                return False
        else:
            add_log(self.iati_import, 'general', 'No file found', None, 1)
            return False

    def download_file(self):
        """
        Download the file from iati_import.url and store it in iati_import.local_file.
        """
        tmp_file = NamedTemporaryFile(delete=True)
        tmp_file.write(urllib2.urlopen(self.iati_import.url, timeout=100).read())
        tmp_file.flush()
        filename = u'iati_import_%s.xml' % str(self.iati_import.pk)
        self.iati_import.local_file.save(filename, File(tmp_file))
        add_log(self.iati_import, 'general', 'Downloaded file from %s' % str(self.iati_import.url),
                None, 0)

    def check_file(self):
        """
        Check if the IATI import has a local_file or url specified. Retrieve the file if
        only the URL is specified.
        """
        if self.iati_import.local_file:
            # File already present.
            add_log(self.iati_import, 'general', 'File found', None, 0)
            return True

        elif self.iati_import.url:
            # No file, but URL specified. Download file from URL.
            add_log(self.iati_import, 'general', 'No file found, URL specified', None, 0)
            try:
                self.download_file()
                return True
            except Exception as e:
                add_log(self.iati_import, 'general', 'Error while downloading file: %s' % str(e),
                        None, 1)
                return False

        # No file or URL specified.
        add_log(self.iati_import, 'general', 'No file or URL specified', None, 1)
        return False

    def __init__(self, iati_import):
        """
        Initialise the IATI Import process.

        :param iati_import: IatiImport instance
        """
        self.SUPPORTED_VERSIONS = [
            '1.01',
            '1.02',
            '1.03',
            '1.04',
            '1.05',
            '2.01',
        ]

        self.iati_import = iati_import
        self.organisation = iati_import.reporting_organisation
        self.user = iati_import.user

        # Start initialize
        self.set_start_date()

        # Check or download file
        self.set_status(2)
        if self.check_file():

            # Start import process
            self.set_status(3)
            self.file = self.iati_import.local_file
            self.activities = self.get_activities()
            if self.activities and self.check_version():
                for activity in self.activities.findall('iati-activity'):
                    try:
                        with transaction.atomic():
                            IatiImportActivity(self.iati_import, activity, self.organisation,
                                               self.user, self.activities.attrib)
                    except Exception as e:
                        add_log(self.iati_import, 'activity_error', str(e), None, 1)

                # Import process complete
                self.set_status(4)

        # Finish import
        if not self.iati_import.status == 4:
            self.set_status(5)
        self.set_end_date()
        self.send_mail()
