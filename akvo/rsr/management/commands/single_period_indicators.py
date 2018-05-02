# -*- coding: utf-8 -*-

# Akvo Reporting is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

import tablib

from django.conf import settings
from django.core.management.base import BaseCommand

from akvo.rsr.models import IndicatorPeriodData
from ...models import Project, Indicator, IndicatorPeriod


class Command(BaseCommand):
    args = '<name> <all | ids of projects>'
    help = ('Convert a project hierarchy to use single period reporting')

    def handle(self, *args, **options):

        def set_period_dates(period):
            period.period_start = start_date
            period.period_end = end_date
            period.save()

        name = args[0]
        config = settings.SINGLE_PERIOD_INDICATORS[name]
        start_date, end_date = config['start_date'], config['end_date']
        if args[1] == 'all':
            pk = config['pk']
            root = Project.objects.get(pk=pk)
            projects = root.descendants()
        else:
            projects = Project.objects.filter(id__in=map(int, args[1:]))

        data = tablib.Dataset(
            headers=[
                'Project ID',
                'Result ID',
                'Result title',
                'Indicator ID',
                'Indicator title',
                'Comment',
            ])

        for project in projects:
            for indicator in Indicator.objects.filter(
                    result__project=project).select_related('result'):
                periods = IndicatorPeriod.objects.filter(
                    indicator=indicator).order_by('-period_end')
                period_count = periods.count()
                row_data = [
                    project.pk,
                    indicator.result.pk,
                    indicator.result.title.replace('\t', ' ').replace('\n', ' '),
                    indicator.pk,
                    indicator.title.replace('\t', ' ').replace('\n', ' '),
                ]
                if period_count == 0:
                    period = IndicatorPeriod.objects.create(
                        indicator=indicator,
                        period_start=start_date,
                        period_end=end_date
                    )
                    row_data += ['Created period: {}'.format(period.pk)]
                elif period_count == 1:
                    period = periods[0]
                    set_period_dates(period)
                    row_data += ['Modified period: {}'.format(period.pk)]
                else:
                    updates = IndicatorPeriodData.objects.filter(period__in=periods)
                    if updates.count() > 0:
                        row_data += ['Multiple periods, at least one with updates']
                    else:
                        for period in periods[1:]:
                            period.delete()
                        set_period_dates(periods[0])
                        row_data += ['Deleted {} periods, set dates on period {}'.format(
                            period_count - 1, periods[0]
                        )]

                data.append(row_data)
        # Exporting as tsv results in errors I can't explain in som cases, columns get merged :-(
        print data.export('csv')
