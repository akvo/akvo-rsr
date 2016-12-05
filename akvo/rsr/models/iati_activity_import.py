# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

import inspect

from datetime import datetime
from lxml import etree

from django.contrib.admin.models import LogEntry
from django.contrib.contenttypes.models import ContentType
from django.core.exceptions import ObjectDoesNotExist, ValidationError
from django.db import models, transaction
from django.utils.translation import ugettext_lazy as _

from akvo import settings
from akvo.rsr.mixins import TimestampsMixin
from akvo.rsr.models.iati_import_log import LOG_ENTRY_TYPE
from akvo.rsr.models.organisation import Organisation
from akvo.rsr.models.project import Project, MultipleReportingOrgs
from akvo.utils import get_sha1_hash


class IatiIdNotFoundException(Exception):
    pass

class IatiActivityImport(TimestampsMixin):
    """
    The IatiActivityImport tracks the import of one IATI activity. One IatiActivityImport instance
    is created for each activity in IatiImportJob.run() and then the IatiActivityImport.do_import()
    method is called.
    IatiActivityImport is mainly a container for IatiImportLog objects, but holds some info for each
    activity:
    iati_import_job: FK to the job
    project: the project created or updated from the activity XML. Note that this may be None if no
             project was created
    activity_xml: the XML of the activity. Note: this is the generated XML from
                  lxml.etree.tostring representation of the activity XML
    sha1_hexdigest: hash of activity_xml
    iati_identifier: the IATI activity ID of the activity
    """

    ACTION_CODES = (
        (LOG_ENTRY_TYPE.ACTION_CREATE, _(u'create')),
        (LOG_ENTRY_TYPE.ACTION_UPDATE, _(u'update'))
    )

    iati_import_job = models.ForeignKey('IatiImportJob', related_name='iati_activity_imports')
    project = models.ForeignKey(
            'Project', verbose_name=_(u'project'), related_name='iati_project_imports', null=True)
    activity_xml = models.TextField(verbose_name=_('activity xml'))
    sha1_hexdigest = models.CharField(
        max_length=40, verbose_name=_(u'sha1 hexadecimal digest of the activity XML'), blank=True, )
    iati_identifier = models.CharField(max_length=100, verbose_name=_(u'IATI activity ID'))

    def __init__(self, *args, **kwargs):
        self._activity = None
        self._log_objects = []
        super(IatiActivityImport, self).__init__(*args, **kwargs)
        if self.activity_xml and not self.sha1_hexdigest:
            self.set_sha1_hexdigest()

    def __unicode__(self):
        return unicode(u'IATI activity import (ID: {}) in job {}'.format(
                getattr(self, 'pk', ''), self.iati_import_job))
        # return unicode(u'IATI activity import (ID: {})'.format(getattr(self, 'pk', '')))

    class Meta:
        verbose_name = _(u'IATI activity import')
        verbose_name_plural = _(u'IATI activity imports')

    def set_sha1_hexdigest(self):
        self.sha1_hexdigest = get_sha1_hash(self.activity_xml)

    def set_status(self, status):
        """
        Set the status of the import

        :param status: Integer; based on the IATI project import status
        """
        self.status = status
        self.save()

    @property
    def activity(self):
        """
        :return: ElementTree object of the activity
        """
        if not self._activity:
            self._activity = etree.fromstring(self.activity_xml)
        return self._activity

    def publish(self):
        """
        Try to publish the project in case the project is not yet published. Unless an akvo:publish
        attribute is set to False in the 'iati-activity' element.
        """
        if self.project.is_published():
            return

        if  self.activity.attrib.get('{{{}}}publish'.format(settings.AKVO_NS), '').lower() == 'false':
            return

        try:
            self.project.publishingstatus.status = 'published'
            self.project.publishingstatus.full_clean()
            self.project.publishingstatus.save()
        except ValidationError as e:
            message = u'Project could not be published: '
            message += str(e).replace("{'__all__': [", '').replace("u'", "'").replace(']}', '')
            self.add_log(text=message, message_type=LOG_ENTRY_TYPE.CRITICAL_ERROR)

    def create_log_entry(self, action_flag=LOG_ENTRY_TYPE.ACTION_UPDATE, change_message=''):
        """
        Create a record in the django_admin_log table recording the addition or change of a project
        :param action_flag: django.contrib.admin.models ADDITION or CHANGE
        :param change_message: The log message
        """
        LogEntry.objects.log_action(
            user_id=self.iati_import_job.iati_import.user.pk,
            content_type_id=ContentType.objects.get_for_model(self.project).pk,
            object_id=self.project.pk,
            object_repr=self.project.__unicode__(),
            action_flag=action_flag,
            change_message=change_message
        )

    def log_changes(self):
        """
        Log the changes that have been made to the project in the LogEntry model.
        Uses the accumulated list self.changes to create the log message.
        """
        if self.changes:
            message = u"IATI activity import, changed project: {}.".format(
                u", ".join([change for change in self.changes])
            )
            self.create_log_entry(LOG_ENTRY_TYPE.ACTION_UPDATE, message)

    def add_log(self, tag='', field='', text='', message_type=LOG_ENTRY_TYPE.VALUE_NOT_SAVED):
        """
        Add a log entry in the IatiImportLog model.

        :param tag: String; the tag in the iati-activity, possibly with an added @attribute
        :param field: String; the field on the RSR model
        :param text: String; the log message text
        :param severity: Integer, must be one of IatiImportLog.SEVERITY_CODES
        """
        caller = inspect.stack()[1][3]
        from .iati_import_log import IatiImportLog

        text = "IatiActivityImport.{}(): {}".format(caller, text)

        self._log_objects += [IatiImportLog(
                iati_import_job=self.iati_import_job,
                project=self.project,
                iati_activity_import=self,
                message_type=message_type,
                tag=tag,
                field=field,
                text=text,
                created_at=datetime.now(),
        )]

    def set_reporting_org(self):
        """
        Try to set the reporting organisation for the project. Checks are made to make sure the
        organisation exists, is allowed to import data, and that there is no other organisation
        already assigned as reporting for the project. Note that this means that the organisation
        must already exist in RSR for this function to return True.
        :return: Boolean; True if a reporting org was found, False if not
        """
        reporting_org_element = self.activity.find('reporting-org')

        if reporting_org_element is not None and 'ref' in reporting_org_element.attrib.keys():
            iati_org_id = reporting_org_element.attrib.get('ref', None)
            try:
                organisation = Organisation.objects.get(iati_org_id=iati_org_id)
            except ObjectDoesNotExist:
                self.add_log('reporting-org', 'reporting_org',
                             'Reporting organisation not present in RSR.',
                             LOG_ENTRY_TYPE.CRITICAL_ERROR)
                return False

            if not organisation.can_create_projects:
                self.add_log('reporting-org', 'reporting_org',
                        'Reporting organisation, {}, ID: {}, not allowed to import projects in RSR.'.format(
                            organisation.name, organisation.id
                        ), LOG_ENTRY_TYPE.CRITICAL_ERROR)
                return False

            try:
                self.project.set_reporting_org(organisation)
            except MultipleReportingOrgs:
                reporting_org = self.project.reporting_org
                self.add_log('reporting-org', 'reporting_org',
                             'Project has a different reporting-org already, {}, ID: {}.'.format(
                                 reporting_org.name, reporting_org.id),
                             LOG_ENTRY_TYPE.CRITICAL_ERROR)
                return False

            if 'secondary-reporter' in reporting_org_element.attrib.keys():
                reporting_partnership = self.project.reporting_partner
                if reporting_org_element.attrib['secondary-reporter'] == '1':
                    reporting_partnership.is_secondary_reporter = True
                    reporting_partnership.save()
                elif reporting_org_element.attrib['secondary-reporter'] == '0':
                    reporting_partnership.is_secondary_reporter = False
                    reporting_partnership.save()

            return True

        self.add_log('reporting-org', 'reporting_org',
                     'Reporting organisation not correctly specified.',
                     LOG_ENTRY_TYPE.CRITICAL_ERROR)
        return False

    def get_or_create_project(self):
        """
        Get an existing project or create a new project if no existing project can be found
        in the RSR database, based on the IATI identifier.

        :return: Tuple; (Project instance, Boolean indicating whether the project was created)
        """
        iati_identifier_element = self.activity.find('iati-identifier')
        if not iati_identifier_element is None and iati_identifier_element.text:
            self.iati_identifier = iati_identifier_element.text
        else:
            self.add_log('iati-identifier', 'iati_identifier', 'identifier not found',
                         LOG_ENTRY_TYPE.CRITICAL_ERROR)
            raise IatiIdNotFoundException

        self.project, created = Project.objects.get_or_create(
            iati_activity_id=self.iati_identifier
        )
        if created:
            self.create_log_entry(
                    LOG_ENTRY_TYPE.ACTION_CREATE, u'IATI activity import, created project.')

        return created

    def activity_has_changed(self):
        """ Figure out if this activity has been imported already and the XML hasn't changed since
        then
        :return: True or False. True means the activity is new or changed and should be imported
        """
        from . iati_import_job import IatiImportJob
        from . iati_import_log import IatiImportLog

        # find previous job, if there is one
        try:
            # weed out jobs that were cancelled, meaning the XML was stale or broken in some way
            cancelled_jobs = IatiImportLog.objects.filter(
                message_type=LOG_ENTRY_TYPE.STATUS_CANCELLED,
                iati_import_job__iati_import=self.iati_import_job.iati_import,
            ).values_list('iati_import_job', flat=True)
            previous_job = IatiImportJob.objects.filter(
                        iati_import=self.iati_import_job.iati_import
                    ).exclude(
                        pk=self.iati_import_job.pk
                    ).exclude(
                        pk__in=cancelled_jobs).latest()
        except IatiImportJob.DoesNotExist:
            previous_job = None

        # look for the IatiActivityImport instance for this activity in the previous job
        if previous_job:
            try:
                previous_activity = IatiActivityImport.objects.get(
                    iati_identifier=self.iati_identifier, iati_import_job=previous_job)
            except IatiActivityImport.DoesNotExist:
                return True
            if previous_activity.sha1_hexdigest == self.sha1_hexdigest:
                return False
        return True

    def do_import(self, activities_globals):
        """
        Import one iati-activity. The main loop of the method loops over the classes in
        akvo.iati.imports.mappers and using those conducts the mapping of data from the
        iati-activity tree to the RSR models.

        :param activities_globals: the attrib dict of the iati-activities tag
        """
        from .iati_import_log import IatiImportLog

        # list of changes to the Project, used in self.log_changes()
        self.changes = []
        # TODO: better logging messages
        try:
            # get_or_create_project() might fail with a IatiIdNotFoundException
            created = self.get_or_create_project()
            # no use doing anything if the activity XML hasn't changed
            if self.activity_has_changed():
                if created:
                    self.add_log(text=u'creating project', message_type=LOG_ENTRY_TYPE.ACTION_CREATE)
                else:
                    self.add_log(text=u'updating project', message_type=LOG_ENTRY_TYPE.ACTION_UPDATE)

                self.add_log(text=u'working', message_type=LOG_ENTRY_TYPE.STATUS_IN_PROGRESS)
                # if we can't assign a reporting-org we also abort
                if self.set_reporting_org():

                    for Klass in self.iati_import_job.iati_import.model_mappers():

                        klass = None
                        # wrap klass.do_import so we can handle exceptions, log them and continue
                        try:
                            with transaction.atomic():
                                klass = Klass(self.iati_import_job, self.activity, self.project,
                                              activities_globals)
                                changes = klass.do_import()

                        except Exception as e:
                            # we can't save IatiImportLog objects here, they will be rolled back if
                            # the transaction.atomic() call in IatiImportJob.do_import() is rolled
                            # back. So we create the objects and store them in self._log_objects to
                            # be used in a later part of IatiImportJob.do_import().
                            changes = []
                            self._log_objects += [IatiImportLog.objects.create(
                                iati_import_job=self.iati_import_job,
                                project=self.project,
                                iati_activity_import=self,
                                message_type=LOG_ENTRY_TYPE.CRITICAL_ERROR,
                                tag='',
                                field='',
                                text="Exception in {}, error message: \n{}".format(
                                        Klass.__name__, e.message,),
                                created_at=datetime.now()
                            )]
                        if changes:
                            self.changes += changes
                        if klass and klass._log_objects:
                            self._log_objects += klass._log_objects

                    self.log_changes()
                    self.publish()
                    self.add_log(text=u'project imported', message_type=LOG_ENTRY_TYPE.STATUS_COMPLETED)
                else:
                    # if the project was newly created, delete it if we couldn't set a reporting org
                    if created:
                        project = self.project
                        self.project = None
                        self.add_log(text=u'deleting project',
                                     message_type=LOG_ENTRY_TYPE.ACTION_DELETE)
                        project.delete()
            else:
                self.add_log(text=u"project skipped since it hasn't changed",
                             message_type=LOG_ENTRY_TYPE.STATUS_NO_CHANGES)

        except IatiIdNotFoundException:
            self.add_log(text=u'Iati identifier not found', message_type=LOG_ENTRY_TYPE.CRITICAL_ERROR)
