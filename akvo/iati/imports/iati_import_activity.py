# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

from ...rsr.models.iati_import_log import IatiImportLog
from ...rsr.models.iati_project_import import IatiProjectImport
from .utils import add_log

from django.conf import settings
from django.contrib.admin.models import LogEntry, ADDITION, CHANGE
from django.contrib.contenttypes.models import ContentType
from django.core.exceptions import ValidationError
from django.db import transaction
from django.db.models import get_model, ObjectDoesNotExist

import datetime
import fields

FIELDS = [
    'title',
    'subtitle',
    'status',
    'project_plan_summary',
    'goals_overview',
    'background',
    'current_status',
    'target_group',
    'project_plan',
    'sustainability',
    'custom_fields',
    'planned_start_date',
    'actual_start_date',
    'planned_end_date',
    'actual_end_date',
    'current_image',
    'language',
    'currency',
    'hierarchy',
    'scope',
    'collaboration_type',
    'default_aid_type',
    'default_finance_type',
    'default_flow_type',
    'default_tied_status',
    'budget_items',
    'country_budget_items',
    'capital_spend',
    'transactions',
    'planned_disbursements',
    'partnerships',
    'related_projects',
    'contacts',
    'results',
    'conditions',
    'locations',
    'recipient_countries',
    'recipient_regions',
    'sectors',
    'policy_markers',
    'links',
    'documents',
    'legacy_data',
    'crs_add',
    'fss',
]


class IatiImportActivity(object):
    def set_start_date(self):
        """
        Set the start date of the project import.
        """
        self.project_import_log.start_date = datetime.datetime.now()
        self.project_import_log.save()

    def set_end_date(self):
        """
        Set the end date of the project import.
        """
        self.project_import_log.end_date = datetime.datetime.now()
        self.project_import_log.save()

    def set_status(self, status):
        """
        Set the status of the import

        :param status: Integer; based on the IATI project import status
        """
        self.project_import_log.status = status
        self.project_import_log.save()

    def publish(self):
        """
        Try to publish the project in case the project is not yet published. Unless an akvo:publish
        attribute is set to False in the 'iati-activity' element.
        """
        if self.project.is_published():
            return

        if '{%s}publish' % settings.AKVO_NS in self.activity.attrib.keys() and \
                self.activity.attrib['{%s}publish' % settings.AKVO_NS].lower() == 'false':
            return

        try:
            self.project.publishingstatus.status = 'published'
            self.project.publishingstatus.full_clean()
            self.project.publishingstatus.save()
        except ValidationError as e:
            message = u'Project could not be published: '
            message += str(e).replace("{'__all__': [", '').replace("u'", "'").replace(']}', '')
            add_log(self.iati_import, 'publish', message, self.project,
                    IatiImportLog.CRITICAL_ERROR)

    def log_changes(self):
        """
        Log the changes that have been made to the project in the LogEntry model.
        """
        if self.changes:
            message = u"IATI import, changed: {}.".format(
                u", ".join([change for change in self.changes])
            )

            LogEntry.objects.log_action(
                user_id=self.user.pk,
                content_type_id=ContentType.objects.get_for_model(self.project).pk,
                object_id=self.project.pk,
                object_repr=self.project.__unicode__(),
                action_flag=CHANGE,
                change_message=message
            )

    def set_reporting_org(self):
        reporting_org = self.project.reporting_org
        reporting_org_element = self.activity.find('reporting-org')

        if not reporting_org_element is None and 'ref' in reporting_org_element.attrib.keys():
            iati_org_id = reporting_org_element.attrib['ref']
            try:
                organisation = get_model('rsr', 'organisation').objects.get(iati_org_id=iati_org_id)
            except ObjectDoesNotExist:
                add_log(self.iati_import, 'reporting_org',
                        'Reporting organisation not present in RSR.', self.project,
                        IatiImportLog.CRITICAL_ERROR)
                return False

            if not organisation.can_create_projects:
                add_log(self.iati_import, 'reporting_org',
                        'Reporting organisation not allowed to import projects in RSR.',
                        self.project, IatiImportLog.CRITICAL_ERROR)
                return False

            if not self.created and reporting_org and reporting_org != organisation:
                add_log(self.iati_import, 'reporting_org',
                        'Project has a different reporting-org already (%s).' % reporting_org.name,
                        self.project, IatiImportLog.CRITICAL_ERROR)
                return False

            self.project.set_reporting_org(organisation)

            if 'secondary-reporter' in reporting_org_element.attrib.keys():
                if reporting_org_element.attrib['secondary-reporter'] == '1':
                    self.project.reporting_partner.is_secondary_reporter = True
                    self.project.reporting_partner.save()
                elif reporting_org_element.attrib['secondary-reporter'] == '0':
                    self.project.reporting_partner.is_secondary_reporter = False
                    self.project.reporting_partner.save()

            return True

        add_log(self.iati_import, 'reporting_org',
                'Reporting organisation not correctly specified.', self.project,
                IatiImportLog.CRITICAL_ERROR)
        return False


    def get_or_create_project(self):
        """
        Get an existing project or create a new project if no existing project can be found
        in the RSR database, based on the IATI identifier.

        :return: Tuple; (Project instance, Boolean indicating whether the project was created)
        """
        iati_identifier_element = self.activity.find('iati-identifier')
        if not iati_identifier_element is None and iati_identifier_element.text:
            iati_identifier = iati_identifier_element.text
        else:
            add_log(self.iati_import, 'iati_identifier', 'identifier not found', self.project,
                    IatiImportLog.CRITICAL_ERROR)
            return None, None

        project, created = get_model('rsr', 'project').objects.get_or_create(
            iati_activity_id=iati_identifier
        )

        if created:
            LogEntry.objects.log_action(
                user_id=self.user.pk,
                content_type_id=ContentType.objects.get_for_model(project).pk,
                object_id=project.pk,
                object_repr=project.__unicode__(),
                action_flag=ADDITION,
                change_message=u'IATI import, created project.'
            )

        return project, created

    def __init__(self, iati_import, activity, user, activities_globals):
        """
        Initialize the IATI activity process.

        :param iati_import: IatiImport instance
        :param activity: ElementTree; the root node of the IATI activity
        :param user: User instance
        :param activities_globals: Dictionary; contains all global variables
        """
        self.iati_import = iati_import
        self.activity = activity
        self.user = user
        self.globals = activities_globals
        self.changes = []

        # Get or create project
        self.project, self.created = self.get_or_create_project()
        act = IatiProjectImport.CREATE_ACTION if self.created else IatiProjectImport.UPDATE_ACTION
        if self.project:
            self.project_import_log = get_model('rsr', 'iatiprojectimport').objects.create(
                iati_import=self.iati_import,
                project=self.project,
                action=act
            )

            # Start import process
            self.set_status(IatiProjectImport.IN_PROGRESS_STATUS)
            self.set_start_date()
            if self.set_reporting_org():
                for field in FIELDS:
                    try:
                        with transaction.atomic():
                            changes = getattr(fields, field)(
                                self.iati_import, self.activity, self.project, self.globals
                            )
                    except Exception as e:
                        changes = []
                        add_log(self.iati_import, field, str(e), self.project,
                                IatiImportLog.CRITICAL_ERROR)

                    for change in changes:
                        self.changes.append(change)

                self.log_changes()
                self.publish()
                self.set_status(IatiProjectImport.COMPLETED_STATUS)

        # Import process finished
        if not self.iati_import.status == IatiProjectImport.COMPLETED_STATUS:
            self.set_status(IatiProjectImport.CANCELLED_STATUS)
        self.set_end_date()
