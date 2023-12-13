# -*- coding: utf-8 -*-

"""Akvo RSR is covered by the GNU Affero General Public License.

See more details in the license.txt file located at the root folder of the
Akvo RSR module. For additional details on the GNU license please
see < http://www.gnu.org/licenses/agpl.html >.
"""

from akvo.rsr.models import Project, Country, Organisation, IndicatorPeriod, ProjectHierarchy, User
from akvo.rsr.staticmap import get_staticmap_url, Coordinate, Size
from akvo.rsr.decorators import with_download_indicator
from akvo.utils import to_bool
from datetime import datetime
from django.contrib.auth.decorators import login_required
from django.db.models import Q
from django.http import HttpResponse, HttpResponseBadRequest
from django.shortcuts import get_object_or_404
from django.template.loader import render_to_string

from . import utils

ORG_PROJECTS_REPORT_NAME = 'organisation_projects_results_indicators_map_overview'


@login_required
def add_org_projects_email_report_job(request, program_id):
    program = get_object_or_404(Project, pk=program_id)
    country = request.GET.get('country', '').strip()
    if not country:
        return HttpResponseBadRequest('Please provide the country code!')
    show_comment = request.GET.get('comment', '').strip()
    start_date = request.GET.get('period_start', '').strip()
    end_date = request.GET.get('period_end', '').strip()
    payload = {
        'program_id': program.id,
        'country': country,
        'show_comment': show_comment,
        'start_date': start_date,
        'end_date': end_date,
    }
    recipient = request.user.email

    return utils.make_async_email_report_task(
        handle_org_projects_email_report,
        payload,
        recipient,
        ORG_PROJECTS_REPORT_NAME
    )


def handle_org_projects_email_report(params, recipient):
    country = params.get('country')
    show_comment = to_bool(params.get('comment', ''))
    start_date = utils.parse_date(params.get('period_start', ''), datetime(1900, 1, 1))
    end_date = utils.parse_date(params.get('period_end', ''), datetime(2999, 12, 31))

    country = Country.objects.get(iso_code=country)
    project_hierarchy = ProjectHierarchy.objects.get(root_project=params['program_id'])
    organisation = Organisation.objects.prefetch_related(
        'projects',
        'projects__results',
        'projects__results__indicators',
        'projects__results__indicators__periods'
    ).get(pk=project_hierarchy.organisation.id)
    projects = organisation.all_projects().filter(primary_location__country=country)
    user = User.objects.get(email=recipient)
    coordinates = [
        Coordinate(p.primary_location.latitude, p.primary_location.longitude)
        for p in projects if p.primary_location
    ]

    now = datetime.today()
    html = render_to_string(
        'reports/organisation-projects-results-indicators-map-overview.html',
        context={
            'title': 'Results and indicators overview for projects in {}'.format(country.name),
            'staticmap': get_staticmap_url(coordinates, Size(900, 600)),
            'projects': [build_view_object(p, start_date, end_date) for p in projects],
            'show_comment': show_comment,
            'today': now.strftime('%d-%b-%Y'),
        }
    )

    filename = '{}-{}-{}-projects-results-indicators-overview.pdf'.format(
        now.strftime('%Y%m%d%H%M%S'), organisation.id, country.iso_code
    )
    utils.save_pdf_and_send_email(html, user, filename)


@login_required
@with_download_indicator
def render_project_results_indicators_map_overview(request, project_id):
    return _render_project_report(request, project_id, with_map=True)


@login_required
@with_download_indicator
def render_project_results_indicators_overview(request, project_id):
    return _render_project_report(request, project_id, with_disaggregation=True)


def build_view_object(project, start_date=None, end_date=None):
    results = {}
    periods = IndicatorPeriod.objects\
        .select_related('indicator', 'indicator__result')\
        .prefetch_related('disaggregations')\
        .filter(indicator__result__project=project)
    if start_date and end_date:
        periods = periods.filter(
            Q(period_start__isnull=True) | Q(period_start__gte=start_date),
            Q(period_end__isnull=True) | Q(period_end__lte=end_date)
        )
    for period in periods:
        indicator = period.indicator
        result = indicator.result
        if result.id not in results:
            results[result.id] = {'item': result, 'indicators': {}}
        if indicator.id not in results[result.id]['indicators']:
            results[result.id]['indicators'][indicator.id] = {'item': indicator, 'periods': []}
        results[result.id]['indicators'][indicator.id]['periods'].append(period)
    return utils.ProjectProxy(project, results)


def _render_project_report(request, project_id, with_map=False, with_disaggregation=False):
    show_comment = to_bool(request.GET.get('comment', '').strip())
    start_date = utils.parse_date(request.GET.get('period_start', '').strip(), datetime(1900, 1, 1))
    end_date = utils.parse_date(request.GET.get('period_end', '').strip(), datetime(2999, 12, 31))

    project = get_object_or_404(
        Project.objects.prefetch_related(
            'locations',
            'partners',
            'related_projects',
            'related_to_projects',
            'results',
            'results__indicators',
            'results__indicators__periods',
            'results__indicators__periods__disaggregations'
        ),
        pk=project_id
    )
    project_location = project.primary_location
    coordinates = None

    if with_map:
        locations = project.locations.all()
        coordinates = [Coordinate(loc.latitude, loc.longitude) for loc in locations if loc]

    now = datetime.today()
    project_view = build_view_object(project, start_date, end_date)

    html = render_to_string(
        'reports/project-results-indicators-map-overview.html',
        context={
            'project': project_view,
            'location': ", ".join([
                _f
                for _f
                in [project_location.city, getattr(project_location.country, 'name', None)]
                if _f
            ]) if project_location else "",
            'staticmap': get_staticmap_url(coordinates, Size(900, 600)) if with_map else None,
            'show_comment': show_comment,
            'show_disaggregations': with_disaggregation,
            'use_indicator_target': project_view.use_indicator_target,
            'today': now.strftime('%d-%b-%Y'),
        }
    )

    if request.GET.get('show-html', ''):
        return HttpResponse(html)

    filename = '{}-{}-results-indicators{}-overview.pdf'.format(
        now.strftime('%Y%b%d'), project.id, '-map' if with_map else '')

    return utils.make_pdf_response(html, filename)
