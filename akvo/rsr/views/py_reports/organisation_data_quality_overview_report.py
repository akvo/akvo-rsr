# -*- coding: utf-8 -*-

"""Akvo RSR is covered by the GNU Affero General Public License.

See more details in the license.txt file located at the root folder of the
Akvo RSR module. For additional details on the GNU license please
see < http://www.gnu.org/licenses/agpl.html >.
"""

from akvo.rsr.models import Organisation, Project
from datetime import datetime
from dateutil.relativedelta import relativedelta
from django.contrib.auth.decorators import login_required
from django.conf import settings
from django.db.models import Q
from django.http import HttpResponse, HttpResponseBadRequest
from django.shortcuts import get_object_or_404
from django.template.loader import render_to_string
from pyexcelerate import Workbook, Style, Font, Color, Alignment, Format
from pyexcelerate.Borders import Borders
from pyexcelerate.Border import Border

from . import utils


@login_required
def render_report(request, org_id):
    organisation = get_object_or_404(Organisation, pk=org_id)
    now = datetime.now()
    reader = OrganisationDataQualityReader(organisation, now)

    format = request.GET.get('format')

    if format == 'pdf':
        return _render_pdf(reader, True if request.GET.get('show-html', '') else False)
    elif format == 'excel':
        return _render_excel(reader)
    else:
        return HttpResponseBadRequest('Unsupported format.')


def _render_pdf(reader, show_html=True):
    html = render_to_string(
        'reports/organisation-data-quality-overview.html',
        context={'reader': reader, 'domain': settings.RSR_DOMAIN}
    )

    if show_html:
        return HttpResponse(html)

    filename = '{}-{}-organisation-data-quality.pdf'.format(
        reader.date.strftime('%Y%m%d'), reader.organisation.id)

    return utils.make_pdf_response(html, filename)


