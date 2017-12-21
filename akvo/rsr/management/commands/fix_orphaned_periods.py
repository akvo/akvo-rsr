# -*- coding: utf-8 -*-

# Akvo Reporting is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

import sys

from django.core.management.base import BaseCommand
from django.db.models import Count

from ...models import Indicator, IndicatorPeriod


def pprint_period_lineage(period):
    indicator = period.indicator
    result = indicator.result
    project = result.project
    print u'{} > {} > {} > {}--{}'.format(
        project.title, result.title, indicator.title, period.period_start, period.period_end
    ).encode('utf8')
    print '{} > {} > {} > {}'.format(project.id, result.id, indicator.id, period.id)
    print '#' * 20


def find_orphaned_indicators():
    """Find indicators which are orphaned, whose parents can be deduced."""

    # Indicators with no parent, but whose indicators have parents
    indicators = Indicator.objects.filter(parent_indicator=None)\
                                  .exclude(result__parent_result=None)

    # Indicators with no siblings
    indicators = indicators.annotate(siblings=Count('result__indicators')).filter(siblings=1)

    # Indicators whose results's parents have a single child
    indicators = indicators.annotate(parent_siblings=Count('result__parent_result__indicators'))\
                           .filter(parent_siblings=1).distinct()

    return list(indicators.values_list('id', 'result__parent_result__indicators'))


def find_orphaned_periods():
    """Find periods which are orphaned, whose parents can be deduced."""

    # Periods with no parent, but whose indicators have parents
    periods = IndicatorPeriod.objects.filter(parent_period=None)\
                                     .exclude(indicator__parent_indicator=None)

    # Periods with no siblings
    periods = periods.annotate(siblings=Count('indicator__periods')).filter(siblings=1)

    # Periods whose indicator's parents have a single child
    periods = periods.annotate(parent_siblings=Count('indicator__parent_indicator__periods'))\
                     .filter(parent_siblings=1).distinct()

    return list(periods.values_list('id', 'indicator__parent_indicator__periods'))


class Command(BaseCommand):

    args = '<indicator|indicator_period> [<child_id> <parent_id>]'
    help = 'Script for fixing orphaned indicators and periods'

    def handle(self, *args, **options):

        # parse options
        verbosity = int(options['verbosity'])

        if len(args) == 1 and args[0] == 'indicator':
            indicators = find_orphaned_indicators()
            periods = []
            self.stdout.write('Fixing {} orphaned indicators'.format(len(indicators)))

        elif len(args) == 1 and args[0] == 'indicator_period':
            indicators = []
            periods = find_orphaned_periods()
            self.stdout.write('Fixing {} orphaned periods'.format(len(periods)))

        elif len(args) == 3 and args[0] == 'indicator':
            indicators = [(int(args[1]), int(args[2]))]
            periods = []

        elif len(args) == 3 and args[0] == 'indicator_period':
            indicators = []
            periods = [(int(args[1]), int(args[2]))]

        else:
            print 'Usage: {} {}'.format(sys.argv[0], self.args)
            sys.exit(1)

        for child_id, parent_id in indicators:
            child_indicator = Indicator.objects.get(id=child_id)
            parent_indicator = Indicator.objects.get(id=parent_id)
            assertion_message = '{} cannot be a parent of {}'.format(parent_id, child_id)
            assert child_indicator.result.parent_result == parent_indicator.result, assertion_message
            child_indicator.parent_indicator = parent_indicator
            child_indicator.save()
            # Any additional missing data is taken care of by saving the parent.
            # parent_indicator.save()

            if verbosity > 1:
                self.stdout.write('{} indicator made parent of {}'.format(parent_id, child_id))

        for child_id, parent_id in periods:
            child_period = IndicatorPeriod.objects.get(id=child_id)
            parent_period = IndicatorPeriod.objects.get(id=parent_id)
            child_result = child_period.indicator.result
            parent_result = parent_period.indicator.result
            assertion_message = '{} cannot be a parent of {}'.format(parent_id, child_id)
            assert child_result.parent_result == parent_result, assertion_message
            child_period.parent_period = parent_period
            child_period.save()
            # Any additional missing data is taken care of by saving the parent.
            # parent_period.save()
            if parent_period.indicator.periods.count() != child_period.indicator.periods.count():
                print 'No. of periods mismatch with parent :: '
                pprint_period_lineage(parent_period)

            if verbosity > 1:
                self.stdout.write('{} period made parent of {}'.format(parent_id, child_id))

        if indicators:
            fixed_indicators = ', '.join(str(id_) for id_, _ in indicators)
            self.stdout.write('Fixed parents for indicator ids: {}'.format(fixed_indicators))

        if periods:
            fixed_periods = ', '.join(str(id_) for id_, _ in periods)
            self.stdout.write('Fixed parents for period ids: {}'.format(fixed_periods))
