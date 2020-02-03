# -*- coding: utf-8 -*-

"""Akvo RSR is covered by the GNU Affero General Public License.

See more details in the license.txt file located at the root folder of the
Akvo RSR module. For additional details on the GNU license please
see < http://www.gnu.org/licenses/agpl.html >.
"""

import os
import pdfkit

from akvo.rsr.models import Project, Country, Organisation
from akvo.rsr.staticmap import get_staticmap_url, Coordinate, Size
from datetime import datetime
from dateutil.parser import parse, ParserError
from decimal import Decimal, InvalidOperation, DivisionByZero
from django.contrib.auth.decorators import login_required
from django.db.models import Q
from django.http import HttpResponse, HttpResponseBadRequest
from django.shortcuts import get_object_or_404
from django.template.loader import render_to_string


DEFAULT_PDF_OPTIONS = {
    'page-size': 'A4',
    'orientation': 'Portrait',
    'margin-left': '0.28in',
    'margin-top': '1in',
    'margin-right': '0.28in',
    'margin-bottom': '1in',
}


def check(request):
    is_reports_container = os.getenv('IS_REPORTS_CONTAINER', '').strip()
    is_requesting_pdf = request.GET.get('pdf', None)

    if not is_requesting_pdf:
        return HttpResponse('OK' if is_reports_container else '')

    return _make_pdf_response(
        render_to_string('reports/checkz.html', {'is_reports_container': is_reports_container}),
        filename='test-report.pdf'
    )


@login_required
def render_organisation_projects_results_indicators_map_overview(request, org_id):
    country = request.GET.get('country', '').strip()
    if not country:
        return HttpResponseBadRequest('Please provide the country code!')

    show_comment = True if request.GET.get('comment', '').strip() == 'true' else False
    start_date = _parse_date(request.GET.get('start_date', '').strip(), datetime(1900, 1, 1))
    end_date = _parse_date(request.GET.get('end_date', '').strip(), datetime(2999, 12, 31))

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
    ]

    html = render_to_string(
        'reports/organisation-projects-results-indicators-map-overview.html',
        context={
            'title': 'Results and indicators overview for projects in {}'.format(country.name),
            'staticmap': get_staticmap_url(coordinates, Size(900, 600)),
            'projects': [
                {
                    'id': p.id,
                    'title': p.title,
                    'results': _transform_project_results(p, start_date, end_date)
                }
                for p
                in projects
            ],
            'show_comment': show_comment,
        }
    )

    if request.GET.get('show-html', ''):
        return HttpResponse(html)

    now = datetime.today()

    return _make_pdf_response(
        html,
        options={
            'footer-left': 'Akvo RSR Report {}'.format(now.strftime('%d-%b-%Y')),
            'footer-right': '[page]',
            'footer-font-size': 8,
            'footer-font-name': 'Roboto Condensed',
            'footer-spacing': 10,
        },
        filename='{}-{}-{}-projects-results-indicators-overview.pdf'.format(
            now.strftime('%Y%b%d'), organisation.id, country.iso_code
        )
    )


@login_required
def render_project_results_indicators_map_overview(request, project_id):
    show_comment = True if request.GET.get('comment', '').strip() == 'true' else False
    start_date = _parse_date(request.GET.get('start_date', '').strip(), datetime(1900, 1, 1))
    end_date = _parse_date(request.GET.get('end_date', '').strip(), datetime(2999, 12, 31))

    project = get_object_or_404(
        Project.objects.prefetch_related(
            'partners',
            'related_projects',
            'related_to_projects',
            'results',
            'results__indicators',
            'results__indicators__periods'
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
    coordinates = [Coordinate(l.latitude, l.longitude) for l in locations]

    html = render_to_string(
        'reports/project-results-indicators-map-overview.html',
        context={
            'project': project,
            'location': ", ".join([_f for _f in [project_location.city, getattr(project_location.country, 'name', None)] if _f]),
            'staticmap': get_staticmap_url(coordinates, Size(900, 600)),
            'results': _transform_project_results(project, start_date, end_date),
            'show_comment': show_comment,
        }
    )

    if request.GET.get('show-html', ''):
        return HttpResponse(html)

    now = datetime.today()

    return _make_pdf_response(
        html,
        options={
            'footer-left': 'Akvo RSR Report {}'.format(now.strftime('%d-%b-%Y')),
            'footer-right': '[page]',
            'footer-font-size': 8,
            'footer-font-name': 'Roboto Condensed',
            'footer-spacing': 10,
        },
        filename='{}-{}-results-indicators-overview.pdf'.format(now.strftime('%Y%b%d'), project.id)
    )


def _make_pdf_response(html, options={}, filename='reports.pdf'):
    opts = DEFAULT_PDF_OPTIONS.copy()
    opts.update(options)

    pdf = pdfkit.from_string(html, False, options=opts)
    response = HttpResponse(pdf, content_type='application/pdf')
    response['Content-Disposition'] = 'attachment; filename="' + filename + '"'

    return response


def _transform_project_results(project, start_date, end_date):
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


def _transform_period(period, project, is_eutf_descendant):
    actual_value = _force_decimal(period.actual_value)
    target_value = _force_decimal(period.target_value)
    total = _calculate_percentage(actual_value, target_value)
    grade = 'low' if total <= 49 else 'high' if total >= 85 else 'medium'

    return {
        'period_start': _get_period_start(period, project, is_eutf_descendant),
        'period_end': _get_period_end(period, project, is_eutf_descendant),
        'actual_value': '{:20,.2f}'.format(actual_value),
        'target_value': '{:20,.2f}'.format(target_value),
        'actual_comment': period.actual_comment,
        'grade': grade,
        'total': '{}%'.format(total),
    }


def _calculate_percentage(part, whole):
    try:
        return int(round(part / whole * 100, 0))
    except (InvalidOperation, TypeError, DivisionByZero):
        return 0


def _get_period_start(period, project, is_eutf_descendant):
    if not is_eutf_descendant:
        return period.period_start

    if project.date_start_actual:
        return project.date_start_actual

    return project.date_start_planned


def _get_period_end(period, project, is_eutf_descendant):
    if not is_eutf_descendant:
        return period.period_end

    if project.date_end_actual:
        return project.date_end_actual

    return project.date_end_planned


def _force_decimal(value):
    try:
        return Decimal(value)
    except (InvalidOperation, TypeError):
        return Decimal(0)


def _parse_date(string, default=None):
    try:
        return parse(string)
    except ParserError:
        return default
