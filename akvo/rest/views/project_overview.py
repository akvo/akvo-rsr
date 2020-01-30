# -*- coding: utf-8 -*-
"""Akvo RSR is covered by the GNU Affero General Public License.

See more details in the license.txt file located at the root folder of the Akvo RSR module.
For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.
"""

from akvo.rest.models import TastyTokenAuthentication
from akvo.rsr.models import Project, Result, IndicatorPeriod
from akvo.rsr.models.result.utils import QUANTITATIVE
from decimal import Decimal, InvalidOperation
from django.http import Http404
from django.shortcuts import get_object_or_404
from rest_framework.authentication import SessionAuthentication
from rest_framework.decorators import api_view, authentication_classes
from rest_framework.response import Response


@api_view(['GET'])
@authentication_classes([SessionAuthentication, TastyTokenAuthentication])
def project_results(request, pk):
    queryset = Project.objects.prefetch_related('results')
    project = get_object_or_404(queryset, pk=pk)
    if not request.user.has_perm('rsr.view_project', project):
        raise Http404
    return Response([{'id': r.id, 'title': r.title} for r in project.results.all()])


@api_view(['GET'])
@authentication_classes([SessionAuthentication, TastyTokenAuthentication])
def project_result_overview(request, project_pk, result_pk):
    queryset = Result.objects.prefetch_related(
        'indicators', 'indicators__periods').select_related('project')
    result = get_object_or_404(queryset, pk=result_pk)
    project = result.project
    if project.id != int(project_pk) or not request.user.has_perm('rsr.view_project', project):
        raise Http404

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
                'measure': (
                    'unit' if i.measure == '1' else 'percentage' if i.measure == '2' else None),
                'periods': _drilldown_indicator_periods_contributions(i)
            }
            for i in result.indicators.all()
        ]
    }
    return Response(data)


def _drilldown_indicator_periods_contributions(indicator):
    periods = _get_indicator_periods_hierarchy_flatlist(indicator)
    periods_tree = _make_periods_hierarchy_tree(periods)

    return [_transform_period_contributions_node(n) for n in periods_tree]


def _transform_period_contributions_node(node):
    period = node['item']
    contributors, countries = _transform_contributions_hierarchy(node['children'])

    return {
        'id': period.id,
        'period_start': period.period_start,
        'period_end': period.period_end,
        'actual_value': _force_decimal(period.actual_value),
        'target_value': _force_decimal(period.target_value),
        'contributors': contributors,
        'countries': countries,
        'comments': period.actual_comment.split(' | ') if period.actual_comment else None,
        'disaggregations': [
            {
                'category': d.dimension_value.name.name,
                'type': d.dimension_value.value,
                'value': d.value,
                'numerator': d.numerator,
                'denominator': d.denominator,
            }
            for d
            in period.disaggregations.all()
        ],
        'disaggregation_targets': [
            {
                'category': d.dimension_value.name.name,
                'type': d.dimension_value.value,
                'value': d.value,
            }
            for d
            in period.disaggregation_targets.all()
        ]
    }


def _transform_contributions_hierarchy(tree):
    contributors = []
    contributor_countries = []
    for node in tree:
        contributor, countries = _transform_contributor_node(node)
        if contributor:
            contributors.append(contributor)
            contributor_countries = _merge_unique(contributor_countries, countries)

    return contributors, contributor_countries


def _transform_contributor_node(node):
    contributor = _transform_contributor(node['item'])
    contributor_countries = []
    if contributor:
        if contributor['country']:
            contributor_countries.append(contributor['country'])
        contributors, countries = _transform_contributions_hierarchy(node['children'])
        contributor['contributors'] = contributors
        contributor_countries = _merge_unique(contributor_countries, countries)

    return contributor, contributor_countries


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
        'disaggregations',
        'disaggregations__dimension_value',
        'disaggregations__dimension_value__name',
        'disaggregation_targets',
        'disaggregation_targets__dimension_value',
        'disaggregation_targets__dimension_value__name'
    ).filter(pk__in=family)

    return periods


def _make_periods_hierarchy_tree(qs):
    tree = []
    lookup = {}
    ids = [p.id for p in qs]

    for period in qs:
        item_id = period.id
        parent_id = period.parent_period.id if period.parent_period else None

        if item_id not in lookup:
            lookup[item_id] = {'children': []}

        lookup[item_id]['item'] = period
        node = lookup[item_id]

        if not parent_id or parent_id not in ids:
            tree.append(node)
        else:
            if parent_id not in lookup:
                lookup[parent_id] = {'children': []}

            lookup[parent_id]['children'].append(node)

    return tree


def _transform_contributor(period):
    value = _force_decimal(period.actual_value)

    if value <= 0:
        return None

    project = period.indicator.result.project
    country = project.primary_location.country if project.primary_location else None

    return {
        'id': project.id,
        'title': project.title,
        'country': {'iso_code': country.iso_code} if country else None,
        'value': value,
        'contributors': [],
        'comments': period.actual_comment.split(' | ') if period.actual_comment else None,
    }


def _merge_unique(l1, l2):
    out = list(l1)
    for i in l2:
        if i not in out:
            out.append(i)

    return out


def _force_decimal(value):
    try:
        return Decimal(value)
    except (InvalidOperation, TypeError):
        return Decimal(0)
