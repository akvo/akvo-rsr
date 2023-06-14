# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

from abc import ABC
from dataclasses import dataclass, field
from datetime import date, datetime
from decimal import Decimal
from enum import Enum
from functools import cached_property, lru_cache
from typing import Optional, List, Set

from akvo.rsr.models import IndicatorPeriodData
from akvo.rsr.models.result.utils import QUANTITATIVE, QUALITATIVE, PERCENTAGE_MEASURE, calculate_percentage
from akvo.utils import ensure_decimal, maybe_decimal
from akvo.codelists.models import ResultType

from django.conf import settings


@dataclass(frozen=True)
class DisaggregationTargetData(object):
    id: Optional[int] = None
    category: str = ''
    type: str = ''
    value: Optional[Decimal] = None

    @classmethod
    def make(cls, data, prefix=''):
        return cls(
            id=data[f"{prefix}id"],
            category=data.get(f"{prefix}dimension_value__name__name", ''),
            type=data.get(f"{prefix}dimension_value__value", ''),
            value=data.get(f"{prefix}value", None),
        )


@dataclass(frozen=True)
class DisaggregationData(object):
    id: Optional[int] = None
    category: str = ''
    type: str = ''
    value: Optional[Decimal] = None
    numerator: Optional[Decimal] = None
    denominator: Optional[Decimal] = None

    @classmethod
    def make(cls, data, prefix=''):
        return cls(
            id=data[f"{prefix}id"],
            category=data.get(f"{prefix}dimension_value__name__name", ''),
            type=data.get(f"{prefix}dimension_value__value", ''),
            value=data.get(f"{prefix}value", None),
            numerator=data.get(f"{prefix}numerator", None),
            denominator=data.get(f"{prefix}denominator", None),
        )


@dataclass(frozen=True)
class UserData(object):
    email: str = ''
    first_name: str = ''
    last_name: str = ''

    @classmethod
    def make(cls, data, prefix=''):
        return cls(
            email=data.get(f"{prefix}email", ''),
            first_name=data.get(f"{prefix}first_name", ''),
            last_name=data.get(f"{prefix}last_name", ''),
        )

    @property
    def full_name(self):
        fullname = f"{self.first_name} {self.last_name}".strip()
        return f"{fullname} ({self.email})" if fullname else self.email


@dataclass(frozen=True)
class PeriodUpdateData(object):
    id: int
    user: Optional[UserData] = None
    status: str = IndicatorPeriodData.STATUS_DRAFT_CODE
    value: Optional[Decimal] = None
    numerator: Optional[Decimal] = None
    denominator: Optional[Decimal] = None
    narrative: str = ''
    created_at: Optional[datetime] = None
    last_modified_at: Optional[datetime] = None
    disaggregations: List[DisaggregationData] = field(default_factory=list)

    @classmethod
    def make(cls, data, prefix=''):
        return cls(
            id=data[f"{prefix}id"],
            user=UserData.make(data, f"{prefix}user__"),
            status=data.get(f"{prefix}status", IndicatorPeriodData.STATUS_DRAFT_CODE),
            value=data.get(f"{prefix}value", None),
            numerator=data.get(f"{prefix}numerator", None),
            denominator=data.get(f"{prefix}denominator", None),
            narrative=data.get(f"{prefix}narrative", ''),
            created_at=data.get(f"{prefix}created_at", None),
            last_modified_at=data.get(f"{prefix}last_modified_at", None),
        )

    @property
    def is_pending(self):
        return self.status == IndicatorPeriodData.STATUS_PENDING_CODE

    @property
    def is_approved(self):
        return self.status == IndicatorPeriodData.STATUS_APPROVED_CODE


@dataclass(frozen=True)
class CountryData(object):
    iso_code: str = ''
    name: str = ''

    @classmethod
    def make(cls, data, prefix=''):
        return cls(
            iso_code=data.get(f"{prefix}iso_code", ''),
            name=data.get(f"{prefix}name", ''),
        )

    def __hash__(self):
        return hash((self.iso_code, self.name))


@dataclass(frozen=True)
class LocationData(object):
    latitude: float = 0
    longitude: float = 0
    country: Optional[CountryData] = None

    @classmethod
    def make(cls, data, prefix=''):
        return cls(
            latitude=data.get(f"{prefix}latitude", 0),
            longitude=data.get(f"{prefix}longitude", 0),
            country=CountryData.make(data, f"{prefix}country__"),
        )

    def __hash__(self):
        return hash((self.latitude, self.longitude, self.country))


