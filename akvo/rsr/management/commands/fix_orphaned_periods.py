# -*- coding: utf-8 -*-

# Akvo Reporting is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

import sys

from django.core.management.base import BaseCommand

from ...models import Indicator, IndicatorPeriod


INDICATORS = [
    # Child, Parent
    (20552, 16726),
    (14910, 14855),
]


PERIODS = [
    # Orphaned periods
    # Child, Parent
    (16521, 16522),
    (16519, 16520),
    (23471, 17821),
    (23472, 17821),

    # Orphaned indicators, hence periods
    (26220, 18201),
    (14972, 14917),
]


# Unable to figure out parent for the following
# #######################
# period id: 26081, indicator id: 20414
# project id: 4272
# result title: u'25. Community groups exist with a recognisable voice/representation of women and marginalized groups'
# #######################
# period id: 12721, indicator id: 12939
# project id: 4145
# result title: u'Partners have access to Akvo RSR'
# extra child indicator, no corresponding parent (can be ignored?)


def pprint_period_lineage(period):
    indicator = period.indicator
    result = indicator.result
    project = result.project
    print u'{} > {} > {} > {}--{}'.format(
        project.title, result.title, indicator.title, period.period_start, period.period_end
    )
    print u'{} > {} > {} > {}'.format(project.id, result.id, indicator.id, period.id)
    print u'#' * 20


class Command(BaseCommand):

    args = '[<indicator|indicator_period> <child_id> <parent_id>]'
    help = 'Script for fixing orphaned indicators and periods'

    def handle(self, *args, **options):

        # parse options
        verbosity = int(options['verbosity'])

        if len(args) == 0:
            indicators = INDICATORS
            periods = PERIODS

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
            assert (
                child_indicator.result.parent_result == parent_indicator.result,
                '{} cannot be a parent of {}'.format(parent_id, child_id)
            )
            child_indicator.parent_indicator = parent_indicator
            child_indicator.save()
            # Any additional missing data is taken care of by saving the parent.
            parent_indicator.save()

            if verbosity > 1:
                self.stdout.write('{} indicator made parent of {}'.format(parent_id, child_id))

        for child_id, parent_id in periods:
            child_period = IndicatorPeriod.objects.get(id=child_id)
            parent_period = IndicatorPeriod.objects.get(id=parent_id)
            assert (
                child_period.indicator.result.parent_result == parent_period.indicator.result,
                '{} cannot be a parent of {}'.format(parent_id, child_id)
            )
            child_period.parent_period = parent_period
            child_period.save()
            # Any additional missing data is taken care of by saving the parent.
            parent_period.save()
            pprint_period_lineage(child_period)
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
