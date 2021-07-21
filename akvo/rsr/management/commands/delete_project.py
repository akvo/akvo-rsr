# -*- coding: utf-8 -*-

# Akvo Reporting is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

from django.core.management.base import BaseCommand
from akvo.rsr.models import Project, IndicatorPeriodData


class Command(BaseCommand):

    def add_arguments(self, parser):
        parser.add_argument('project_id', type=int)
        parser.add_argument(
            '--delete',
            action='store_true',
            dest='delete',
            default=False,
            help='Actually delete project'
        )

    def handle(self, *args, **options):
        try:
            project = Project.objects.get(id=options['project_id'])
        except Project.DoesNotExist:
            print("Project not found")
            return

        updates = IndicatorPeriodData.objects.filter(period__indicator__result__project=project)
        if options['delete']:
            print(f"Deleting project {project.title} (ID: {project.pk})")
            print(f"Deleting {updates.count()} period updates")
            updates.delete()
            project.delete()
        else:
            print(f"Found project {project.title} (ID: {project.pk})")
            print(f"Found period updates: {updates.count()}")