@dataclass(frozen=True)
class ContributorProjectData(object):
    id: Optional[int] = None
    title: str = ''
    subtitle: str = ''
    country: Optional[str] = None
    location: Optional[LocationData] = None
    aggregate_children: bool = True
    aggregate_to_parent: bool = True
    sectors: Set[str] = field(default_factory=set)

    @classmethod
    def make(cls, data, prefix=''):
        return cls(
            id=data.get(f"{prefix}id", None),
            title=data.get(f"{prefix}title", ''),
            subtitle=data.get(f"{prefix}subtitle", ''),
            country=data.get(f"{prefix}primary_location__country__name", None),
            location=LocationData.make(data, f"{prefix}primary_location__"),
            aggregate_children=data.get(f"{prefix}aggregate_children", True),
            aggregate_to_parent=data.get(f"{prefix}aggregate_to_parent", True),
        )

    def __hash__(self):
        return hash((
            self.id,
            self.title,
            self.subtitle,
            self.country,
            self.location,
            self.aggregate_children,
            self.aggregate_to_parent,
            tuple(self.sectors),
        ))


class ReportingPeriodMixin(ABC):
    period_start: Optional[date] = None
    target_value: Optional[Decimal] = None
    indicator_type: int = QUANTITATIVE
    indicator_measure: str = ''
    indicator_cumulative: bool = False
    updates: List[PeriodUpdateData] = field(default_factory=list)
    disaggregation_targets: List[DisaggregationTargetData] = field(default_factory=list)
    contributors: List['ContributorData'] = field(default_factory=list)
    period_disaggregations: List[DisaggregationData] = field(default_factory=list)
    period_actual_value: Optional[Decimal] = None

    @property
    def is_qualitative(self):
        return self.indicator_type == QUALITATIVE

    @property
    def is_quantitative(self):
        return self.indicator_type != QUALITATIVE

    @property
    def is_percentage(self):
        return self.is_quantitative and self.indicator_measure == PERCENTAGE_MEASURE

    @property
    def is_cumulative(self):
        return self.indicator_cumulative and not self.is_percentage

    @property
    def is_cumulative_future(self):
        return self.is_cumulative and self.period_start and self.period_start > date.today()

    @cached_property
    def approved_updates(self):
        return [u for u in self.updates if u.is_approved]

    @cached_property
    def updates_value(self):
        if self.is_percentage:
            return None
        value = 0
        for update in self.approved_updates:
            value += ensure_decimal(update.value)
        return value

    @cached_property
    def updates_numerator(self):
        if not self.is_percentage:
            return None
        value = 0
        for update in self.approved_updates:
            value += ensure_decimal(update.numerator)
        return value

    @cached_property
    def updates_denominator(self):
        if not self.is_percentage:
            return None
        value = 0
        for update in self.approved_updates:
            value += ensure_decimal(update.denominator)
        return value

    @cached_property
    def aggregated_value(self):
        if self.is_percentage or self.is_qualitative:
            return None
        value = ensure_decimal(self.updates_value)
        for contributor in self.contributors:
            value += ensure_decimal(contributor.aggregated_value)
        return value

    @cached_property
    def aggregated_numerator(self):
        if not self.is_percentage:
            return None
        value = ensure_decimal(self.updates_numerator)
        for contributor in self.contributors:
            value += ensure_decimal(contributor.aggregated_numerator)
        return value

    @cached_property
    def aggregated_denominator(self):
        if not self.is_percentage:
            return None
        value = ensure_decimal(self.updates_denominator)
        for contributor in self.contributors:
            value += ensure_decimal(contributor.aggregated_denominator)
        return value

    @cached_property
    def aggregated_target_value(self):
        value = ensure_decimal(self.target_value)
        for contributor in self.contributors:
            value += ensure_decimal(contributor.aggregated_target_value)
        return value

    @cached_property
    def aggregated_indicator_target_value(self):
        value = ensure_decimal(getattr(self, 'indicator_target_value', 0))
        for contributor in self.contributors:
            value += ensure_decimal(contributor.indicator_target_value)
        return value if value else None

    @cached_property
    def actual_value(self):
        if self.is_qualitative:
            return None
        if self.is_percentage:
            return calculate_percentage(self.aggregated_numerator, self.aggregated_denominator)
        # if self.is_cumulative_future:
        #     return 0
        return self.period_actual_value

    @cached_property
    def disaggregations(self):
        return self._get_disaggregations(self.approved_updates)

    @cached_property
    def aggregated_disaggregations(self) -> List[DisaggregationData]:
        items = {}
        for d in self.disaggregations:
            key = (d.category, d.type)
            if key not in items:
                items[key] = {'value': None, 'numerator': None, 'denominator': None}
            if self.is_percentage:
                items[key]['numerator'] = ensure_decimal(items[key]['numerator']) + ensure_decimal(d.numerator)
                items[key]['denominator'] = ensure_decimal(items[key]['denominator']) + ensure_decimal(d.numerator)
            else:
                items[key]['value'] = ensure_decimal(items[key]['value']) + ensure_decimal(d.value)
        for contributor in self.contributors:
            for d in contributor.aggregated_disaggregations:
                key = (d.category, d.type)
                if key not in items:
                    items[key] = {'value': None, 'numerator': None, 'denominator': None}
                if self.is_percentage:
                    items[key]['numerator'] = ensure_decimal(items[key]['numerator']) + ensure_decimal(d.numerator)
                    items[key]['denominator'] = ensure_decimal(items[key]['denominator']) + ensure_decimal(d.numerator)
                else:
                    items[key]['value'] = ensure_decimal(items[key]['value']) + ensure_decimal(d.value)
        return [
            DisaggregationData(None, category, type, d['value'], d['numerator'], d['denominator'])
            for (category, type), d
            in items.items()
        ]

    @cached_property
    def aggregated_disaggregation_targets(self) -> List[DisaggregationTargetData]:
        items = {}
        for d in self.disaggregation_targets:
            key = (d.category, d.type)
            if key not in items:
                items[key] = None
            items[key] = ensure_decimal(items[key]) + ensure_decimal(d.value)
        for contributor in self.contributors:
            for d in contributor.aggregated_disaggregation_targets:
                key = (d.category, d.type)
                if key not in items:
                    items[key] = None
                items[key] = ensure_decimal(items[key]) + ensure_decimal(d.value)
        return [
            DisaggregationTargetData(None, category, type, value)
            for (category, type), value
            in items.items()
        ]

    def get_disaggregation_target_value(self, category, type):
        item = self._select_disaggregation(self.disaggregation_targets, category, type)
        return item.value if item else None

    def get_aggregated_disaggregation_target_value(self, category, type):
        item = self._select_disaggregation(self.aggregated_disaggregation_targets, category, type)
        return item.value if item else None

    def get_disaggregation_value(self, category, type):
        if self.is_cumulative_future:
            return None
        item = self._select_disaggregation(self.period_disaggregations if self.is_cumulative else self.disaggregations, category, type)
        if not item:
            return None
        if self.is_percentage:
            return calculate_percentage(item.numerator, item.denominator)
        return item.value

    def get_aggregated_disaggregation_value(self, category, type):
        if self.is_cumulative_future:
            return None
        item = self._select_disaggregation(self.period_disaggregations if self.is_cumulative else self.aggregated_disaggregations, category, type)
        if not item:
            return None
        if self.is_percentage:
            return calculate_percentage(item.numerator, item.denominator)
        return item.value

    def _select_disaggregation(self, disaggregations, category, type):
        return next((d for d in disaggregations if d.category == category and d.type == type), None)

    def _get_disaggregations(self, updates):
        items = {}
        for u in updates:
            for d in u.disaggregations:
                key = (d.category, d.type)
                if key not in items:
                    items[key] = {'value': None if self.is_percentage else 0, 'numerator': d.numerator, 'denominator': d.denominator}
                if not self.is_percentage:
                    items[key]['value'] += 0 if d.value is None else d.value
        return [DisaggregationData(None, category, type, d['value'], d['numerator'], d['denominator']) for (category, type), d in items.items()]


