# -*- coding: utf-8 -*-

"""Akvo RSR is covered by the GNU Affero General Public License.
See more details in the license.txt file located at the root folder of the
Akvo RSR module. For additional details on the GNU license please
see < http://www.gnu.org/licenses/agpl.html >.
"""
from django.conf import settings
from django.contrib.sites.shortcuts import get_current_site
from django.utils import timezone
from akvo.rsr.dataclasses import IndicatorData, PeriodData, ProjectData, ResultData

from akvo.rsr.models import Organisation, IndicatorPeriod, RecipientCountry, Partnership, Project, User
from akvo.rsr.models.result.utils import PERCENTAGE_MEASURE
from django.contrib.auth.decorators import login_required
from django.db.models import Count
from django.shortcuts import get_object_or_404
from pyexcelerate import Workbook, Style, Font, Color, Fill, Alignment

from akvo.utils import ensure_decimal

from . import utils

REPORT_NAME = 'organisation_results_indicators_table'


@login_required
def add_email_report_job(request, org_id):
    organisation = get_object_or_404(Organisation, pk=org_id)
    report_label = f'Results and Indicators Export for {organisation.name} organisation'
    payload = {
        'org_id': organisation.id,
        'site': str(get_current_site(request)),
        'report_label': report_label,
    }
    recipient = request.user.email
    return utils.make_async_email_report_task(
        handle_email_report,
        payload,
        recipient,
        REPORT_NAME,
        hook='akvo.rsr.views.py_reports.utils.notify_user_on_failed_report'
    )


def handle_email_report(params, recipient):
    organisation = Organisation.objects.get(pk=params['org_id'])
    user = User.objects.get(email=recipient)
    site = params['site']
    wb = generate_workbook(organisation)
    filename = '{}-{}-results-and-indicators-simple-table.xlsx'.format(
        timezone.now().strftime('%Y%m%d%H%M%S'), organisation.id)
    utils.save_excel_and_send_email(wb, site, user, filename)


def fetch_periods(organisation: Organisation):
    project_ids = organisation.all_projects()\
        .annotate(results_count=Count('results'))\
        .filter(results_count__gt=0)\
        .values_list('pk', flat=True)

    queryset = IndicatorPeriod.objects\
        .select_related('indicator', 'indicator__result', 'indicator__result__project')\
        .filter(indicator__result__project__in=project_ids)\
        .exclude(indicator__result__type__iexact='')\
        .order_by(
            'indicator__result__project__id',
            'indicator__result__order',
            'indicator__result__id',
            'indicator__order',
            'indicator__id',
            'period_start',
            'period_end'
        )
    return queryset.values(
        'id', 'period_start', 'period_end', 'target_value', 'target_comment', 'actual_value', 'actual_comment', 'narrative',
        'indicator__id', 'indicator__title', 'indicator__type', 'indicator__measure', 'indicator__cumulative',
        'indicator__ascending', 'indicator__description', 'indicator__baseline_year', 'indicator__baseline_value',
        'indicator__baseline_comment', 'indicator__target_value', 'indicator__target_comment',
        'indicator__result__id', 'indicator__result__title', 'indicator__result__description',
        'indicator__result__type', 'indicator__result__aggregation_status',
        'indicator__result__project__id', 'indicator__result__project__title', 'indicator__result__project__subtitle',
        'indicator__result__project__iati_activity_id', 'indicator__result__project__date_start_planned',
        'indicator__result__project__date_end_planned', 'indicator__result__project__date_start_actual',
        'indicator__result__project__date_end_actual', 'indicator__result__project__targets_at',
    )


def get_view_objects(organisation):
    raw_periods = fetch_periods(organisation)
    lookup = {
        'projects': {},
        'results': {},
        'indicators': {},
        'periods': {},
    }
    for r in raw_periods:
        project_id = r['indicator__result__project__id']
        result_id = r['indicator__result__id']
        indicator_id = r['indicator__id']
        period_id = r['id']
        if project_id not in lookup['projects']:
            lookup['projects'][project_id] = ProjectData.make(r, 'indicator__result__project__')
        project = lookup['projects'][project_id]
        if result_id not in lookup['results']:
            result = ResultData.make(r, 'indicator__result__')
            project.results.append(result)
            lookup['results'][result_id] = result
        else:
            result = lookup['results'][result_id]
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
    project_ids = {id for id in lookup['projects'].keys()}
    recipient_countries = RecipientCountry.objects.filter(project__in=project_ids).values('project', 'country')
    for recipient in recipient_countries:
        project = lookup['projects'][recipient['project']]
        project.recipient_countries.append(recipient['country'])
    partners = Partnership.objects.filter(project__in=project_ids)\
        .exclude(organisation__isnull=True)\
        .values('project', 'organisation__name')
    for partner in partners:
        project = lookup['projects'][partner['project']]
        project.partners.append(partner['organisation__name'])
    return [it for it in lookup['projects'].values()]


