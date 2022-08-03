# -*- coding: utf-8 -*-

"""Akvo RSR is covered by the GNU Affero General Public License.

See more details in the license.txt file located at the root folder of the
Akvo RSR module. For additional details on the GNU license please
see < http://www.gnu.org/licenses/agpl.html >.
"""

from datetime import datetime

from akvo.rsr.dataclasses import (
    ResultData, IndicatorData, PeriodData, PeriodUpdateData, DisaggregationData,
    ContributorData, DisaggregationTargetData, group_results_by_types
)
from akvo.rsr.project_overview import is_aggregating_targets, get_disaggregations
from akvo.rsr.models import Project, IndicatorPeriod, DisaggregationTarget, Sector, EmailReportJob
from akvo.rsr.models.result.utils import calculate_percentage
from akvo.rsr.decorators import with_download_indicator
from akvo.utils import ensure_decimal, maybe_decimal
from django.contrib.auth.decorators import login_required
from django.db.models import Q
from django.http import HttpResponse
from django.shortcuts import get_object_or_404
from pyexcelerate import Workbook, Style, Font, Color, Fill, Alignment

from . import utils


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
        .order_by('indicator__result__order', 'indicator__order', '-period_start')\
        .values(
            'id', 'period_start', 'period_end', 'target_value',
            'indicator__id', 'indicator__title', 'indicator__description', 'indicator__type', 'indicator__measure', 'indicator__target_value',
            'indicator__baseline_value', 'indicator__result__id', 'indicator__result__type', 'indicator__result__title', 'indicator__result__description',
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
        .prefetch_related(
            'data',
            'data__disaggregations',
            'data__disaggregations__value',
            'data__disaggregations__value__name'
        )\
        .filter(id__in=contributor_ids)\
        .values(
            'id', 'parent_period', 'target_value', 'indicator__id',
            'indicator__type', 'indicator__measure', 'indicator__target_value',
            'indicator__baseline_value', 'indicator__result__project__id',
            'indicator__result__project__title', 'indicator__result__project__subtitle',
            'indicator__result__project__aggregate_children', 'indicator__result__project__aggregate_to_parent',
            'indicator__result__project__primary_location__country__name',
            'data__id', 'data__status', 'data__value', 'data__numerator', 'data__denominator',
            'data__disaggregations__id', 'data__disaggregations__value',
            'data__disaggregations__numerator', 'data__disaggregations__denominator',
            'data__disaggregations__dimension_value__value', 'data__disaggregations__dimension_value__name__name',
        )


def fetch_contributor_disaggregations(contributor_ids):
    return DisaggregationTarget.objects\
        .select_related('period', 'dimension_value', 'dimension_value__name')\
        .filter(period__in=contributor_ids)\
        .values('id', 'value', 'period__id', 'dimension_value__value', 'dimension_value__name__name')


def fetch_sectors(project_ids):
    return Sector.objects.filter(project__in=project_ids, vocabulary='1')\
        .exclude(Q(sector_code__isnull=True) | Q(sector_code__exact=''))


def get_project_sectors(project_ids):
    sectors = fetch_sectors(project_ids)
    project_sectors = {}
    for s in sectors:
        project_sectors.setdefault(s.project_id, set()).add(s.iati_sector_unicode())
    return project_sectors


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
    project_ids = {c['indicator__result__project__id'] for c in raw_contributors}
    project_sectors = get_project_sectors(project_ids)
    for contributor in lookup['contributors'].values():
        project_id = contributor.project.id
        if project_id in project_sectors:
            contributor.project.sectors.update(project_sectors[project_id])
    return hierarchize_contributors(lookup['contributors'].values())


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
    contributors = get_contributors(period_ids)
    for contributor in contributors:
        period_id = contributor.parent
        if period_id in lookup['periods']:
            period = lookup['periods'][period_id]
            period.contributors.append(contributor)
    return [r for r in lookup['results'].values()]


AGGREGATED_TARGET_VALUE_COLUMN = 11


def get_dynamic_column_start(aggregate_targets):
    return AGGREGATED_TARGET_VALUE_COLUMN + 1 if aggregate_targets else AGGREGATED_TARGET_VALUE_COLUMN


@login_required
def add_email_report_job(request, program_id):
    user = request.user
    EmailReportJob.objects.create(
        report='program_overview_pdf_report',
        payload={
            'program_id': program_id,
            'period_start': request.GET.get('period_start', '').strip(),
            'period_end': request.GET.get('period_end', '').strip(),
        },
        recipient=user.email
    )
    return HttpResponse('The report you requested will be sent to your email address', status=202)


def send_report(params, recipient):
    program = Project.objects.prefetch_related('results').get(pk=params['program_id'])
    start_date = utils.parse_date(params.get('period_start', ''))
    end_date = utils.parse_date(params.get('period_end', ''))
    wb = generate_workbok(program, start_date, end_date)
    filename = '{}-{}-program-overview-report.xlsx'.format(datetime.today().strftime('%Y%b%d'), program.id)
    utils.send_excel_report(wb, recipient, filename)


@login_required
@with_download_indicator
def render_report(request, program_id):
    program = get_object_or_404(Project.objects.prefetch_related('results'), pk=program_id)
    start_date = utils.parse_date(request.GET.get('period_start', '').strip())
    end_date = utils.parse_date(request.GET.get('period_end', '').strip())
    wb = generate_workbok(program, start_date, end_date)
    filename = '{}-{}-program-overview-report.xlsx'.format(datetime.today().strftime('%Y%b%d'), program.id)
    return utils.make_excel_response(wb, filename)


def generate_workbok(program, start_date=None, end_date=None):
    results = get_results_framework(program, start_date, end_date)
    results_by_types = group_results_by_types(results)
    if not results_by_types:
        results_by_types = {'Sheet1': []}
    aggregate_targets = is_aggregating_targets(program)
    use_indicator_target = utils.is_using_indicator_target(program)
    disaggregations = get_disaggregations(program)
    disaggregations_column_start = 16 if aggregate_targets else 15
    disaggregation_types_length = 0
    for types in disaggregations.values():
        disaggregation_types_length += len(types.keys())
    disaggregations_last_colnum = disaggregations_column_start - 1 + (disaggregation_types_length * 2)
    wb = Workbook()
    header_style = Style(
        font=Font(bold=True, size=12),
        fill=Fill(background=Color(211, 211, 211))
    )

    subheader_style = Style(
        font=Font(size=12),
        fill=Fill(background=Color(211, 211, 211))
    )
    header_disaggregation_style = Style(
        font=Font(bold=True, size=12),
        fill=Fill(background=Color(211, 211, 211)),
        alignment=Alignment(wrap_text=True, horizontal='center'),
    )

    for type, results in results_by_types.items():
        ws = wb.new_sheet(type)
        ws.set_col_style(1, Style(size=50))
        ws.set_col_style(2, Style(size=50))
        ws.set_col_style(3, Style(size=50))
        ws.set_col_style(4, Style(size=25))
        ws.set_col_style(5, Style(size=20))
        ws.set_col_style(6, Style(size=60))
        ws.set_col_style(7, Style(size=25))
        ws.set_col_style(8, Style(size=25))
        ws.set_col_style(9, Style(size=25))
        ws.set_col_style(10, Style(size=25))
        if aggregate_targets:
            ws.set_col_style(AGGREGATED_TARGET_VALUE_COLUMN, Style(size=25))
        col = get_dynamic_column_start(aggregate_targets)
        ws.set_col_style(col, Style(size=25))
        col += 1
        ws.set_col_style(col, Style(size=25))
        col += 1
        ws.set_col_style(col, Style(size=25))
        col += 1
        ws.set_col_style(col, Style(size=25))
        # r1
        ws.set_row_style(1, Style(size=36))
        for i in range(1, disaggregations_column_start):
            ws.set_cell_style(1, i, header_style)
        ws.set_cell_value(1, 1, 'Result title')
        ws.set_cell_value(1, 2, 'Result description')
        ws.set_cell_value(1, 3, 'Indicator title')
        ws.set_cell_value(1, 4, 'Reporting period')
        ws.set_cell_value(1, 5, 'Hierarchy level')
        ws.set_cell_value(1, 6, 'Contributor title')
        ws.set_cell_value(1, 7, 'Contributor subtitle')
        ws.set_cell_value(1, 8, 'Countries')
        ws.set_cell_value(1, 9, 'Sector')
        ws.set_cell_value(1, 10, 'Baseline value')
        if aggregate_targets:
            ws.set_cell_value(1, AGGREGATED_TARGET_VALUE_COLUMN, 'Aggregated target value')
        col = get_dynamic_column_start(aggregate_targets)
        ws.set_cell_value(1, col, 'Target value')
        col += 1
        ws.set_cell_value(1, col, 'Aggregated actual value')
        col += 1
        ws.set_cell_value(1, col, 'Actual value')
        col += 1
        ws.set_cell_value(1, col, '% of contribution')
        if disaggregation_types_length:
            col = disaggregations_column_start
            for category, types in disaggregations.items():
                ws.set_cell_style(1, col, header_disaggregation_style)
                ws.set_cell_value(1, col, category.upper())
                type_length = len(types.keys()) * 2
                next_col = col + type_length
                ws.range(utils.xl_column_name(col) + str(1), utils.xl_column_name(next_col - 1) + str(1)).merge()
                col = next_col
        # r2
        for i in range(1, disaggregations_column_start):
            ws.set_cell_style(2, i, header_style)
        if disaggregation_types_length:
            col = disaggregations_column_start
            types = [t for ts in disaggregations.values() for t in ts.keys()]
            for type in types:
                ws.set_cell_style(2, col, header_disaggregation_style)
                ws.set_cell_value(2, col, type)
                next_col = col + 2
                ws.range(utils.xl_column_name(col) + str(2), utils.xl_column_name(next_col - 1) + str(2)).merge()
                col = next_col
        # r3
        for i in range(1, disaggregations_column_start):
            ws.set_cell_style(3, i, header_style)
        if disaggregation_types_length:
            col = disaggregations_column_start
            while col <= disaggregations_last_colnum:
                for label in ['value', 'target']:
                    ws.set_cell_style(3, col, subheader_style)
                    ws.set_cell_value(3, col, label)
                    col += 1
        # r4
        row = 4
        for result in results:
            for indicator in result.indicators:
                for period in indicator.periods:
                    row = render_period(ws, row, result, indicator, period, aggregate_targets, use_indicator_target, disaggregations)
                    for contributor in period.contributors:
                        row = render_contributor_hierarchy(ws, row, result, indicator, period, contributor, aggregate_targets, use_indicator_target, disaggregations)
    return wb


def render_period(ws, row, result, indicator, period, aggregate_targets=False, use_indicator_target=False, disaggregations={}):
    long_text_style = Style(alignment=Alignment(wrap_text=True))
    ws.set_cell_style(row, 1, long_text_style)
    ws.set_cell_value(row, 1, result.title)
    ws.set_cell_style(row, 2, long_text_style)
    ws.set_cell_value(row, 2, result.description)
    ws.set_cell_style(row, 3, long_text_style)
    ws.set_cell_value(row, 3, indicator.title)
    ws.set_cell_value(row, 4, f"{period.period_start} - {period.period_end}")
    ws.set_cell_value(row, 10, maybe_decimal(indicator.baseline_value))
    col = get_dynamic_column_start(aggregate_targets)
    if aggregate_targets:
        ws.set_cell_value(row, AGGREGATED_TARGET_VALUE_COLUMN, indicator.aggregated_target_value if use_indicator_target else period.aggregated_target_value)
    else:
        ws.set_cell_value(row, col, indicator.target_value if use_indicator_target else ensure_decimal(period.target_value))
    col += 1
    ws.set_cell_value(row, col, period.aggregated_value)
    if period.is_quantitative:
        col += 3
        for category, types in disaggregations.items():
            for type in [t for t in types.keys()]:
                ws.set_cell_value(row, col, period.get_aggregated_disaggregation_value(category, type) or '')
                col += 1
                ws.set_cell_value(row, col, period.get_aggregated_disaggregation_target_value(category, type) or '')
                col += 1
    return row + 1


def render_contributor_hierarchy(ws, row, result, indicator, period, contributor, aggregate_targets=False, use_indicator_target=False, disaggregations={}, level=1):
    row = render_contributor(ws, row, result, indicator, period, contributor, aggregate_targets, use_indicator_target, disaggregations, level)
    for subcontributor in contributor.contributors:
        row = render_contributor_hierarchy(ws, row, result, indicator, period, subcontributor, aggregate_targets, use_indicator_target, disaggregations, level + 1)
    return row


def render_contributor(ws, row, result, indicator, period, contributor, aggregate_targets=False, use_indicator_target=False, disaggregations={}, level=1):
    long_text_style = Style(alignment=Alignment(wrap_text=True))
    ws.set_cell_style(row, 1, long_text_style)
    ws.set_cell_value(row, 1, result.title)
    ws.set_cell_style(row, 2, long_text_style)
    ws.set_cell_value(row, 2, result.description)
    ws.set_cell_style(row, 3, long_text_style)
    ws.set_cell_value(row, 3, indicator.title)
    ws.set_cell_value(row, 4, f"{period.period_start} - {period.period_end}")
    ws.set_cell_value(row, 5, level)
    ws.set_cell_style(row, 6, long_text_style)
    ws.set_cell_value(row, 6, contributor.project.title)
    ws.set_cell_style(row, 7, long_text_style)
    ws.set_cell_value(row, 7, contributor.project.subtitle)
    ws.set_cell_style(row, 8, long_text_style)
    ws.set_cell_value(row, 8, contributor.project.country)
    ws.set_cell_style(row, 9, long_text_style)
    ws.set_cell_value(row, 9, ', '.join(contributor.project.sectors) if contributor.project.sectors else '')
    ws.set_cell_value(row, 10, maybe_decimal(contributor.indicator_baseline_value))
    col = get_dynamic_column_start(aggregate_targets)
    ws.set_cell_value(row, col, contributor.indicator_target_value if use_indicator_target else ensure_decimal(contributor.target_value))
    col += 2
    ws.set_cell_value(row, col, contributor.actual_value)
    col += 1
    if period.is_quantitative:
        contribution = calculate_percentage(ensure_decimal(contributor.updates_value), ensure_decimal(period.aggregated_value))
        ws.set_cell_style(row, col, Style(alignment=Alignment(horizontal='right')))
        ws.set_cell_value(row, col, f"{contribution}%")
        col += 1
        for category, types in disaggregations.items():
            for type in [t for t in types.keys()]:
                ws.set_cell_value(row, col, contributor.get_disaggregation_value(category, type) or '')
                col += 1
                ws.set_cell_value(row, col, contributor.get_disaggregation_target_value(category, type) or '')
                col += 1
    return row + 1
