# -*- coding: utf-8 -*-

# Akvo Reporting is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

import hashlib
import inspect
import urllib2

from datetime import datetime
import zipfile

import tablib
from lxml import etree

from django.conf import settings
from django.contrib.admin.models import LogEntry
from django.contrib.contenttypes.models import ContentType
from django.core import urlresolvers
from django.core.files import File
from django.core.files.temp import NamedTemporaryFile
from django.db import models, transaction, IntegrityError
from django.utils.translation import ugettext_lazy as _

from akvo.iati.imports.mappers.CordaidZip.organisations import Organisations
from akvo.rsr.models.iati_import_log import LOG_ENTRY_TYPE
from akvo.rsr.models.organisation import Organisation
from akvo.utils import rsr_send_mail, file_from_zip_archive


def file_path(self, filename):
    return 'db/iati_import/{}'.format(filename)

class IatiImportJob(models.Model):
    """
    The IatiImportJob model records the running of an import once.
    Fields:
    iati_import: the IAtiImport object the job is for
    iati_xml_file: The IATI XML file the import is run for
    status: is used to show various stages of the import and if the job was completed or cancelled
    projects: all projects that were created or updated by the job
    sha1_hexdigest: used to determine if the file has changed compared to the previous job
    """
    SUPPORTED_IATI_VERSIONS = ['1.01', '1.02', '1.03', '1.04', '1.05', '2.01',]
    STATUS_CODES = (
        (LOG_ENTRY_TYPE.STATUS_PENDING, _(u'pending')),
        (LOG_ENTRY_TYPE.STATUS_IN_PROGRESS, _(u'in progress')),
        (LOG_ENTRY_TYPE.STATUS_RETRIEVING, _(u'retrieving')),
        (LOG_ENTRY_TYPE.STATUS_COMPLETED, _(u'completed')),
        (LOG_ENTRY_TYPE.STATUS_CANCELLED, _(u'cancelled')),
    )

    CRITICAL_LOG = 'critical'
    WARNINGS_LOG = 'warnings'
    FULL_LOG = 'full'

    iati_import = models.ForeignKey('IatiImport', related_name='jobs')
    iati_xml_file = models.FileField(_(u'local file'), blank=True, upload_to=file_path)
    status = models.PositiveSmallIntegerField(
            _(u'status'), choices=STATUS_CODES, default=LOG_ENTRY_TYPE.STATUS_PENDING)
    projects = models.ManyToManyField(
        'Project', verbose_name=_(u'projects'), through='IatiActivityImport', blank=True
    )
    sha1_hexdigest = models.CharField(
            max_length=40, verbose_name=_(u'sha1 hexadecimal digest of the XML file'), blank=True,)

    def __init__(self, *args, **kwargs):
        self._log_objects = []
        super(IatiImportJob, self).__init__(*args, **kwargs)

    def __unicode__(self):
        return unicode(u'IATI import job (ID: {}) for {}'.format(self.pk, self.iati_import))
        # return unicode(u'IATI import job (ID: {})'.format(self.pk))

    class Meta:
        app_label = 'rsr'
        verbose_name = _(u'IATI import job')
        verbose_name_plural = _(u'IATI import jobs')
        get_latest_by = 'iati_import_logs__created_at'

    def add_log(self, text, message_type=LOG_ENTRY_TYPE.VALUE_NOT_SAVED):
        """
        Add a log entry in the IatiImportLog model.

        :param text: String; the log message text
        :param severity: Integer, must be one of LOG_ENTRY_TYPE
        """
        if message_type in [code for code, label in self.STATUS_CODES]:
            self.status = message_type
        # get the name of the function where add_log was called
        from .iati_import_log import IatiImportLog
        caller = inspect.stack()[1][3]
        # prefix log text with model and method
        text = "IatiImportJob.{}(): {}".format(caller, text)

        IatiImportLog.objects.create(
            iati_import_job=self,
            message_type=message_type,
            text=text,
            created_at=datetime.now(),
        )

    def save_import_logs(self, iati_activity_import):
        # TODO: Tried using bulk_create here, but got  a pk constraint integrity error, on the
        # IatiImportLog. Really weird. May have to do with the transactions we're in. But
        # bulk_create is much more efficient if one can get it to work.

        for log_obj in iati_activity_import._log_objects:
            # adding the iati_activity_import object here because when doing it in the mappers the
            # iati_activity_import object isn't instantiated yet resulting in the FK being None :-(
            log_obj.iati_activity_import = iati_activity_import
            # if the project associated with the log object was deleted, we get an integrity error
            # here, since we're referring to a project that doesn't exist
            try:
                log_obj.save()
            # in that case, check that project_id is mentioned in the error message, if so remove
            # the FK to the now non-existing project and save again.
            except IntegrityError as e:
                if e.message.find('project_id'):
                    log_obj.project = None
                    log_obj.save()

    def admin_url(self):
        return u'<a href="{}">{}</a>'.format(
                urlresolvers.reverse('admin:rsr_iatiimportjob_change', args=(self.pk,)),
                self.__unicode__())

    admin_url.short_description = "IATI import job"
    admin_url.allow_tags = True

    def show_status(self):
        return dict(map(lambda x: x, self.STATUS_CODES))[self.status]

    def started_at(self):
        return self.iati_import_logs.first().created_at

    def finished_at(self):
        return self.iati_import_logs.last().created_at

    def get_log_list(self, type):
        """
        Create a list of lists, each list being data from a IatiImportLog object. The log objects
        are filtered depending on the type param
        :param type: string; determines the filtering applied
        :return: headers and data for use by tablib.Dataset
        """
        if type == self.CRITICAL_LOG:
            logs = self.iati_import_logs.filter(
                    message_type=LOG_ENTRY_TYPE.CRITICAL_ERROR, iati_import_job=self)
        elif type == self.WARNINGS_LOG:
            logs = self.iati_import_logs.filter(
                    message_type__in=[LOG_ENTRY_TYPE.VALUE_PARTLY_SAVED,
                                      LOG_ENTRY_TYPE.VALUE_NOT_SAVED],
                    iati_import_job=self
            )
        elif type == self.FULL_LOG:
            logs = self.iati_import_logs.filter(iati_import_job=self)
        else:
            logs = []

        records = [
                [
                    log.created_at,
                    log.project.pk if log.project else '',
                    log.project.iati_activity_id if log.project else '',
                    log.show_message_type(),
                    log.text,
                    log.tag,
                    log.model_field()
                ] for log in logs]
        headers = ['Timestamp', 'Project ID', 'Message type', 'Text', 'Tag', 'Model', 'Field']
        return headers, records

    def get_log_csv(self, type):
        """
        Create a dict suitable for use by the EmailMessage.attach() method
        :param type: The type of attachment, used as file name
        :return: dict that can be used as kwargs to EmailMessage.attach()
        """
        headers, records = self.get_log_list(type)
        if records:
            data = tablib.Dataset(*records,headers=headers)
            return [{'filename': "{}.csv".format(type), 'content': data.csv, 'mimetype': 'text/csv'}]
        return []

    def send_mail(self):
        """
        Send an email to the RSR admins (gathered from settings) and the user linked to the
        IATI import instance.
        """

        email_addresses = [email for _name, email in settings.ADMINS]
        email_addresses.append(self.iati_import.user.email)

        attachments = []
        attachments.extend(self.get_log_csv(self.CRITICAL_LOG))
        attachments.extend(self.get_log_csv(self.WARNINGS_LOG))
        attachments.extend(self.get_log_csv(self.FULL_LOG))

        rsr_send_mail(
            email_addresses,
            subject='iati_import/import_done_subject.txt',
            message='iati_import/import_done_message.txt',
            subject_context={
                'iati_import': self.iati_import
            },
            msg_context={
                'iati_import_job': self,
                'project_count': self.projects.count(),
                'projects_created': self.iati_import_logs.filter(
                        message_type=LOG_ENTRY_TYPE.ACTION_CREATE).count(),
                'projects_updated': self.iati_import_logs.filter(
                        message_type=LOG_ENTRY_TYPE.ACTION_UPDATE).count(),
                'projects_published': self.projects.all().published().count(),
                'critical_errors_log': self.iati_import_logs.filter(
                        message_type=LOG_ENTRY_TYPE.CRITICAL_ERROR),
                'warnings_log': self.iati_import_logs.filter(
                        message_type__in=[LOG_ENTRY_TYPE.VALUE_PARTLY_SAVED,
                                          LOG_ENTRY_TYPE.VALUE_NOT_SAVED]
                ),
                'projects_log': self.iati_import_logs.filter(
                        message_type__in=[LOG_ENTRY_TYPE.ACTION_CREATE,
                                          LOG_ENTRY_TYPE.ACTION_UPDATE]
                ),
                'full_log': self.iati_import_logs.filter(iati_import_job=self),
                'LOG_ENTRY_TYPE': LOG_ENTRY_TYPE,
            },
            html_message='iati_import/import_done_message.html',
            attachments=attachments,
        )

    def check_version(self):
        """
        Check if the version of the IATI XML file is specified and supported.
        """
        version = self.activities.attrib.get('version')
        if version:
            if version in self.SUPPORTED_IATI_VERSIONS:
                return True
            else:
                self.add_log(
                        'IATI Version %s not supported' % version, LOG_ENTRY_TYPE.CRITICAL_ERROR)
                return False
        else:
            self.add_log('No version specified', LOG_ENTRY_TYPE.CRITICAL_ERROR)
            return False

    def parse_xml(self, xml_file=None):
        """
        :param xml_file: optional file like object with the XML to parse if not using
                         self.iati_xml_file
        :return: ElementTree root of the XML document if all went well, False if not
        """
        if not xml_file:
            xml_file = self.iati_xml_file
        try:
            parsed_xml = etree.parse(xml_file)
        except Exception as e:
            self.add_log('Error parsing XML file. Error message:\n{}'.format(e.message),
                         LOG_ENTRY_TYPE.CRITICAL_ERROR)
            return False

        activities = parsed_xml.getroot()
        if activities.tag == 'iati-activities':
            self.add_log(
                'Retrieved {} activities'.format(len(activities.findall('iati-activity'))),
                LOG_ENTRY_TYPE.INFORMATIONAL)
            return activities
        else:
            self.add_log('Not a valid IATI XML file, '
                         'iati-activities not root of document.', LOG_ENTRY_TYPE.CRITICAL_ERROR)
            return False

    def get_activities(self):
        """
        Parse self.iati_xml_file. Real work made in parse_xml() so sub-classes can supply
        custom xml file
        :return: ElementTree; the root node of the XML or False when a critical error precludes the
                 continuation of the import
        """
        if self.iati_xml_file:
            return self.parse_xml()
        else:
            self.add_log('No file found', LOG_ENTRY_TYPE.CRITICAL_ERROR)
            return False

    def fetch_file(self):
        """
        Download the file from iati_import.url and store it in iati_import.local_file.
        """
        tmp_file = NamedTemporaryFile(delete=True)
        tmp_file.write(urllib2.urlopen(self.iati_import.url, timeout=100).read())
        tmp_file.flush()
        filename = u'iati_import_%s.xml' % str(self.pk)
        self.iati_xml_file.save(filename, File(tmp_file))
        self.add_log('Downloaded file from %s' % str(self.iati_import.url),
                     LOG_ENTRY_TYPE.INFORMATIONAL)

    def check_file(self):
        """
        Check if the IATI import has a local_file or url specified. Retrieve the file if
        only the URL is specified.
        """
        if self.iati_xml_file:
            # File already present, means manual import.
            self.add_log('Using uploaded file: {}'.format(self.iati_xml_file), LOG_ENTRY_TYPE.INFORMATIONAL)
            return True

        elif self.iati_import.url:
            # No file, but URL specified. Download file from URL.
            self.add_log('Fetching file from URL: {}'.format(self.iati_import.url),
                         LOG_ENTRY_TYPE.INFORMATIONAL)
            try:
                self.fetch_file()
                return True
            except Exception as e:
                self.add_log('Error while fetching file from URL. '
                             'Error message:\n{}'.format(e.message),
                             LOG_ENTRY_TYPE.CRITICAL_ERROR)
        else:
        # No file or URL specified.
            self.add_log('No file or URL specified', LOG_ENTRY_TYPE.CRITICAL_ERROR)

        self.add_log(u"Import cancelled. File missing.", LOG_ENTRY_TYPE.STATUS_CANCELLED)
        return False

    def is_new_file(self):
        """ Returns True if this job's xml file is the same as the previous job's, otherwise False.
         Sameness is based on the sha1 hash of the file.
        """
        if self.iati_xml_file:
            f = self.iati_xml_file.file
            f.open('rb')
            hash = hashlib.sha1()
            if f.multiple_chunks():
                for chunk in f.chunks():
                    hash.update(chunk)
            else:
                hash.update(f.read())
            # re-open the file for further processing
            f.open('r')
            self.sha1_hexdigest = hash.hexdigest()
            self.save()

        try:
            # TODO: this filter fails when the previous job completed, but no activities were
            # imported. This can happen if the reporting-org isn't allowed to create projects
            previous_job = self.iati_import.jobs.exclude(pk=self.pk).filter(
                    status=LOG_ENTRY_TYPE.STATUS_COMPLETED).latest()
        except IatiImportJob.DoesNotExist:
            previous_job = None

        if previous_job and previous_job.sha1_hexdigest == self.sha1_hexdigest:
            self.add_log(u"Import cancelled since the file hasn't changed since last import.",
                         LOG_ENTRY_TYPE.STATUS_CANCELLED)
            return False

        return True

    def run(self):
        """
        Main loop method. Gets and checks the IATI activites file and imports the activities if
        all's well.
        """
        from akvo.rsr.models.iati_activity_import import IatiActivityImport

        # Start initialize
        self.add_log(u'Starting import job.', LOG_ENTRY_TYPE.INFORMATIONAL)
        self.add_log(u'Fetching and parsing XML file.', LOG_ENTRY_TYPE.STATUS_RETRIEVING)

        if self.check_file() and self.is_new_file():

            # Start import process
            self.activities = self.get_activities()
            if self.activities and self.check_version():
                self.add_log(u'Importing activities.', LOG_ENTRY_TYPE.STATUS_IN_PROGRESS)
                for activity in self.activities.findall('iati-activity'):

                    iati_activity_import = None
                    try:
                        with transaction.atomic():
                            iati_activity_import = IatiActivityImport(
                                    iati_import_job=self, activity_xml=etree.tostring(activity))
                            iati_activity_import.do_import(self.activities.attrib)
                            iati_activity_import.save()

                    except Exception as e:
                        self.add_log(u"Error when running import of activity. "
                                     u"Error message:\n{}".format(e.message),
                                     LOG_ENTRY_TYPE.CRITICAL_ERROR)

                    if iati_activity_import:
                        self.save_import_logs(iati_activity_import)

                # Import process complete
                self.add_log(u'Import finished.', LOG_ENTRY_TYPE.STATUS_COMPLETED)
        self.send_mail()
        self.add_log(u'Job finished.', LOG_ENTRY_TYPE.INFORMATIONAL)