def is_using_indicator_target(projects):
    for project in projects:
        program = Project.objects.get(id=project.id).get_program()
        targets_at = program.targets_at if program else project.targets_at
        if targets_at == 'indicator':
            return True
    return False


def get_eutf_members():
    try:
        root = Project.objects.get(id=settings.EUTF_ROOT_PROJECT)
        return root.descendants().values_list('id', flat=True)
    except Project.DoesNotExist:
        return []


def get_period_start(period, project, in_eutf_hierarchy):
    if not in_eutf_hierarchy:
        return period.period_start

    if project.id == settings.EUTF_ROOT_PROJECT:
        return period.period_start

    if project.date_start_actual:
        return project.date_start_actual

    return project.date_start_planned


def get_period_end(period, project, in_eutf_hierarchy):
    if not in_eutf_hierarchy:
        return period.period_end

    if project.id == settings.EUTF_ROOT_PROJECT:
        return period.period_end

    if project.date_end_actual:
        return project.date_end_actual

    return project.date_end_planned


def get_total_period_targets(indicator):
    total = 0
    for period in indicator.periods:
        total += ensure_decimal(period.target_value)
    return total


def get_indicator_target(indicator, targets_at):
    return ensure_decimal(indicator.target_value) if targets_at == 'indicator' else get_total_period_targets(indicator)


