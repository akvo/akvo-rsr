# -*- coding: utf-8 -*-

"""Akvo RSR is covered by the GNU Affero General Public License.

See more details in the license.txt file located at the root folder of the
Akvo RSR module. For additional details on the GNU license please
see < http://www.gnu.org/licenses/agpl.html >.
"""

import io
from decimal import Decimal, InvalidOperation
from dateutil.parser import parse, ParserError
from django.http import HttpResponse
from weasyprint import HTML
from weasyprint.fonts import FontConfiguration
from akvo.rsr.models.result.utils import QUALITATIVE, PERCENTAGE_MEASURE, calculate_percentage


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


class Proxy(object):
    def __init__(self, real):
        self._real = real

    def __getattr__(self, attr):
        return getattr(self._real, attr)


class ProjectProxy(Proxy):
    def __init__(self, project, results={}):
        super().__init__(project)
        self._results = []
        for r in sorted(results.values(), key=lambda it: it['item'].order or 0):
            self._results.append(ResultProxy(r['item'], r['indicators']))

    @property
    def results(self):
        return self._results


class ResultProxy(Proxy):
    def __init__(self, result, indicators={}):
        super().__init__(result)
        self._indicators = []
        for i in sorted(indicators.values(), key=lambda it: it['item'].order or 0):
            self._indicators.append(IndicatorProxy(i['item'], i['periods']))

    @property
    def indicators(self):
        return self._indicators


class IndicatorProxy(Proxy):
    def __init__(self, indicator, periods=[]):
        super().__init__(indicator)
        self._periods = []
        for p in periods:
            self._periods.append(PeriodProxy(p))

    @property
    def is_qualitative(self):
        self.type == QUALITATIVE

    @property
    def is_percentage(self):
        self.measure == PERCENTAGE_MEASURE

    @property
    def periods(self):
        return self._periods

    @property
    def disaggregations(self):
        disaggregations = {}
        for period in self.periods:
            for d in period.disaggregations.all():
                category = d.dimension_value.name.name
                type = d.dimension_value.value
                if category not in disaggregations:
                    disaggregations[category] = {}
                if type not in disaggregations[category]:
                    disaggregations[category][type] = {'value': 0, 'numerator': 0, 'denominator': 0}
                disaggregations[category][type]['value'] += (d.value or 0)
                disaggregations[category][type]['numerator'] += (d.numerator or 0)
                disaggregations[category][type]['denominator'] += (d.denominator or 0)

        if self.is_percentage:
            for category, types in disaggregations.items():
                for type in types.keys():
                    disaggregations[category][type]['value'] = calculate_percentage(
                        disaggregations[category][type]['numerator'],
                        disaggregations[category][type]['denominator']
                    )

        return disaggregations


class PeriodProxy(Proxy):
    pass
