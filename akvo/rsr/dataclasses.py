# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

from dataclasses import dataclass, field
from datetime import date
from decimal import Decimal
from functools import cached_property, lru_cache
from typing import Optional, List

from akvo.rsr.models import IndicatorPeriodData
from akvo.rsr.models.result.utils import QUANTITATIVE, QUALITATIVE, PERCENTAGE_MEASURE, calculate_percentage
from akvo.utils import ensure_decimal
from akvo.codelists.models import ResultType

from django.conf import settings


@dataclass(frozen=True)
class DisaggregationTargetData(object):
    id: int
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
class PeriodUpdateData(object):
    id: int
    status: str = IndicatorPeriodData.STATUS_DRAFT_CODE
    value: Optional[Decimal] = None
    numerator: Optional[Decimal] = None
    denominator: Optional[Decimal] = None
    narrative: str = ''
    created_at: Optional[date] = None
    last_modified_at: Optional[date] = None
    disaggregations: List[DisaggregationData] = field(default_factory=list)

    @classmethod
    def make(cls, data, prefix=''):
        return cls(
            id=data[f"{prefix}id"],
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
class PeriodData(object):
    id: int
    period_start: Optional[date] = None
    period_end: Optional[date] = None
    target_value: str = ''
    target_comment: str = ''
    actual_value: str = ''
    actual_comment: str = ''
    narrative: str = ''
    indicator_type: int = QUANTITATIVE
    indicator_measure: str = ''
    updates: List[PeriodUpdateData] = field(default_factory=list)
    disaggregation_targets: List[DisaggregationTargetData] = field(default_factory=list)

    @classmethod
    def make(cls, data, prefix=''):
        return cls(
            id=data[f"{prefix}id"],
            period_start=data.get(f"{prefix}period_start", None),
            period_end=data.get(f"{prefix}period_end", None),
            target_value=data.get(f"{prefix}target_value", ''),
            target_comment=data.get(f"{prefix}target_comment", ''),
            actual_value=data.get(f"{prefix}actual_value", ''),
            actual_comment=data.get(f"{prefix}actual_comment", ''),
            narrative=data.get(f"{prefix}narrative", ''),
            indicator_type=data.get(f"{prefix}indicator__type", None),
            indicator_measure=data.get(f"{prefix}indicator__measure", ''),
        )

    @property
    def is_qualitative(self):
        return self.indicator_type == QUALITATIVE

    @property
    def is_quantitative(self):
        return self.indicator_type == QUALITATIVE

    @property
    def is_percentage(self):
        return self.is_quantitative and self.indicator_measure == PERCENTAGE_MEASURE

    @cached_property
    def approved_updates(self):
        return [u for u in self.updates if u.is_approved]

    @cached_property
    def pending_updates(self):
        return [u for u in self.updates if u.is_pending]

    @cached_property
    def has_pending_updates(self):
        return len(self.pending_updates) > 0

    @cached_property
    def pending_value(self):
        if self.is_percentage:
            return calculate_percentage(self.pending_numerator, self.pending_denominator)
        value = 0
        for update in self.updates:
            if update.is_pending:
                value += ensure_decimal(update.value)
        return value

    @cached_property
    def pending_numerator(self):
        value = 0
        for update in self.updates:
            if update.is_pending:
                value += ensure_decimal(update.numerator)
        return value

    @cached_property
    def pending_denominator(self):
        value = 0
        for update in self.updates:
            if update.is_pending:
                value += ensure_decimal(update.denominator)
        return value

    @cached_property
    def disaggregations(self):
        return self._get_disaggregations(self.approved_updates)

    @cached_property
    def pending_disaggregations(self):
        return self._get_disaggregations(self.pending_updates)

    def get_disaggregation_target_value(self, category, type):
        item = self._select_disaggregation(self.disaggregation_targets, category, type)
        return item.value if item else None

    def get_disaggregation_value(self, category, type):
        item = self._select_disaggregation(self.disaggregations, category, type)
        return item.value if item else None

    def get_pending_disaggregation_value(self, category, type):
        item = self._select_disaggregation(self.pending_disaggregations, category, type)
        return item.value if item else None

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
class IndicatorData(object):
    id: int
    title: str = ''
    type: int = QUANTITATIVE
    measure: str = ''
    description: str = ''
    baseline_year: Optional[int] = None
    baseline_value: str = ''
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
            description=data.get(f"{prefix}description", ''),
            baseline_year=data.get(f"{prefix}baseline_year", None),
            baseline_value=data.get(f"{prefix}baseline_value", ''),
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
