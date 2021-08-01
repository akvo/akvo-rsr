# -*- coding: utf-8 -*-

"""Akvo RSR is covered by the GNU Affero General Public License.

See more details in the license.txt file located at the root folder of the
Akvo RSR module. For additional details on the GNU license please
see < http://www.gnu.org/licenses/agpl.html >.
"""


from akvo.rsr.models import Project, IndicatorPeriod, DisaggregationTarget
from akvo.rsr.dataclasses import ResultData, IndicatorData, PeriodData, PeriodUpdateData, DisaggregationData, DisaggregationTargetData
from akvo.rsr.decorators import with_download_indicator
from akvo.rsr.project_overview import get_disaggregations
from datetime import datetime
from dateutil.relativedelta import relativedelta
from django.db.models import Q
from django.contrib.auth.decorators import login_required
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


def is_using_indicator_target(project):
    program = project.get_program()
    targets_at = program.targets_at if program else project.targets_at
    return True if targets_at == 'indicator' else False


def group_results_by_types(results):
    by_types = {}
    for result in results:
        type = result.iati_type_name
        if not type:
            continue
        if type not in by_types:
            by_types[type] = []
        by_types[type].append(result)
    return by_types


@login_required
@with_download_indicator
def render_report(request, project_id):
    start_date = utils.parse_date(request.GET.get('start_date', '').strip(), datetime(1900, 1, 1))
    end_date = utils.parse_date(request.GET.get('end_date', '').strip(), datetime.today() + relativedelta(years=10))
    project = get_object_or_404(Project, pk=project_id)
    in_eutf_hierarchy = project.in_eutf_hierarchy()
    use_indicator_target = is_using_indicator_target(project)
    results = get_results_framework(project, start_date, end_date)
    pending_results = [r for r in results if r.has_pending_updates]
    results_by_types = group_results_by_types(results)
    pending_results_by_types = group_results_by_types(pending_results)
    disaggregations = get_disaggregations(project)
    disaggregation_types_length = 0
    for _, types in disaggregations.items():
        disaggregation_types_length += len(types.keys())
    disaggregations_last_colnum = 11 + (disaggregation_types_length * 2)
    max_column = disaggregations_last_colnum + 1
    wb = Workbook()
    make_result_by_type_sheets(
        wb, results_by_types, project, disaggregations, max_column, disaggregation_types_length,
        disaggregations_last_colnum, in_eutf_hierarchy, use_indicator_target
    )
    make_result_by_type_sheets(
        wb, pending_results_by_types, project, disaggregations, max_column, disaggregation_types_length,
        disaggregations_last_colnum, in_eutf_hierarchy, use_indicator_target, only_pending_updates=True
    )
    filename = f"{datetime.today().strftime('%Y%b%d')}-{project.id}-results-indicators-report.xlsx"
    return utils.make_excel_response(wb, filename)


