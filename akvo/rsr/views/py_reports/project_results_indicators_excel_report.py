# -*- coding: utf-8 -*-

"""Akvo RSR is covered by the GNU Affero General Public License.

See more details in the license.txt file located at the root folder of the
Akvo RSR module. For additional details on the GNU license please
see < http://www.gnu.org/licenses/agpl.html >.
"""

from akvo.rsr.models import Project, IndicatorPeriodDisaggregation, IndicatorPeriod
from akvo.rsr.decorators import with_download_indicator
from datetime import datetime
from dateutil.relativedelta import relativedelta
from django.db.models import Q
from django.contrib.auth.decorators import login_required
from django.shortcuts import get_object_or_404
from pyexcelerate import Workbook, Style, Font, Fill, Color, Alignment

from . import utils


def build_view_object(project, start_date=None, end_date=None):
    periods = IndicatorPeriod.objects\
        .select_related('indicator', 'indicator__result', 'indicator__result__project')\
        .filter(indicator__result__project=project)
    if start_date and end_date:
        periods = periods.filter(
            Q(period_start__isnull=True) | Q(period_start__gte=start_date),
            Q(period_end__isnull=True) | Q(period_end__lte=end_date)
        )

    if not periods.count():
        return utils.ProjectProxy(project)

    return utils.make_project_proxies(periods.order_by('-period_start'))[0]


@login_required
@with_download_indicator
def render_report(request, project_id):
    project = get_object_or_404(Project, pk=project_id)
    start_date = utils.parse_date(request.GET.get('start_date', '').strip(), datetime(1900, 1, 1))
    end_date = utils.parse_date(request.GET.get('end_date', '').strip(), datetime.today() + relativedelta(years=10))

    project_view = build_view_object(project, start_date, end_date)
    in_eutf_hierarchy = project_view.in_eutf_hierarchy
    use_indicator_target = project_view.use_indicator_target
    has_disaggregation = IndicatorPeriodDisaggregation.objects\
        .filter(period__indicator__result__project=project).count() > 0

    max_column = 14 if has_disaggregation else 12

    results_by_types = {}
    for result in project_view.results:
        type = result.iati_type_name
        if not type:
            continue
        if type not in results_by_types:
            results_by_types[type] = []
        results_by_types[type].append(result)

    wb = Workbook()
    for type, results in results_by_types.items():
        ws = wb.new_sheet(type)
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
        ws.set_col_style(12, Style(size=30))
        if has_disaggregation:
            ws.set_col_style(13, Style(size=30))
            ws.set_col_style(14, Style(size=30))
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
        ws.set_cell_value(3, 2, type)

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
            row += 1

            # r6
            ws.set_row_style(row, Style(size=42))
            result_header2_style = Style(
                font=Font(size=12, color=Color(255, 255, 255)),
                alignment=Alignment(wrap_text=True),
                fill=Fill(background=Color(89, 89, 89)))
            ws.range('A' + str(row), 'B' + str(row)).merge()
            ws.set_cell_style(row, 1, result_header2_style)
            ws.set_cell_value(row, 1, result.title)
            ws.range('C' + str(row), ('N' if has_disaggregation else 'L') + str(row)).merge()
            ws.set_cell_style(row, 3, result_header2_style)
            ws.set_cell_value(row, 3, result.description)
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
            if has_disaggregation:
                ws.set_cell_value(row, 12, 'Disaggregation label')
                ws.set_cell_value(row, 13, 'Disaggregation value')
            ws.set_cell_value(row, max_column, 'Aggregation status')
            row += 1

            ws.set_cell_value(row, max_column, 'Yes' if result.aggregation_status else 'No')
            for indicator in result.indicators:
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

                for period in indicator.periods:
                    period_start = utils.get_period_start(period, in_eutf_hierarchy)
                    period_end = utils.get_period_end(period, in_eutf_hierarchy)
                    inner_col = col
                    inner_col += 1
                    ws.set_cell_value(
                        row, inner_col,
                        period_start.strftime('%Y-%m-%d') if period_start else '')
                    inner_col += 1
                    ws.set_cell_value(
                        row, inner_col,
                        period_end.strftime('%Y-%m-%d') if period_end else '')
                    if not use_indicator_target:
                        inner_col += 1
                        ws.set_cell_style(row, inner_col, Style(alignment=Alignment(horizontal='right')))
                        ws.set_cell_value(row, inner_col, period.target_value)
                        inner_col += 1
                        ws.set_cell_style(row, inner_col, Style(alignment=Alignment(wrap_text=True)))
                        ws.set_cell_value(row, inner_col, period.target_comment)
                    ws.set_cell_style(row, 10, Style(alignment=Alignment(horizontal='right')))
                    ws.set_cell_value(row, 10, period.actual_value)
                    ws.set_cell_style(row, 11, Style(alignment=Alignment(wrap_text=True)))
                    ws.set_cell_value(row, 11, period.actual_comment)

                    disaggregations = period.disaggregations.order_by('dimension_value__name__id')
                    if has_disaggregation and disaggregations.count():
                        category = None
                        last_category = None
                        for disaggregation in disaggregations.all():
                            if disaggregation.value is None:
                                continue
                            category = disaggregation.dimension_value.name.name
                            if category != last_category:
                                ws.set_cell_style(row, 12, Style(alignment=Alignment(wrap_text=True)))
                                ws.set_cell_value(row, 12, disaggregation.dimension_value.name.name)
                            last_category = category
                            ws.set_cell_style(row, 13, Style(alignment=Alignment(wrap_text=True)))
                            ws.set_cell_value(
                                row, 13,
                                disaggregation.dimension_value.value + ': ' + str(disaggregation.value))
                            row += 1
                    else:
                        row += 1

    filename = '{}-{}-results-indicators-report.xlsx'.format(
        datetime.today().strftime('%Y%b%d'), project.id)

    return utils.make_excel_response(wb, filename)
