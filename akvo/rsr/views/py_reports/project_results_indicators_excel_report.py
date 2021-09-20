# -*- coding: utf-8 -*-

"""Akvo RSR is covered by the GNU Affero General Public License.

See more details in the license.txt file located at the root folder of the
Akvo RSR module. For additional details on the GNU license please
see < http://www.gnu.org/licenses/agpl.html >.
"""

from akvo.rsr.dataclasses import (
    ResultData, IndicatorData, PeriodData, PeriodUpdateData, DisaggregationData, DisaggregationTargetData, group_results_by_types
)
from akvo.rsr.decorators import with_download_indicator
from akvo.rsr.models import Project, IndicatorPeriod, DisaggregationTarget
from akvo.rsr.project_overview import get_disaggregations
from datetime import datetime
from dateutil.relativedelta import relativedelta
from django.contrib.auth.decorators import login_required
from django.db.models import Q
from django.shortcuts import get_object_or_404
from pyexcelerate import Workbook, Style, Font, Fill, Color, Alignment

from . import utils


def fetch_periods(project, start_date=None, end_date=None):
    queryset = IndicatorPeriod.objects\
        .select_related(
            'indicator',
            'indicator__result',
            'indicator__result__project'
        ).prefetch_related(
            'data',
            'data__disaggregations',
            'data__disaggregations__dimension_value',
            'data__disaggregations__dimension_value__name',
        ).filter(indicator__result__project=project)
    if start_date and end_date:
        queryset = queryset.filter(
            Q(period_start__isnull=True) | Q(period_start__gte=start_date),
            Q(period_end__isnull=True) | Q(period_end__lte=end_date)
        )
    return queryset\
        .order_by('indicator__result__order', 'indicator__order', '-period_start')\
        .values(
            'id', 'period_start', 'period_end', 'target_value', 'target_comment', 'actual_value', 'actual_comment',
            'indicator__id', 'indicator__title', 'indicator__description', 'indicator__type', 'indicator__measure',
            'indicator__baseline_year', 'indicator__baseline_value', 'indicator__baseline_comment',
            'indicator__target_value', 'indicator__target_comment', 'indicator__order',
            'indicator__result__id', 'indicator__result__type', 'indicator__result__title',
            'indicator__result__description', 'indicator__result__aggregation_status', 'indicator__result__order',
            'data__id', 'data__status', 'data__value', 'data__numerator', 'data__denominator',
            'data__disaggregations__id', 'data__disaggregations__value', 'data__disaggregations__numerator', 'data__disaggregations__denominator',
            'data__disaggregations__dimension_value__value', 'data__disaggregations__dimension_value__name__name',
        )


def fetch_disaggregation_targets(project, start_date=None, end_date=None):
    queryset = DisaggregationTarget.objects\
        .select_related('period', 'dimension_value', 'dimension_value__name')\
        .filter(period__indicator__result__project=project)
    if start_date and end_date:
        queryset = queryset.filter(
            Q(period__period_start__isnull=True) | Q(period__period_start__gte=start_date),
            Q(period__period_end__isnull=True) | Q(period__period_end__lte=end_date)
        )
    return queryset.values('id', 'value', 'period__id', 'dimension_value__value', 'dimension_value__name__name')


def get_results_framework(project, start_date=None, end_date=None):
    raw_periods = fetch_periods(project, start_date, end_date)
    lookup = {
        'results': {},
        'indicators': {},
        'periods': {},
        'updates': {},
        'disaggregations': {},
    }
    for r in raw_periods:
        result_id = r['indicator__result__id']
        indicator_id = r['indicator__id']
        period_id = r['id']
        update_id = r['data__id']
        disaggregation_id = r['data__disaggregations__id']
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
        else:
            period = lookup['periods'][period_id]
        if update_id is None:
            continue
        if update_id not in lookup['updates']:
            update = PeriodUpdateData.make(r, 'data__')
            period.updates.append(update)
            lookup['updates'][update_id] = update
        else:
            update = lookup['updates'][update_id]
        if disaggregation_id is None:
            continue
        if disaggregation_id not in lookup['disaggregations']:
            disaggregation = DisaggregationData.make(r, 'data__disaggregations__')
            update.disaggregations.append(disaggregation)
            lookup['disaggregations'][disaggregation_id] = disaggregation
    raw_disaggregation_targets = fetch_disaggregation_targets(project, start_date, end_date)
    for r in raw_disaggregation_targets:
        period_id = r['period__id']
        if period_id not in lookup['periods']:
            continue
        disaggregation_target = DisaggregationTargetData.make(r)
        period = lookup['periods'][period_id]
        period.disaggregation_targets.append(disaggregation_target)
    return [r for r in lookup['results'].values()]


def generate_workbook(project, start_date=None, end_date=None):
    in_eutf_hierarchy = project.in_eutf_hierarchy()
    use_indicator_target = utils.is_using_indicator_target(project)
    disaggregations = get_disaggregations(project)
    results = get_results_framework(project, start_date, end_date)
    results_by_types = group_results_by_types(results)
    pending_results = [r for r in results if r.has_pending_updates]
    pending_results_by_types = group_results_by_types(pending_results)
    wb = Workbook()
    render_result_by_type_sheets(wb, results_by_types, disaggregations, use_indicator_target, in_eutf_hierarchy)
    render_result_by_type_sheets(wb, pending_results_by_types, disaggregations, use_indicator_target, in_eutf_hierarchy, only_pending_updates=True)
    return wb


