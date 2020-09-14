# -*- coding: utf-8 -*-

"""Akvo RSR is covered by the GNU Affero General Public License.

See more details in the license.txt file located at the root folder of the
Akvo RSR module. For additional details on the GNU license please
see < http://www.gnu.org/licenses/agpl.html >.
"""

from akvo.codelists.models import ActivityStatus
from akvo.rsr.models import Organisation
from akvo.utils import ObjectReaderProxy
from akvo.rsr.decorators import with_download_indicator
from datetime import datetime
from django.conf import settings
from django.contrib.auth.decorators import login_required
from django.db.models import Count, Sum
from django.db.models.functions import Trunc
from django.http import HttpResponse, HttpResponseBadRequest
from django.shortcuts import get_object_or_404
from django.template.loader import render_to_string
from django.urls import reverse
from pyexcelerate import Workbook, Style, Font, Color

from . import utils


class OrganisationProjectsOverviewReader(ObjectReaderProxy):
    def __init__(self, organisation):
        super().__init__(organisation)
        self._location = None

    @property
    def location(self):
        if self._location is None:
            location = self.primary_location
            country = location.country if location else None
            self._location = {
                'address_1': location.address_1 if location else '',
                'address_2': location.address_2 if location else '',
                'city': location.city if location else '',
                'state': location.state if location else '',
                'country': country.name if country else '',
            }
        return self._location

    @property
    def rsr_link(self):
        return 'https://{}{}?organisation={}'.format(
            settings.RSR_DOMAIN, reverse('project-directory'), self.id)

    @property
    def projects_count(self):
        return self.all_projects().count()

    @property
    def published_projects_count(self):
        return self.published_projects(only_public=False).count()

    @property
    def unpublished_projects_count(self):
        return self.projects.unpublished().distinct().count()

    @property
    def updates_count(self):
        return self.all_updates().count()

    @property
    def users_count(self):
        return self.all_users().distinct().count()

    @property
    def published_projects_funding(self):
        return self.published_projects(only_public=False)\
            .values('currency')\
            .annotate(total_budget=Sum('budget'))\
            .annotate(total_funds=Sum('funds'))\
            .annotate(total_funds_needed=Sum('funds_needed'))\
            .order_by('-total_budget', '-total_funds', '-total_funds_needed')

    @property
    def projects_by_activity_status(self):
        queryset = self.all_projects()\
            .values('iati_status')\
            .annotate(status_count=Count('id', distinct=True))\
            .order_by()

        return [
            {
                'status': _activity_status_name(it['iati_status']),
                'count': it['status_count']
            }
            for it in queryset
        ]

    @property
    def projects_per_year(self):
        return self.published_projects(only_public=False)\
            .annotate(start_year=Trunc('date_start_planned', 'year'))\
            .values('start_year').annotate(projects_count=Count('id', distinct=True))\
            .order_by('start_year')

    @property
    def projects_per_country(self):
        queryset = self.published_projects(only_public=False)\
            .values('locations__country__name')\
            .annotate(projects_count=Count('id', distinct=True))\
            .annotate(updates_count=Count('project_updates', distinct=True))\
            .order_by()

        return [
            {
                'country': it['locations__country__name'],
                'projects_count': it['projects_count'],
                'updates_count': it['updates_count'],
            }
            for it in queryset
        ]

    @property
    def published_projects_overview(self):
        queryset = self.published_projects(only_public=False)\
            .prefetch_related('locations', 'locations__country', 'keywords')\
            .annotate(updates_count=Count('project_updates'))

        by_location = {}
        for project in queryset:
            location = ', '.join([
                loc.country.name
                for loc
                in project.locations.distinct('country__name').order_by('country__name')
                if loc.country
            ])
            location_key = location or 'zzz'
            if location_key not in by_location:
                by_location[location_key] = {}
            by_location[location_key][project.id] = location, utils.ProjectProxy(project)

        result = []
        for location_key, by_pk in sorted(by_location.items()):
            for pk, value in sorted(by_pk.items()):
                result.append(value)

        return result


def _activity_status_name(value, version=settings.IATI_VERSION):
    if not value:
        return 'None'
    status = ActivityStatus.objects.get(code=value, version__code=version)
    return status.name if status else 'None'


@login_required
@with_download_indicator
def render_report(request, org_id):
    organisation = get_object_or_404(Organisation, pk=org_id)
    reader = OrganisationProjectsOverviewReader(organisation)

    format = request.GET.get('format')

    if format == 'pdf':
        return _render_pdf(reader, True if request.GET.get('show-html', '') else False)
    elif format == 'excel':
        return _render_excel(reader)
    else:
        return HttpResponseBadRequest('Unsupported format.')


