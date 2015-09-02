# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

from ...rsr.models.iati_import_log import IatiImportLog

from django.core.files import File
from django.core.files.temp import NamedTemporaryFile
from django.db import DataError

from xml.etree import ElementTree

import datetime
import urllib2


class IatiImportProcess(object):
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

        :param status: Integer based on the IATI import status codes
        """
        self.iati_import.status = status
        self.iati_import.save()

    def get_activities(self):
        """
        Get the activities from iati_import.local_file.

        :return: An ElementTree node; the root node of the XML
        """
        if self.file:
            parsed_xml = ElementTree.parse(self.file)
            activities = parsed_xml.getroot()
            if activities.tag == 'iati-activities':
                activities_count = len(activities.findall('iati-activity'))
                IatiImportLog.objects.create(
                    iati_import=self.iati_import,
                    text=u'Retrieved %s activities.' % str(activities_count) or '0'
                )
                return activities
            else:
                raise DataError(u'Not a valid IATI XML file.')
        else:
            raise DataError(u'No file found.')

    def download_file(self):
        """
        Download the file from iati_import.url and store it in iati_import.local_file.
        """
        tmp_file = NamedTemporaryFile(delete=True)
        tmp_file.write(urllib2.urlopen(self.iati_import.url, timeout=100).read())
        tmp_file.flush()
        filename = u'iati_import_%s.xml' % str(self.iati_import.pk)
        self.iati_import.local_file.save(filename, File(tmp_file))
        IatiImportLog.objects.create(
            iati_import=self.iati_import,
            text=u'Downloaded file from %s.' % str(self.iati_import.url)
        )

    def check_file(self):
        """
        Check if the IATI import has a local_file or url specified. Retrieve the file if
        only the URL is specified.
        """
        if self.iati_import.local_file:
            # File already present.
            # Action; create log entry.
            IatiImportLog.objects.create(
                iati_import=self.iati_import,
                text=u'File found.'
            )
            return

        elif self.iati_import.url:
            # No file, but URL specified.
            # Actions; create log entry, update IATI import status and download file.
            IatiImportLog.objects.create(
                iati_import=self.iati_import,
                text=u'No file found, URL specified.'
            )
            self.download_file()
            return

        else:
            # No file or URL specified.
            # Actions; raise error.
            raise DataError(u'No file or URL specified.')

    def __init__(self, iati_import):
        """
        Initialise the IATI Import process.

        :param iati_import: An IatiImport Django ORM object
        """
        self.iati_import = iati_import
        self.organisation = iati_import.reporting_organisation
        self.user = iati_import.user

        # Start initialize
        self.set_start_date()

        # Check or download file
        self.set_status(2)
        self.check_file()
        self.file = self.iati_import.local_file

        # Start import process
        self.set_status(3)
        self.activities = self.get_activities()
        self.globals = self.activities.items()

        # Import process complete
        self.set_status(4)
        self.set_end_date()
