from akvo.rsr.models import Project
from akvo.utils import ensure_decimal
from datetime import datetime
from django.contrib.auth.decorators import login_required
from django.shortcuts import get_object_or_404
from pyexcelerate import Workbook, Style, Font, Fill, Color, Alignment
from pyexcelerate.Borders import Borders
from pyexcelerate.Border import Border

from . import utils


@login_required
def render_report(request, project_id):
    queryset = Project.objects.prefetch_related(
        'results', 'results__indicators', 'results__indicators__periods')
    project = get_object_or_404(queryset, pk=project_id)
    in_eutf_hierarchy = project.in_eutf_hierarchy()

    wb = Workbook()
    ws = wb.new_sheet('ResultsTable')
    ws.set_col_style(1, Style(size=75))
    ws.set_col_style(2, Style(size=75))
    ws.set_col_style(3, Style(size=41))
    ws.set_col_style(4, Style(size=18.5))
    ws.set_col_style(5, Style(size=34))
    ws.set_col_style(6, Style(size=37.5))
    ws.set_col_style(7, Style(size=47.5))
    ws.set_col_style(8, Style(size=20))
    ws.set_col_style(9, Style(size=20))
    ws.set_col_style(10, Style(size=34))
    ws.set_col_style(11, Style(size=20))
    ws.set_col_style(12, Style(size=20))
    ws.set_col_style(13, Style(size=20))
    ws.set_col_style(14, Style(size=24))
    ws.set_col_style(15, Style(size=20.5))
    ws.set_col_style(16, Style(size=30))
    ws.set_col_style(17, Style(size=22))
    ws.set_col_style(18, Style(size=21))

    # r1
    ws.set_row_style(1, Style(size=36))
    ws.set_cell_style(1, 1, Style(
        font=Font(bold=True, size=18, color=Color(255, 255, 255)),
        fill=Fill(background=Color(32, 56, 100)),
        alignment=Alignment(horizontal='center')
    ))
    ws.set_cell_value(1, 1, 'Project Results and Indicators simple table report')

    # r2
    ws.set_row_style(2, Style(size=36))
    for i in range(1, 19):
        ws.set_cell_style(2, i, Style(
            font=Font(bold=True, size=14),
            fill=Fill(background=Color(214, 234, 248)),
            alignment=Alignment(horizontal='center'),
            borders=Borders(top=Border(color=Color(0, 0, 0)), bottom=Border(color=Color(0, 0, 0)))
        ))
    ws.set_cell_value(2, 1, 'Project name')
    ws.set_cell_value(2, 2, 'Project subtitle')
    ws.set_cell_value(2, 3, 'Result title')
    ws.set_cell_value(2, 4, 'Result type')
    ws.set_cell_value(2, 5, 'Result description')
    ws.set_cell_value(2, 6, 'Indicator title')
    ws.set_cell_value(2, 7, 'Indicator description')
    ws.set_cell_value(2, 8, 'Baseline year')
    ws.set_cell_value(2, 9, 'Baseline value')
    ws.set_cell_value(2, 10, 'Baseline comment')
    ws.set_cell_value(2, 11, 'Period start')
    ws.set_cell_value(2, 12, 'Period end')
    ws.set_cell_value(2, 13, 'Target value')
    ws.set_cell_value(2, 14, 'Target comment')
    ws.set_cell_value(2, 15, 'Actual value')
    ws.set_cell_value(2, 16, 'Actual comment')
    ws.set_cell_value(2, 17, 'Type')
    ws.set_cell_value(2, 18, 'Aggregation status')

    # r3
    row = 3
    ws.set_cell_value(row, 1, project.title)
    ws.set_cell_value(row, 2, project.subtitle)

    prev_type = ''
    curr_type = ''
    prev_agg_status = ''
    curr_agg_status = ''
    prev_indicator_type = ''
    curr_indicator_type = ''
    for result in project.results.exclude(type__exact='').all():
        ws.set_cell_value(row, 3, result.title)
        curr_type = result.iati_type().name
        if curr_type != prev_type:
            ws.set_cell_value(row, 4, curr_type)
            prev_type = curr_type
        ws.set_cell_style(row, 5, Style(alignment=Alignment(wrap_text=True)))
        ws.set_cell_value(row, 5, result.description)
        curr_agg_status = 'Yes' if result.aggregation_status else 'No'
        if curr_agg_status != prev_agg_status:
            ws.set_cell_value(row, 18, curr_agg_status)
            prev_agg_status = curr_agg_status

        for indicator in result.indicators.all():
            ws.set_cell_style(row, 6, Style(alignment=Alignment(wrap_text=True)))
            ws.set_cell_value(row, 6, indicator.title)
            ws.set_cell_style(row, 7, Style(alignment=Alignment(wrap_text=True)))
            ws.set_cell_value(row, 7, indicator.description)
            ws.set_cell_value(row, 8, indicator.baseline_year)
            ws.set_cell_value(row, 9, indicator.baseline_value)
            ws.set_cell_style(row, 7, Style(alignment=Alignment(wrap_text=True)))
            ws.set_cell_value(row, 10, indicator.baseline_comment)
            curr_indicator_type = 'Qualitative' if indicator.type == '2' else 'Quantitative'
            if curr_indicator_type != prev_indicator_type:
                ws.set_cell_value(row, 17, curr_indicator_type)
                prev_indicator_type = curr_indicator_type

            for period in indicator.periods.all():
                ws.set_cell_value(row, 11, utils.get_period_start(period, in_eutf_hierarchy))
                ws.set_cell_value(row, 12, utils.get_period_end(period, in_eutf_hierarchy))
                ws.set_cell_value(row, 13, period.target_value)
                ws.set_cell_style(row, 14, Style(alignment=Alignment(wrap_text=True)))
                ws.set_cell_value(row, 14, period.target_comment)
                ws.set_cell_value(row, 15, ensure_decimal(period.actual_value))
                ws.set_cell_style(row, 14, Style(alignment=Alignment(wrap_text=True)))
                ws.set_cell_value(row, 14, period.actual_comment)

                ws.set_row_style(row, Style(size=68))
                row += 1

    filename = '{}-{}-eutf-project-results-indicators-report.xlsx'.format(
        datetime.today().strftime('%Y%b%d'), project.id)

    return utils.make_excel_response(wb, filename)
