# -*- coding: utf-8 -*-

"""Akvo RSR is covered by the GNU Affero General Public License.

See more details in the license.txt file located at the root folder of the
Akvo RSR module. For additional details on the GNU license please
see < http://www.gnu.org/licenses/agpl.html >.
"""

import pdfkit

from akvo.rsr.models import Project
from datetime import date
from django.contrib.auth.decorators import login_required
from django.http import HttpResponse
from django.shortcuts import get_object_or_404
from django.template.loader import render_to_string


@login_required
def render_pdf(request, project_id):
    project = get_object_or_404(
        Project.objects.prefetch_related(
            'partners',
            'related_projects',
            'related_to_projects',
            'results',
            'project_updates'
        ),
        pk=project_id
    )
    html = render_to_string('reports/project.html', {'project': project})

    if request.GET.get('show-html', ''):
        response = HttpResponse(html)
    else:
        options = {
            'page-size': 'A4',
            'orientation': 'Portrait',
            'margin-left': '0.28in',
            'margin-top': '1in',
            'margin-right': '0.28in',
            'margin-bottom': '1in',
            'footer-left': 'Akvo RSR Report {}'.format(date.today().strftime('%d-%b-%Y')),
            'footer-right': '[page]',
            'footer-font-size': 8,
            'footer-font-name': 'Roboto Condensed',
            'footer-spacing': 10,
        }
        pdf = pdfkit.from_string(html, False, options=options)
        filename = 'project-report.pdf'
        response = HttpResponse(pdf, content_type='application/pdf')
        response['Content-Disposition'] = 'attachment; filename="' + filename + '"'

    return response
