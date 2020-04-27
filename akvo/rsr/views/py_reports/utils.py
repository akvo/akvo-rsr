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
from akvo.rsr.models.result.utils import QUALITATIVE, PERCENTAGE_MEASURE


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


class Proxy(object):
    """
    Proxy objects are intended as read only view model or DTO to be used in report templates.
    Additional method can be added to encapsulate representation logic in sub-classes.
    """
    def __init__(self, real):
        self._real = real

    def __getattr__(self, attr):
        return getattr(self._real, attr)


class ProjectProxy(Proxy):
    def __init__(self, project, results={}):
        super().__init__(project)
        self._results = []
        self._in_eutf_hierarchy = None
        for r in sorted(results.values(), key=lambda it: it['item'].order or 0):
            self._results.append(ResultProxy(r['item'], self, r['indicators']))

    @property
    def results(self):
        return self._results

    @property
    def in_eutf_hierarchy(self):
        if self._in_eutf_hierarchy is None:
            self._in_eutf_hierarchy = self._real.in_eutf_hierarchy()
        return self._in_eutf_hierarchy


class ResultProxy(Proxy):
    def __init__(self, result, project, indicators={}):
        super().__init__(result)
        self._project = project
        self._indicators = []
        for i in sorted(indicators.values(), key=lambda it: it['item'].order or 0):
            self._indicators.append(IndicatorProxy(i['item'], self, i['periods']))

    @property
    def project(self):
        return self._project

    @property
    def indicators(self):
        return self._indicators


class IndicatorProxy(Proxy):
    def __init__(self, indicator, result, periods=[]):
        super().__init__(indicator)
        self._result = result
        self._periods = []
        for p in periods:
            self._periods.append(PeriodProxy(p, self))
        self._disaggregations = None

    @property
    def result(self):
        return self._result

    @property
    def is_qualitative(self):
        return self.type == QUALITATIVE

    @property
    def is_percentage(self):
        return self.measure == PERCENTAGE_MEASURE

    @property
    def periods(self):
        return self._periods

    @property
    def disaggregations(self):
        if self._disaggregations is None:
            self._disaggregations = {}
            for period in self.periods:
                for d in period.disaggregations.all():
                    category = d.dimension_value.name.name
                    type = d.dimension_value.value
                    if category not in self._disaggregations:
                        self._disaggregations[category] = {}
                    if type not in self._disaggregations[category]:
                        self._disaggregations[category][type] = {'value': 0, 'numerator': 0, 'denominator': 0}
                    self._disaggregations[category][type]['value'] += (d.value or 0)
                    self._disaggregations[category][type]['numerator'] += (d.numerator or 0)
                    self._disaggregations[category][type]['denominator'] += (d.denominator or 0)

            if self.is_percentage:
                for category, types in self._disaggregations.items():
                    for type in types.keys():
                        self._disaggregations[category][type]['value'] = calculate_percentage(
                            self._disaggregations[category][type]['numerator'],
                            self._disaggregations[category][type]['denominator']
                        )

        return self._disaggregations


class PeriodProxy(Proxy):
    def __init__(self, period, indicator):
        super().__init__(period)
        self._indicator = indicator
        self._period_start = None
        self._period_end = None
        self._actual_value = None
        self._target_value = None
        self._progress = None

    @property
    def indicator(self):
        return self._indicator

    @property
    def period_start(self):
        if self._period_start is None:
            self._period_start = get_period_start(
                self._real, self.indicator.result.project.in_eutf_hierarchy)
        return self._period_start

    @property
    def period_end(self):
        if self._period_end is None:
            self._period_end = get_period_end(
                self._real, self.indicator.result.project.in_eutf_hierarchy)
        return self._period_end

    @property
    def actual_value(self):
        if self._actual_value is None:
            self._actual_value = force_decimal(self._real.actual_value)
        return self._actual_value

    @property
    def target_value(self):
        if self._target_value is None:
            self._target_value = force_decimal(self._real.target_value)
        return self._target_value

    @property
    def progress(self):
        if self._progress is None:
            self._progress = calculate_percentage(self.actual_value, self.target_value)
        return self._progress

    @property
    def progress_str(self):
        return '{}%'.format(self.progress)

    @property
    def grade(self):
        return 'low' if self.progress <= 49 else 'high' if self.progress >= 85 else 'medium'
