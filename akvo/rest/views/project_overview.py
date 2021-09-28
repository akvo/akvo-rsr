# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.

# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


from akvo.codelists.models import ResultType
from akvo.rest.models import TastyTokenAuthentication
from akvo.rsr.models import Project, Result, Indicator, IndicatorPeriod, IndicatorPeriodData
from akvo.rsr.models.result.utils import QUANTITATIVE, QUALITATIVE, PERCENTAGE_MEASURE, calculate_percentage
from akvo.utils import ensure_decimal
from dataclasses import dataclass, field
from datetime import date
from decimal import Decimal, InvalidOperation
from django.conf import settings
from django.db.models import Sum
from django.shortcuts import get_object_or_404
from functools import cached_property, lru_cache
from rest_framework.authentication import SessionAuthentication
from rest_framework.decorators import api_view, authentication_classes
from rest_framework.response import Response
from rest_framework.status import HTTP_403_FORBIDDEN
from typing import Optional, Dict, List


@dataclass(frozen=True)
class ContributingProjectData(object):
    id: int
    title: Optional[str] = None
    country_code: Optional[str] = None
    aggregate_children: bool = True
    aggregate_to_parent: bool = True
    partners: Dict[int, str] = field(default_factory=dict)

    @classmethod
    def make(cls, data, prefix=''):
        obj = cls(
            id=data[f"{prefix}id"],
            title=data.get(f"{prefix}title", None),
            aggregate_children=data.get(f"{prefix}aggregate_children", True),
            aggregate_to_parent=data.get(f"{prefix}aggregate_to_parent", True),
            country_code=data.get(f"{prefix}primary_location__country__iso_code", None),
        )
        partner_id = data.get(f"{prefix}partners__id", None)
        partner_name = data.get(f"{prefix}partners__name", None)
        if not partner_id and partner_name:
            obj.partners[partner_id] = partner_name
        return obj


@dataclass(frozen=True)
class ContributingResultData(object):
    id: int
    project: ContributingProjectData
    parent: Optional[int] = None
    contributors: List['ContributingResultData'] = field(default_factory=list)

    @classmethod
    def make(cls, data, prefix=''):
        return cls(
            id=data[f"{prefix}id"],
            parent=data.get(f"{prefix}parent_result", None),
            project=ContributingProjectData.make(data, f"{prefix}project__")
        )

    @cached_property
    def contributing_countries(self):
        if not self.project.aggregate_children:
            return set()
        local_project = set([self.project.country_code]) if self.project and self.project.country_code else set()
        contributors = set()
        for contrib in self.contributors:
            if not contrib.project.aggregate_to_parent:
                continue
            contributors = contributors | contrib.contributing_countries
        return local_project | contributors

    @cached_property
    def contributing_projects(self):
        if not self.project.aggregate_children:
            return {}
        projects = {self.project.id: self.project.title} if self.project else {}
        for contrib in self.contributors:
            if not contrib.project.aggregate_to_parent:
                continue
            for project_id, project_title in contrib.contributing_projects.items():
                if project_id not in projects:
                    projects[project_id] = project_title
        return projects

    @cached_property
    def contributing_partners(self):
        if not self.project.aggregate_children:
            return {}
        partners = self.project.partners if self.project else {}
        for contrib in self.contributors:
            if not contrib.project.aggregate_to_parent:
                continue
            for partner_id, partner_name in contrib.contributing_partners.items():
                if partner_id not in partners:
                    partners[partner_id] = partner_name
        return partners


@dataclass(frozen=True)
class PeriodData:
    id: int
    period_start: Optional[date] = None
    period_end: Optional[date] = None

    @classmethod
    def make(cls, data, prefix=''):
        return cls(
            id=data[f"{prefix}id"],
            period_start=data.get(f"{prefix}period_start", None),
            period_end=data.get(f"{prefix}period_end", None),
        )


