# -*- coding: utf-8 -*-

# Akvo Reporting is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


from __future__ import print_function
from decimal import Decimal, InvalidOperation
from django.core.management.base import BaseCommand

from ...models import Indicator

QUANTITATIVE = 1


class Command(BaseCommand):
    help = """
        Display values that can't be converted to Decimal in Indicator.baseline_value

        Output is tab separated to be easily copied and pasted into an XL sheet
    """

    def handle(self, *args, **options):

        # caching of expensive org lookup
        organisations = {}

        indicators = Indicator.objects.filter(type=QUANTITATIVE).select_related(
            'result', 'result__project')
        print()
        print("*" * 50)
        print("Non-numeric Indicator.baseline_value")
        print("*" * 50)
        print()
        print("Organisation ID\tOrganisation name\tProject ID\tProject title\tResult ID\t"
              "Result title\tIndicator ID\tIndicator title\tBaseline value")

        for indicator in indicators:
            try:
                if not (indicator.baseline_value is None or indicator.baseline_value == ''):
                    Decimal(indicator.baseline_value)
            except InvalidOperation:
                project = indicator.result.project
                if organisations.get(project.id):
                    organisation = organisations[project.id]
                else:
                    organisation = project.find_primary_organisation()
                    organisations[project.id] = organisation
                result = indicator.result
                print("{}\t{}\t{}\t{}\t{}\t{}\t{}\t{}\t{}".format(
                    getattr(organisation, 'id', 'No org'), getattr(organisation, 'name', 'No org'),
                    project.id, project.title,
                    result.id, result.title,
                    indicator.id, indicator.title,
                    indicator.baseline_value).encode('utf-8')
                )
