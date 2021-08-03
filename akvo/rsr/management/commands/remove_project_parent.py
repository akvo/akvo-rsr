# -*- coding: utf-8 -*-

# Akvo Reporting is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

from django.core.management.base import BaseCommand
from akvo.rsr.models import Project
from akvo.rsr.usecases import remove_project_parent as cmd


class Command(BaseCommand):

    def add_arguments(self, parser):
        parser.add_argument('project_id', type=int)

    def handle(self, *args, **options):
        try:
            project = Project.objects.get(id=options['project_id'])
        except Project.DoesNotExist:
            print("Project not found")
            return
        cmd.remove_parent(project)