@dataclass(frozen=True)
class ContributorData(ReportingPeriodMixin):
    id: int
    period_start: Optional[date] = None
    parent: Optional[int] = None
    indicator_type: int = QUANTITATIVE
    indicator_measure: str = ''
    indicator_cumulative: bool = False
    target_value: Optional[Decimal] = None
    period_actual_value: Optional[Decimal] = None
    period_narrative: str = ''
    indicator_baseline_value: Optional[Decimal] = None
    indicator_target_value: Optional[Decimal] = None
    project: Optional[ContributorProjectData] = None
    updates: List[PeriodUpdateData] = field(default_factory=list)
    disaggregation_targets: List[DisaggregationTargetData] = field(default_factory=list)
    contributors: List['ContributorData'] = field(default_factory=list)
    period_disaggregations: List[DisaggregationData] = field(default_factory=list)

    @classmethod
    def make(cls, data, prefix=''):
        return cls(
            id=data[f"{prefix}id"],
            period_start=data.get(f"{prefix}period_start", None),
            parent=data.get(f"{prefix}parent_period", None),
            indicator_type=data.get(f"{prefix}indicator__type", QUANTITATIVE),
            indicator_measure=data.get(f"{prefix}indicator__measure", ''),
            indicator_cumulative=data.get(f"{prefix}indicator__cumulative", False),
            target_value=maybe_decimal(data.get(f"{prefix}target_value", None)),
            period_actual_value=ensure_decimal(data.get(f"{prefix}actual_value", None)),
            period_narrative=data.get(f"{prefix}narrative", ''),
            indicator_baseline_value=data.get(f"{prefix}indicator__baseline_value", None),
            indicator_target_value=data.get(f"{prefix}indicator__target_value", None),
            project=ContributorProjectData.make(data, 'indicator__result__project__')
        )

    @cached_property
    def has_contributions(self):
        if len(self.approved_updates) > 0:
            return True
        for contributor in self.contributors:
            if contributor.has_contributions:
                return True
        return False

    @cached_property
    def locations(self) -> Set[LocationData]:
        result = set()
        if self.project and self.project.location:
            result.add(self.project.location)
        for contributor in self.contributors:
            result.update(contributor.locations)
        return result

    @cached_property
    def countries(self) -> Set[CountryData]:
        result = set()
        for location in self.locations:
            if not location.country:
                continue
            result.add(location.country)
        return result


