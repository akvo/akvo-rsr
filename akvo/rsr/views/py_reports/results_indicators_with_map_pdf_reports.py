# -*- coding: utf-8 -*-

"""Akvo RSR is covered by the GNU Affero General Public License.

See more details in the license.txt file located at the root folder of the
Akvo RSR module. For additional details on the GNU license please
see < http://www.gnu.org/licenses/agpl.html >.
"""

from akvo.rsr.models import Project, Country, Organisation, IndicatorPeriod
from akvo.rsr.staticmap import get_staticmap_url, Coordinate, Size
from datetime import datetime
from django.contrib.auth.decorators import login_required
from django.db.models import Q
from django.http import HttpResponse, HttpResponseBadRequest
from django.shortcuts import get_object_or_404
from django.template.loader import render_to_string

from . import utils


@login_required
def render_organisation_projects_results_indicators_map_overview(request, org_id):
    country = request.GET.get('country', '').strip()
    if not country:
        return HttpResponseBadRequest('Please provide the country code!')

    show_comment = True if request.GET.get('comment', '').strip() == 'true' else False
    start_date = utils.parse_date(request.GET.get('start_date', '').strip(), datetime(1900, 1, 1))
    end_date = utils.parse_date(request.GET.get('end_date', '').strip(), datetime(2999, 12, 31))

    country = get_object_or_404(Country, iso_code=country)
    organisation = get_object_or_404(
        Organisation.objects.prefetch_related(
            'projects',
            'projects__results',
            'projects__results__indicators',
            'projects__results__indicators__periods'
        ),
        pk=org_id
    )
    projects = organisation.all_projects().filter(primary_location__country=country)
    coordinates = [
        Coordinate(p.primary_location.latitude, p.primary_location.longitude)
        for p
        in projects
        if p.primary_location
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

    if request.GET.get('show-html', ''):
        return HttpResponse(html)

    filename = '{}-{}-{}-projects-results-indicators-overview.pdf'.format(
        now.strftime('%Y%b%d'), organisation.id, country.iso_code
    )

    return utils.make_pdf_response(html, filename)


@login_required
def render_project_results_indicators_map_overview(request, project_id):
    return _render_project_report(request, project_id, with_map=True)


@login_required
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
    show_comment = True if request.GET.get('comment', '').strip() == 'true' else False
    start_date = utils.parse_date(request.GET.get('start_date', '').strip(), datetime(1900, 1, 1))
    end_date = utils.parse_date(request.GET.get('end_date', '').strip(), datetime(2999, 12, 31))

    project = get_object_or_404(
        Project.objects.prefetch_related(
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
    locations = [project_location]
    if project.parents().count():
        locations.append(project.parents().first().primary_location)
    if project.children().count():
        for child in project.children_all().published():
            locations.append(child.primary_location)

    if with_map:
        coordinates = [Coordinate(l.latitude, l.longitude) for l in locations if l]

    now = datetime.today()

    html = render_to_string(
        'reports/project-results-indicators-map-overview.html',
        context={
            'project': build_view_object(project, start_date, end_date),
            'location': ", ".join([
                _f
                for _f
                in [project_location.city, getattr(project_location.country, 'name', None)]
                if _f
            ]) if project_location else "",
            'staticmap': get_staticmap_url(coordinates, Size(900, 600)) if with_map else None,
            'show_comment': show_comment,
            'show_disaggregations': with_disaggregation,
            'today': now.strftime('%d-%b-%Y'),
        }
    )

    if request.GET.get('show-html', ''):
        return HttpResponse(html)

    filename = '{}-{}-results-indicators{}-overview.pdf'.format(
        now.strftime('%Y%b%d'), project.id, '-map' if with_map else '')

    return utils.make_pdf_response(html, filename)
