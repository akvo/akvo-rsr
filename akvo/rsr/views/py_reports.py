# -*- coding: utf-8 -*-

"""Akvo RSR is covered by the GNU Affero General Public License.

See more details in the license.txt file located at the root folder of the
Akvo RSR module. For additional details on the GNU license please
see < http://www.gnu.org/licenses/agpl.html >.
"""

import os
import pdfkit
from django.http import HttpResponse
from django.template.loader import render_to_string


def check(request):
    is_reports_container = os.getenv('DJANGO_PORT', None) == '9000'
    is_requesting_pdf = request.GET.get('pdf', None)

    if not is_requesting_pdf:
        return HttpResponse('OK' if is_reports_container else '')

    options = {
        'page-size': 'A4',
        'orientation': 'Landscape',
    }
    html = render_to_string('reports/checkz.html', {'is_reports_container': is_reports_container})
    pdf = pdfkit.from_string(html, False, options=options)
    filename = 'test-report.pdf'
    response = HttpResponse(pdf, content_type='application/pdf')
    response['Content-Disposition'] = 'attachment; filename="' + filename + '"'

    return response
