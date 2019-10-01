# -*- coding: utf-8 -*-

# Akvo Reporting is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

"""Move permissions that use UserProjects to ProjectRole based permissions

Usage:

    python manage.py user_projects_to_project_roles

"""

from django.core.management.base import BaseCommand

from akvo.rsr.models import Organisation, UserProjects, ProjectRole


class Command(BaseCommand):
    help = __doc__

    def handle(self, *args, **options):
        enable_restrictions_orgs = Organisation.objects.filter(enable_restrictions=True)
        enable_restrictions_orgs.update(use_project_roles=True)

        for user_projects in UserProjects.objects.filter(is_restricted=True):
            user = user_projects.user
            employments = user.employers.filter(organisation__use_project_roles=True)
            employments_count = employments.count()
            if employments_count == 0:
                print('Could not find an employment for the user {}'.format(user))
                continue

            for employment in employments:
                group = employment.group
                user_projects.projects.update(use_project_roles=True)
                for project in user_projects.projects.all():
                    ProjectRole.objects.create(user=user, project=project, group=group)
