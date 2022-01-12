# -*- coding: utf-8 -*-

# Akvo Reporting is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

from tablib import Dataset
from django.core.management.base import BaseCommand
from akvo.rsr.models import RelatedProject


class Command(BaseCommand):
    help = "Delete all empty project relations"

    def add_arguments(self, parser):
        parser.add_argument('--delete', action='store_true', help='Actually delete data')

    def handle(self, *args, **options):
        empty_related_projects = RelatedProject.objects\
            .select_related('project', 'related_project')\
            .filter(related_project__isnull=True, related_iati_id__exact='')
        empty_relations = RelatedProject.objects\
            .select_related('project', 'related_project')\
            .filter(relation__exact='')

        if options['delete']:
            empty_related_projects.delete()
            empty_relations.delete()
        else:
            problematic_relations = empty_related_projects.union(empty_relations).order_by('-project_id')
            dataset = Dataset()
            dataset.headers = (
                'project_id',
                'project_title',
                'project_date_end',
                'project_status',
                'program_title',
                'related_project_id',
                'related_project_title',
                'related_project_date_end',
                'related_project_status',
                'related_iati_id',
                'relation',
                'id',
            )
            for item in problematic_relations:
                project = item.project
                related_project = item.related_project
                program = project.get_program()
                dataset.append([
                    project.id,
                    project.title,
                    project.date_end_planned,
                    project.show_plain_status(),
                    program.title if program else None,
                    related_project.id if related_project else None,
                    related_project.title if related_project else None,
                    related_project.date_end_planned if related_project else None,
                    related_project.show_plain_status() if related_project else None,
                    item.related_iati_id,
                    item.iati_relation_unicode(),
                    item.id,
                ])
            print(dataset.export('csv'))
