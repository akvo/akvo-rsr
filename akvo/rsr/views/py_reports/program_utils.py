from django.db.models import Q

from akvo.rsr.dataclasses import (
    ResultData, IndicatorData, PeriodData, PeriodUpdateData, DisaggregationData,
    ContributorData, DisaggregationTargetData, has_cumulative_indicator
)
from akvo.rsr.models import IndicatorPeriod, DisaggregationTarget, Sector, IndicatorPeriodDisaggregation


def get_results_framework(project, start_date=None, end_date=None):
    raw_periods = fetch_periods(project, start_date, end_date)
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
    is_cumulative = has_cumulative_indicator(lookup['results'].values())
    if is_cumulative:
        raw_period_disaggregations = fetch_period_disaggregations(period_ids)
        for r in raw_period_disaggregations:
            period_id = r['period__id']
            if period_id not in lookup['periods']:
                continue
            period_disaggregation = DisaggregationData.make(r)
            period = lookup['periods'][period_id]
            period.period_disaggregations.append(period_disaggregation)
    contributors = get_contributors(period_ids, is_cumulative)
    for contributor in contributors:
        period_id = contributor.parent
        if period_id in lookup['periods']:
            period = lookup['periods'][period_id]
            period.contributors.append(contributor)
    return [r for r in lookup['results'].values()]


def fetch_periods(project, start_date=None, end_date=None):
    queryset = IndicatorPeriod.objects\
        .select_related('indicator', 'indicator__result', 'indicator__result__project')\
        .filter(indicator__result__project=project)
    if start_date and end_date:
        queryset = queryset.filter(
            Q(period_start__isnull=True) | Q(period_start__gte=start_date),
            Q(period_end__isnull=True) | Q(period_end__lte=end_date)
        )
    return queryset\
        .order_by('indicator__result__order', 'indicator__order', 'period_start')\
        .values(
            'id', 'period_start', 'period_end', 'target_value', 'actual_value', 'narrative',
            'indicator__id', 'indicator__title', 'indicator__description', 'indicator__type', 'indicator__measure', 'indicator__cumulative',
            'indicator__target_value', 'indicator__baseline_value',
            'indicator__result__id', 'indicator__result__type', 'indicator__result__title', 'indicator__result__description',
        )


def get_contributors(root_period_ids, has_cumulative_indicator=False):
    lookup = {
        'contributors': {},
        'updates': {},
        'disaggregations': {},
    }
    raw_contributors = fetch_contributors(root_period_ids)
    for c in raw_contributors:
        contributor_id = c['id']
        update_id = c['data__id']
        disaggregation_id = c['data__disaggregations__id']
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
        if disaggregation_id is None:
            continue
        disaggregation = DisaggregationData.make(c, 'data__disaggregations__')
        update.disaggregations.append(disaggregation)
    contributor_ids = {c['id'] for c in raw_contributors}
    raw_disaggregation_targets = fetch_contributor_disaggregations(contributor_ids)
    for d in raw_disaggregation_targets:
        contributor_id = d['period__id']
        if contributor_id not in lookup['contributors']:
            continue
        disaggregation_target = DisaggregationTargetData.make(d)
        contributor = lookup['contributors'][contributor_id]
        contributor.disaggregation_targets.append(disaggregation_target)
    if has_cumulative_indicator:
        raw_period_disaggregations = fetch_period_disaggregations(contributor_ids)
        for r in raw_period_disaggregations:
            period_id = r['period__id']
            if period_id not in lookup['contributors']:
                continue
            period_disaggregation = DisaggregationData.make(r)
            contributor = lookup['contributors'][period_id]
            contributor.period_disaggregations.append(period_disaggregation)
    project_ids = {c['indicator__result__project__id'] for c in raw_contributors}
    project_sectors = get_project_sectors(project_ids)
    for contributor in lookup['contributors'].values():
        project_id = contributor.project.id
        if project_id in project_sectors:
            contributor.project.sectors.update(project_sectors[project_id])
    return hierarchize_contributors(lookup['contributors'].values())


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
        .prefetch_related(
            'data',
            'data__disaggregations',
            'data__disaggregations__value',
            'data__disaggregations__value__name'
        )\
        .filter(id__in=contributor_ids)\
        .values(
            'id', 'period_start', 'parent_period', 'target_value', 'actual_value', 'indicator__id',
            'indicator__type', 'indicator__measure', 'indicator__cumulative', 'indicator__target_value',
            'indicator__baseline_value', 'indicator__result__project__id',
            'indicator__result__project__title', 'indicator__result__project__subtitle',
            'indicator__result__project__aggregate_children', 'indicator__result__project__aggregate_to_parent',
            'indicator__result__project__primary_location__latitude',
            'indicator__result__project__primary_location__longitude',
            'indicator__result__project__primary_location__country__name',
            'indicator__result__project__primary_location__country__iso_code',
            'data__id', 'data__status', 'data__value', 'data__numerator', 'data__denominator', 'data__narrative',
            'data__created_at', 'data__last_modified_at',
            'data__user__email', 'data__user__first_name', 'data__user__last_name',
            'data__disaggregations__id', 'data__disaggregations__value',
            'data__disaggregations__numerator', 'data__disaggregations__denominator',
            'data__disaggregations__dimension_value__value', 'data__disaggregations__dimension_value__name__name',
        )


def fetch_contributor_disaggregations(contributor_ids):
    return DisaggregationTarget.objects\
        .select_related('period', 'dimension_value', 'dimension_value__name')\
        .filter(period__in=contributor_ids)\
        .values('id', 'value', 'period__id', 'dimension_value__value', 'dimension_value__name__name')


def fetch_period_disaggregations(period_ids):
    queryset = IndicatorPeriodDisaggregation.objects\
        .select_related('period', 'dimension_value', 'dimension_value__name')\
        .filter(period__in=period_ids)
    return queryset.values('id', 'value', 'numerator', 'denominator', 'period__id', 'dimension_value__value', 'dimension_value__name__name')


def get_project_sectors(project_ids):
    sectors = fetch_sectors(project_ids)
    project_sectors = {}
    for s in sectors:
        project_sectors.setdefault(s.project_id, set()).add(s.iati_sector_unicode())
    return project_sectors


def fetch_sectors(project_ids):
    return Sector.objects.filter(project__in=project_ids, vocabulary='1')\
        .exclude(Q(sector_code__isnull=True) | Q(sector_code__exact=''))


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
