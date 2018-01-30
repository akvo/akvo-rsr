# -*- coding: utf-8 -*-

# Akvo Reporting is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

from django.core.management.base import BaseCommand

from ...models import Indicator, IndicatorPeriod

RESULT_TYPE_OUTPUT = u"1"


class Command(BaseCommand):
    help = """
    Script that adds indicator periods for a project to indicators of output results.
    The new periods have the following start and end dates:
        2018-01-01", "2018-06-30"
        2018-07-01", "2018-12-31"
        2019-01-01", "2019-06-30"
        2019-07-01", "2019-12-31"
        2020-01-01", "2020-06-30"
        2020-07-01", "2020-12-31"
        2021-01-01", "2021-06-30"
        2021-07-01", "2021-12-31"

    NOTE: this is a custom command for OneDrop.
    """

    def handle(self, *args, **options):

        DATES = [
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
                result__type=RESULT_TYPE_OUTPUT
            )

            for indicator in indicators:
                periods = IndicatorPeriod.objects.filter(indicator=indicator)
                if periods.count() == 1:
                    print u"{}\t{}".format(indicator.pk, indicator.title).encode('utf-8')
                    for (period_start, period_end) in DATES:
                        IndicatorPeriod.objects.create(indicator=indicator,
                                                       period_start=period_start,
                                                       period_end=period_end)
