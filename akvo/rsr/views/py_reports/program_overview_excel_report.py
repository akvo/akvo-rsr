# -*- coding: utf-8 -*-

"""Akvo RSR is covered by the GNU Affero General Public License.

See more details in the license.txt file located at the root folder of the
Akvo RSR module. For additional details on the GNU license please
see < http://www.gnu.org/licenses/agpl.html >.
"""

from datetime import datetime

from django.contrib.auth.decorators import login_required
from django.shortcuts import get_object_or_404
from pyexcelerate import Workbook, Style, Font, Color, Fill, Alignment

from akvo.rsr.dataclasses import group_results_by_types
from akvo.rsr.project_overview import is_aggregating_targets, get_disaggregations
from akvo.rsr.models import Project, User
from akvo.rsr.models.result.utils import calculate_percentage
from akvo.utils import ensure_decimal, maybe_decimal

from . import utils, program_utils


AGGREGATED_TARGET_VALUE_COLUMN = 12


def get_dynamic_column_start(aggregate_targets):
    return AGGREGATED_TARGET_VALUE_COLUMN + 1 if aggregate_targets else AGGREGATED_TARGET_VALUE_COLUMN


REPORT_NAME = 'program_overview_excel_report'


@login_required
def add_email_report_job(request, program_id):
    program = get_object_or_404(Project, pk=program_id)
    payload = {
        'program_id': program.id,
        'period_start': request.GET.get('period_start', '').strip(),
        'period_end': request.GET.get('period_end', '').strip(),
        'report_label': 'Program overview results table',
    }
    recipient = request.user.email

    return utils.make_async_email_report_task(handle_email_report, payload, recipient, REPORT_NAME)


def handle_email_report(params, recipient):
    program = Project.objects.prefetch_related('results').get(pk=params['program_id'])
    user = User.objects.get(email=recipient)
    start_date = utils.parse_date(params.get('period_start', ''), datetime(1900, 1, 1))
    end_date = utils.parse_date(params.get('period_end', ''), datetime(2999, 12, 31))
    wb = generate_workbok(program, start_date, end_date)
    filename = '{}-{}-program-overview-report.xlsx'.format(datetime.today().strftime('%Y%m%d%H%M%S'), program.id)
    utils.save_excel_and_send_email(wb, user, filename)


def generate_workbok(program, start_date=None, end_date=None):
    results = program_utils.get_results_framework(program, start_date, end_date)
    results_by_types = group_results_by_types(results)
    if not results_by_types:
        results_by_types = {'Sheet1': []}
    aggregate_targets = is_aggregating_targets(program)
    use_indicator_target = utils.is_using_indicator_target(program)
    disaggregations = get_disaggregations(program)
    disaggregations_column_start = 18 if aggregate_targets else 17
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
        ws.set_col_style(11, Style(size=30))
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
        ws.set_cell_value(1, 11, 'Narrative')
        if aggregate_targets:
            ws.set_cell_value(1, AGGREGATED_TARGET_VALUE_COLUMN, 'Aggregated target value')
        col = get_dynamic_column_start(aggregate_targets)
        ws.set_cell_value(1, col, 'Target value')
        col += 1
        ws.set_cell_value(1, col, 'Aggregated actual value')
        col += 1
        ws.set_cell_value(1, col, 'Actual value')
        col += 1
        ws.set_cell_value(1, col, 'Actual comment')
        col += 1
        ws.set_cell_value(1, col, '% of contribution')
        # col += 1
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
    if period.is_quantitative and not period.is_cumulative_future:
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
    if period.is_qualitative:
        ws.set_cell_style(row, 11, long_text_style)
        ws.set_cell_value(row, 11, contributor.period_narrative)
    col = get_dynamic_column_start(aggregate_targets)
    ws.set_cell_value(row, col, contributor.indicator_target_value if use_indicator_target else ensure_decimal(contributor.target_value))
    col += 2
    ws.set_cell_value(row, col, contributor.actual_value)
    col += 1
    ws.set_cell_style(row, col, long_text_style)
    ws.set_cell_value(row, col, contributor.period_actual_comment)
    col += 1
    if period.is_quantitative and not period.is_cumulative_future:
        contribution = calculate_percentage(contributor.actual_value, period.aggregated_value)
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