@dataclass(frozen=True)
class IndicatorData(object):
    id: int
    title: Optional[str] = ''
    periods: List[PeriodData] = field(default_factory=list)

    @classmethod
    def make(cls, data, prefix=''):
        return cls(
            id=data[f"{prefix}id"],
            title=data.get(f"{prefix}title", ''),
        )

    @cached_property
    def reporting_periods(self):
        periods = set()
        for period in self.periods:
            periods = periods | set([(period.period_start, period.period_end)])
        return periods


@dataclass(frozen=True)
class ResultData(object):
    id: int
    title: Optional[str] = None
    type: Optional[str] = None
    indicators: List[IndicatorData] = field(default_factory=list)
    contributors: List[ContributingResultData] = field(default_factory=list)

    @classmethod
    def make(cls, data, prefix=''):
        return cls(
            id=data[f"{prefix}id"],
            title=data.get(f"{prefix}title", None),
            type=data.get(f"{prefix}type", None),
        )

    @property
    def indicator_count(self):
        return len(self.indicators)

    @cached_property
    def indicator_titles(self):
        return [i.title for i in self.indicators]

    @cached_property
    def reporting_periods(self):
        periods = set()
        for indicator in self.indicators:
            periods = periods | indicator.reporting_periods
        return periods

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

    @cached_property
    def contributing_countries(self):
        codes = set()
        for contrib in self.contributors:
            codes = codes | contrib.contributing_countries
        return codes

    @cached_property
    def contributing_projects(self):
        projects = {}
        for contrib in self.contributors:
            for project_id, project_title in contrib.contributing_projects.items():
                if project_id not in projects:
                    projects[project_id] = project_title
        return projects

    @cached_property
    def contributing_partners(self):
        partners = {}
        for contrib in self.contributors:
            for partner_id, partner_name in contrib.contributing_partners.items():
                if partner_id not in partners:
                    partners[partner_id] = partner_name
        return partners


def fetch_periods(project):
    return IndicatorPeriod.objects\
        .select_related('indicator', 'indicator__result')\
        .filter(indicator__result__project=project)\
        .order_by('indicator__result__order', 'indicator__order')\
        .values(
            'id', 'period_start', 'period_end', 'indicator__id', 'indicator__title',
            'indicator__result__id', 'indicator__result__title', 'indicator__result__type'
        )


def get_contributor_ids(root_result_ids):
    family = set(root_result_ids)
    while True:
        children = Result.objects.filter(parent_result__in=family).values_list('id', flat=True)
        if family.union(children) == family:
            break
        family = family.union(children)
    return family - root_result_ids


def fetch_contributing_results(root_result_ids):
    contributor_ids = get_contributor_ids(root_result_ids)
    return Result.objects\
        .filter(id__in=contributor_ids)\
        .values(
            'id', 'parent_result',
            'project__id', 'project__title', 'project__aggregate_children', 'project__aggregate_to_parent',
            'project__primary_location__country__iso_code', 'project__partners__id', 'project__partners__name',
        )


def get_flat_contributors(root_result_ids):
    lookup = {}
    raw_contributors = fetch_contributing_results(root_result_ids)
    for c in raw_contributors:
        contributor_id = c['id']
        partner_id = c['project__partners__id']
        if contributor_id not in lookup:
            contributor = ContributingResultData.make(c)
            lookup[contributor_id] = contributor
        if partner_id not in contributor.project.partners:
            contributor.project.partners[partner_id] = c['project__partners__name']
    return lookup.values()


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


def get_contributors(root_result_ids):
    flat_contributors = get_flat_contributors(root_result_ids)
    return hierarchize_contributors(flat_contributors)


def get_results(project):
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
    contributors = get_contributors(lookup['results'].keys())
    for c in contributors:
        result_id = c.parent
        if result_id in lookup['results']:
            lookup['results'][result_id].contributors.append(c)
    return lookup['results'].values()


