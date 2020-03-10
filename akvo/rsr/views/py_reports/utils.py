# -*- coding: utf-8 -*-

"""Akvo RSR is covered by the GNU Affero General Public License.

See more details in the license.txt file located at the root folder of the
Akvo RSR module. For additional details on the GNU license please
see < http://www.gnu.org/licenses/agpl.html >.
"""

import io
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


def make_excel_response(workbook, filename='report.xlsx'):
    stream = io.BytesIO()
    workbook.save(stream)
    stream.seek(0)
    response = HttpResponse(stream.read(), content_type='text/xlsx')
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


def get_period_start(period, in_eutf_hierarchy):
    if not in_eutf_hierarchy:
        return period.period_start

    project = period.indicator.result.project
    if project.date_start_actual:
        return project.date_start_actual

    return project.date_start_planned


def get_period_end(period, in_eutf_hierarchy):
    if not in_eutf_hierarchy:
        return period.period_end

    project = period.indicator.result.project
    if project.date_end_actual:
        return project.date_end_actual

    return project.date_end_planned
