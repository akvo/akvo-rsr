# -*- coding: utf-8 -*-

# Akvo Reporting is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


from datetime import datetime

from django.core.management.base import BaseCommand
from django.db.models import Count

from akvo.rsr.models import Indicator, IndicatorPeriod, Project, Result


def delete_periods():
    """Delete the periods which were incorrectly created due to a bug."""

    projects = [5808, 5807, 5550, 5549, 5548, 5547, 5546, 5544, 5253]

    # Delete parent periods which don't have children
    parent_results = Result.objects.filter(project__in=projects)\
                                   .annotate(children=Count('child_results'))\
                                   .filter(children__gt=0)
    periods = IndicatorPeriod.objects.filter(indicator__result__in=parent_results)\
                                     .annotate(children=Count('child_periods'))\
                                     .filter(children=0)
    periods.delete()

    # Delete child periods which don't have a parent
    child_results = Result.objects.filter(project__in=projects)\
                                  .exclude(parent_result=None)

    periods = IndicatorPeriod.objects.filter(indicator__result__in=child_results)\
                                     .filter(parent_period=None)
    periods.delete()

    # Delete parent and child periods with no period start date
    periods = IndicatorPeriod.objects.filter(indicator__result__project__in=projects)\
                                     .filter(period_start=None)
    child_periods = periods.values_list('child_periods', flat=True)
    child_periods = IndicatorPeriod.objects.filter(id__in=child_periods)

    child_periods.delete()
    periods.delete()


def create_periods():
    """Create new periods, based on the rules defined by the partner."""

    OUTPUT = '1'
    OUTCOME = '2'

    project = Project.objects.get(id=5808)

    # Add periods to outputs
    OUTPUT_DATES = [
        ((2017, 1, 1), (2017, 12, 31)),
        ((2018, 1, 1), (2018, 12, 31)),
        ((2019, 1, 1), (2019, 12, 31)),
        ((2020, 1, 1), (2020, 12, 31)),
    ]

    outputs = project.results.filter(type=OUTPUT)
    pathways = outputs.filter(title__contains='Pathway ')
    indicators = Indicator.objects.filter(result__in=pathways)\
                                  .values_list('id', flat=True)
    print('Adding periods to {} indicators'.format(indicators.count()))
    for indicator_id in indicators:
        print('Adding periods to {}'.format(indicator_id))
        for period_start, period_end in OUTPUT_DATES:
            IndicatorPeriod.objects.create(
                indicator_id=indicator_id,
                period_start=datetime(*period_start),
                period_end=datetime(*period_end),
                target_value='0',
            )

    # Add periods to outcomes
    OUTCOME_DATES = [
        ((2019, 1, 1), (2020, 12, 31)),
    ]

    outcomes = project.results.filter(type=OUTCOME)
    pathways = outcomes.filter(title__contains='Pathway ')
    indicators = Indicator.objects.filter(result__in=pathways)\
                                  .values_list('id', flat=True)
    print('Adding periods to {} indicators'.format(indicators.count()))
    for indicator_id in indicators:
        print('Adding periods to {}'.format(indicator_id))
        for period_start, period_end in OUTCOME_DATES:
            IndicatorPeriod.objects.create(
                indicator_id=indicator_id,
                period_start=datetime(*period_start),
                period_end=datetime(*period_end),
                target_value='0',
            )


class Command(BaseCommand):

    args = ''
    help = 'Script for fixing UTZ results data'

    def handle(self, *args, **options):
        delete_periods()
        create_periods()