def _render_pdf(reader, show_html=True):
    current_date = datetime.now()
    html = render_to_string(
        'reports/organisation-projects-overview.html',
        context={
            'reader': reader,
            'current_date': current_date
        }
    )

    if show_html:
        return HttpResponse(html)

    filename = '{}-{}-organisation-projects-overview.pdf'.format(
        current_date.strftime('%Y%m%d'), reader.id)

    return utils.make_pdf_response(html, filename)


def _render_excel(reader):
    section_title_style = Style(font=Font(size=14, bold=True))
    table_header_style = Style(font=Font(bold=True))

    wb = Workbook()
    ws = wb.new_sheet('Sheet0')
    ws.set_col_style(1, Style(size=35))
    ws.set_col_style(2, Style(size=19))
    ws.set_col_style(3, Style(size=26))
    ws.set_col_style(4, Style(size=56))
    ws.set_col_style(5, Style(size=11))
    ws.set_col_style(6, Style(size=5))
    ws.set_col_style(7, Style(size=10))
    ws.set_col_style(8, Style(size=12))
    ws.set_col_style(9, Style(size=12))
    ws.set_col_style(10, Style(size=21))
    ws.set_col_style(11, Style(size=7))
    ws.set_col_style(12, Style(size=16))
    ws.set_col_style(13, Style(size=17))

    # r1
    ws.range('A1', 'B1').merge()
    ws.set_cell_style(1, 1, Style(font=Font(size=18, bold=True, color=Color(128, 128, 128))))
    ws.set_cell_value(1, 1, 'RSR Project overview report')

    # r2
    ws.set_row_style(2, Style(size=24))
    ws.range('A2', 'C2').merge()
    ws.set_cell_style(2, 1, section_title_style)
    ws.set_cell_value(2, 1, reader.name)

    # r3
    ws.range('B3', 'C3').merge()
    ws.set_cell_value(3, 2, reader.location['address_1'])

    # r4
    ws.range('B4', 'C4').merge()
    ws.set_cell_value(4, 2, reader.location['address_2'])

    # r5
    ws.range('B5', 'C5').merge()
    ws.set_cell_value(5, 2, reader.location['city'])

    # r6
    ws.range('B6', 'C6').merge()
    ws.set_cell_value(6, 2, reader.location['state'])

    # r7
    ws.range('B7', 'C7').merge()
    ws.set_cell_value(7, 2, reader.location['country'])

    # r8
    ws.set_cell_value(8, 2, 'Phone:')
    ws.set_cell_value(8, 3, reader.phone)

    # r9
    ws.set_cell_value(9, 2, 'Website:')
    ws.set_cell_value(9, 3, reader.url)

    # r10
    ws.set_cell_value(10, 2, 'RSR overview link:')
    ws.set_cell_value(10, 3, reader.rsr_link)

    # r11
    ws.set_cell_style(11, 1, section_title_style)
    ws.set_cell_value(11, 1, 'Statistics')

    # r12
    for i in range(1, 3):
        ws.set_cell_style(12, i, table_header_style)
    ws.set_cell_value(12, 1, 'Name')
    ws.set_cell_value(12, 2, 'Count')

    # r13
    ws.set_cell_value(13, 1, 'Total number of projects')
    ws.set_cell_value(13, 2, reader.projects_count)

    # r14
    ws.set_cell_value(14, 1, 'Published projects')
    ws.set_cell_value(14, 2, reader.published_projects_count)

    # r15
    ws.set_cell_value(15, 1, 'Unpublished projects')
    ws.set_cell_value(15, 2, reader.unpublished_projects_count)

    # r16
    ws.set_cell_value(16, 1, 'Total number of updates (published)')
    ws.set_cell_value(16, 2, reader.updates_count)

    # r17
    ws.set_cell_value(17, 1, 'Users')
    ws.set_cell_value(17, 2, reader.users_count)

    # r18
    ws.set_cell_style(18, 1, section_title_style)
    ws.set_cell_value(18, 1, 'Published project funding')

    # r19
    for i in range(1, 5):
        ws.set_cell_style(19, i, table_header_style)
    ws.set_cell_value(19, 1, 'Currency')
    ws.set_cell_value(19, 2, 'Budget')
    ws.set_cell_value(19, 3, 'Funds')
    ws.set_cell_value(19, 4, 'Needed')

    # r20
    row = 20
    for f in reader.published_projects_funding:
        ws.set_cell_value(row, 1, f['currency'])
        ws.set_cell_value(row, 2, f['total_budget'])
        ws.set_cell_value(row, 3, f['total_funds'])
        ws.set_cell_value(row, 4, f['total_funds_needed'])
        row += 1

    # r21
    ws.set_cell_style(row, 1, section_title_style)
    ws.set_cell_value(row, 1, 'Projects by status')
    row += 1

    # r22
    for i in range(1, 3):
        ws.set_cell_style(row, i, table_header_style)
    ws.set_cell_value(row, 1, 'Status')
    ws.set_cell_value(row, 2, 'Count')
    row += 1

    # r23
    for s in reader.projects_by_activity_status:
        ws.set_cell_value(row, 1, s['status'])
        ws.set_cell_value(row, 2, s['count'])
        row += 1

    # r24
    ws.set_cell_style(row, 1, section_title_style)
    ws.set_cell_value(row, 1, 'Published projects by start year')
    row += 1

    # r25
    for i in range(1, 3):
        ws.set_cell_style(row, i, table_header_style)
    ws.set_cell_value(row, 1, 'Planned start year')
    ws.set_cell_value(row, 2, 'Count')
    row += 1

    # r26
    for p in reader.projects_per_year:
        ws.set_cell_value(row, 1, p['start_year'].strftime('%Y') if p['start_year'] else '')
        ws.set_cell_value(row, 2, p['projects_count'])
        row += 1

    # r27
    ws.set_cell_style(row, 1, section_title_style)
    ws.set_cell_value(row, 1, 'Published project statistics by country')
    row += 1

    # r28
    for i in range(1, 4):
        ws.set_cell_style(row, i, table_header_style)
    ws.set_cell_value(row, 1, 'Country')
    ws.set_cell_value(row, 2, 'Project count')
    ws.set_cell_value(row, 3, 'Update count')
    row += 1

    # r29
    for p in reader.projects_per_country:
        ws.set_cell_value(row, 1, p['country'])
        ws.set_cell_value(row, 2, p['projects_count'])
        ws.set_cell_value(row, 3, p['updates_count'])
        row += 1

    # r30
    ws.set_cell_style(row, 1, section_title_style)
    ws.set_cell_value(row, 1, 'Published project overview')
    row += 1

    # r31
    ws.set_cell_value(row, 1, 'Sorted by countries and id')
    row += 1

    # r32
    for i in range(1, 14):
        ws.set_cell_style(row, i, table_header_style)
    ws.set_cell_value(row, 1, 'Countries')
    ws.set_cell_value(row, 2, 'Title')
    ws.set_cell_value(row, 3, 'Subtitle')
    ws.set_cell_value(row, 4, 'Id')
    ws.set_cell_value(row, 5, 'Status')
    ws.set_cell_value(row, 6, '¤')
    ws.set_cell_value(row, 7, 'Budget')
    ws.set_cell_value(row, 8, 'Planned start date')
    ws.set_cell_value(row, 9, 'Planned end date')
    ws.set_cell_value(row, 10, 'IATI activity id')
    ws.set_cell_value(row, 11, '# of updates')
    ws.set_cell_value(row, 12, 'Keywords')
    ws.set_cell_value(row, 13, 'Project URL')
    row += 1

    # r33
    for country, project in reader.published_projects_overview:
        ws.set_cell_value(row, 1, country)
        ws.set_cell_value(row, 2, project.title)
        ws.set_cell_value(row, 3, project.subtitle)
        ws.set_cell_value(row, 4, project.id)
        ws.set_cell_value(row, 5, project.iati_status)
        ws.set_cell_value(row, 6, project.currency)
        ws.set_cell_value(row, 7, project.budget)
        ws.set_cell_value(row, 8, project.date_start_planned)
        ws.set_cell_value(row, 9, project.date_end_planned)
        ws.set_cell_value(row, 10, project.iati_activity_id)
        ws.set_cell_value(row, 11, project.updates_count)
        ws.set_cell_value(row, 12, project.keyword_labels)
        ws.set_cell_value(row, 13, project.absolute_url)
        row += 1

    filename = '{}-{}-organisation-projects-overview.xlsx'.format(
        datetime.now().strftime('%Y%m%d'), reader.id)

    return utils.make_excel_response(wb, filename)
