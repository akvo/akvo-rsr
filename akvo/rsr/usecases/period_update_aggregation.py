from decimal import Decimal
from typing import Tuple, Optional
from django.db import transaction
from django.db.models import QuerySet, Q, Sum
from akvo.utils import ensure_decimal
from akvo.rsr.models import IndicatorPeriod, IndicatorPeriodData, Disaggregation, IndicatorDimensionValue
from akvo.rsr.models.result.utils import PERCENTAGE_MEASURE, calculate_percentage
from akvo.rsr.models.result.indicator_period_disaggregation import IndicatorPeriodDisaggregation
from akvo.rsr.models.result.disaggregation_aggregation import DisaggregationAggregation

disaggregation_aggregation = DisaggregationAggregation(Disaggregation.objects, IndicatorPeriodDisaggregation.objects)


@transaction.atomic
def aggregate(period: IndicatorPeriod):
    _aggregate_period_value(period)
    _aggregate_disaggregation(period)


def _aggregate_period_value(period: IndicatorPeriod):
    value, numerator, denominator = sum_updates(period)
    if period.indicator.measure == PERCENTAGE_MEASURE:
        contrib_numerator, contrib_denominator = sum_contributed_percentage_value(period)
        numerator = ensure_decimal(numerator) + ensure_decimal(contrib_numerator)
        denominator = ensure_decimal(denominator) + ensure_decimal(contrib_denominator)
        value = calculate_percentage(numerator, denominator)
    else:
        value = ensure_decimal(value) + sum_contributed_unit_value(period)
    period.actual_value = str(value) if value else ''
    if period.indicator.measure == PERCENTAGE_MEASURE:
        period.numerator = numerator
        period.denominator = denominator
    period.save()
    if period.parent_period \
            and period.indicator.result.project.aggregate_to_parent \
            and period.parent_period.indicator.result.project.aggregate_children:
        _aggregate_period_value(period.parent_period)


def _aggregate_disaggregation(period: IndicatorPeriod):
    disaggregations = Disaggregation.objects.filter(update__period=period, update__status=IndicatorPeriodData.STATUS_APPROVED_CODE)
    dimension_values = (
        IndicatorDimensionValue.objects.filter(name__in=period.indicator.dimension_names.all())
        | IndicatorDimensionValue.objects.filter(disaggregations__in=disaggregations)
    ).distinct()
    for dimension_value in dimension_values:
        disaggregation_aggregation.aggregate(period, dimension_value)


def sum_updates(period: IndicatorPeriod) -> Tuple[Optional[Decimal], Optional[Decimal], Optional[Decimal]]:
    result = period.approved_updates.aggregate(value=Sum('value'), numerator=Sum('numerator'), denominator=Sum('denominator'))
    return [result[k] for k in ('value', 'numerator', 'denominator')]


def sum_contributed_unit_value(period: IndicatorPeriod) -> Decimal:
    value = Decimal(0)
    for contributor in get_contributing_child_periods(period):
        value += ensure_decimal(contributor.actual_value)
    return value


def sum_contributed_percentage_value(period: IndicatorPeriod) -> Tuple[Optional[Decimal], Optional[Decimal]]:
    result = get_contributing_child_periods(period).aggregate(numerator=Sum('numerator'), denominator=Sum('denominator'))
    return [result[k] for k in ('numerator', 'denominator')]


def get_contributing_child_periods(period: IndicatorPeriod) -> QuerySet:
    return period.child_periods.exclude(Q(actual_value__isnull=True) | Q(actual_value__exact=''))