@dataclass(frozen=True)
class PeriodData(ReportingPeriodMixin):
    id: int
    period_start: Optional[date] = None
    period_end: Optional[date] = None
    target_value: Optional[Decimal] = None
    target_comment: str = ''
    period_actual_value: Optional[Decimal] = None
    actual_comment: str = ''
    narrative: str = ''
    indicator_type: int = QUANTITATIVE
    indicator_measure: str = ''
    indicator_cumulative: bool = False
    updates: List[PeriodUpdateData] = field(default_factory=list)
    disaggregation_targets: List[DisaggregationTargetData] = field(default_factory=list)
    contributors: List[ContributorData] = field(default_factory=list)
    period_disaggregations: List[DisaggregationData] = field(default_factory=list)

    @classmethod
    def make(cls, data, prefix=''):
        return cls(
            id=data[f"{prefix}id"],
            period_start=data.get(f"{prefix}period_start", None),
            period_end=data.get(f"{prefix}period_end", None),
            target_value=maybe_decimal(data.get(f"{prefix}target_value", None)),
            target_comment=data.get(f"{prefix}target_comment", ''),
            period_actual_value=ensure_decimal(data.get(f"{prefix}actual_value", None)),
            actual_comment=data.get(f"{prefix}actual_comment", ''),
            narrative=data.get(f"{prefix}narrative", ''),
            indicator_type=data.get(f"{prefix}indicator__type", QUANTITATIVE),
            indicator_measure=data.get(f"{prefix}indicator__measure", ''),
            indicator_cumulative=data.get(f"{prefix}indicator__cumulative", False),
        )

    @cached_property
    def aggregated_value(self):
        if self.is_qualitative:
            return None
        if self.is_cumulative_future:
            return 0
        if self.is_cumulative:
            return self.actual_value
        if self.is_percentage:
            return calculate_percentage(self.aggregated_numerator, self.aggregated_denominator)
        value = ensure_decimal(self.updates_value)
        for contributor in self.contributors:
            value += ensure_decimal(contributor.aggregated_value)
        return value

    @cached_property
    def pending_updates(self):
        return [u for u in self.updates if u.is_pending]

    @cached_property
    def has_pending_updates(self):
        return len(self.pending_updates) > 0

    @cached_property
    def pending_value(self):
        if self.is_qualitative:
            return None
        if self.is_percentage:
            return calculate_percentage(self.pending_numerator, self.pending_denominator)
        value = 0
        for update in self.pending_updates:
            value += ensure_decimal(update.value)
        return value

    @cached_property
    def pending_numerator(self):
        if not self.is_percentage:
            return None
        value = 0
        for update in self.pending_updates:
            value += ensure_decimal(update.numerator)
        return value

    @cached_property
    def pending_denominator(self):
        if not self.is_percentage:
            return None
        value = 0
        for update in self.pending_updates:
            value += ensure_decimal(update.denominator)
        return value

    @cached_property
    def pending_disaggregations(self):
        return self._get_disaggregations(self.pending_updates)

    def get_pending_disaggregation_value(self, category, type):
        item = self._select_disaggregation(self.pending_disaggregations, category, type)
        return item.value if item else None

    @cached_property
    def locations(self) -> Set[LocationData]:
        result = set()
        for contributor in self.contributors:
            result.update(contributor.locations)
        return result

    @cached_property
    def countries(self) -> Set[CountryData]:
        result = set()
        for contributor in self.contributors:
            result.update(contributor.countries)
        return result


