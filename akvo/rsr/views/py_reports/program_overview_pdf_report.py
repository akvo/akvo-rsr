# -*- coding: utf-8 -*-

"""Akvo RSR is covered by the GNU Affero General Public License.

See more details in the license.txt file located at the root folder of the
Akvo RSR module. For additional details on the GNU license please
see < http://www.gnu.org/licenses/agpl.html >.
"""

from akvo.rsr.models import Project, IndicatorPeriod, EmailReportJob
from akvo.rsr.project_overview import get_periods_with_contributors, is_aggregating_targets, merge_unique
from akvo.rsr.staticmap import get_staticmap_url, Coordinate, Size
from akvo.rsr.decorators import with_download_indicator
from datetime import datetime
from dateutil.relativedelta import relativedelta
from django.contrib.auth.decorators import login_required
from django.db.models import Q
from django.http import HttpResponse
from django.shortcuts import get_object_or_404
from django.template.loader import render_to_string

from . import utils


class ProgramProxy(utils.ProjectProxy):
    def __init__(self, project, results={}):
        super().__init__(project, results)
        self._locations = None
        self._level1_contributors = None
        self._level2_contributors = None

    @property
    def locations(self):
        if self._locations is None:
            self._locations = []
            for result in self.results:
                for indicator in result.indicators:
                    for period in indicator.periods:
                        for contributor in period.contributors:
                            locations = merge_unique([subcontributor.location for subcontributor in contributor.contributors], [contributor.location])
                            self._locations = merge_unique(self._locations, locations)
        return self._locations

    @property
    def level1_contributors(self):
        if self._level1_contributors is None:
            self._level1_contributors = []
            for result in self.results:
                for indicator in result.indicators:
                    for period in indicator.periods:
                        projects = [contributor.project for contributor in period.contributors]
                        self._level1_contributors = merge_unique(self._level1_contributors, projects)
        return self._level1_contributors

    @property
    def level2_contributors(self):
        if self._level2_contributors is None:
            self._level2_contributors = []
            for result in self.results:
                for indicator in result.indicators:
                    for period in indicator.periods:
                        for contributor in period.contributors:
                            projects = [subcontributor.project for subcontributor in contributor.contributors]
                            self._level2_contributors = merge_unique(self._level2_contributors, projects)
        return self._level2_contributors


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
        return ProgramProxy(project)

    periods_with_contribution = get_periods_with_contributors(periods, is_aggregating_targets(project))

    return utils.make_project_proxies(periods_with_contribution, ProgramProxy)[0]


@login_required
def add_email_report_job(request, program_id):
    user = request.user
    EmailReportJob.objects.create(
        report='program_overview_pdf_report',
        payload={
            'program_id': program_id,
            'period_start': request.GET.get('period_start', '').strip(),
            'period_end': request.GET.get('period_end', '').strip(),
        },
        recipient=user.email
    )
    return HttpResponse('The report you requested will be sent to your email address', status=202)


def email_report(params, recipient):
    now = datetime.today()
    program = Project.objects.prefetch_related('results').get(pk=params['program_id'])
    start_date = utils.parse_date(params.get('period_start', ''))
    end_date = utils.parse_date(params.get('period_end', ''))
    program_view = build_view_object(program, start_date or datetime(1900, 1, 1), end_date or (datetime.today() + relativedelta(years=10)))
    coordinates = [
        Coordinate(loc.latitude, loc.longitude)
        for loc in program_view.locations
        if loc and loc.latitude and loc.longitude
    ]
    html = render_to_string('reports/program-overview.html', context={
        'program': program_view,
        'staticmap': get_staticmap_url(coordinates, Size(900, 600)),
        'start_date': start_date,
        'end_date': end_date,
    })
    filename = '{}-program-{}-overview.pdf'.format(now.strftime('%Y%b%d'), program.id)
    utils.send_pdf_report(html, recipient, filename)


@login_required
@with_download_indicator
def render_report(request, program_id):
    now = datetime.today()

    program = get_object_or_404(Project.objects.prefetch_related('results'), pk=program_id)
    start_date = utils.parse_date(request.GET.get('period_start', '').strip())
    end_date = utils.parse_date(request.GET.get('period_end', '').strip())

    program_view = build_view_object(program, start_date or datetime(1900, 1, 1), end_date or (datetime.today() + relativedelta(years=10)))

    coordinates = [
        Coordinate(loc.latitude, loc.longitude)
        for loc in program_view.locations
        if loc and loc.latitude and loc.longitude
    ]

    html = render_to_string('reports/program-overview.html', context={
        'program': program_view,
        'staticmap': get_staticmap_url(coordinates, Size(900, 600)),
        'start_date': start_date,
        'end_date': end_date,
    })

    if request.GET.get('show-html', ''):
        return HttpResponse(html)

    filename = '{}-program-{}-overview.pdf'.format(now.strftime('%Y%b%d'), program.id)

    return utils.make_pdf_response(html, filename)
