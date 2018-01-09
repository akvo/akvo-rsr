# -*- coding: utf-8 -*-

# Akvo Reporting is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


from decimal import Decimal, InvalidOperation
from django.core.management.base import BaseCommand

from ...models import IndicatorPeriodData


class Command(BaseCommand):
    help = """
        Display values that can't be converted to Decimal in IndicatorPeriodData.value

        Output is tab separated to be easily copied and pasted into an XL sheet
    """

    def handle(self, *args, **options):

        # caching of expensive org lookup
        organisations = {}

        updates = IndicatorPeriodData.objects.select_related(
            'period', 'period__indicator', 'period__indicator__result',
            'period__indicator__result__project')
        print
        print("*" * 50)
        print(u"Non-numeric IndicatorPeriodData.value")
        print("*" * 50)
        print(u"Organisation ID\tOrganisation name\tProject ID\tProject title\tResult ID\t"
              u"Result title\tIndicator ID\tIndicator title\tPeriod ID\tPeriod dates\tUpdate ID\t"
              u"Update value")
        for update in updates:
            try:
                if not (update.value is None or update.value == ''):
                    Decimal(update.value) if update.value is not None else None
            except InvalidOperation:
                project = update.period.indicator.result.project
                if organisations.get(project.id):
                    organisation = organisations[project.id]
                else:
                    organisation = project.find_primary_organisation()
                    organisations[project.id] = organisation
                result = update.period.indicator.result
                indicator = update.period.indicator
                period = update.period
                print(u"{}\t{}\t{}\t{}\t{}\t{}\t{}\t{}\t{}\t{}\t{}\t{}".format(
                    organisation.id, organisation.name,
                    project.id, project.title,
                    result.id, result.title,
                    indicator.id, indicator.title,
                    period.id, u"{} - {}".format(period.period_start, period.period_end),
                    update.id, update.value).encode('utf-8')
                )