@dataclass(frozen=True)
class IndicatorData(object):
    id: int
    title: str = ''
    type: int = QUANTITATIVE
    measure: str = ''
    cumulative: bool = False
    description: str = ''
    baseline_year: Optional[int] = None
    baseline_value: Optional[Decimal] = None
    baseline_comment: str = ''
    target_value: Optional[Decimal] = None
    target_comment: str = ''
    periods: List[PeriodData] = field(default_factory=list)

    @classmethod
    def make(cls, data, prefix=''):
        return cls(
            id=data[f"{prefix}id"],
            title=data.get(f"{prefix}title", ''),
            type=data.get(f"{prefix}type", QUANTITATIVE),
            measure=data.get(f"{prefix}measure", ''),
            cumulative=data.get(f"{prefix}cumulative", False),
            description=data.get(f"{prefix}description", ''),
            baseline_year=data.get(f"{prefix}baseline_year", None),
            baseline_value=maybe_decimal(data.get(f"{prefix}baseline_value", None)),
            baseline_comment=data.get(f"{prefix}baseline_comment", ''),
            target_value=data.get(f"{prefix}target_value", None),
            target_comment=data.get(f"{prefix}target_comment", None),
        )

    @cached_property
    def has_pending_updates(self):
        for period in self.periods:
            if period.has_pending_updates:
                return True
        return False

    @cached_property
    def aggregated_target_value(self):
        return self.periods[0].aggregated_indicator_target_value if len(self.periods) > 0 else None

    @property
    def is_qualitative(self):
        return self.type == QUALITATIVE

    @property
    def is_quantitative(self):
        return self.type != QUALITATIVE

    @property
    def is_percentage(self):
        return self.is_quantitative and self.measure == PERCENTAGE_MEASURE

    @property
    def is_cumulative(self):
        return self.cumulative and not self.is_percentage


@dataclass(frozen=True)
class ResultData(object):
    id: int
    title: str = ''
    description: str = ''
    type: str = ''
    aggregation_status: Optional[bool] = None
    indicators: List[IndicatorData] = field(default_factory=list)

    @classmethod
    def make(cls, data, prefix=''):
        return cls(
            id=data[f"{prefix}id"],
            title=data.get(f"{prefix}title", ''),
            description=data.get(f"{prefix}description", ''),
            type=data.get(f"{prefix}type", ''),
            aggregation_status=data.get(f"{prefix}aggregation_status", ''),
        )

    @cached_property
    def has_pending_updates(self):
        for indicator in self.indicators:
            if indicator.has_pending_updates:
                return True
        return False

    @cached_property
    def iati_type_name(self):
        return self.get_codelist_name(self.type)

    @staticmethod
    @lru_cache
    def get_codelist_name(code, version=settings.IATI_VERSION):
        try:
            type = ResultType.objects.get(code=code, version__code=version)
            return type.name
        except ResultType.DoesNotExist:
            return ''


class IndicatorType(Enum):
    Quantitative = QUANTITATIVE
    Qualitative = QUALITATIVE


@dataclass(frozen=True)
class ResultWithIndicatorType:
    type: IndicatorType
    result: ResultData

    @cached_property
    def indicators(self):
        return [it for it in self.result.indicators if self._check_type(it)]

    def __getattr__(self, attr):
        return getattr(self.result, attr)

    def _check_type(self, indicator: IndicatorData):
        return indicator.is_qualitative \
            if self.type == IndicatorType.Qualitative \
            else indicator.is_quantitative


def filter_results_by_indicator_type(type: IndicatorType, results: List[ResultData]):
    wrapped = [ResultWithIndicatorType(type=type, result=it) for it in results]
    return [it for it in wrapped if it.indicators]


def group_results_by_types(results):
    types = {}
    for result in results:
        type = result.iati_type_name
        if not type:
            continue
        types.setdefault(type, []).append(result)
    return types


def has_cumulative_indicator(results):
    for result in results:
        for indicator in result.indicators:
            if indicator.is_cumulative:
                return True
    return False
