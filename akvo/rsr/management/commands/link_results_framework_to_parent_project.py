# -*- coding: utf-8 -*-

# Akvo Reporting is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

from django.core.management.base import BaseCommand

from akvo.rsr.models import Project


class Command(BaseCommand):

    def add_arguments(self, parser):
        parser.add_argument('project_id', type=int)

    def handle(self, *args, **options):
        project = Project.objects.get(id=options['project_id'])
        parent = project.parents_all().first()

        for result in project.results.all():
            parent_result = parent.results.get(title=result.title)
            result.parent_result = parent_result
            result.save(update_fields=['parent_result'])

            for indicator in result.indicators.all():
                parent_indicator = parent_result.indicators.get(title=indicator.title)
                indicator.parent_indicator = parent_indicator
                indicator.save(update_fields=['parent_indicator'])

                for period in indicator.periods.all():
                    parent_period = parent_indicator.periods.get(period_start=period.period_start, period_end=period.period_end)
                    period.parent_period = parent_period
                    period.save(update_fields=['parent_period'])
                    parent_period.recalculate_period()
