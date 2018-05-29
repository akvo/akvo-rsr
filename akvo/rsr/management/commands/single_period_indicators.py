# -*- coding: utf-8 -*-

# Akvo Reporting is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

import tablib

from django.conf import settings
from django.core.management.base import BaseCommand

from optparse import make_option

from akvo.rsr.models import IndicatorPeriodData
from akvo.utils import single_period_dates
from ...models import Project, Indicator, IndicatorPeriod


class Command(BaseCommand):
    args = '<name> <all | ids of projects>'
    help = ('Convert a project hierarchy to use single period reporting')

    option_list = BaseCommand.option_list + (
        make_option('--live',
                    action='store_true',
                    dest='live',
                    default=False,
                    help='Live run, changes made to the models'),
    )

    def handle(self, *args, **options):

        def set_period_dates(period):
            period.period_start = PERIOD_START
            period.period_end = PERIOD_END
            period.save()

        def get_parent_periods(indicator, PERIOD_START, PERIOD_END):
            return indicator.parent_indicator.periods.filter(
                period_start=PERIOD_START, period_end=PERIOD_END
            )

        name = args[0]
        config = settings.SINGLE_PERIOD_INDICATORS[name]
        live = options['live']

        _, PERIOD_START, PERIOD_END = single_period_dates(name)
        assert PERIOD_START, u"No start date configured. Aborting."
        assert PERIOD_END, u"No end date configured. Aborting."

        pk = config['pk']
        root = Project.objects.get(pk=pk)
        hierarchy_projects = root.descendants()

        if args[1] == 'all':
            projects = hierarchy_projects
        else:
            projects = Project.objects.filter(id__in=map(int, args[1:]))
            in_hierarchy = set(projects) < set(hierarchy_projects)
            assert in_hierarchy, u"Not all projects part of the hierarchy. Aborting"

        period_data = tablib.Dataset(
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
                    result__project=project
            ).select_related('result'):
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

                # No period present. Create one and link it if indicator has a parent
                if period_count == 0:
                    # If the indicator has a parent we need to find and link to the parent period
                    if indicator.parent_indicator:
                        parent_periods = get_parent_periods(indicator, PERIOD_START, PERIOD_END)
                        if parent_periods.count() != 1:
                            row_data += ["ERROR: Can't find parent period."]
                            continue
                        else:
                            parent_period = parent_periods[0]
                    else:
                        parent_period = None
                    if live:
                        period = IndicatorPeriod.objects.create(
                            indicator=indicator,
                            parent_period=parent_period,
                            period_start=PERIOD_START,
                            period_end=PERIOD_END,
                        )
                        row_data += ['Created period: {}'.format(period.pk)]
                    else:
                        row_data += ['Would create period']

                # One period. Change its dates.
                elif period_count == 1:
                    period = periods[0]
                    if live:
                        set_period_dates(period)
                        row_data += ['Modified period: {}'.format(period.pk)]
                    else:
                        row_data += ['Would modify period: {}'.format(period.pk)]

                # Multiple periods. Keep the "latest" one.
                else:
                    updates = IndicatorPeriodData.objects.filter(period__in=periods)
                    if updates.count() > 0:
                        row_data += ['ERROR: Multiple periods, at least one with updates']
                    else:
                        if live:
                            for period in periods[1:]:
                                period.delete()
                            set_period_dates(periods[0])
                            row_data += ['Deleted {} periods, set dates on period {}'.format(
                                period_count - 1, periods[0].pk
                            )]
                        else:
                            row_data += ['Would delete {} periods, set dates on period {}'.format(
                                period_count - 1, periods[0].pk
                            )]

                period_data.append(row_data)

        # Exporting as tsv results in errors I can't explain in som cases, columns get merged :-(
        # Looks like a bug in tablib
        print period_data.export('csv')
