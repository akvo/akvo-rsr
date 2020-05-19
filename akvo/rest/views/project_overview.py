# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.

# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


from akvo.rest.models import TastyTokenAuthentication
from akvo.rsr.models import Project, Result, Indicator, IndicatorPeriod, IndicatorPeriodData
from akvo.rsr.models.result.utils import QUANTITATIVE, QUALITATIVE, PERCENTAGE_MEASURE, calculate_percentage
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
    data = {
        'id': project.id,
        'title': project.title,
        'subtitle': project.subtitle,
        'results': [
            {
                'id': r.id,
                'title': r.title,
                'indicator_count': r.indicators.count(),
                'type': r.iati_type().name if r.type else None
            }
            for r in project.results.all()
        ],
    }
    return Response(data)


def is_eutf_syria_program(project):
    return project.id == 7809


@api_view(['GET'])
@authentication_classes([SessionAuthentication, TastyTokenAuthentication])
def project_result_overview(request, project_pk, result_pk):
    queryset = Result.objects.prefetch_related(
        'indicators', 'indicators__periods').select_related('project')
    result = get_object_or_404(queryset, pk=result_pk)
    project = result.project
    if project.id != int(project_pk) or not request.user.has_perm('rsr.view_project', project):
        raise Http404

    # NOTE: We aggregate targets only if the project is EUTF Syria's program.
    # Their program has only L0 and L1 projects, and they don't set targets the
    # program level. We use an aggregation of targets at L1 as the L0 target.
    aggregate_targets = is_eutf_syria_program(project)

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
                'measure': (
                    'unit' if i.measure == '1' else 'percentage' if i.measure == '2' else None),
                'periods': _drilldown_indicator_periods_contributions(i, aggregate_targets)
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
        raise Http404

    data = {
        'id': indicator.id,
        'title': indicator.title,
        'description': indicator.description,
        'period_count': len(indicator.periods.all()),
        'type': 'quantitative' if indicator.type == QUANTITATIVE else 'qualitative',
        'baseline_year': indicator.baseline_year,
        'baseline_value': indicator.baseline_value,
        'measure': (
            'unit' if indicator.measure == '1' else 'percentage' if indicator.measure == '2' else None),
        'periods': _drilldown_indicator_periods_contributions(indicator)
    }
    return Response(data)


def _drilldown_indicator_periods_contributions(indicator, aggregate_targets=False):
    periods = _get_indicator_periods_hierarchy_flatlist(indicator)
    periods_tree = _make_periods_hierarchy_tree(periods)

    return [_transform_period_contributions_node(n, aggregate_targets) for n in periods_tree]


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
        'target_value': target,
        'countries': countries,
        'updates': updates,
        'updates_value': updates_value,
        'updates_numerator': updates_numerator,
        'updates_denominator': updates_denominator,
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
                    disaggregations[key]['value'] += disaggregation_contributions[key]['value']

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
                    disaggregations[key]['value'] += d['value']

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

    if value < 1 and period.data.count() < 1:
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


def _transform_disaggregation_targets(period):
    return [
        {
            'category': t.dimension_value.name.name,
            'category_id': t.dimension_value.name.id,
            'type': t.dimension_value.value,
            'type_id': t.dimension_value.id,
            'value': t.value,
        }
        for t
        in period.disaggregation_targets.all()
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