@api_view(['GET'])
@authentication_classes([SessionAuthentication, TastyTokenAuthentication])
def project_results(request, pk):
    queryset = Project.objects.prefetch_related('results')
    project = get_object_or_404(queryset, pk=pk)
    if not request.user.has_perm('rsr.view_project', project):
        return Response('Request not allowed', status=HTTP_403_FORBIDDEN)
    results = get_results(project)
    data = {
        'id': project.id,
        'title': project.title,
        'subtitle': project.subtitle,
        'targets_at': project.targets_at,
        'results': [
            {
                'id': r.id,
                'title': r.title,
                'indicator_count': r.indicator_count,
                'indicator_titles': r.indicator_titles,
                'type': r.iati_type_name,
                'countries': r.contributing_countries,
                'contributors': r.contributing_projects,
                'partners': r.contributing_partners,
                'periods': r.reporting_periods,
            }
            for r in results
        ]
    }
    return Response(data)


def is_aggregating_targets(project):
    return project.id in settings.AGGREGATE_TARGETS


@api_view(['GET'])
@authentication_classes([SessionAuthentication, TastyTokenAuthentication])
def project_result_overview(request, project_pk, result_pk):
    queryset = Result.objects.prefetch_related(
        'indicators', 'indicators__periods').select_related('project')
    result = get_object_or_404(queryset, pk=result_pk)
    project = result.project
    if project.id != int(project_pk) or not request.user.has_perm('rsr.view_project', project):
        return Response('Request not allowed', status=HTTP_403_FORBIDDEN)

    program = project.get_program()
    targets_at = program.targets_at if program else project.targets_at
    aggregate_targets = is_aggregating_targets(project)

    data = {
        'id': result.id,
        'title': result.title,
        'indicators': [
            {
                'id': i.id,
                'title': i.title,
                'description': i.description,
                'period_count': len(i.periods.all()),
                'type': 'quantitative' if i.type == QUANTITATIVE else 'qualitative',
                'baseline_year': i.baseline_year,
                'baseline_value': i.baseline_value,
                'target_value': _get_indicator_target(i, targets_at, aggregate_targets),
                'score_options': i.scores,
                'measure': (
                    'unit' if i.measure == '1' else 'percentage' if i.measure == '2' else None),
                'periods': _drilldown_indicator_periods_contributions(i, aggregate_targets),
                'disaggregation_targets': _transform_disaggregation_targets(i),
            }
            for i in result.indicators.all()
        ]
    }
    return Response(data)


@api_view(['GET'])
@authentication_classes([SessionAuthentication, TastyTokenAuthentication])
def project_indicator_overview(request, project_pk, indicator_pk):
    queryset = Indicator.objects.prefetch_related('periods').select_related('result__project')
    indicator = get_object_or_404(queryset, pk=indicator_pk)
    project = indicator.result.project
    if project.id != int(project_pk) or not request.user.has_perm('rsr.view_project', project):
        return Response('Request not allowed', status=HTTP_403_FORBIDDEN)

    program = project.get_program()
    targets_at = program.targets_at if program else project.targets_at
    aggregate_targets = is_aggregating_targets(project)

    data = {
        'id': indicator.id,
        'title': indicator.title,
        'description': indicator.description,
        'period_count': len(indicator.periods.all()),
        'type': 'quantitative' if indicator.type == QUANTITATIVE else 'qualitative',
        'baseline_year': indicator.baseline_year,
        'baseline_value': indicator.baseline_value,
        'target_value': _get_indicator_target(indicator, targets_at, aggregate_targets),
        'measure': (
            'unit' if indicator.measure == '1' else 'percentage' if indicator.measure == '2' else None),
        'periods': _drilldown_indicator_periods_contributions(indicator),
        'disaggregation_targets': _transform_disaggregation_targets(indicator),
    }
    return Response(data)


def _drilldown_indicator_periods_contributions(indicator, aggregate_targets=False):
    periods = _get_indicator_periods_hierarchy_flatlist(indicator)
    periods_tree = _make_objects_hierarchy_tree(periods, 'parent_period')

    return [_transform_period_contributions_node(n, aggregate_targets) for n in periods_tree]


