# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

from django.contrib.admin.models import LogEntry, CHANGE
from django.contrib.contenttypes.models import ContentType
from django.db.models import get_model

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
    'planned_start_date',
    'actual_start_date',
    'planned_end_date',
    'actual_end_date',
    'current_image',
    'language',
    'currency',
    'hierarchy',
    'scope',
    'default_aid_type',
    'default_finance_type',
    'default_flow_type',
    'default_tied_status',
    'partnerships',
    'related_projects',
    'contacts',
    'results',
    'conditions',
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

    def set_errors_true(self):
        """
        Set the errors flag of the project import to True.
        """
        self.project_import_log.errors = True
        self.project_import_log.save()

    def log_changes(self):
        """
        Log the changes that have been made to the project in the LogEntry model.
        """
        if self.changes:
            message = u'IATI import, changed: '
            for change in self.changes:
                message += u'%s, ' % change
            message = message[:-2] + u'.'

            LogEntry.objects.log_action(
                user_id=self.user.pk,
                content_type_id=ContentType.objects.get_for_model(self.project).pk,
                object_id=self.project.pk,
                object_repr=self.project.__unicode__(),
                action_flag=CHANGE,
                change_message=message
            )

    def set_sync_owner(self):
        """
        Check if the project can be edited by the current reporting organisation and set
        the sync_owner.
        """
        sync_owner = self.project.sync_owner
        if not self.created and sync_owner and sync_owner != self.organisation:
            self.set_end_date()
            self.set_status(4)
            self.set_errors_true()
            raise Exception({
                'message': u'sync_owner: Project has a different sync_owner (%s).' %
                           sync_owner.name,
                'project': self.project
            })
        self.project.sync_owner = self.organisation
        self.project.save()

    def get_or_create_project(self):
        """
        Get an existing project or create a new project if no existing project can be found
        in the RSR database, based on the IATI identifier.

        :return: Tuple; (Project instance, Boolean indicating whether the project was created)
        """
        iati_identifier = self.activity.find('iati-identifier').text
        return get_model('rsr', 'project').objects.get_or_create(iati_activity_id=iati_identifier)

    def __init__(self, iati_import, activity, reporting_organisation, user, activities_globals):
        """
        Initialize the IATI activity process.

        :param iati_import: IatiImport instance
        :param activity: ElementTree; the root node of the IATI activity
        :param reporting_organisation: Organisation instance
        :param user: User instance
        :param activities_globals: Dictionary; contains all global variables
        """
        self.iati_import = iati_import
        self.activity = activity
        self.organisation = reporting_organisation
        self.user = user
        self.globals = activities_globals
        self.changes = []

        # Get or create project
        self.project, self.created = self.get_or_create_project()
        self.project_import_log = get_model('rsr', 'iatiprojectimport').objects.create(
            iati_import=self.iati_import,
            project=self.project,
            action=1 if self.created else 2
        )

        # Start import process
        self.set_status(2)
        self.set_start_date()
        self.set_sync_owner()

        for field in FIELDS:
            try:
                changes = getattr(fields, field)(self.activity, self.project, self.globals)
            except Exception as e:
                changes = []
                if isinstance(e, basestring):
                    text = e
                else:
                    try:
                        text = u", ".join(str(e_part) for e_part in e)
                    except TypeError:
                        text = e
                get_model('rsr', 'iatiimportlog').objects.create(
                    iati_import=self.iati_import,
                    text=u'%s: %s.' % (field, text),
                    project=self.project,
                    error=True
                )

            for change in changes:
                self.changes.append(change)

        self.log_changes()

        # Import process finished
        self.set_status(3)
        self.set_end_date()
