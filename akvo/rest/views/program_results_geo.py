# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.

# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


import json

from abc import ABC
from dataclasses import dataclass, field
from datetime import date
from decimal import Decimal
from functools import cached_property, lru_cache
from os.path import dirname, abspath, join
from typing import List, Optional, Set

from django.conf import settings
from django.shortcuts import get_object_or_404
from rest_framework.authentication import SessionAuthentication
from rest_framework.decorators import api_view, authentication_classes
from rest_framework.response import Response
from rest_framework.status import HTTP_403_FORBIDDEN

from akvo.codelists.models import ResultType
from akvo.rest.models import TastyTokenAuthentication
from akvo.rsr.models import Project, IndicatorPeriod, IndicatorPeriodData
from akvo.rsr.models.result.utils import QUANTITATIVE, QUALITATIVE, PERCENTAGE_MEASURE, calculate_percentage
from akvo.utils import ensure_decimal


# -----------------------------------------------------------------------
# Dataclasses

@dataclass(frozen=True)
class ContributorProjectData(object):
    id: Optional[int] = None
    title: str = ''
    country_code: Optional[str] = None
    aggregate_children: bool = True
    aggregate_to_parent: bool = True
    sector_codes: Set[str] = field(default_factory=set)

    @classmethod
    def make(cls, data, prefix=''):
        return cls(
            id=data.get(f"{prefix}id", None),
            title=data.get(f"{prefix}title", ''),
            country_code=data.get(f"{prefix}primary_location__country__iso_code", None),
            aggregate_children=data.get(f"{prefix}aggregate_children", True),
            aggregate_to_parent=data.get(f"{prefix}aggregate_to_parent", True),
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
    def is_approved(self):
        return self.status == IndicatorPeriodData.STATUS_APPROVED_CODE


class ReportingPeriodMixin(ABC):
    target_value: Optional[str] = None
    indicator_type: int = QUANTITATIVE
    indicator_measure: str = ''
    updates: List[PeriodUpdateData] = field(default_factory=list)
    contributors: List['ContributorData'] = field(default_factory=list)

    @property
    def is_qualitative(self):
        return self.indicator_type == QUALITATIVE

    @property
    def is_quantitative(self):
        return self.indicator_type != QUALITATIVE

    @property
    def is_percentage(self):
        return self.is_quantitative and self.indicator_measure == PERCENTAGE_MEASURE

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
        value = self.updates_value
        for contributor in self.contributors:
            value += ensure_decimal(contributor.aggregated_value)
        return value

    @cached_property
    def aggregated_numerator(self):
        if not self.is_percentage:
            return None
        value = self.updates_numerator
        for contributor in self.contributors:
            value += ensure_decimal(contributor.aggregated_numerator)
        return value

    @cached_property
    def aggregated_denominator(self):
        if not self.is_percentage:
            return None
        value = self.updates_denominator
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


@dataclass(frozen=True)
class ContributorData(ReportingPeriodMixin):
    id: int
    parent: Optional[int] = None
    indicator_type: int = QUANTITATIVE
    indicator_measure: str = ''
    target_value: Optional[str] = None
    indicator_target_value: Optional[Decimal] = None
    project: Optional[ContributorProjectData] = None
    updates: List[PeriodUpdateData] = field(default_factory=list)
    contributors: List['ContributorData'] = field(default_factory=list)

    @classmethod
    def make(cls, data, prefix=''):
        return cls(
            id=data[f"{prefix}id"],
            parent=data.get(f"{prefix}parent_period", None),
            indicator_type=data.get(f"{prefix}indicator__type", QUANTITATIVE),
            indicator_measure=data.get(f"{prefix}indicator__measure", ''),
            target_value=data.get(f"{prefix}target_value", None),
            indicator_target_value=data.get(f"{prefix}indicator__target_value", None),
            project=ContributorProjectData.make(data, 'indicator__result__project__')
        )

    @cached_property
    def contributing_countries(self):
        if self.project and not self.project.aggregate_children:
            return set()
        local = set([self.project.country_code]) if self.project and self.project.country_code else set()
        contributors = set()
        for contrib in self.contributors:
            if contrib.project and not contrib.project.aggregate_to_parent:
                continue
            contributors = contributors | contrib.contributing_countries
        return local | contributors

    @cached_property
    def actual_value(self):
        if self.is_qualitative:
            return None
        if self.is_percentage:
            return calculate_percentage(self.updates_numerator, self.updates_denominator)
        return self.updates_value


@dataclass(frozen=True)
class PeriodData(ReportingPeriodMixin):
    id: int
    period_start: Optional[date] = None
    period_end: Optional[date] = None
    target_value: Optional[str] = None
    target_comment: str = ''
    actual_value: str = ''
    actual_comment: str = ''
    narrative: str = ''
    indicator_type: int = QUANTITATIVE
    indicator_measure: str = ''
    updates: List[PeriodUpdateData] = field(default_factory=list)
    contributors: List[ContributorData] = field(default_factory=list)

    @classmethod
    def make(cls, data, prefix=''):
        return cls(
            id=data[f"{prefix}id"],
            period_start=data.get(f"{prefix}period_start", None),
            period_end=data.get(f"{prefix}period_end", None),
            target_value=data.get(f"{prefix}target_value", None),
            target_comment=data.get(f"{prefix}target_comment", ''),
            actual_value=data.get(f"{prefix}actual_value", ''),
            actual_comment=data.get(f"{prefix}actual_comment", ''),
            narrative=data.get(f"{prefix}narrative", ''),
            indicator_type=data.get(f"{prefix}indicator__type", QUANTITATIVE),
            indicator_measure=data.get(f"{prefix}indicator__measure", ''),
        )

    @cached_property
    def contributing_countries(self):
        codes = set()
        for contrib in self.contributors:
            codes = codes | contrib.contributing_countries
        return codes

    @cached_property
    def aggregated_value(self):
        if self.is_qualitative:
            return None
        if self.is_percentage:
            return calculate_percentage(self.aggregated_numerator, self.aggregated_denominator)
        value = self.updates_value
        for contributor in self.contributors:
            value += ensure_decimal(contributor.aggregated_value)
        return value


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
    def contributing_countries(self):
        codes = set()
        for period in self.periods:
            codes = codes | period.contributing_countries
        return codes

    @property
    def is_quantitative(self):
        return self.type != QUALITATIVE

    @property
    def is_percentage(self):
        return self.is_quantitative and self.measure == PERCENTAGE_MEASURE


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
    def contributing_countries(self):
        codes = set()
        for indicator in self.indicators:
            codes = codes | indicator.contributing_countries
        return codes

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


# ------------------------------------------------------------------------
# Fetch Data

def fetch_periods(project):
    queryset = IndicatorPeriod.objects\
        .select_related('indicator', 'indicator__result', 'indicator__result__project')\
        .filter(indicator__result__project=project)
    return queryset\
        .order_by('indicator__result__order', 'indicator__order', '-period_start')\
        .values(
            'id', 'period_start', 'period_end', 'target_value',
            'indicator__id', 'indicator__title', 'indicator__type', 'indicator__measure', 'indicator__target_value',
            'indicator__result__id', 'indicator__result__type', 'indicator__result__title',
        )


def fetch_contributors(root_period_ids):
    family = set(root_period_ids)
    while True:
        children = IndicatorPeriod.objects.filter(parent_period__in=family).values_list('id', flat=True)
        if family.union(children) == family:
            break
        family = family.union(children)
    contributor_ids = family - root_period_ids
    return IndicatorPeriod.objects\
        .select_related('indicator__result__project')\
        .prefetch_related('data')\
        .filter(id__in=contributor_ids)\
        .values(
            'id', 'parent_period', 'target_value', 'indicator__id',
            'indicator__type', 'indicator__measure', 'indicator__target_value',
            'indicator__result__project__id', 'indicator__result__project__title',
            'indicator__result__project__aggregate_children', 'indicator__result__project__aggregate_to_parent',
            'indicator__result__project__primary_location__country__iso_code',
            'data__id', 'data__status', 'data__value', 'data__numerator', 'data__denominator',
        )


# -------------------------------------------------------------------------
# Process data

def hierarchize_contributors(contributors):
    tops = []
    lookup = {it.id: it for it in contributors}
    ids = lookup.keys()
    for contributor in contributors:
        parent = contributor.parent
        if not parent or parent not in ids:
            tops.append(contributor)
        else:
            lookup[parent].contributors.append(contributor)
    return tops


def get_contributors(root_period_ids):
    lookup = {
        'contributors': {},
        'updates': {},
    }
    raw_contributors = fetch_contributors(root_period_ids)
    for c in raw_contributors:
        contributor_id = c['id']
        update_id = c['data__id']
        if contributor_id not in lookup['contributors']:
            contributor = ContributorData.make(c)
            lookup['contributors'][contributor_id] = contributor
        else:
            contributor = lookup['contributors'][contributor_id]
        if update_id is None:
            continue
        if update_id not in lookup['updates']:
            update = PeriodUpdateData.make(c, 'data__')
            contributor.updates.append(update)
            lookup['updates'][update_id] = update
        else:
            update = lookup['updates'][update_id]
    return hierarchize_contributors(lookup['contributors'].values())


def get_results_framework(project):
    raw_periods = fetch_periods(project)
    lookup = {
        'results': {},
        'indicators': {},
        'periods': {},
    }
    for r in raw_periods:
        result_id = r['indicator__result__id']
        indicator_id = r['indicator__id']
        period_id = r['id']
        if result_id not in lookup['results']:
            lookup['results'][result_id] = ResultData.make(r, 'indicator__result__')
        result = lookup['results'][result_id]
        if indicator_id not in lookup['indicators']:
            indicator = IndicatorData.make(r, 'indicator__')
            result.indicators.append(indicator)
            lookup['indicators'][indicator_id] = indicator
        else:
            indicator = lookup['indicators'][indicator_id]
        if period_id not in lookup['periods']:
            period = PeriodData.make(r)
            indicator.periods.append(period)
            lookup['periods'][period_id] = period
    period_ids = {it['id'] for it in raw_periods}
    contributors = get_contributors(period_ids)
    for contributor in contributors:
        period_id = contributor.parent
        if period_id in lookup['periods']:
            period = lookup['periods'][period_id]
            period.contributors.append(contributor)
    return [r for r in lookup['results'].values()]


def get_countries_geojson():
    filepath = join(dirname(abspath(__file__)), 'countries.geojson')
    with open(filepath, 'r') as f:
        return json.load(f)


@dataclass
class PeriodValue(object):
    period_start: Optional[date] = None
    period_end: Optional[date] = None
    period_target: Optional[Decimal] = None
    aggregated_period_target: Optional[Decimal] = None
    target: Optional[Decimal] = None
    value: Optional[Decimal] = None
    numerator: Optional[Decimal] = None
    denominator: Optional[Decimal] = None

    def add_value(self, value):
        if self.value is None:
            self.value = Decimal(0)
        self.value += value

    def add_fraction(self, numerator, denominator):
        if self.numerator is None:
            self.numerator = Decimal(0)
        if self.denominator is None:
            self.denominator = Decimal(0)
        self.numerator += numerator
        self.denominator += denominator

    def add_target(self, target):
        if self.target is None:
            self.target = Decimal(0)
        self.target += target

    def to_dict(self):
        return self.__dict__


def get_indicators_by_country(project):
    results = get_results_framework(project)
    by_countries = {}
    for result in results:
        for indicator in result.indicators:
            for period in indicator.periods:
                if period.aggregated_value is None or not period.is_quantitative:
                    continue
                for contributor in period.contributors:
                    if not contributor.project and not contributor.project.country_code:
                        continue
                    country_code = contributor.project.country_code
                    if country_code not in by_countries:
                        by_countries[country_code] = {}
                    by_country = by_countries[country_code]
                    if indicator.id not in by_country:
                        by_country[indicator.id] = {
                            'is_percentage': indicator.is_percentage,
                            'periods': {}
                        }
                    by_indicator = by_country[indicator.id]
                    if period.id not in by_indicator:
                        by_indicator['periods'][period.id] = PeriodValue(
                            period_start=period.period_start,
                            period_end=period.period_end,
                            period_target=ensure_decimal(period.target_value),
                            aggregated_period_target=period.aggregated_target_value,
                        )
                    period_value = by_indicator['periods'][period.id]
                    if period.is_percentage:
                        period_value.add_fraction(contributor.aggregated_numerator, contributor.aggregated_denominator)
                    else:
                        period_value.add_value(contributor.aggregated_value)
                    period_value.add_target(contributor.aggregated_target_value)
    return by_countries


def get_geo_data(project):
    by_countries = get_indicators_by_country(project)
    country_codes = list(by_countries.keys())
    countries_geo = get_countries_geojson()
    features = []
    for feature in countries_geo['features']:
        country_code = feature['properties']['iso_code']
        if country_code.lower() not in country_codes:
            continue
        properties = {'iso_code': country_code, 'indicators': {}}
        for indicator_id, indicator_value in by_countries[country_code.lower()].items():
            properties['indicators'][indicator_id] = {
                'is_percentage': indicator_value['is_percentage'],
                'periods': [p.to_dict() for p in indicator_value['periods'].values()]
            }
        feature['properties'] = properties
        features.append(feature)
    return {'type': 'FeatureCollection', 'features': features}


# -------------------------------------------------------------------------
# Endpoint

@api_view(['GET'])
@authentication_classes([SessionAuthentication, TastyTokenAuthentication])
def get_program_results_geo(request, project_pk):
    project = get_object_or_404(Project, pk=project_pk)
    if not request.user.has_perm('rsr.view_project', project):
        return Response('Request not allowed', status=HTTP_403_FORBIDDEN)

    data = get_geo_data(project)

    return Response(data)