def _get_indicator_hierarchy_ids(indicator):
    family = {indicator.id}
    while True:
        children = set(Indicator.objects.filter(parent_indicator__in=family).values_list('pk', flat=True))
        if family.union(children) == family:
            break
        family = family.union(children)
    return family


def _get_indicator_target(indicator, targets_at=None, aggregate_targets=False):
    if targets_at != 'indicator':
        return None
    if indicator.type == QUALITATIVE:
        return indicator.target_value
    if indicator.measure == PERCENTAGE_MEASURE or not aggregate_targets:
        return ensure_decimal(indicator.target_value)
    hierarchy_ids = _get_indicator_hierarchy_ids(indicator)
    result = Indicator.objects.filter(id__in=hierarchy_ids).aggregate(Sum('target_value'))
    return ensure_decimal(result['target_value__sum'])


def _get_indicator_periods_hierarchy_flatlist(indicator):
    family = {period.id for period in indicator.periods.all()}
    while True:
        children = set(
            IndicatorPeriod.objects.filter(parent_period__in=family).values_list('pk', flat=True))
        if family.union(children) == family:
            break

        family = family.union(children)

    periods = IndicatorPeriod.objects.select_related(
        'indicator__result__project',
        'indicator__result__project__primary_location__country',
        'parent_period',
    ).prefetch_related(
        'data',
        'data__user',
        'data__approved_by',
        'data__comments',
        'data__comments__user',
        'data__disaggregations',
        'data__disaggregations__dimension_value',
        'data__disaggregations__dimension_value__name',
        'disaggregation_targets',
        'disaggregation_targets__dimension_value',
        'disaggregation_targets__dimension_value__name'
    ).filter(pk__in=family)

    return periods


def _make_objects_hierarchy_tree(objects, parent_attr):
    tree = []
    lookup = {}
    ids = [o.id for o in objects]

    for obj in objects:
        item_id = obj.id
        if item_id not in lookup:
            lookup[item_id] = {'children': []}
        lookup[item_id]['item'] = obj
        node = lookup[item_id]

        parent_obj = getattr(obj, parent_attr)
        parent_id = parent_obj.id if parent_obj else None
        if not parent_id or parent_id not in ids:
            tree.append(node)
        else:
            if parent_id not in lookup:
                lookup[parent_id] = {'children': []}
            lookup[parent_id]['children'].append(node)

    return tree


def _transform_period_contributions_node(node, aggregate_targets=False):
    period = node['item']
    is_percentage = period.indicator.measure == PERCENTAGE_MEASURE
    is_qualitative = period.indicator.type == QUALITATIVE
    actual_numerator, actual_denominator = None, None
    updates_value, updates_numerator, updates_denominator = None, None, None
    contributors, countries, aggregates, disaggregations = _transform_contributions_hierarchy(node['children'], is_percentage)
    aggregated_value, aggregated_numerator, aggregated_denominator = aggregates
    updates = _transform_updates(period)

    if is_percentage:
        updates_numerator, updates_denominator = _extract_percentage_updates(updates)
        updates_value = calculate_percentage(updates_numerator, updates_denominator)
        actual_numerator, actual_denominator = updates_numerator, updates_denominator
        if aggregated_numerator:
            actual_numerator += aggregated_numerator
        if aggregated_denominator:
            actual_denominator += aggregated_denominator
        actual_value = calculate_percentage(actual_numerator, actual_denominator)
    else:
        actual_value = _force_decimal(period.actual_value)
        updates_value = _calculate_update_values(updates)

    if is_qualitative:
        target = period.target_value
    elif aggregate_targets and not is_percentage:
        target = _aggregate_targets(node)
    else:
        target = _force_decimal(period.target_value)

    result = {
        'period_id': period.id,
        'period_start': period.period_start,
        'period_end': period.period_end,
        'locked': period.locked,
        'actual_comment': period.actual_comment.split(' | ') if period.actual_comment else None,
        'actual_value': actual_value,
        'actual_numerator': actual_numerator,
        'actual_denominator': actual_denominator,
        'can_add_update': period.can_save_update(),
        'target_value': target,
        'countries': countries,
        'updates': updates,
        'updates_value': updates_value,
        'updates_numerator': updates_numerator,
        'updates_denominator': updates_denominator,
        'updates_score_index': period.score_index,
        'updates_score_indices': period.score_indices,
        'contributors': contributors,
        'disaggregation_contributions': list(disaggregations.values()),
        'disaggregation_targets': _transform_disaggregation_targets(period),
    }

    return result