class CordaidZipIatiImportJob(IatiImportJob):
    """
    Custom job for Coradiad's ZIP archive IATI delivery
    """

    class Meta:
        proxy = True

    def import_organisations(self):
        ORGANISATIONS_FILENAME = 'akvo-organizations.xml'
        ORGANISATIONS_ROOT = 'Relations'
        ORGANISATIONS_CHILDREN = 'object'
        CORDAID_ORG_ID = 273
        self.add_log(u'CordaidZip: Starting organisations import.', LOG_ENTRY_TYPE.INFORMATIONAL)
        organisations_xml = self.get_xml_file(ORGANISATIONS_FILENAME)
        organisations = self.parse_xml(
                organisations_xml, ORGANISATIONS_ROOT, ORGANISATIONS_CHILDREN)
        cordaid = Organisation.objects.get(pk=CORDAID_ORG_ID)
        if organisations:
            for object in organisations.findall(ORGANISATIONS_CHILDREN):
                try:
                    org_mapper = Organisations(self, object, None, {'cordaid': cordaid})
                    organisation, changes, created = org_mapper.do_import()
                    if created:
                        self.log_creation(organisation)
                    else:
                        self.log_changes(organisation, changes)
                except Exception as e:
                    self.add_log(
                            u'CordaidZip: Critical error when importing '
                            u'organisations: {}'.format(e.message),
                            LOG_ENTRY_TYPE.CRITICAL_ERROR)

        self.add_log(u'CordaidZip: Organisations import done.', LOG_ENTRY_TYPE.INFORMATIONAL)

    def create_log_entry(self, organisation, action_flag=LOG_ENTRY_TYPE.ACTION_UPDATE,
                         change_message=''):
        """
        Create a record in the django_admin_log table recording the addition or change of a project
        :param action_flag: django.contrib.admin.models ADDITION or CHANGE
        :param change_message: The log message
        """
        LogEntry.objects.log_action(
            user_id=self.iati_import.user.pk,
            content_type_id=ContentType.objects.get_for_model(organisation).pk,
            object_id=organisation.pk,
            object_repr=organisation.__unicode__(),
            action_flag=action_flag,
            change_message=change_message
        )

    def log_changes(self, organisation, changes):
        """
        Log the changes that have been made to the organisation in the LogEntry model.
        The changes list holds the names of the changed fields
        """
        if changes:
            message = u"CordaidZip: IATI activity import, changed organisation: {}.".format(
                u", ".join([change for change in changes])
            )
            self.create_log_entry(organisation, LOG_ENTRY_TYPE.ACTION_UPDATE, message)

    def log_creation(self, organisation):
        """
        Log the creation of an organisation in the LogEntry model.
        """
        message = u"CordaidZip: IATI activity import, created organisation: {}.".format(
                organisation.__unicode__())
        self.create_log_entry(organisation, LOG_ENTRY_TYPE.ACTION_CREATE, message)

    def parse_xml(self, xml_file, root_tag='', children_tag=''):
        """
        :param xml_file: optional file like object with the XML to parse if not using
                         self.iati_xml_file
        :return: ElementTree root of the XML document if all went well, False if not
        """
        try:
            parsed_xml = etree.parse(xml_file)
        except Exception as e:
            self.add_log('Error parsing XML file. Error message:\n{}'.format(e.message),
                         LOG_ENTRY_TYPE.CRITICAL_ERROR)
            return False

        objects = parsed_xml.getroot()
        if objects.tag == root_tag:
            self.add_log(
                    'CordaidZip: Retrieved {} <{}> objects'.format(
                        len(objects.findall(children_tag)), children_tag),
                    LOG_ENTRY_TYPE.INFORMATIONAL)
            return objects
        else:
            self.add_log('CordaidZip Not a valid XML file, '
                         '{} not root of document.'.format(root_tag), LOG_ENTRY_TYPE.CRITICAL_ERROR)
            return False

    def get_xml_file(self, file_name):
        """
        Find and return the named XML file from the Cordaid Zip archive
        """
        if self.iati_xml_file and zipfile.is_zipfile(self.iati_xml_file):
            xml_file = file_from_zip_archive(self.iati_xml_file, file_name)
            if xml_file:
                return xml_file
            else:
                self.add_log('CordaidZip: {} file not found in ZIP.'.format(file_name),
                             LOG_ENTRY_TYPE.CRITICAL_ERROR)
                return None

    def get_activities_file(self):
        """
        Find and return the Cordaid archive contains the iati-activities.xml file
        """
        ACTIVITIES_FILENAME = 'iati-activities.xml'
        return self.get_xml_file(ACTIVITIES_FILENAME)

    def get_activities(self):
        """
        Get the XML from the Cordaid ZIP and then call parse_xml() to try parsing it

        :return: ElementTree; the root node of the XML or False when a critical error precludes the
                 continuation of the import
        """
        IATI_XML_ACTIVITIES = 'iati-activities'
        IATI_XML_ACTIVITY = 'iati-activity'
        xml = self.get_activities_file()
        if xml:
            return self.parse_xml(xml, IATI_XML_ACTIVITIES, IATI_XML_ACTIVITY)
        else:
            return False

    def check_file(self):
        """
        Check that the Cordaid archive contains the iati-activities.xml file
        """
        file = self.get_activities_file()
        if file:
            # Cordaid zip delivery found, let's get the iati activities
            self.add_log('Using iati-activities.xml from the Cordaid ZIP: {}'.format(self.iati_xml_file),
                         LOG_ENTRY_TYPE.INFORMATIONAL)
            return True

        self.add_log(u"Import cancelled. File missing.", LOG_ENTRY_TYPE.STATUS_CANCELLED)
        return False

    def run(self):
        self.import_organisations()
        super(CordaidZipIatiImportJob, self).run()

