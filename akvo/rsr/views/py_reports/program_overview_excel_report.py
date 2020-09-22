# -*- coding: utf-8 -*-

"""Akvo RSR is covered by the GNU Affero General Public License.

See more details in the license.txt file located at the root folder of the
Akvo RSR module. For additional details on the GNU license please
see < http://www.gnu.org/licenses/agpl.html >.
"""

from akvo.rsr.models import Project, IndicatorPeriod
from akvo.rsr.models.result.utils import calculate_percentage
from akvo.rsr.project_overview import get_periods_with_contributors, is_aggregating_targets
from akvo.rsr.decorators import with_download_indicator
from dateutil.relativedelta import relativedelta
from django.contrib.auth.decorators import login_required
from django.db.models import Q
from django.shortcuts import get_object_or_404
from datetime import datetime
from pyexcelerate import Workbook, Style, Font, Color, Fill, Alignment

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

    periods_with_contribution = get_periods_with_contributors(periods, is_aggregating_targets(project))

    return utils.make_project_proxies(periods_with_contribution)[0]


@login_required
@with_download_indicator
def render_report(request, program_id):
    program = get_object_or_404(Project.objects.prefetch_related('results'), pk=program_id)
    start_date = utils.parse_date(request.GET.get('period_start', '').strip())
    end_date = utils.parse_date(request.GET.get('period_end', '').strip())

    project_view = build_view_object(program, start_date or datetime(1900, 1, 1), end_date or (datetime.today() + relativedelta(years=10)))

    results_by_types = {}
    for result in project_view.results:
        type = result.iati_type_name
        if not type:
            continue
        if type not in results_by_types:
            results_by_types[type] = []
        results_by_types[type].append(result)

    if not results_by_types:
        results_by_types = {'Sheet1': []}

    report_title = 'Programme Overview Report{}'.format(
        ': {} - {}'.format('' if start_date is None else start_date.strftime('%d-%m-%Y'), '' if end_date is None else end_date.strftime('%d-%m-%Y'))
        if start_date is not None or end_date is not None
        else ''
    )

    wb = Workbook()
    for type, results in results_by_types.items():
        ws = wb.new_sheet(type)

        ws.set_col_style(1, Style(size=60))
        ws.set_col_style(2, Style(size=10))
        ws.set_col_style(3, Style(size=70))
        ws.set_col_style(4, Style(size=25))
        ws.set_col_style(5, Style(size=25))
        ws.set_col_style(6, Style(size=25))

        # r1
        ws.set_row_style(1, Style(size=41))
        ws.set_cell_style(1, 1, Style(font=Font(bold=True, size=24)))
        ws.set_cell_value(1, 1, report_title)
        ws.range('A1', 'C1').merge()

        # r2
        ws.set_row_style(2, Style(size=36))
        ws.set_cell_style(2, 1, Style(font=Font(bold=True, size=12)))
        ws.set_cell_value(2, 1, 'Programme title')
        ws.set_cell_style(2, 2, Style(font=Font(size=12)))
        ws.set_cell_value(2, 2, program.title)
        ws.range('B2', 'F2').merge()

        # r3
        ws.set_row_style(3, Style(size=36))
        ws.set_cell_style(3, 1, Style(font=Font(bold=True, size=12)))
        ws.set_cell_value(3, 1, 'Result type')
        ws.set_cell_style(3, 2, Style(font=Font(size=12)))
        ws.set_cell_value(3, 2, '' if type == 'Sheet1' else type)
        ws.range('B3', 'C3').merge()

        # r4

        row = 5
        for result in results:
            # r5
            ws.set_row_style(row, Style(size=36))
            result_header1_style = Style(
                font=Font(bold=True, size=12, color=Color(255, 255, 255)),
                fill=Fill(background=Color(89, 89, 89)))
            for i in range(1, 7):
                ws.set_cell_style(row, i, result_header1_style)
            ws.set_cell_value(row, 1, 'Result title:')
            ws.set_cell_value(row, 4, 'Result description:')
            row += 1

            # r6
            ws.set_row_style(row, Style(size=42))
            result_header2_style = Style(
                font=Font(size=12, color=Color(255, 255, 255)),
                alignment=Alignment(wrap_text=True),
                fill=Fill(background=Color(89, 89, 89)))
            ws.range('A' + str(row), 'C' + str(row)).merge()
            ws.set_cell_style(row, 1, result_header2_style)
            ws.set_cell_value(row, 1, result.title)
            ws.range('D' + str(row), 'F' + str(row)).merge()
            ws.set_cell_style(row, 4, result_header2_style)
            ws.set_cell_value(row, 4, result.description)
            row += 1

            for indicator in result.indicators:
                # r7
                ws.set_row_style(row, Style(size=36))
                row7_style = Style(
                    font=Font(bold=True, size=12),
                    fill=Fill(background=Color(211, 211, 211)))
                for i in range(1, 7):
                    ws.set_cell_style(row, i, row7_style)
                ws.range('B' + str(row), 'C' + str(row)).merge()
                ws.set_cell_value(row, 1, 'Indicator title')
                ws.set_cell_value(row, 2, 'Indicator description')
                ws.set_cell_value(row, 4, 'Indicator type:')
                row += 1

                # r8
                row8_style = Style(
                    fill=Fill(background=Color(211, 211, 211)), alignment=Alignment(wrap_text=True))
                for i in range(1, 7):
                    ws.set_cell_style(row, i, row8_style)
                ws.range('B' + str(row), 'C' + str(row)).merge()
                ws.set_cell_value(row, 1, indicator.title)
                ws.set_cell_value(row, 2, indicator.description)
                ws.set_cell_value(row, 4, 'Qualitative' if indicator.is_qualitative else 'Quantitative')
                row += 1

                for period in indicator.periods:
                    # r9
                    ws.set_row_style(row, Style(size=36))
                    row9_style = Style(
                        font=Font(bold=True, size=12),
                        fill=Fill(background=Color(220, 230, 242)))
                    for i in range(1, 7):
                        ws.set_cell_style(row, i, row9_style)
                    ws.range('B' + str(row), 'C' + str(row)).merge()
                    ws.set_cell_value(row, 1, 'Reporting Period:')
                    ws.set_cell_value(row, 2, 'Number of contrributors')
                    ws.set_cell_value(row, 4, 'Countries')
                    ws.set_cell_value(row, 5, 'Aggregated Actual Value')
                    ws.set_cell_value(row, 6, '% of Contribution')
                    row += 1

                    # r10
                    number_of_contributors = len(period.contributors)
                    row10_style = Style(
                        font=Font(size=12),
                        fill=Fill(background=Color(220, 230, 242)))
                    for i in range(1, 6):
                        ws.set_cell_style(row, i, row10_style)
                    ws.range('B' + str(row), 'C' + str(row)).merge()
                    ws.set_cell_value(row, 1, '{} - {}'.format(period.period_start, period.period_end))
                    ws.set_cell_value(row, 2, number_of_contributors)
                    ws.set_cell_value(row, 4, len(period.countries))
                    ws.set_cell_value(row, 5, period.actual_value)
                    ws.set_cell_style(row, 6, Style(
                        alignment=Alignment(horizontal='right'),
                        font=Font(size=12),
                        fill=Fill(background=Color(220, 230, 242))))
                    ws.set_cell_value(row, 6, '100%')
                    row += 1

                    if not number_of_contributors:
                        continue

                    for contrib in period.contributors:
                        # r11
                        ws.range('B' + str(row), 'C' + str(row)).merge()
                        ws.set_cell_style(row, 2, Style(font=Font(bold=True)))
                        ws.set_cell_value(row, 2, 'Level 1 contributors:')
                        row += 1

                        # r12
                        ws.set_row_style(row, Style(size=30))
                        ws.range('B' + str(row), 'C' + str(row)).merge()
                        ws.set_cell_style(row, 2, Style(alignment=Alignment(wrap_text=True, vertical='top')))
                        ws.set_cell_value(row, 2, contrib.project.title)
                        ws.set_cell_style(row, 4, Style(alignment=Alignment(horizontal='right')))
                        ws.set_cell_value(row, 4, getattr(contrib.country, 'name', ' '))
                        ws.set_cell_value(row, 5, contrib.updates.total_value)
                        ws.set_cell_style(row, 6, Style(alignment=Alignment(horizontal='right')))
                        ws.set_cell_value(row, 6, '{}%'.format(calculate_percentage(contrib.updates.total_value, period.actual_value)))
                        row += 1

                        if len(contrib.contributors) < 1:
                            continue

                        # r13
                        ws.set_cell_style(row, 3, Style(font=Font(bold=True)))
                        ws.set_cell_value(row, 3, 'Level 2 sub-contributors:')
                        row += 1

                        for subcontrib in contrib.contributors:
                            # r14
                            ws.set_cell_style(row, 3, Style(alignment=Alignment(wrap_text=True)))
                            ws.set_cell_value(row, 3, subcontrib.project.title)
                            ws.set_cell_style(row, 4, Style(alignment=Alignment(horizontal='right')))
                            ws.set_cell_value(row, 4, getattr(subcontrib.country, 'name', ' '))
                            ws.set_cell_value(row, 5, subcontrib.actual_value)
                            ws.set_cell_style(row, 6, Style(alignment=Alignment(horizontal='right')))
                            ws.set_cell_value(row, 6, '{}%'.format(calculate_percentage(subcontrib.actual_value, period.actual_value)))
                            row += 1

    # output
    filename = '{}-{}-program-overview-report.xlsx'.format(datetime.today().strftime('%Y%b%d'), program.id)

    return utils.make_excel_response(wb, filename)