def _aggregate_targets(node):
    aggregate = _force_decimal(node['item'].target_value)
    for child in node['children']:
        aggregate += _aggregate_targets(child)

    return aggregate


def _transform_contributions_hierarchy(tree, is_percentage):
    contributors = []
    contributor_countries = []
    aggregated_value = Decimal(0) if not is_percentage else None
    aggregated_numerator = Decimal(0) if is_percentage else None
    aggregated_denominator = Decimal(0) if is_percentage else None
    disaggregations = {}
    for node in tree:
        contributor, countries = _transform_contributor_node(node, is_percentage)
        if contributor:
            contributors.append(contributor)
            contributor_countries = _merge_unique(contributor_countries, countries)
            if not is_percentage:
                aggregated_value += contributor['actual_value']
            else:
                aggregated_numerator += contributor['actual_numerator']
                aggregated_denominator += contributor['actual_denominator']
            disaggregation_contributions = _extract_disaggregation_contributions(contributor)
            for key in disaggregation_contributions:
                if key not in disaggregations:
                    disaggregations[key] = disaggregation_contributions[key].copy()
                else:
                    disaggregations[key]['value'] = ensure_decimal(disaggregations[key]['value']) + ensure_decimal(disaggregation_contributions[key]['value'])

    aggregates = (aggregated_value, aggregated_numerator, aggregated_denominator)

    return contributors, contributor_countries, aggregates, disaggregations


def _extract_disaggregation_contributions(contributor):
    disaggregations = {}
    for update in contributor['updates']:
        if update['status']['code'] == 'A':
            for d in update['disaggregations']:
                key = (d['category'], d['type'])
                if key not in disaggregations:
                    disaggregations[key] = d.copy()
                else:
                    disaggregations[key]['value'] = ensure_decimal(disaggregations[key]['value']) + ensure_decimal(d['value'])

    return disaggregations


def _extract_percentage_updates(updates):
    numerator = Decimal(0)
    denominator = Decimal(0)
    for update in updates:
        if (
            update['numerator'] is not None
            and update['denominator'] is not None
            and update['status']['code'] == IndicatorPeriodData.STATUS_APPROVED_CODE
        ):
            numerator += update['numerator']
            denominator += update['denominator']

    return numerator, denominator


def _transform_contributor_node(node, is_percentage):
    contributor, aggregate_children = _transform_contributor(node['item'], is_percentage)
    if not contributor:
        return contributor, []

    contributor_countries = []
    if contributor['country']:
        contributor_countries.append(contributor['country'])

    if is_percentage:
        actual_numerator, actual_denominator = _extract_percentage_updates(contributor['updates'])
        contributor['actual_numerator'] = actual_numerator
        contributor['actual_denominator'] = actual_denominator

    if not aggregate_children:
        return contributor, contributor_countries

    contributors, countries, aggregates, disaggregations = _transform_contributions_hierarchy(node['children'], is_percentage)
    aggregated_value, aggregated_numerator, aggregated_denominator = aggregates
    contributors_count = len(contributors)
    if contributors_count:
        if aggregated_numerator:
            contributor['actual_numerator'] += aggregated_numerator
        if aggregated_denominator:
            contributor['actual_denominator'] += aggregated_denominator
        contributor['contributors'] = contributors
        contributor['disaggregation_contributions'] = list(disaggregations.values())
        contributor_countries = _merge_unique(contributor_countries, countries)

    return contributor, contributor_countries


def _calculate_update_values(updates):
    total = 0
    for update in updates:
        if update['value'] and update['status']['code'] == IndicatorPeriodData.STATUS_APPROVED_CODE:
            total += update['value']

    return total


