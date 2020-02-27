# -*- coding: utf-8 -*-

# Akvo Reporting is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

"""Move permissions that use UserProjects to ProjectRole based permissions

Usage:

    python manage.py user_projects_to_project_roles

"""

from django.core.management.base import BaseCommand

from akvo.rsr.models import Organisation, UserProjects, ProjectHierarchy, ProjectRole


class Command(BaseCommand):
    help = __doc__

    def handle(self, *args, **options):
        # Convert UserProjects to corresponding project roles
        all_user_projects = UserProjects.objects.filter(is_restricted=True)
        for user_projects in all_user_projects:
            create_project_roles_from_user_projects(user_projects)
        all_user_projects.delete()

        # Turn on use_project_roles on orgs where enable_restrictions was on
        enable_restrictions_orgs = Organisation.objects.filter(enable_restrictions=True)
        enable_restrictions_orgs.update(use_project_roles=True)
        # Delete collaborator orgs
        enable_restrictions_orgs.content_owned_organisations().filter(name__icontains='Collaborator:').delete()

        # Mark projects in restricted hierarchies as restricted projects
        hierarchies = ProjectHierarchy.objects.filter(organisation__in=enable_restrictions_orgs)
        for hierarchy in hierarchies:
            hierarchy.root_project.descendants().update(use_project_roles=True)

        # Turn off enable_restrictions on those orgs
        enable_restrictions_orgs.update(enable_restrictions=False)


def create_project_roles_from_user_projects(user_projects):
    user = user_projects.user
    employments = user.employers.filter(organisation__enable_restrictions=True)
    employments_count = employments.count()
    if employments_count == 0:
        print('Could not find an employment for the user {}'.format(user))
        return

    for employment in employments:
        group = employment.group
        user_projects.projects.update(use_project_roles=True)
        for project in user_projects.projects.all():
            ProjectRole.objects.create(user=user, project=project, group=group)
