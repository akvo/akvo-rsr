from __future__ import annotations
from decimal import Decimal
from typing import Tuple, Optional, TYPE_CHECKING, Set
import logging

from django.apps import apps
from django.db import transaction
from django.db.models import QuerySet, Q, Sum

from akvo.utils import ensure_decimal
from akvo.rsr.models.result.utils import PERCENTAGE_MEASURE, calculate_percentage, get_per_user_latest_indicator_update_ids
from akvo.rsr.models.result.disaggregation_aggregation import DisaggregationAggregation

if TYPE_CHECKING:
    from akvo.rsr.models import IndicatorPeriod

logger = logging.getLogger(__name__)

# Memory protection configuration
DEFAULT_MAX_AGGREGATION_DEPTH = 100
MAX_AGGREGATION_DEPTH = getattr(
    __import__('django.conf', fromlist=['settings']).settings,
    'RSR_MAX_AGGREGATION_DEPTH',
    DEFAULT_MAX_AGGREGATION_DEPTH
)


def get_disaggregation_aggregation():
    Disaggregation = apps.get_model('rsr', 'Disaggregation')
    IndicatorPeriodDisaggregation = apps.get_model('rsr', 'IndicatorPeriodDisaggregation')
    return DisaggregationAggregation(Disaggregation.objects, IndicatorPeriodDisaggregation.objects)


@transaction.atomic
def aggregate(period: IndicatorPeriod):
    _aggregate_period_value(period)
    _aggregate_disaggregation(period)


def _aggregate_period_value(period: IndicatorPeriod, max_depth: int = None):
    """
    Aggregate period values up the hierarchy using iterative approach to prevent stack overflow.

    Args:
        period: The starting period to aggregate
        max_depth: Maximum depth to traverse (uses configured value if None) to prevent infinite loops
    """
    if max_depth is None:
        max_depth = MAX_AGGREGATION_DEPTH

    processed_periods: Set[int] = set()
    periods_to_process = [period]
    depth = 0

    while periods_to_process and depth < max_depth:
        current_period = periods_to_process.pop(0)

        # Prevent infinite loops by checking if we've already processed this period
        if current_period.id in processed_periods:
            logger.warning(
                f"Circular reference detected in period aggregation: "
                f"Period {current_period.id} already processed. Skipping."
            )
            continue

        processed_periods.add(current_period.id)

        # Calculate and save the aggregated value for current period
        try:
            value, numerator, denominator = calculate_period_actual_value(current_period)
            current_period.actual_value = str(value) if value else ''
            if current_period.indicator.measure == PERCENTAGE_MEASURE:
                current_period.numerator = numerator
                current_period.denominator = denominator
            current_period.save()
        except Exception as e:
            logger.error(
                f"Error aggregating period {current_period.id}: {e}. "
                f"Continuing with next period."
            )
            continue

        # Check if we should aggregate to parent
        if (current_period.parent_period
                and current_period.indicator.result.project.aggregate_to_parent
                and current_period.parent_period.indicator.result.project.aggregate_children):
            periods_to_process.append(current_period.parent_period)

        depth += 1

    if depth >= max_depth:
        logger.warning(
            f"Maximum aggregation depth ({max_depth}) reached for period {period.id}. "
            f"Hierarchy may be too deep or contain cycles."
        )


def _aggregate_disaggregation(period: IndicatorPeriod):
    Disaggregation = apps.get_model('rsr', 'Disaggregation')
    IndicatorPeriodData = apps.get_model('rsr', 'IndicatorPeriodData')
    IndicatorDimensionValue = apps.get_model('rsr', 'IndicatorDimensionValue')

    disaggregations = Disaggregation.objects.filter(update__period=period, update__status=IndicatorPeriodData.STATUS_APPROVED_CODE)
    dimension_values = (
        IndicatorDimensionValue.objects.filter(name__in=period.indicator.dimension_names.all())
        | IndicatorDimensionValue.objects.filter(disaggregations__in=disaggregations)
    ).distinct()
    for dimension_value in dimension_values:
        get_disaggregation_aggregation().aggregate(period, dimension_value)


def calculate_period_actual_value(period: IndicatorPeriod) -> Tuple[Decimal, Optional[Decimal], Optional[Decimal]]:
    value, numerator, denominator = sum_updates(period)
    if period.indicator.measure == PERCENTAGE_MEASURE:
        contrib_numerator, contrib_denominator = sum_contributed_percentage_value(period)
        numerator = ensure_decimal(numerator) + ensure_decimal(contrib_numerator)
        denominator = ensure_decimal(denominator) + ensure_decimal(contrib_denominator)
        return calculate_percentage(numerator, denominator), numerator, denominator

    return ensure_decimal(value) + sum_contributed_unit_value(period), None, None


def sum_updates(period: IndicatorPeriod) -> Tuple[Optional[Decimal], Optional[Decimal], Optional[Decimal]]:
    return sum_cumulative_updates(period) if period.indicator.is_cumulative() else sum_non_cumulative_updates(period)


def sum_cumulative_updates(period: IndicatorPeriod) -> Tuple[Optional[Decimal], Optional[Decimal], Optional[Decimal]]:
    IndicatorPeriodData = apps.get_model('rsr', 'IndicatorPeriodData')
    latest_per_users = get_per_user_latest_indicator_update_ids(period)
    value = IndicatorPeriodData.objects.filter(id__in=latest_per_users)\
        .aggregate(value=Sum('value'))['value']
    return value, None, None


def sum_non_cumulative_updates(period: IndicatorPeriod) -> Tuple[Optional[Decimal], Optional[Decimal], Optional[Decimal]]:
    result = period.approved_updates.aggregate(value=Sum('value'), numerator=Sum('numerator'), denominator=Sum('denominator'))
    return (result[k] for k in ('value', 'numerator', 'denominator'))


def sum_contributed_unit_value(period: IndicatorPeriod) -> Decimal:
    value = Decimal(0)
    for contributor in get_contributing_child_periods(period):
        value += ensure_decimal(contributor.actual_value)
    return value


def sum_contributed_percentage_value(period: IndicatorPeriod) -> Tuple[Optional[Decimal], Optional[Decimal]]:
    result = get_contributing_child_periods(period).aggregate(numerator=Sum('numerator'), denominator=Sum('denominator'))
    return (result[k] for k in ('numerator', 'denominator'))


def get_contributing_child_periods(period: IndicatorPeriod) -> QuerySet:
    return period.child_periods.exclude(Q(actual_value__isnull=True) | Q(actual_value__exact=''))
