# -*- coding: utf-8 -*-

# Akvo Reporting is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

from django.core.management.base import BaseCommand

from ...models import Indicator, IndicatorPeriod

QUANTITATIVE = 1
RESULT_TYPE_OUTCOME = u"2"


class Command(BaseCommand):
    help = """
    Script that replaces indicator periods for a project if it doesn't have exactly 9 periods.
    The new periods have the following start and end dates:
        2017-07-01", "2017-12-31"
        2018-01-01", "2018-06-30"
        2018-07-01", "2018-12-31"
        2019-01-01", "2019-06-30"
        2019-07-01", "2019-12-31"
        2020-01-01", "2020-06-30"
        2020-07-01", "2020-12-31"
        2021-01-01", "2021-06-30"
        2021-07-01", "2021-12-31"

    Only results of type "outcome" will be changed in this way.

    NOTE: this is a custom command for OneDrop.
    """

    def handle(self, *args, **options):

        DATES = [
            ["2017-07-01", "2017-12-31"],
            ["2018-01-01", "2018-06-30"],
            ["2018-07-01", "2018-12-31"],
            ["2019-01-01", "2019-06-30"],
            ["2019-07-01", "2019-12-31"],
            ["2020-01-01", "2020-06-30"],
            ["2020-07-01", "2020-12-31"],
            ["2021-01-01", "2021-06-30"],
            ["2021-07-01", "2021-12-31"],
        ]

        project_ids = args

        print('ID\tTitle')
        for project_id in project_ids:
            indicators = Indicator.objects.filter(
                result__project=project_id
            ).filter(
                result__type=RESULT_TYPE_OUTCOME
            ).select_related('result')

            for indicator in indicators:
                periods = IndicatorPeriod.objects.filter(indicator=indicator)
                if periods.count() != 9:
                    print u"{}\t{}".format(indicator.pk, indicator.title).encode('utf-8')
                    periods.delete()
                    for (period_start, period_end) in DATES:
                        IndicatorPeriod.objects.create(indicator=indicator,
                                                       period_start=period_start,
                                                       period_end=period_end)
