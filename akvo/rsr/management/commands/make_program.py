#!/usr/bin/env python3

# Akvo Reporting is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

""" Make a program from the given project id

Usage:

    python manage.py make_program project_id

"""

from django.core.management.base import BaseCommand

from akvo.rsr.models import Project, ProjectHierarchy


class Command(BaseCommand):
    help = "Make a program from the given project id"

    def add_arguments(self, parser):
        parser.add_argument(
            "project_id",
            type=int,
            help="ID of the project from which to make a program",
        )

    def handle(self, *args, **options):
        project_id = options['project_id']
        assert not ProjectHierarchy.objects.filter(root_project_id=project_id).exists(), 'Program for the project already exists'

        project = Project.objects.get(id=project_id)
        program, created = ProjectHierarchy.objects.get_or_create(root_project=project, max_depth=2)
        print(f'Created program {program.id} from {project_id}')
