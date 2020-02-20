# -*- coding: utf-8 -*-

# Akvo Reporting is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

from django.core.management.base import BaseCommand
from akvo.rsr.models import Disaggregation, DisaggregationContribution, IndicatorPeriodDisaggregation
from akvo.rsr.models.result.disaggregation_aggregation import DisaggregationAggregation


class Command(BaseCommand):
    help = "Reset and recalculate period disaggregation aggregation data."

    def handle(self, *args, **options):
        print("Deleting the disaggregation contribution data...")
        DisaggregationContribution.objects.all().delete()

        print("Deleting the period disaggregation data...")
        IndicatorPeriodDisaggregation.objects.all().delete()

        print("Recalculate period disaggregation aggregation...")
        disaggregation_aggregation = DisaggregationAggregation(
            Disaggregation.objects,
            IndicatorPeriodDisaggregation.objects
        )

        disaggregation_leafs = Disaggregation.objects.filter(
            update__period__child_periods__isnull=True,
            dimension_value__isnull=False
        )

        for disaggregation in disaggregation_leafs:
            disaggregation_aggregation.aggregate(
                disaggregation.update.period,
                disaggregation.dimension_value
            )

        print("Done!")
