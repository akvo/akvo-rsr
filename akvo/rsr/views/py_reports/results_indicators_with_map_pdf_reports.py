# -*- coding: utf-8 -*-

"""Akvo RSR is covered by the GNU Affero General Public License.

See more details in the license.txt file located at the root folder of the
Akvo RSR module. For additional details on the GNU license please
see < http://www.gnu.org/licenses/agpl.html >.
"""

from akvo.rsr.models import Project, Country, Organisation
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
            'projects': [
                {
                    'id': p.id,
                    'title': p.title,
                    'subtitle': p.subtitle,
                    'results': _transform_project_results(p, start_date, end_date)
                }
                for p
                in projects
            ],
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
    return _render_project_report(request, project_id)


def _render_project_report(request, project_id, with_map=False):
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
            'project': project,
            'location': ", ".join([
                _f
                for _f
                in [project_location.city, getattr(project_location.country, 'name', None)]
                if _f
            ]) if project_location else "",
            'staticmap': get_staticmap_url(coordinates, Size(900, 600)) if with_map else None,
            'results': _transform_project_results(project, start_date, end_date, not with_map),
            'show_comment': show_comment,
            'today': now.strftime('%d-%b-%Y'),
        }
    )

    if request.GET.get('show-html', ''):
        return HttpResponse(html)

    filename = '{}-{}-results-indicators{}-overview.pdf'.format(
        now.strftime('%Y%b%d'), project.id, '-map' if with_map else '')

    return utils.make_pdf_response(html, filename)


def _transform_project_results(project, start_date, end_date, with_disaggregation=False):
    is_eutf_descendant = project.in_eutf_hierarchy
    return [
        {
            'title': r.title.strip(),
            'indicators': [
                {
                    'title': i.title,
                    'baseline_value': '{}{}'.format(i.baseline_value, '%' if i.measure == '2' else ''),
                    'baseline_year': '({})'.format(i.baseline_year) if i.baseline_year else '',
                    'baseline_comment': i.baseline_comment,
                    'periods': [
                        _transform_period(p, project, is_eutf_descendant)
                        for p
                        in i.periods.all()
                    ],
                    'disaggregations': _transform_disaggregations(i) if with_disaggregation else {},
                }
                for i
                in r.indicators.all()
            ]
        }
        for r
        in project.results.filter(
            Q(indicators__periods__period_start__isnull=True) | Q(indicators__periods__period_start__gte=start_date),
            Q(indicators__periods__period_end__isnull=True) | Q(indicators__periods__period_end__lte=end_date)
        ).all()
    ]


def _transform_disaggregations(indicator):
    disaggregations = {}

    for period in indicator.periods.all():
        for disaggregation in period.disaggregations.all():
            category = disaggregation.dimension_value.name.name
            type = disaggregation.dimension_value.value
            if category not in disaggregations:
                disaggregations[category] = {}
            if type not in disaggregations[category]:
                disaggregations[category][type] = 0

            if disaggregation.value:
                disaggregations[category][type] += disaggregation.value

    return disaggregations


def _transform_period(period, project, is_eutf_descendant):
    actual_value = utils.force_decimal(period.actual_value)
    target_value = utils.force_decimal(period.target_value)
    total = utils.calculate_percentage(actual_value, target_value)
    grade = 'low' if total <= 49 else 'high' if total >= 85 else 'medium'

    return {
        'period_start': utils.get_period_start(period, is_eutf_descendant),
        'period_end': utils.get_period_end(period, is_eutf_descendant),
        'actual_value': actual_value,
        'target_value': target_value,
        'actual_comment': "\n\n".join(period.actual_comment.split(' | ')),
        'grade': grade,
        'total': '{}%'.format(total),
    }
