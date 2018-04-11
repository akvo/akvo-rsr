# -*- coding: utf-8 -*-

# Akvo Reporting is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

import tablib

from django.core.management.base import BaseCommand
from ...models import Indicator, IndicatorPeriod


def has_no_data(period):
    if (period.target_value
            or period.target_comment
            or period.actual_value
            or period.actual_comment
            or period.numerator
            or period.denominator):
        return False
    return True


class Command(BaseCommand):

    def handle(self, *args, **options):
        """
        Script that deletes indicator periods that share the same indicator, have the same
        period_start and period_end and has no other data. There will always be one period left
        with a particular set of dates.

        The script will also list periods that are duplicates as per above, but have data added to
        them
        """
        problem_periods = tablib.Dataset()
        problem_periods.headers = [
            'Project ID',
            'Result',
            'Indicator',
            'Period ID',
            'Period.period_start',
            'Period.period_end',
        ]
        deleted_dupes = tablib.Dataset()
        deleted_dupes.headers = [
            'Project ID',
            'Result',
            'Indicator',
            'Period ID',
            'Period.period_start',
            'Period.period_end',
        ]
        for indicator in Indicator.objects.all():
            periods = IndicatorPeriod.objects.filter(indicator=indicator).select_related(
                'indicator', 'indicator__result', 'indicator__result__project'
            )
            for period in periods:
                dupes = IndicatorPeriod.objects.filter(
                    indicator=indicator,
                    period_start=period.period_start,
                    period_end=period.period_end,
                ).exclude(pk=period.id)
                if dupes:
                    deletables = [dupe for dupe in dupes if has_no_data(dupe)]
                    if deletables:
                        if len(dupes) - len(deletables) > 0:
                            problem_periods.append([
                                period.indicator.result.project.pk,
                                period.indicator.result.title,
                                period.indicator.title,
                                period.pk,
                                period.period_start,
                                period.period_end,
                            ])
                        else:
                            deleted_dupes.append([
                                period.indicator.result.project.pk,
                                period.indicator.result.title,
                                period.indicator.title,
                                period.pk,
                                period.period_start,
                                period.period_end,
                            ])

        if len(problem_periods.dict):
            print u"Problems:"
            print problem_periods.export('tsv')
        else:
            print u"No problems"
        if len(deleted_dupes.dict):
            IndicatorPeriod.objects.filter(pk__in=deleted_dupes['Period ID']).delete()
            print u"Deletions:"
            print deleted_dupes.export('tsv')
        else:
            print u"No duplicates found"
