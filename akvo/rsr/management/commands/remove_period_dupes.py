# -*- coding: utf-8 -*-

# Akvo Reporting is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


import tablib

from django.core.management.base import BaseCommand

from ...models import Indicator, IndicatorPeriod


class Command(BaseCommand):
    help = ("Script that lists indicator periods that share the same indicator, have the same "
            "period_start and period_end and has no other data. When deleting, there will always "
            "be one period left with a particular set of dates.\n\n"
            "The script will also list periods that are duplicates as per above, but have data "
            "added to them. They will never be deleted.\n\n"
            "Use the --delete option to actually delete the duplicates listed")

    def add_arguments(self, parser):
        parser.add_argument(
            '--delete',
            action='store_true',
            dest='delete',
            default=False,
            help='Actually delete period duplicates'
        )

    def handle(self, *args, **options):

        def has_data(period):
            if (period.target_value or period.target_comment or period.actual_value
                    or period.actual_comment or period.numerator or period.denominator
                    or not period.locked or period.data.exists()):
                return True
            return False

        def separate(periods):
            periods_with_data = []
            periods_without_data = []
            for period in periods:
                if has_data(period):
                    periods_with_data += [period]
                else:
                    periods_without_data += [period]
            if len(periods_with_data) > 0:
                return dict(
                    keep=periods_with_data,
                    delete=periods_without_data
                )
            else:
                return dict(
                    keep=[periods_without_data[0]],
                    delete=periods_without_data[1:]
                )

        def de_duplicate(indicator):
            periods = IndicatorPeriod.objects.filter(indicator=indicator).select_related(
                'indicator', 'indicator__result', 'indicator__result__project'
            ).prefetch_related('data')

            # group periods with identical date fields
            dupe_groups = {}
            for period in periods:
                dupe_groups.setdefault(
                    "{}:{}".format(period.period_start, period.period_end), []
                ).append(period)

            problem_periods = []
            duplicate_periods = []
            for key in dupe_groups:
                periods_with_same_dates = dupe_groups[key]
                if len(periods_with_same_dates) > 1:
                    periods_to_keep_and_to_delete = separate(periods_with_same_dates)
                    if len(periods_to_keep_and_to_delete['keep']) > 1:
                        problem_periods.extend(periods_to_keep_and_to_delete['keep'])
                    else:
                        duplicate_periods.extend(periods_to_keep_and_to_delete['delete'])

            return problem_periods, duplicate_periods

        def table_of(periods, delete=False):
            headers = [
                'Project ID',
                'Result ID',
                'Result title',
                'Indicator ID',
                'Indicator title',
                'Period ID',
                'Period.period_start',
                'Period.period_end',
            ]
            table = tablib.Dataset()
            table.headers = headers

            for period in periods:
                table.append([
                    period.indicator.result.project.pk,
                    period.indicator.result.pk,
                    period.indicator.result.title,
                    period.indicator.pk,
                    period.indicator.title,
                    period.pk,
                    period.period_start,
                    period.period_end,
                ])

                if delete:
                    period.delete()

            return table

        problem_periods = []
        duplicate_periods = []
        for indicator in Indicator.objects.all():
            new_problems, new_dupes = de_duplicate(indicator)
            problem_periods.extend(new_problems)
            duplicate_periods.extend(new_dupes)

        if problem_periods:
            print("Duplicate periods with data")
            print(table_of(problem_periods).export('csv'))
        else:
            print("No duplicate periods with data")

        if duplicate_periods:
            print("Deleted duplicate periods with no data")
            print(table_of(duplicate_periods, options['delete']).export('csv'))
        else:
            print("No duplicate periods")
