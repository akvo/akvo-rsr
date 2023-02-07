# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.

# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


from akvo.rest.authentication import TastyTokenAuthentication
from akvo.rsr.dataclasses import ResultData, IndicatorData, PeriodData, ContributorData
from akvo.rsr.models import Project, IndicatorPeriod
from akvo.rsr.models.result.utils import QUANTITATIVE
from django.shortcuts import get_object_or_404
from rest_framework.authentication import SessionAuthentication
from rest_framework.decorators import api_view, authentication_classes
from rest_framework.response import Response
from rest_framework.status import HTTP_403_FORBIDDEN


@api_view(['GET'])
@authentication_classes([SessionAuthentication, TastyTokenAuthentication])
def get_program_results(request, program_pk):
    queryset = Project.objects.prefetch_related('results')
    program = get_object_or_404(queryset, pk=program_pk)
    if not request.user.has_perm('rsr.view_project', program):
        return Response('Request not allowed', status=HTTP_403_FORBIDDEN)
    results = get_results_framework(program)
    data = {
        'id': program.id,
        'title': program.title,
        'targets_at': program.targets_at,
        'results': [
            {
                'id': result.id,
                'title': result.title,
                'type': result.iati_type_name,
                'indicators': [
                    {
                        'id': indicator.id,
                        'title': indicator.title,
                        'type': 'quantitative' if indicator.type == QUANTITATIVE else 'qualitative',
                        'target_value': indicator.target_value,
                        'score_options': indicator.scores,
                        'periods': [
                            {
                                'id': period.id,
                                'period_start': period.period_start,
                                'period_end': period.period_end,
                                'target_value': period.target_value,
                                'contributors': format_contributors(period.contributors),
                            }
                            for period in indicator.periods
                        ],
                    } for indicator in result.indicators
                ],
            }
            for result in results
        ],
    }
    return Response(data)


def format_contributors(contributors):
    return [format_contributor(c) for c in contributors if c.project.aggregate_to_parent]


def format_contributor(contributor):
    return {
        'id': contributor.id,
        'project_id': contributor.project.id,
        'project_title': contributor.project.title,
        'project_subtitle': contributor.project.subtitle,
        'country': {'iso_code': contributor.project.country_code} if contributor.project.country_code else None,
        'partners': {k: v for k, v in contributor.project.partners.items()},
        'contributors': format_contributors(contributor.contributors) if contributor.project.aggregate_children else []
    }


def get_results_framework(program):
    raw_periods = fetch_periods(program)
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
    contributors = get_contributors(lookup['periods'].keys())
    for c in contributors:
        period_id = c.parent
        if period_id in lookup['periods']:
            lookup['periods'][period_id].contributors.append(c)
    return lookup['results'].values()


def fetch_periods(program):
    return IndicatorPeriod.objects\
        .select_related('indicator', 'indicator__result')\
        .filter(indicator__result__project=program)\
        .order_by('indicator__result__order', 'indicator__order', '-period_start')\
        .values(
            'id', 'period_start', 'period_end', 'target_value', 'indicator__id',
            'indicator__title', 'indicator__type', 'indicator__target_value', 'indicator__scores',
            'indicator__result__id', 'indicator__result__title', 'indicator__result__type'
        )


def get_contributors(root_period_ids):
    flat_contributors = get_flat_contributors(root_period_ids)
    return hierarchize_contributors(flat_contributors)


def get_flat_contributors(root_period_ids):
    lookup = {}
    raw_contributors = fetch_contributors(root_period_ids)
    for c in raw_contributors:
        contributor_id = c['id']
        partner_id = c['indicator__result__project__partners__id']
        if contributor_id not in lookup:
            contributor = ContributorData.make(c)
            lookup[contributor_id] = contributor
        contributor = lookup[contributor_id]
        if partner_id not in contributor.project.partners:
            contributor.project.partners[partner_id] = c['indicator__result__project__partners__name']
    return lookup.values()


def fetch_contributors(root_period_ids):
    contributor_ids = fetch_contributor_ids(root_period_ids)
    return IndicatorPeriod.objects\
        .select_related('indicator__result__project')\
        .prefetch_related('indicator__result__project__partners')\
        .filter(id__in=contributor_ids)\
        .values(
            'id', 'parent_period',
            'indicator__result__project__id',
            'indicator__result__project__title',
            'indicator__result__project__subtitle',
            'indicator__result__project__aggregate_children',
            'indicator__result__project__aggregate_to_parent',
            'indicator__result__project__primary_location__country__iso_code',
            'indicator__result__project__partners__id',
            'indicator__result__project__partners__name',
        )


def fetch_contributor_ids(root_period_ids):
    family = set(root_period_ids)
    while True:
        children = IndicatorPeriod.objects.filter(parent_period__in=family).values_list('id', flat=True)
        if family.union(children) == family:
            break
        family = family.union(children)
    return family - root_period_ids


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
