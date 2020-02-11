# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

from decimal import Decimal, InvalidOperation
from django.db.models import Sum
from .indicator_period_data import IndicatorPeriodData


class DisaggregationAggregation(object):

    def __init__(self, disaggregations, period_disaggregations):
        self.disaggregations = disaggregations
        self.period_disaggregations = period_disaggregations

    def aggregate(self, period, dimension_value):
        local = self._get_local_values(period, dimension_value)
        contributed = self._get_contributed_values(period, dimension_value)

        period_disaggregation, _ = self.period_disaggregations.get_or_create(
            period=period,
            dimension_value=dimension_value
        )
        period_disaggregation.value = _sum_attr(local, contributed, 'value')
        period_disaggregation.numerator = _sum_attr(local, contributed, 'numerator')
        period_disaggregation.denominator = _sum_attr(local, contributed, 'denominator')
        period_disaggregation.save()

        if period.parent_period is not None \
                and period.parent_period.indicator.result.project.aggregate_children \
                and period.indicator.result.project.aggregate_to_parent \
                and dimension_value.parent_dimension_value:
            self.aggregate(period.parent_period, dimension_value.parent_dimension_value)

    def _get_local_values(self, period, dimension_value):
        return self.disaggregations.filter(
            update__period=period,
            update__status=IndicatorPeriodData.STATUS_APPROVED_CODE,
            dimension_value=dimension_value
        ).aggregate(
            value=Sum('value'),
            numerator=Sum('numerator'),
            denominator=Sum('denominator')
        )

    def _get_contributed_values(self, period, dimension_value):
        child_dimension_values_pks = [
            child_dimension_value.id
            for child_dimension_value
            in dimension_value.child_dimension_values.all()
        ]
        child_periods_pks = [
            child_period.id
            for child_period
            in period.child_periods.all()
        ]
        return self.period_disaggregations\
            .filter(
                dimension_value__in=child_dimension_values_pks,
                period__in=child_periods_pks
            ).aggregate(
                value=Sum('value'),
                numerator=Sum('numerator'),
                denominator=Sum('denominator')
            )


def _sum_attr(a, b, attr):
    left = a[attr]
    right = b[attr]

    if left is None and right is None:
        return None

    return _d(left) + _d(right)


def _d(value):
    try:
        return Decimal(value)
    except (InvalidOperation, TypeError):
        return Decimal(0)
