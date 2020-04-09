# -*- coding: utf-8 -*-

# Akvo Reporting is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


from django.core.management.base import BaseCommand

from akvo.rsr.models import Project


class Command(BaseCommand):
    help = """Restore indicator periods missing from child projects.

    For consistency in data aggregation, we enforce that child indicators have
    the same periods as the parent. Before we enabled this rule in the UI,
    users could delete periods. This script looks for such indicators and goes
    around fixing them.

    """

    def add_arguments(self, parser):
        parser.add_argument(
            'project_id',
            type=int,
            help='The root project hierarchy under which all projects are fixed',
        )

    def handle(self, *args, **options):
        root_project = Project.objects.get(id=options['project_id'])
        for child, parent in root_project.walk_hierarchy():
            fix_missing_periods(child, parent)


def fix_missing_periods(project, parent_project):
    for result in project.results.all():
        if not result.parent_result_id:
            continue
        for indicator in result.indicators.all():
            if not indicator.parent_indicator_id:
                continue
            if indicator.periods.count() != indicator.parent_indicator.periods.count():
                print('Fixing "{}" on {}'.format(indicator.title, project.id))
                for parent_period in indicator.parent_indicator.periods.all():
                    project.copy_period(indicator, parent_period, set_parent=True)
