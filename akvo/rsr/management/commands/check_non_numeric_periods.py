# -*- coding: utf-8 -*-

# Akvo Reporting is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


from __future__ import print_function
from decimal import Decimal, InvalidOperation
from django.core.management.base import BaseCommand

from ...models import IndicatorPeriod

QUANTITATIVE = 1


class Command(BaseCommand):
    help = """
        Display values that can't be converted to Decimal in IndicatorPeriod.target_value

        Output is tab separated to be easily copied and pasted into an XL sheet
    """

    def handle(self, *args, **options):

        # caching of expensive org lookup
        organisations = {}

        periods = IndicatorPeriod.objects.filter(indicator__type=QUANTITATIVE).select_related(
            'indicator', 'indicator__result', 'indicator__result__project')

        print()
        print("*" * 50)
        print(u"Non-numeric IndicatorPeriod.target_value")
        print("*" * 50)
        print()
        print(u"Organisation ID\tOrganisation name\tProject ID\tProject title\tResult ID\t"
              u"Result title\tIndicator ID\tIndicator title\tPeriod ID\tPeriod dates\tTarget value")
        for period in periods:
            try:
                if not (period.target_value is None or period.target_value == ''):
                    Decimal(period.target_value)
            except InvalidOperation:
                project = period.indicator.result.project
                if organisations.get(project.id):
                    organisation = organisations[project.id]
                else:
                    organisation = project.find_primary_organisation()
                    organisations[project.id] = organisation
                result = period.indicator.result
                indicator = period.indicator
                print(u"{}\t{}\t{}\t{}\t{}\t{}\t{}\t{}\t{}\t{}\t{}".format(
                    getattr(organisation, 'id', 'No org'), getattr(organisation, 'name', 'No org'),
                    project.id, project.title,
                    result.id, result.title,
                    indicator.id, indicator.title,
                    period.id, u"{} - {}".format(period.period_start, period.period_end),
                    period.target_value).encode('utf-8')
                )
