# -*- coding: utf-8 -*-

"""Akvo RSR is covered by the GNU Affero General Public License.

See more details in the license.txt file located at the root folder of the
Akvo RSR module. For additional details on the GNU license please
see < http://www.gnu.org/licenses/agpl.html >.
"""

import os
import pdfkit

from decimal import Decimal, InvalidOperation, DivisionByZero
from akvo.rsr.models import Project, Country, Organisation
from akvo.rsr.staticmap import get_staticmap_url, Coordinate, Size
from datetime import date
from django.contrib.auth.decorators import login_required
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
                {'title': p.title, 'results': _transform_project_results(p)}
                for p
                in projects
            ]
        }
    )

    if request.GET.get('show-html', ''):
        return HttpResponse(html)

    now = date.today()

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
    location = project.primary_location

    html = render_to_string(
        'reports/project-results-indicators-map-overview.html',
        context={
            'project': project,
            'location': ", ".join(filter(None, [location.city, getattr(location.country, 'name', None)])),
            'staticmap': get_staticmap_url([Coordinate(location.latitude, location.longitude)], Size(900, 600), zoom=8),
            'results': _transform_project_results(project)
        }
    )

    if request.GET.get('show-html', ''):
        return HttpResponse(html)

    now = date.today()

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


def _transform_project_results(project):
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
        in project.results.all()
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
