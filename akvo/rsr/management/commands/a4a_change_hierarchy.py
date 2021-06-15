# -*- coding: utf-8 -*-

# Akvo Reporting is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


from django.core.management.base import BaseCommand

from akvo.rsr.models import Project


class Command(BaseCommand):
    args = ''
    help = ('Script to change projects for an A4A project')

    def handle(self, *args, **options):
        # FIXME: Tweak to make these arguments, if we get more such requests
        parent_id = 9222  # Innovate
        project_id = 9284

        project = Project.objects.get(id=project_id)
        parent = Project.objects.get(id=parent_id)
        print(f"Modifying project {project.id}")
        project.make_parent_sibling_parent(parent)
