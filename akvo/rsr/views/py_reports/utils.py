# -*- coding: utf-8 -*-

"""Akvo RSR is covered by the GNU Affero General Public License.

See more details in the license.txt file located at the root folder of the
Akvo RSR module. For additional details on the GNU license please
see < http://www.gnu.org/licenses/agpl.html >.
"""

from decimal import Decimal, InvalidOperation, DivisionByZero
from dateutil.parser import parse, ParserError
from django.http import HttpResponse
from weasyprint import HTML
from weasyprint.fonts import FontConfiguration


def make_pdf_response(html, filename='reports.pdf'):
    font_config = FontConfiguration()
    pdf = HTML(string=html).write_pdf(font_config=font_config)

    response = HttpResponse(pdf, content_type='application/pdf')
    response['Content-Disposition'] = 'attachment; filename="' + filename + '"'

    return response


def force_decimal(value):
    try:
        return Decimal(value)
    except (InvalidOperation, TypeError):
        return Decimal(0)


def calculate_percentage(part, whole):
    try:
        return int(round(part / whole * 100, 0))
    except (InvalidOperation, TypeError, DivisionByZero):
        return 0


def parse_date(string, default=None):
    try:
        return parse(string)
    except ParserError:
        return default
