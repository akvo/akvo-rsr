# -*- coding: utf-8 -*-

"""Akvo RSR is covered by the GNU Affero General Public License.

See more details in the license.txt file located at the root folder of the
Akvo RSR module. For additional details on the GNU license please
see < http://www.gnu.org/licenses/agpl.html >.
"""

from akvo.rsr.models import Project, IndicatorPeriod
from akvo.rsr.models.result.utils import calculate_percentage
from akvo.rest.views.project_overview import _make_objects_hierarchy_tree, _transform_period_contributions_node
from akvo.rsr.iso3166 import ISO_3166_COUNTRIES
from dateutil.relativedelta import relativedelta
from django.contrib.auth.decorators import login_required
from django.db.models import Q
from django.shortcuts import get_object_or_404
from datetime import datetime
from pyexcelerate import Workbook, Style, Font, Color, Fill, Alignment

from . import utils

iso_countries = dict((code, country.title()) for code, country in ISO_3166_COUNTRIES)


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


def _drilldown_indicator_periods_contributions(indicator, aggregate_targets=False):
    periods = _get_indicator_periods_hierarchy_flatlist(indicator)
    periods_tree = _make_objects_hierarchy_tree(periods, 'parent_period')

    return [_transform_period_contributions_node(n, aggregate_targets) for n in periods_tree]


def _get_indicator_periods_hierarchy_flatlist(indicator):
    family = {period.id for period in indicator.periods}
    while True:
        children = set(
            IndicatorPeriod.objects.filter(parent_period__in=family).values_list('pk', flat=True))
        if family.union(children) == family:
            break

        family = family.union(children)

    periods = IndicatorPeriod.objects.select_related(
        'indicator__result__project',
        'indicator__result__project__primary_location__country',
        'parent_period',
    ).prefetch_related(
        'data',
        'data__user',
        'data__approved_by',
        'data__comments',
        'data__comments__user',
        'data__disaggregations',
        'data__disaggregations__dimension_value',
        'data__disaggregations__dimension_value__name',
        'disaggregation_targets',
        'disaggregation_targets__dimension_value',
        'disaggregation_targets__dimension_value__name'
    ).filter(pk__in=family)

    return periods