def _render_excel(reader):
    wb = Workbook()

    # styles
    section_header_style = Style(font=Font(bold=True, size=14))
    table_header_style = Style(font=Font(bold=True))
    table_footer_first_style = Style(
        alignment=Alignment(horizontal='left'), borders=Borders(top=Border(color=Color(0, 0, 0))))
    table_footer_style = Style(
        alignment=Alignment(horizontal='right'), borders=Borders(top=Border(color=Color(0, 0, 0))))

    # sheet0 ==================================================================
    ws = wb.new_sheet('Sheet0')
    ws.set_col_style(1, Style(size=28))
    ws.set_col_style(2, Style(size=35))
    ws.set_col_style(3, Style(size=16))
    ws.set_col_style(4, Style(size=20))
    ws.set_col_style(5, Style(size=33))
    ws.set_col_style(6, Style(size=39))

    # r1
    ws.set_cell_style(1, 1, Style(font=Font(size=18)))
    ws.set_cell_value(1, 1, 'Data quality report for ' + reader.organisation.name)
    # r2
    ws.set_cell_value(2, 1, 'Sorted by country and id, only active and completed projects')

    # r3
    ws.set_cell_style(3, 1, section_header_style)
    ws.set_cell_value(3, 1, 'Project totals')
    # r4
    ws.set_cell_value(4, 1, 'Planned end date overdue')
    ws.set_cell_value(4, 2, reader.planned_and_date_overdue.count())
    # r5
    ws.set_cell_value(5, 1, 'No edits or updates last 3 months')
    ws.set_cell_value(5, 2, reader.no_edit_or_updates.count())
    # r6
    ws.set_cell_value(6, 1, 'Need funding')
    ws.set_cell_value(6, 2, reader.need_funding.count())
    # r7
    ws.set_cell_value(7, 1, 'Without photo')
    ws.set_cell_value(7, 2, reader.without_photo.count())

    # r8
    ws.set_cell_style(8, 1, section_header_style)
    ws.set_cell_value(8, 1, 'Projects with planned end date overdue')
    # r9
    ws.set_cell_value(9, 1, 'Sorted by country and id')

    # r10
    for i in range(1, 7):
        ws.set_cell_style(10, i, table_header_style)
    ws.set_cell_value(10, 1, 'Id')
    ws.set_cell_value(10, 2, 'Title')
    ws.set_cell_value(10, 3, 'Planned start date')
    ws.set_cell_value(10, 4, 'Planned end date')
    ws.set_cell_value(10, 5, 'Country')
    ws.set_cell_value(10, 6, 'Project URL')
    # r11
    row = 11
    for project, country in reader.planned_and_date_overdue_list:
        ws.set_cell_style(row, 1, Style(alignment=Alignment(horizontal='left')))
        ws.set_cell_value(row, 1, project.id)
        ws.set_cell_value(row, 2, project.title)
        ws.set_cell_style(row, 3, Style(alignment=Alignment(horizontal='right')))
        ws.set_cell_value(row, 3, project.date_start_planned.strftime('%-d-%b-%Y') if project.date_start_planned else '')
        ws.set_cell_style(row, 4, Style(alignment=Alignment(horizontal='right')))
        ws.set_cell_value(row, 4, project.date_end_planned.strftime('%-d-%b-%Y') if project.date_end_planned else '')
        ws.set_cell_value(row, 5, country)
        ws.set_cell_value(row, 6, 'https://{}{}'.format(settings.RSR_DOMAIN, project.get_absolute_url()))
        row += 1
    # r12
    ws.set_cell_style(row, 1, table_footer_first_style)
    for i in range(2, 7):
        ws.set_cell_style(row, i, table_footer_style)
    ws.set_cell_value(row, 1, len(reader.planned_and_date_overdue_list))

    # sheet1 ==================================================================
    ws = wb.new_sheet('Sheet1')
    ws.set_col_style(1, Style(size=17))
    ws.set_col_style(2, Style(size=27))
    ws.set_col_style(3, Style(size=20))
    ws.set_col_style(4, Style(size=16))
    ws.set_col_style(5, Style(size=22))
    ws.set_col_style(6, Style(size=11))
    ws.set_col_style(7, Style(size=38))

    # r1
    ws.set_cell_style(1, 1, section_header_style)
    ws.set_cell_value(1, 1, 'Projects with no edits or updates last 3 months')
    # r2
    ws.set_cell_value(2, 1, 'Sorted by country and id')

    # r4
    for i in range(1, 8):
        ws.set_cell_style(4, i, table_header_style)
    ws.set_cell_value(4, 1, 'Id')
    ws.set_cell_value(4, 2, 'Title')
    ws.set_cell_value(4, 3, 'Last modified')
    ws.set_cell_value(4, 4, 'Planned start date')
    ws.set_cell_value(4, 5, 'Planned end date')
    ws.set_cell_value(4, 6, 'Country')
    ws.set_cell_value(4, 7, 'Project URL')
    # r5
    row = 5
    for project, country in reader.no_edit_or_updates_list:
        ws.set_cell_style(row, 1, Style(alignment=Alignment(horizontal='left')))
        ws.set_cell_value(row, 1, project.id)
        ws.set_cell_value(row, 2, project.title)
        ws.set_cell_style(row, 3, Style(alignment=Alignment(horizontal='right')))
        ws.set_cell_value(row, 3, project.last_modified_at.strftime('%-d-%b-%Y') if project.last_modified_at else '')
        ws.set_cell_style(row, 4, Style(alignment=Alignment(horizontal='right')))
        ws.set_cell_value(row, 4, project.date_start_planned.strftime('%-d-%b-%Y') if project.date_start_planned else '')
        ws.set_cell_style(row, 5, Style(alignment=Alignment(horizontal='right')))
        ws.set_cell_value(row, 5, project.date_end_planned.strftime('%-d-%b-%Y') if project.date_end_planned else '')
        ws.set_cell_value(row, 6, country)
        ws.set_cell_value(row, 7, 'https://{}{}'.format(settings.RSR_DOMAIN, project.get_absolute_url()))
        row += 1
    # r6
    ws.set_cell_style(row, 1, table_footer_first_style)
    for i in range(2, 8):
        ws.set_cell_style(row, i, table_footer_style)
    ws.set_cell_value(row, 1, len(reader.no_edit_or_updates_list))

    # sheet2 ==================================================================
    ws = wb.new_sheet('Sheet2')
    ws.set_col_style(1, Style(size=17))
    ws.set_col_style(2, Style(size=27))
    ws.set_col_style(3, Style(size=19))
    ws.set_col_style(4, Style(size=19))
    ws.set_col_style(5, Style(size=33))
    ws.set_col_style(6, Style(size=37))
    ws.set_col_style(7, Style(size=12))
    ws.set_col_style(8, Style(size=38))

    # r1
    ws.set_cell_style(1, 1, section_header_style)
    ws.set_cell_value(1, 1, 'Projects that need funding')

    # r2
    for i in range(1, 9):
        ws.set_cell_style(2, i, table_header_style)
    ws.range('C2', 'D2').merge()
    ws.set_cell_value(2, 1, 'Id')
    ws.set_cell_value(2, 2, 'Title')
    ws.set_cell_value(2, 3, 'Budget')
    ws.set_cell_value(2, 5, 'Funds')
    ws.set_cell_value(2, 6, 'Funds needed')
    ws.set_cell_value(2, 7, 'Country')
    ws.set_cell_value(2, 8, 'Project URL')
    # r3
    row = 3
    for project, country in reader.need_funding_list:
        ws.set_cell_style(row, 1, Style(alignment=Alignment(horizontal='left')))
        ws.set_cell_value(row, 1, project.id)
        ws.set_cell_value(row, 2, project.title)
        ws.set_cell_style(row, 3, Style(alignment=Alignment(horizontal='right')))
        ws.set_cell_value(row, 3, project.currency)
        ws.set_cell_style(row, 4, Style(format=Format("#,#0.00")))
        ws.set_cell_value(row, 4, project.budget)
        ws.set_cell_style(row, 5, Style(format=Format("#,#0.00")))
        ws.set_cell_value(row, 5, project.funds)
        ws.set_cell_style(row, 6, Style(format=Format("#,#0.00")))
        ws.set_cell_value(row, 6, project.funds_needed)
        ws.set_cell_value(row, 7, country)
        ws.set_cell_value(row, 8, 'https://{}{}'.format(settings.RSR_DOMAIN, project.get_absolute_url()))
        row += 1
    # r4
    ws.set_cell_style(row, 1, table_footer_first_style)
    for i in range(2, 9):
        ws.set_cell_style(row, i, table_footer_style)
    ws.set_cell_value(row, 1, len(reader.need_funding_list))
    row += 1

    # r5
    ws.set_cell_style(row, 1, section_header_style)
    ws.set_cell_value(row, 1, 'Projects without photos')
    row += 1

    # r6
    for i in range(1, 7):
        ws.set_cell_style(row, i, table_header_style)
    ws.set_cell_value(row, 1, 'Id')
    ws.set_cell_value(row, 2, 'Title')
    ws.set_cell_value(row, 3, 'Planned start date')
    ws.set_cell_value(row, 4, 'Planned end date')
    ws.set_cell_value(row, 5, 'Country')
    ws.set_cell_value(row, 6, 'Project URL')
    # r7
    row += 1
    for project, country in reader.without_photo_list:
        ws.set_cell_style(row, 1, Style(alignment=Alignment(horizontal='left')))
        ws.set_cell_value(row, 1, project.id)
        ws.set_cell_value(row, 2, project.title)
        ws.set_cell_style(row, 3, Style(alignment=Alignment(horizontal='right')))
        ws.set_cell_value(row, 3, project.date_start_planned.strftime('%-d-%b-%Y') if project.date_start_planned else '')
        ws.set_cell_style(row, 4, Style(alignment=Alignment(horizontal='right')))
        ws.set_cell_value(row, 4, project.date_end_planned.strftime('%-d-%b-%Y') if project.date_end_planned else '')
        ws.set_cell_value(row, 5, country)
        ws.set_cell_value(row, 6, 'https://{}{}'.format(settings.RSR_DOMAIN, project.get_absolute_url()))
        row += 1
    # r8
    ws.set_cell_style(row, 1, table_footer_first_style)
    for i in range(2, 7):
        ws.set_cell_style(row, i, table_footer_style)
    ws.set_cell_value(row, 1, len(reader.without_photo_list))

    filename = '{}-{}-organisation-data-quality.xlsx'.format(
        reader.date.strftime('%Y%m%d'), reader.organisation.id)

    return utils.make_excel_response(wb, filename)