def render_result_by_type_sheets(wb, results_by_types, disaggregations, use_indicator_target=False, in_eutf_hierarchy=False, only_pending_updates=False):
    header_style = Style(font=Font(bold=True, size=12), fill=Fill(background=Color(211, 211, 211)))
    for type, results in results_by_types.items():
        ws = wb.new_sheet(f"Pending Approval {type}" if only_pending_updates else type)
        ws.set_col_style(1, Style(size=50))
        ws.set_col_style(2, Style(size=50))
        ws.set_col_style(3, Style(size=50))
        ws.set_col_style(4, Style(size=50))
        ws.set_col_style(5, Style(size=20))
        ws.set_col_style(6, Style(size=20))
        ws.set_col_style(7, Style(size=30))
        for i in range(8, 17):
            ws.set_col_style(i, Style(size=25))
        ws.set_row_style(1, Style(size=36))
        for i in range(1, 17):
            ws.set_cell_style(1, i, header_style)
        ws.set_cell_value(1, 1, 'Result title')
        ws.set_cell_value(1, 2, 'Result description')
        ws.set_cell_value(1, 3, 'Indicator title')
        ws.set_cell_value(1, 4, 'Indicator description')
        ws.set_cell_value(1, 5, 'Baseline year')
        ws.set_cell_value(1, 6, 'Baseline value')
        ws.set_cell_value(1, 7, 'Baseline comment')
        col = 8
        if not use_indicator_target:
            ws.set_cell_value(1, col, 'Reporting period')
            col += 1
        ws.set_cell_value(1, col, 'Target value')
        col += 1
        ws.set_cell_value(1, col, 'Target comment')
        if use_indicator_target:
            col += 1
            ws.set_cell_value(1, col, 'Reporting period')
        ws.set_cell_value(1, 11, 'Actual value')
        ws.set_cell_value(1, 12, 'Actual comment')
        ws.set_cell_value(1, 13, 'Disaggregation category')
        ws.set_cell_value(1, 14, 'Disaggregation type')
        ws.set_cell_value(1, 15, 'Disaggregation target')
        ws.set_cell_value(1, 16, 'Disaggregation value')
        row = 2
        for result in results:
            for indicator in result.indicators:
                periods = [p for p in indicator.periods if p.has_pending_updates] if only_pending_updates else indicator.periods
                for period in periods:
                    if period.is_quantitative:
                        for category, types in disaggregations.items():
                            for type in [t for t in types.keys()]:
                                row = render_row(ws, row, result, indicator, period, category, type, use_indicator_target, only_pending_updates, in_eutf_hierarchy)
                    else:
                        row = render_row(
                            ws, row, result, indicator, period,
                            use_indicator_target=use_indicator_target,
                            only_pending_updates=only_pending_updates,
                            in_eutf_hierarchy=in_eutf_hierarchy
                        )


def render_row(ws, row, result, indicator, period, category=None, type=None, use_indicator_target=False, only_pending_updates=False, in_eutf_hierarchy=False):
    long_text_style = Style(alignment=Alignment(wrap_text=True))
    right_align_text = Style(alignment=Alignment(horizontal='right'))
    ws.set_cell_style(row, 1, long_text_style)
    ws.set_cell_value(row, 1, result.title)
    ws.set_cell_style(row, 2, long_text_style)
    ws.set_cell_value(row, 2, result.description)
    ws.set_cell_style(row, 3, long_text_style)
    ws.set_cell_value(row, 3, indicator.title)
    ws.set_cell_style(row, 4, long_text_style)
    ws.set_cell_value(row, 4, indicator.description)
    ws.set_cell_style(row, 5, right_align_text)
    ws.set_cell_value(row, 5, indicator.baseline_year)
    ws.set_cell_style(row, 6, right_align_text)
    ws.set_cell_value(row, 6, indicator.baseline_value)
    ws.set_cell_style(row, 7, long_text_style)
    ws.set_cell_value(row, 7, indicator.baseline_comment)
    col = 8
    if use_indicator_target:
        ws.set_cell_value(row, col, indicator.target_value)
        col += 1
        ws.set_cell_style(row, col, long_text_style)
        ws.set_cell_value(row, col, indicator.target_comment)
        col += 1
    period_start = utils.get_period_start(period, in_eutf_hierarchy)
    period_end = utils.get_period_end(period, in_eutf_hierarchy)
    ws.set_cell_value(row, col, f"{period_start.strftime('%Y-%m-%d') if period_start else ''} - {period_end.strftime('%Y-%m-%d') if period_end else ''}")
    col += 1
    if not use_indicator_target:
        ws.set_cell_style(row, col, right_align_text)
        ws.set_cell_value(row, col, period.target_value)
        col += 1
        ws.set_cell_style(row, col, long_text_style)
        ws.set_cell_value(row, col, period.target_comment)
    ws.set_cell_value(row, 11, period.pending_value if only_pending_updates else period.actual_value)
    ws.set_cell_style(row, 12, long_text_style)
    ws.set_cell_value(row, 12, period.actual_comment if not only_pending_updates else '')
    if category and type:
        ws.set_cell_value(row, 13, category)
        ws.set_cell_value(row, 14, type)
        ws.set_cell_value(row, 15, period.get_disaggregation_target_value(category, type) or '')
        disaggregation_value = period.get_pending_disaggregation_value(category, type) \
            if only_pending_updates \
            else period.get_disaggregation_value(category, type)
        ws.set_cell_value(row, 16, disaggregation_value or '')
    return row + 1


@login_required
@with_download_indicator
def render_report(request, project_id):
    start_date = utils.parse_date(request.GET.get('start_date', '').strip(), datetime(1900, 1, 1))
    end_date = utils.parse_date(request.GET.get('end_date', '').strip(), datetime.today() + relativedelta(years=10))
    project = get_object_or_404(Project, pk=project_id)
    wb = generate_workbook(project, start_date, end_date)
    filename = f"{datetime.today().strftime('%Y%b%d')}-{project.id}-results-indicators-report.xlsx"
    return utils.make_excel_response(wb, filename)
