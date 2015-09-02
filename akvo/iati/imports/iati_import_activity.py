# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

from ...rsr.exceptions import ProjectException

from django.db.models import get_model

import datetime


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

    def set_sync_owner(self):
        """
        Check if the project can be edited by the current reporting organisation and set
        the sync_owner.
        """
        sync_owner = self.project.sync_owner
        if not self.created and sync_owner and sync_owner != self.organisation:
            self.set_status(4)
            raise ProjectException({
                'message': u'Project has a different sync_owner: %s' % sync_owner.name,
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

        # Import process finished
        self.set_status(3)
        self.set_end_date()
