# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

from django.db.models import Sum


class DisaggregationAggregation:

    def __init__(self, disaggregations, period_disaggregations):
        self.disaggregations = disaggregations
        self.period_disaggregations = period_disaggregations

    def aggregate(self, period, dimension_value):
        queryset = self.disaggregations.filter(update__period=period, dimension_value=dimension_value)
        self._aggregate_period_disaggregation(queryset, period, dimension_value)

    def aggregate_parent(self, period, dimension_value):
        child_dimension_values_pks = [
            child_dimension_value.id
            for child_dimension_value
            in dimension_value.child_dimension_values.all()
        ]
        queryset = self.period_disaggregations\
            .filter(dimension_value__in=child_dimension_values_pks)
        self._aggregate_period_disaggregation(queryset, period, dimension_value)

    def _aggregate_period_disaggregation(self, queryset, period, dimension_value):
        values = queryset.aggregate(value=Sum('value'), numerator=Sum('numerator'), denominator=Sum('denominator'))
        period_disaggregation, _ = self.period_disaggregations.get_or_create(
            period=period,
            dimension_value=dimension_value
        )
        period_disaggregation.value = values['value']
        period_disaggregation.numerator = values['numerator']
        period_disaggregation.denominator = values['denominator']
        period_disaggregation.save()

        if period.is_child_period() \
                and period.parent_period.indicator.result.project.aggregate_children \
                and period.indicator.result.project.aggregate_to_parent \
                and dimension_value.parent_dimension_value:
            self.aggregate_parent(period.parent_period, dimension_value.parent_dimension_value)
