# -*- coding: utf-8 -*-

"""Akvo RSR is covered by the GNU Affero General Public License.

See more details in the license.txt file located at the root folder of the
Akvo RSR module. For additional details on the GNU license please
see < http://www.gnu.org/licenses/agpl.html >.
"""

from akvo.rsr.models import Project, IndicatorPeriodDisaggregation
from datetime import datetime
from django.contrib.auth.decorators import login_required
from django.shortcuts import get_object_or_404
from pyexcelerate import Workbook, Style, Font, Fill, Color, Alignment

from . import utils


@login_required
def render_report(request, project_id):
    queryset = Project.objects.prefetch_related(
        'results', 'results__indicators', 'results__indicators__periods')
    project = get_object_or_404(queryset, pk=project_id)
    in_eutf_hierarchy = project.in_eutf_hierarchy()
    has_disaggregation = IndicatorPeriodDisaggregation.objects\
        .filter(period__indicator__result__project=project).count() > 0
    max_column = 15 if has_disaggregation else 13

    results_by_types = {}
    for result in project.results.exclude(type__exact='').all():
        type = result.iati_type().name
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
            ws.range('C' + str(row), ('O' if has_disaggregation else 'M') + str(row)).merge()
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
            ws.set_cell_value(row, 6, 'Indicator target')
            ws.set_cell_value(row, 7, 'Period start')
            ws.set_cell_value(row, 8, 'Period end')
            ws.set_cell_value(row, 9, 'Target value')
            ws.set_cell_value(row, 10, 'Target comment')
            ws.set_cell_value(row, 11, 'Actual value')
            ws.set_cell_value(row, 12, 'Actual comment')
            if has_disaggregation:
                ws.set_cell_value(row, 13, 'Disaggregation label')
                ws.set_cell_value(row, 14, 'Disaggregation value')
            ws.set_cell_value(row, max_column, 'Aggregation status')
            row += 1

            ws.set_cell_value(row, max_column, 'Yes' if result.aggregation_status else 'No')
            for indicator in result.indicators.all():
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
                ws.set_cell_style(row, 6, Style(alignment=Alignment(horizontal='right')))
                ws.set_cell_value(row, 6, indicator.target_value)

                for period in indicator.periods.all():
                    period_start = utils.get_period_start(period, in_eutf_hierarchy)
                    period_end = utils.get_period_end(period, in_eutf_hierarchy)
                    ws.set_cell_value(
                        row, 7,
                        period_start.strftime('%Y-%m-%d') if period_start else '')
                    ws.set_cell_value(
                        row, 8,
                        period_end.strftime('%Y-%m-%d') if period_end else '')
                    ws.set_cell_style(row, 9, Style(alignment=Alignment(horizontal='right')))
                    ws.set_cell_value(row, 9, period.target_value)
                    ws.set_cell_style(row, 10, Style(alignment=Alignment(wrap_text=True)))
                    ws.set_cell_value(row, 10, period.target_comment)
                    ws.set_cell_style(row, 11, Style(alignment=Alignment(horizontal='right')))
                    ws.set_cell_value(row, 11, period.actual_value)
                    ws.set_cell_style(row, 12, Style(alignment=Alignment(wrap_text=True)))
                    ws.set_cell_value(row, 12, period.actual_comment)

                    disaggregations = period.disaggregations.order_by('dimension_value__name__id')
                    if has_disaggregation and disaggregations.count():
                        category = None
                        last_category = None
                        for disaggregation in disaggregations.all():
                            if disaggregation.value is None:
                                continue
                            category = disaggregation.dimension_value.name.name
                            if category != last_category:
                                ws.set_cell_style(row, 13, Style(alignment=Alignment(wrap_text=True)))
                                ws.set_cell_value(row, 13, disaggregation.dimension_value.name.name)
                            last_category = category
                            ws.set_cell_style(row, 14, Style(alignment=Alignment(wrap_text=True)))
                            ws.set_cell_value(
                                row, 14,
                                disaggregation.dimension_value.value + ': ' + str(disaggregation.value))
                            row += 1
                    else:
                        row += 1

    filename = '{}-{}-results-indicators-report.xlsx'.format(
        datetime.today().strftime('%Y%b%d'), project.id)

    return utils.make_excel_response(wb, filename)