def make_result_by_type_sheets(
    wb, results_by_types, project, disaggregations, max_column, disaggregation_types_length, disaggregations_last_colnum,
    in_eutf_hierarchy, use_indicator_target, only_pending_updates=False
):
    for type, results in results_by_types.items():
        ws = wb.new_sheet(f"Pending Approval {type}" if only_pending_updates else type)
        ws.set_col_style(1, Style(size=55))
        ws.set_col_style(2, Style(size=60))
        ws.set_col_style(3, Style(size=20))
        ws.set_col_style(4, Style(size=20))
        ws.set_col_style(5, Style(size=35))
        ws.set_col_style(6, Style(size=20))
        ws.set_col_style(7, Style(size=20))
        ws.set_col_style(8, Style(size=20))
        ws.set_col_style(9, Style(size=20))
        ws.set_col_style(10, Style(size=25))
        ws.set_col_style(11, Style(size=20))
        ws.set_col_style(max_column, Style(size=25))
        # r1
        ws.set_row_style(1, Style(size=41))
        ws.set_cell_style(1, 1, Style(font=Font(bold=True, size=24)))
        ws.set_cell_value(1, 1, 'Project Results and Indicators simple table report')
        ws.range('A1', 'B1').merge()
        # r2
        ws.set_row_style(2, Style(size=36))
        ws.set_cell_style(2, 1, Style(font=Font(bold=True, size=12)))
        ws.set_cell_value(2, 1, 'Project title')
        ws.set_cell_style(2, 2, Style(font=Font(size=12)))
        ws.set_cell_value(2, 2, project.title)
        # r3
        ws.set_row_style(3, Style(size=36))
        ws.set_cell_style(3, 1, Style(font=Font(bold=True, size=12)))
        ws.set_cell_value(3, 1, 'Result type')
        ws.set_cell_style(3, 2, Style(font=Font(size=12)))
        ws.set_cell_value(3, 2, f"Pending Approval {type}" if only_pending_updates else type)
        # r4
        ws.set_row_style(4, Style(size=36))
        ws.set_cell_value(4, 1, '')
        row = 5
        for result in results:
            # r5
            ws.set_row_style(row, Style(size=36))
            result_header1_style = Style(
                font=Font(bold=True, size=12, color=Color(255, 255, 255)),
                fill=Fill(background=Color(89, 89, 89)))
            for i in range(1, max_column + 1):
                ws.set_cell_style(row, i, result_header1_style)
            ws.set_cell_value(row, 1, 'Result title:')
            ws.set_cell_value(row, 3, 'Result description:')
            if disaggregation_types_length:
                ws.set_cell_style(row, 12, Style(
                    font=Font(bold=True, size=12, color=Color(255, 255, 255)),
                    alignment=Alignment(horizontal='center'),
                    fill=Fill(background=Color(89, 89, 89))))
                ws.set_cell_value(row, 12, 'Disaggregations')
                ws.range('L' + str(row), utils.xl_column_name(disaggregations_last_colnum) + str(row)).merge()
            row += 1
            # r6
            ws.set_row_style(row, Style(size=42))
            result_header2_style = Style(
                font=Font(size=12, color=Color(255, 255, 255)),
                alignment=Alignment(wrap_text=True),
                fill=Fill(background=Color(89, 89, 89)))
            result_header_disaggregation_style = Style(
                font=Font(size=12, color=Color(255, 255, 255)),
                alignment=Alignment(wrap_text=True, horizontal='center'),
                fill=Fill(background=Color(89, 89, 89)))
            ws.range('A' + str(row), 'B' + str(row)).merge()
            ws.set_cell_style(row, 1, result_header2_style)
            ws.set_cell_value(row, 1, result.title)
            ws.range('C' + str(row), ('K') + str(row)).merge()
            ws.set_cell_style(row, 3, result_header2_style)
            ws.set_cell_value(row, 3, result.description)
            if disaggregation_types_length:
                col = 12
                for category, types in disaggregations.items():
                    ws.set_cell_style(row, col, result_header_disaggregation_style)
                    ws.set_cell_value(row, col, category.upper())
                    type_length = len(types.keys()) * 2
                    next_col = col + type_length
                    ws.range(utils.xl_column_name(col) + str(row), utils.xl_column_name(next_col - 1) + str(row)).merge()
                    col = next_col
            ws.set_cell_style(row, max_column, result_header2_style)
            row += 1
            # r7
            ws.set_row_style(row, Style(size=36))
            row7_style = Style(
                font=Font(bold=True, size=12),
                fill=Fill(background=Color(211, 211, 211)))
            for i in range(1, max_column + 1):
                ws.set_cell_style(row, i, row7_style)
            ws.set_cell_value(row, 1, 'Indicator title')
            ws.set_cell_value(row, 2, 'Indicator description')
            ws.set_cell_value(row, 3, 'Baseline year')
            ws.set_cell_value(row, 4, 'Baseline value')
            ws.set_cell_value(row, 5, 'Baseline comment')
            col = 5
            if use_indicator_target:
                col += 1
                ws.set_cell_value(row, col, 'Target')
                col += 1
                ws.set_cell_value(row, col, 'Target comment')
            col += 1
            ws.set_cell_value(row, col, 'Period start')
            col += 1
            ws.set_cell_value(row, col, 'Period end')
            if not use_indicator_target:
                col += 1
                ws.set_cell_value(row, col, 'Target value')
                col += 1
                ws.set_cell_value(row, col, 'Target comment')
            ws.set_cell_value(row, 10, 'Actual value')
            ws.set_cell_value(row, 11, 'Actual comment')
            if disaggregation_types_length:
                col = 12
                types = [t for ts in disaggregations.values() for t in ts.keys()]
                for type in types:
                    ws.set_cell_value(row, col, type)
                    next_col = col + 2
                    ws.range(utils.xl_column_name(col) + str(row), utils.xl_column_name(next_col - 1) + str(row)).merge()
                    col = next_col
            ws.set_cell_value(row, max_column, 'Aggregation status')
            row += 1
            if disaggregation_types_length:
                # r7+1
                row7_1_style = Style(fill=Fill(background=Color(211, 211, 211)))
                for i in range(1, max_column + 1):
                    ws.set_cell_style(row, i, row7_1_style)
                col = 12
                while col <= disaggregations_last_colnum:
                    ws.set_cell_value(row, col, 'value')
                    col += 1
                    ws.set_cell_value(row, col, 'target')
                    col += 1
            row += 1
            ws.set_cell_value(row, max_column, 'Yes' if result.aggregation_status else 'No')
            indicators = [i for i in result.indicators if i.has_pending_updates] if only_pending_updates else result.indicators
            for indicator in indicators:
                # r8
                ws.set_cell_style(row, 1, Style(alignment=Alignment(wrap_text=True)))
                ws.set_cell_value(row, 1, indicator.title)
                ws.set_cell_style(row, 2, Style(alignment=Alignment(wrap_text=True)))
                ws.set_cell_value(row, 2, indicator.description)
                ws.set_cell_style(row, 3, Style(alignment=Alignment(horizontal='right')))
                ws.set_cell_value(row, 3, indicator.baseline_year)
                ws.set_cell_style(row, 4, Style(alignment=Alignment(horizontal='right')))
                ws.set_cell_value(row, 4, indicator.baseline_value)
                ws.set_cell_style(row, 5, Style(alignment=Alignment(wrap_text=True)))
                ws.set_cell_value(row, 5, indicator.baseline_comment)
                col = 5
                if use_indicator_target:
                    col += 1
                    ws.set_cell_style(row, col, Style(alignment=Alignment(horizontal='right')))
                    ws.set_cell_value(row, col, indicator.target_value)
                    col += 1
                    ws.set_cell_style(row, col, Style(alignment=Alignment(wrap_text=True)))
                    ws.set_cell_value(row, col, indicator.target_comment)
                periods = [p for p in indicator.periods if p.has_pending_updates] if only_pending_updates else indicator.periods
                for period in periods:
                    period_start = utils.get_period_start(period, in_eutf_hierarchy)
                    period_end = utils.get_period_end(period, in_eutf_hierarchy)
                    inner_col = col
                    inner_col += 1
                    ws.set_cell_value(row, inner_col, period_start.strftime('%Y-%m-%d') if period_start else '')
                    inner_col += 1
                    ws.set_cell_value(row, inner_col, period_end.strftime('%Y-%m-%d') if period_end else '')
                    if not use_indicator_target:
                        inner_col += 1
                        ws.set_cell_style(row, inner_col, Style(alignment=Alignment(horizontal='right')))
                        ws.set_cell_value(row, inner_col, period.target_value)
                        inner_col += 1
                        ws.set_cell_style(row, inner_col, Style(alignment=Alignment(wrap_text=True)))
                        ws.set_cell_value(row, inner_col, period.target_comment)
                    inner_col += 1
                    ws.set_cell_style(row, inner_col, Style(alignment=Alignment(horizontal='right')))
                    ws.set_cell_value(row, inner_col, period.pending_value if only_pending_updates else period.actual_value)
                    inner_col += 1
                    ws.set_cell_style(row, inner_col, Style(alignment=Alignment(wrap_text=True)))
                    ws.set_cell_value(row, inner_col, period.actual_comment if not only_pending_updates else '')
                    if disaggregation_types_length:
                        for category, types in disaggregations.items():
                            for type in [t for t in types.keys()]:
                                inner_col += 1
                                disaggregation_value = period.get_pending_disaggregation_value(category, type) \
                                    if only_pending_updates \
                                    else period.get_disaggregation_value(category, type)
                                ws.set_cell_value(row, inner_col, disaggregation_value or '')
                                inner_col += 1
                                ws.set_cell_value(row, inner_col, period.get_disaggregation_target_value(category, type) or '')
                    row += 1