class OrganisationDataQualityReader(object):
    def __init__(self, organisation, date):
        self.organisation = organisation
        self.date = date
        self._planned_and_date_overdue_sorted = None
        self._no_edit_or_updates_sorted = None
        self._need_funding_sorted = None
        self._without_photo_sorted = None

    @property
    def planned_and_date_overdue(self):
        return self.organisation.published_projects(only_public=False)\
            .status_active().filter(date_end_planned__lt=self.date)

    @property
    def planned_and_date_overdue_list(self):
        if self._planned_and_date_overdue_sorted is None:
            self._planned_and_date_overdue_sorted = _apply_sorting_by_country_and_project_id(
                self.planned_and_date_overdue)
        return self._planned_and_date_overdue_sorted

    @property
    def no_edit_or_updates(self):
        return self.organisation.published_projects(only_public=False)\
            .filter(last_modified_at__lt=(self.date - relativedelta(months=3)))

    @property
    def no_edit_or_updates_list(self):
        if self._no_edit_or_updates_sorted is None:
            self._no_edit_or_updates_sorted = _apply_sorting_by_country_and_project_id(
                self.no_edit_or_updates)
        return self._no_edit_or_updates_sorted

    @property
    def need_funding(self):
        return self.organisation.published_projects(only_public=False)\
            .filter(funds_needed__gt=5, status__in=[Project.STATUS_ACTIVE, Project.STATUS_COMPLETE])

    @property
    def need_funding_list(self):
        if self._need_funding_sorted is None:
            self._need_funding_sorted = _apply_sorting_by_country_and_project_id(self.need_funding)
        return self._need_funding_sorted

    @property
    def without_photo(self):
        return self.organisation.published_projects(only_public=False)\
            .filter(Q(current_image__isnull=True) | Q(current_image__exact=''))

    @property
    def without_photo_list(self):
        if self._without_photo_sorted is None:
            self._without_photo_sorted = _apply_sorting_by_country_and_project_id(self.without_photo)
        return self._without_photo_sorted


def _apply_sorting_by_country_and_project_id(queryset):
    by_country = {}
    no_country = 'zzz'
    for project in queryset.prefetch_related('locations', 'locations__country').all():
        countries = [getattr(l.country, 'name') for l in project.locations.all() if l.country]
        if not countries:
            if no_country not in by_country:
                by_country[no_country] = {}
            by_country[no_country][project.id] = project
        for country in countries:
            if country not in by_country:
                by_country[country] = {}
            by_country[country][project.id] = project

    sorted_list = []
    for country in sorted(by_country.keys()):
        for pid in sorted(by_country[country].keys()):
            p = by_country[country][pid]
            c = country if country != no_country else ''
            sorted_list.append((p, c))

    return sorted_list