def _transform_contributor(period, is_percentage):
    value = _force_decimal(period.actual_value)

    is_qualitative = period.indicator.type == QUALITATIVE
    # FIXME: Not sure why the value < 1 check is being used, if it is a float
    # comparison issue, we need to resolve it in a better fashion.
    # Return early if there are not updates and value is "0" for quantitative updates
    if not is_qualitative and value < 1 and period.data.count() < 1:
        return None, None

    project = period.indicator.result.project
    if not project.aggregate_to_parent:
        return None, None

    country = project.primary_location.country if project.primary_location else None
    updates = _transform_updates(period)
    updates_value, updates_numerator, updates_denominator = None, None, None
    if is_percentage:
        updates_numerator, updates_denominator = _extract_percentage_updates(updates)
        updates_value = calculate_percentage(updates_numerator, updates_denominator)
    else:
        updates_value = _calculate_update_values(updates)

    if is_qualitative:
        target = period.target_value
    else:
        target = _force_decimal(period.target_value)

    contributor = {
        'project_id': project.id,
        'project_title': project.title,
        'project_subtitle': project.subtitle,
        'period_id': period.id,
        'country': {'iso_code': country.iso_code} if country else None,
        'actual_comment': period.actual_comment.split(' | ') if period.actual_comment else None,
        'actual_value': value,
        'actual_numerator': None,
        'actual_denominator': None,
        'target_value': target,
        'score_index': period.score_index,
        'score_indices': period.score_indices,
        'updates': updates,
        'updates_value': updates_value,
        'updates_numerator': updates_numerator,
        'updates_denominator': updates_denominator,
        'contributors': [],
        'disaggregation_contributions': [],
        'disaggregation_targets': _transform_disaggregation_targets(period),
    }

    return contributor, project.aggregate_children


def _transform_updates(period):
    return [
        {
            'update_id': u.id,
            'status': {'code': u.status, 'name': dict(IndicatorPeriodData.STATUSES)[u.status]},
            'user': {
                'user_id': u.user.id,
                'email': u.user.email,
                'name': u.user.get_full_name(),
            } if u.user else None,
            'approved_by': {
                'user_id': u.approved_by.id,
                'email': u.approved_by.email,
                'name': u.user.get_full_name(),
            } if u.approved_by else None,
            'value': u.value,
            'numerator': u.numerator,
            'denominator': u.denominator,
            'text': u.text,
            'narrative': u.narrative,
            'score_index': u.score_index,
            'score_indices': u.score_indices,
            'comments': [
                {
                    'comment_id': c.id,
                    'user': {
                        'user_id': c.user.id,
                        'email': c.user.email,
                        'name': u.user.get_full_name(),
                    },
                    'comment': c.comment,
                    'created_at': c.created_at,
                }
                for c
                in u.comments.all()
            ],
            'disaggregations': [
                {
                    'category': d.dimension_value.name.name,
                    'category_id': d.dimension_value.name.id,
                    'type': d.dimension_value.value,
                    'type_id': d.dimension_value.id,
                    'value': d.value,
                    'numerator': d.numerator,
                    'denominator': d.denominator,
                }
                for d
                in u.disaggregations.all()
            ],
            'created_at': u.created_at,
            'last_modified_at': u.last_modified_at,

        }
        for u
        in period.data.all()
    ]


def _transform_disaggregation_targets(obj):
    return [
        {
            'category': t.dimension_value.name.name,
            'category_id': t.dimension_value.name.id,
            'type': t.dimension_value.value,
            'type_id': t.dimension_value.id,
            'value': t.value,
        }
        for t
        in obj.disaggregation_targets.all()
    ]


def _force_decimal(value):
    try:
        return Decimal(value)
    except (InvalidOperation, TypeError):
        return Decimal(0)


def _merge_unique(l1, l2):
    out = list(l1)
    for i in l2:
        if i not in out:
            out.append(i)

    return out
