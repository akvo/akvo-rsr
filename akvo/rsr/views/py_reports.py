# -*- coding: utf-8 -*-

"""Akvo RSR is covered by the GNU Affero General Public License.

See more details in the license.txt file located at the root folder of the
Akvo RSR module. For additional details on the GNU license please
see < http://www.gnu.org/licenses/agpl.html >.
"""

import os
import pdfkit
from datetime import date
from django.http import HttpResponse
from django.template.loader import render_to_string


def check(request):
    is_reports_container = bool(int(os.getenv('RSR_REPORTS', '0')))
    text = 'OK' if is_reports_container else ''

    if request.GET.get('pdf', ''):
        options = {
            'page-size': 'A4',
            'orientation': 'Portrait',
            'margin-left': '0.28in',
            'margin-top': '1in',
            'margin-right': '0.28in',
            'margin-bottom': '1in',
            'footer-left': 'Test Report {}'.format(date.today().strftime('%d-%b-%Y')),
            'footer-right': '[page]',
            'footer-font-size': 8,
            'footer-font-name': 'Roboto Condensed',
            'footer-spacing': 10,
        }
        html = render_to_string('reports/checkz.html', {'text': text})
        pdf = pdfkit.from_string(html, False, options=options)
        filename = 'test-report.pdf'
        response = HttpResponse(pdf, content_type='application/pdf')
        response['Content-Disposition'] = 'attachment; filename="' + filename + '"'
        return response

    return HttpResponse(text)