@login_required
def render_report(request, program_id):
    program = get_object_or_404(Project.objects.prefetch_related('results'), pk=program_id)
    start_date = utils.parse_date(request.GET.get('start_date', '').strip(), datetime(1900, 1, 1))
    end_date = utils.parse_date(request.GET.get('end_date', '').strip(), datetime.today() + relativedelta(years=10))

    project_view = build_view_object(program, start_date, end_date)

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

        ws.set_col_style(1, Style(size=60))
        ws.set_col_style(2, Style(size=70))
        ws.set_col_style(3, Style(size=25))
        ws.set_col_style(4, Style(size=25))
        ws.set_col_style(5, Style(size=25))

        # r1
        ws.set_row_style(1, Style(size=41))
        ws.set_cell_style(1, 1, Style(font=Font(bold=True, size=24)))
        ws.set_cell_value(1, 1, 'Programme Overview Report')
        ws.range('A1', 'B1').merge()

        # r2
        ws.set_row_style(2, Style(size=36))
        ws.set_cell_style(2, 1, Style(font=Font(bold=True, size=12)))
        ws.set_cell_value(2, 1, 'Programme title')
        ws.set_cell_style(2, 2, Style(font=Font(size=12)))
        ws.set_cell_value(2, 2, program.title)
        ws.range('B2', 'E2').merge()

        # r3
        ws.set_row_style(3, Style(size=36))
        ws.set_cell_style(3, 1, Style(font=Font(bold=True, size=12)))
        ws.set_cell_value(3, 1, 'Result type')
        ws.set_cell_style(3, 2, Style(font=Font(size=12)))
        ws.set_cell_value(3, 2, type)

        # r4

        row = 5
        for result in results:
            # r5
            ws.set_row_style(row, Style(size=36))
            result_header1_style = Style(
                font=Font(bold=True, size=12, color=Color(255, 255, 255)),
                fill=Fill(background=Color(89, 89, 89)))
            for i in range(1, 6):
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
            ws.range('C' + str(row), 'E' + str(row)).merge()
            ws.set_cell_style(row, 3, result_header2_style)
            ws.set_cell_value(row, 3, result.description)
            row += 1

            for indicator in result.indicators:
                # r7
                ws.set_row_style(row, Style(size=36))
                row7_style = Style(
                    font=Font(bold=True, size=12),
                    fill=Fill(background=Color(211, 211, 211)))
                for i in range(1, 6):
                    ws.set_cell_style(row, i, row7_style)
                ws.set_cell_value(row, 1, 'Indicator title')
                ws.set_cell_value(row, 2, 'Indicator description')
                ws.set_cell_value(row, 3, 'Indicator type:')
                row += 1

                # r8
                row8_style = Style(
                    fill=Fill(background=Color(211, 211, 211)), alignment=Alignment(wrap_text=True))
                for i in range(1, 6):
                    ws.set_cell_style(row, i, row8_style)
                ws.set_cell_value(row, 1, indicator.title)
                ws.set_cell_value(row, 2, indicator.description)
                ws.set_cell_value(row, 3, 'Qualitative' if indicator.is_qualitative else 'Quantitative')
                row += 1

                for period in _drilldown_indicator_periods_contributions(indicator):
                    # r9
                    ws.set_row_style(row, Style(size=36))
                    row9_style = Style(
                        font=Font(bold=True, size=12),
                        fill=Fill(background=Color(220, 230, 242)))
                    for i in range(1, 6):
                        ws.set_cell_style(row, i, row9_style)
                    ws.set_cell_value(row, 1, 'Reporting Period:')
                    ws.set_cell_value(row, 2, 'Number of contrributors')
                    ws.set_cell_value(row, 3, 'Countries')
                    ws.set_cell_value(row, 4, 'Aggregated Actual Value')
                    ws.set_cell_value(row, 5, '% of Contribution')
                    row += 1

                    # r10
                    number_of_contributors = len(period['contributors'])
                    row10_style = Style(
                        font=Font(size=12),
                        fill=Fill(background=Color(220, 230, 242)))
                    for i in range(1, 6):
                        ws.set_cell_style(row, i, row10_style)
                    ws.set_cell_value(row, 1, '{} - {}'.format(period['period_start'], period['period_end']))
                    ws.set_cell_value(row, 2, number_of_contributors)
                    ws.set_cell_value(row, 3, len(period['countries']))
                    ws.set_cell_value(row, 4, period['actual_value'])
                    ws.set_cell_value(row, 5, '100%')
                    row += 1

                    if not number_of_contributors:
                        continue

                    aggregated_value = period['actual_value']

                    for contrib in period['contributors']:
                        # r11
                        ws.set_cell_style(row, 2, Style(font=Font(bold=True)))
                        ws.set_cell_value(row, 2, 'Level 1 contributors:')
                        row += 1

                        # r12
                        ws.set_cell_value(row, 2, contrib['project_title'])
                        iso_code = None
                        if contrib['country']:
                            iso_code = contrib['country']['iso_code']
                        country_name = ' '
                        if iso_code:
                            country_name = iso_countries[iso_code]
                        ws.set_cell_value(row, 3, country_name)
                        ws.set_cell_value(row, 4, contrib['updates_value'])
                        ws.set_cell_value(row, 5, '{}%'.format(calculate_percentage(contrib['updates_value'], aggregated_value)))
                        row += 1

                        if len(contrib['contributors']) < 1:
                            continue

                        # r13
                        ws.set_cell_style(row, 2, Style(font=Font(bold=True)))
                        ws.set_cell_value(row, 2, 'Level 2 sub-contributors:')
                        row += 1

                        for subcontrib in contrib['contributors']:
                            # r14
                            ws.set_cell_value(row, 2, subcontrib['project_title'])
                            iso_code = None
                            if subcontrib['country']:
                                iso_code = subcontrib['country']['iso_code']
                            country_name = ' '
                            if iso_code:
                                country_name = iso_countries[iso_code]
                            ws.set_cell_value(row, 3, country_name)
                            ws.set_cell_value(row, 4, subcontrib['updates_value'])
                            ws.set_cell_value(row, 5, '{}%'.format(calculate_percentage(subcontrib['updates_value'], aggregated_value)))
                            row += 1

    # output
    filename = '{}-{}-program-overview-report.xlsx'.format(datetime.today().strftime('%Y%b%d'), program.id)

    return utils.make_excel_response(wb, filename)