def generate_workbook(organisation):
    projects = get_view_objects(organisation)
    use_indicator_target = is_using_indicator_target(projects)
    eutf_members = get_eutf_members()

    def in_eutf_hierarchy(project):
        return project.id in eutf_members

    wb = Workbook()
    ws = wb.new_sheet('ProjectList')

    ws.set_col_style(1, Style(size=81.5))
    ws.set_col_style(2, Style(size=33.5))
    ws.set_col_style(3, Style(size=27))
    ws.set_col_style(4, Style(size=21))
    ws.set_col_style(5, Style(size=21))
    ws.set_col_style(6, Style(size=21))
    ws.set_col_style(7, Style(size=21))
    ws.set_col_style(8, Style(size=33.5))
    ws.set_col_style(9, Style(size=33.5))
    ws.set_col_style(10, Style(size=14))
    ws.set_col_style(11, Style(size=33.5))
    ws.set_col_style(12, Style(size=33.5))
    ws.set_col_style(13, Style(size=10))
    ws.set_col_style(14, Style(size=10))
    ws.set_col_style(15, Style(size=10))
    ws.set_col_style(16, Style(size=10))
    ws.set_col_style(17, Style(size=33.5))
    ws.set_col_style(18, Style(size=20))
    ws.set_col_style(19, Style(size=20))
    ws.set_col_style(20, Style(size=20))
    ws.set_col_style(21, Style(size=33.5))
    ws.set_col_style(22, Style(size=10))
    ws.set_col_style(23, Style(size=33.5))
    ws.set_col_style(24, Style(size=10))
    ws.set_col_style(25, Style(size=10))
    ws.set_col_style(26, Style(size=33.5))
    ws.set_col_style(27, Style(size=14))
    ws.set_col_style(28, Style(size=14))
    ws.set_col_style(29, Style(size=14))
    ws.set_col_style(30, Style(size=14))

    # r1
    ws.set_cell_style(1, 1, Style(font=Font(bold=True, size=24)))
    ws.set_cell_value(1, 1, 'Organisation Results and Indicators simple table report')

    # r3
    for col in range(1, 31):
        ws.set_cell_style(3, col, Style(
            font=Font(bold=True, size=14, color=Color(255, 255, 255)),
            fill=Fill(background=Color(88, 88, 87))
        ))
    ws.set_cell_value(3, 1, 'Project name')
    ws.set_cell_value(3, 2, 'Subtitle')
    ws.set_cell_value(3, 3, 'IATI id')
    ws.set_cell_value(3, 4, 'Date start planned')
    ws.set_cell_value(3, 5, 'Date end planned')
    ws.set_cell_value(3, 6, 'Date start actual')
    ws.set_cell_value(3, 7, 'Date end actual')
    ws.set_cell_value(3, 8, 'Result title')
    ws.set_cell_value(3, 9, 'Result description')
    ws.set_cell_value(3, 10, 'Aggregation')
    ws.set_cell_value(3, 11, 'Indicator title')
    ws.set_cell_value(3, 12, 'Indicator description')
    ws.set_cell_value(3, 13, 'Measure')
    ws.set_cell_value(3, 14, 'Ascending')
    ws.set_cell_value(3, 15, 'Baseline year')
    ws.set_cell_value(3, 16, 'Baseline value')
    ws.set_cell_value(3, 17, 'Baseline comment')
    col = 17
    if use_indicator_target:
        col += 1
        ws.set_cell_value(3, col, 'Target')
        col += 1
        ws.set_cell_value(3, col, 'Target comment')
    col += 1
    ws.set_cell_value(3, col, 'Period start')
    col += 1
    ws.set_cell_value(3, col, 'Period end')
    if not use_indicator_target:
        col += 1
        ws.set_cell_value(3, col, 'Target value')
        col += 1
        ws.set_cell_value(3, col, 'Target comment')
    ws.set_cell_value(3, 22, 'Actual value')
    ws.set_cell_value(3, 23, 'Actual comment')
    ws.set_cell_value(3, 24, 'Country')
    ws.set_cell_value(3, 25, 'Type')
    ws.set_cell_value(3, 26, 'Related partners')
    ws.set_cell_value(3, 27, 'Project id')
    ws.set_cell_value(3, 28, 'Result id')
    ws.set_cell_value(3, 29, 'Indicator id')
    ws.set_cell_value(3, 30, 'Period id')

    wrap_text = [2, 8, 9, 11, 12, 17, 21, 23]
    row = 4
    for key, project in enumerate(projects):
        highlight = (key % 2) == 0
        for result in project.results:
            for indicator in result.indicators:
                for period in indicator.periods:
                    for col in range(1, 31):
                        ws.set_cell_style(row, col, Style(
                            alignment=Alignment(wrap_text=True) if col in wrap_text else None,
                            fill=Fill(background=Color(217, 217, 217)) if highlight else None
                        ))
                    # The empty strings are sort of a hack because the style formatting
                    # are not applied on a cell with empty content.
                    ws.set_cell_value(row, 1, project.title or ' ')
                    ws.set_cell_value(row, 2, project.subtitle or ' ')
                    ws.set_cell_value(row, 3, project.iati_activity_id or ' ')
                    ws.set_cell_value(row, 4, project.date_start_planned or ' ')
                    ws.set_cell_value(row, 5, project.date_end_planned or ' ')
                    ws.set_cell_value(row, 6, project.date_start_actual or ' ')
                    ws.set_cell_value(row, 7, project.date_end_planned or ' ')
                    ws.set_cell_value(row, 8, result.title or ' ')
                    ws.set_cell_value(row, 9, result.description or ' ')
                    ws.set_cell_value(row, 10, 'Yes' if result.aggregation_status else 'No')
                    ws.set_cell_value(row, 11, indicator.title or ' ')
                    ws.set_cell_value(row, 12, indicator.description or ' ')
                    ws.set_cell_value(row, 13, 'Percentage' if indicator.measure == PERCENTAGE_MEASURE else 'Unit')
                    ws.set_cell_value(row, 14, 'Yes' if indicator.ascending else 'No')
                    ws.set_cell_value(row, 15, indicator.baseline_year or ' ')
                    ws.set_cell_value(row, 16, indicator.baseline_value or ' ')
                    ws.set_cell_value(row, 17, indicator.baseline_comment or ' ')
                    col = 17
                    if use_indicator_target:
                        col += 1
                        ws.set_cell_value(row, col, get_indicator_target(indicator, project.targets_at) or ' ')
                        col += 1
                        ws.set_cell_value(row, col, indicator.target_comment or ' ')
                    col += 1
                    ws.set_cell_value(row, col, get_period_start(period, project, in_eutf_hierarchy(project)) or ' ')
                    col += 1
                    ws.set_cell_value(row, col, get_period_end(period, project, in_eutf_hierarchy(project)) or ' ')
                    if not use_indicator_target:
                        col += 1
                        ws.set_cell_value(row, col, period.target_value or ' ')
                        col += 1
                        ws.set_cell_value(row, col, period.target_comment or ' ')
                    ws.set_cell_value(row, 22, period.period_actual_value or ' ')
                    ws.set_cell_value(row, 23, period.actual_comment or ' ')
                    ws.set_cell_value(row, 24, project.country_codes or ' ')
                    ws.set_cell_value(row, 25, result.iati_type_name or ' ')
                    ws.set_cell_value(row, 26, project.partner_names or ' ')
                    ws.set_cell_value(row, 27, project.id)
                    ws.set_cell_value(row, 28, result.id)
                    ws.set_cell_value(row, 29, indicator.id)
                    ws.set_cell_value(row, 30, period.id)
                    row += 1
    return wb
