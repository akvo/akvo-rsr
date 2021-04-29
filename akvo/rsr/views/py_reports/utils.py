# -*- coding: utf-8 -*-

"""Akvo RSR is covered by the GNU Affero General Public License.

See more details in the license.txt file located at the root folder of the
Akvo RSR module. For additional details on the GNU license please
see < http://www.gnu.org/licenses/agpl.html >.
"""

import io
from collections import OrderedDict
from dateutil.parser import parse, ParserError
from django.conf import settings
from django.http import HttpResponse
from weasyprint import HTML
from weasyprint.fonts import FontConfiguration
from akvo.rsr.models import IndicatorPeriodData
from akvo.rsr.project_overview import DisaggregationTarget, IndicatorType
from akvo.rsr.models.result.utils import QUANTITATIVE, QUALITATIVE, PERCENTAGE_MEASURE, calculate_percentage
from akvo.utils import ObjectReaderProxy, ensure_decimal


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


def make_docx_response(document, filename='report.docx'):
    stream = io.BytesIO()
    document.save(stream)
    stream.seek(0)
    response = HttpResponse(
        stream.read(),
        content_type="application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    )
    response["Content-Disposition"] = 'attachment; filename="' + filename + '"'

    return response


def xl_column_name(n):
    string = ""
    while n > 0:
        n, remainder = divmod(n - 1, 26)
        string = chr(65 + remainder) + string
    return string


def parse_date(string, default=None):
    try:
        return parse(string)
    except ParserError:
        return default


def get_period_start(period, in_eutf_hierarchy):
    if not in_eutf_hierarchy:
        return period.period_start

    project = period.indicator.result.project

    if project.id == settings.EUTF_ROOT_PROJECT:
        return period.period_start

    if project.date_start_actual:
        return project.date_start_actual

    return project.date_start_planned


def get_period_end(period, in_eutf_hierarchy):
    if not in_eutf_hierarchy:
        return period.period_end

    project = period.indicator.result.project

    if project.id == settings.EUTF_ROOT_PROJECT:
        return period.period_end

    if project.date_end_actual:
        return project.date_end_actual

    return project.date_end_planned


def get_order_or_id_attribute(item):
    return item.order + 1 if item.order is not None else item.id


class ProjectProxy(ObjectReaderProxy):
    def __init__(self, project, results={}):
        super().__init__(project)
        self._results = []
        self._in_eutf_hierarchy = None
        self._accountable_partner = None
        self._partner_names = None
        self._country_codes = None
        self._location_names = None
        self._keyword_labels = None
        self._sector_labels = None
        self._iati_status = None
        self._use_indicator_target = None
        for r in sorted(results.values(), key=lambda it: get_order_or_id_attribute(it['item'])):
            self._results.append(ResultProxy(r['item'], self, r['indicators']))

    @property
    def results(self):
        return self._results

    @property
    def in_eutf_hierarchy(self):
        if self._in_eutf_hierarchy is None:
            self._in_eutf_hierarchy = self._real.in_eutf_hierarchy()
        return self._in_eutf_hierarchy

    @property
    def use_indicator_target(self):
        if self._use_indicator_target is None:
            program = self.get_program()
            targets_at = program.targets_at if program else self.targets_at
            self._use_indicator_target = True if targets_at == 'indicator' else False
        return self._use_indicator_target

    @property
    def partner_names(self):
        if self._partner_names is None:
            self._partner_names = ', '.join([p.name for p in self.all_partners()]) or ''
        return self._partner_names

    @property
    def accountable_partner(self):
        if self._accountable_partner is None:
            self._accountable_partner = ', '.join([p.name for p in self.support_partners()]) or ''
        return self._accountable_partner

    @property
    def country_codes(self):
        if self._country_codes is None:
            self._country_codes = ', '.join([r.country for r in self.recipient_countries.all()]) or ''
        return self._country_codes

    @property
    def location_names(self):
        if self._location_names is None:
            self._location_names = [
                ", ".join(
                    [_f for _f in [loc.city, getattr(loc.country, 'name', None)] if _f]
                )
                for loc
                in self.locations.all()
            ]
        return self._location_names

    @property
    def keyword_labels(self):
        if self._keyword_labels is None:
            self._keyword_labels = ', '.join([k.label for k in self.keywords.all()]) or ''
        return self._keyword_labels

    @property
    def sector_labels(self):
        if self._sector_labels is None:
            labels = [k.iati_sector_unicode() for k in self.sectors.all()]
            labels = [label if ',' not in label else f'"{label}"' for label in labels]
            self._sector_labels = ', '.join(labels) or ''
        return self._sector_labels

    @property
    def iati_status(self):
        if self._iati_status is None:
            self._iati_status = self.show_plain_status() or 'None'
        return self._iati_status

    @property
    def absolute_url(self):
        return 'https://{}{}'.format(settings.RSR_DOMAIN, self.get_absolute_url())


def make_project_proxies(periods, proxy_factory=ProjectProxy):
    projects = OrderedDict()
    for period in periods:
        indicator = period.indicator
        result = indicator.result
        project = result.project

        if project.id not in projects:
            results = OrderedDict()
            projects[project.id] = {'item': project, 'results': results}
        else:
            results = projects[project.id]['results']

        if result.id not in results:
            indicators = OrderedDict()
            results[result.id] = {'item': result, 'indicators': indicators}
        else:
            indicators = results[result.id]['indicators']

        if indicator.id not in indicators:
            periods = []
            indicators[indicator.id] = {'item': indicator, 'periods': periods}
        else:
            periods = indicators[indicator.id]['periods']

        periods.append(period)

    return [proxy_factory(p['item'], p['results']) for p in projects.values()]


class ResultProxy(ObjectReaderProxy):
    def __init__(self, result, project, indicators={}):
        super().__init__(result)
        self._project = project
        self._indicators = []
        self._iati_type_name = None
        self._has_quantitative_indicators = None
        self._has_qualitative_indicators = None
        for i in sorted(indicators.values(), key=lambda it: get_order_or_id_attribute(it['item'])):
            self._indicators.append(IndicatorProxy(i['item'], self, i['periods']))

    @property
    def project(self):
        return self._project

    @property
    def indicators(self):
        return self._indicators

    @property
    def iati_type_name(self):
        if self._iati_type_name is None:
            iati_type = self.iati_type()
            self._iati_type_name = iati_type.name if iati_type else ''
        return self._iati_type_name

    @property
    def has_quantitative_indicators(self):
        if self._has_quantitative_indicators is None:
            self._has_quantitative_indicators = False
            for indicator in self.indicators:
                if indicator.is_quantitative:
                    self._has_quantitative_indicators = True
                    break
        return self._has_quantitative_indicators

    @property
    def has_qualitative_indicators(self):
        if self._has_qualitative_indicators is None:
            self._has_qualitative_indicators = False
            for indicator in self.indicators:
                if indicator.is_qualitative:
                    self._has_qualitative_indicators = True
                    break
        return self._has_qualitative_indicators


class IndicatorProxy(ObjectReaderProxy):
    def __init__(self, indicator, result, periods=[]):
        super().__init__(indicator)
        self._result = result
        self._periods = []
        self._progress = None
        self._target_value = None
        for p in periods:
            self._periods.append(PeriodProxy(p, self))
        self._disaggregations = None

    @property
    def result(self):
        return self._result

    @property
    def is_quantitative(self):
        return self.type == QUANTITATIVE

    @property
    def is_qualitative(self):
        return self.type == QUALITATIVE

    @property
    def is_percentage(self):
        return self.measure == PERCENTAGE_MEASURE

    @property
    def target_value(self):
        if self._target_value is None:
            self._target_value = ensure_decimal(self._real.target_value)
        return self._target_value

    @property
    def periods(self):
        return self._periods

    @property
    def progress(self):
        if self._progress is None:
            actual_values = 0
            target_values = 0
            for period in self.periods:
                actual_values += period.actual_value
                target_values += period.target_value
            self._progress = calculate_percentage(actual_values, self.target_value or target_values)
        return self._progress

    @property
    def progress_str(self):
        return '{}%'.format(self.progress)

    @property
    def grade(self):
        return 'low' if self.progress <= 49 else 'high' if self.progress >= 85 else 'medium'

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


class PeriodProxy(ObjectReaderProxy):
    def __init__(self, period, indicator):
        super().__init__(period)
        self.type = IndicatorType.get_type(period.indicator)
        self._indicator = indicator
        self._period_start = None
        self._period_end = None
        self._actual_value = None
        self._target_value = None
        self._progress = None
        self._approved_updates = None
        self._has_qualitative_data = None
        self._disaggregation_targets = None

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
            self._actual_value = ensure_decimal(self._real.actual_value)
        return self._actual_value

    @property
    def target_value(self):
        if self._target_value is None:
            self._target_value = ensure_decimal(self._real.target_value)
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

    @property
    def approved_updates(self):
        if self._approved_updates is None:
            self._approved_updates = ApprovedUpdateCollection(self, self.type)
        return self._approved_updates

    @property
    def has_qualitative_data(self):
        if self._has_qualitative_data is None:
            self._has_qualitative_data = False
            if self.indicator.is_qualitative:
                for update in self.approved_updates:
                    if update.has_qualitative_data:
                        self._has_qualitative_data = True
                        break
        return self._has_qualitative_data

    @property
    def disaggregation_targets(self):
        if self._disaggregation_targets is None:
            disaggregations = [
                DisaggregationTarget(t)
                for t in self._real.disaggregation_targets.all()
            ]
            self._disaggregation_targets = {(d.category, d.type): d for d in disaggregations}
        return self._disaggregation_targets

    def get_disaggregation_target_of(self, category, type):
        key = (category, type)
        if key not in self.disaggregation_targets:
            return None
        return ensure_decimal(self.disaggregation_targets[key].value)

    def get_disaggregation_of(self, category, type):
        key = (category, type)
        if key not in self.approved_updates.disaggregations:
            return None
        return self.approved_updates.disaggregations[key]['value']


class ApprovedUpdateCollection(ObjectReaderProxy):
    def __init__(self, period, type):
        self.period = period
        self.type = type
        self._updates = None
        self._total_value = None
        self._total_numerator = None
        self._total_denominator = None
        self._disaggregations = None

    @property
    def total_value(self):
        self._build()
        return self._total_value

    @property
    def total_numerator(self):
        self._build()
        return self._total_numerator

    @property
    def total_denominator(self):
        self._build()
        return self._total_denominator

    @property
    def disaggregations(self):
        self._build()
        return self._disaggregations

    def __iter__(self):
        self._build()
        return iter(self._updates)

    def __len__(self):
        self._build()
        return len(self._updates)

    def _build(self):
        if self._updates is not None:
            return
        self._updates = []
        self._total_value = 0
        if self.type == IndicatorType.PERCENTAGE:
            self._total_numerator = 0
            self._total_denominator = 0
        self._disaggregations = {}

        for update in self.period.data.all():
            if update.status != IndicatorPeriodData.STATUS_APPROVED_CODE:
                continue
            self._updates.append(PeriodUpdateProxy(update, self.period))
            if self.type == IndicatorType.PERCENTAGE:
                if update.numerator is not None and update.denominator is not None:
                    self._total_numerator += update.numerator
                    self._total_denominator += update.denominator
            elif update.value:
                self._total_value += update.value

            for d in update.disaggregations.all():
                key = (d.dimension_value.name.name, d.dimension_value.value)
                if key not in self._disaggregations:
                    self._disaggregations[key] = {
                        'category': d.dimension_value.name.name,
                        'type': d.dimension_value.value,
                        'value': 0,
                        'numerator': d.numerator,
                        'denominator': d.denominator,
                    }

                self._disaggregations[key]['value'] += d.value

        if self.type == IndicatorType.PERCENTAGE and self._total_denominator > 0:
            self._total_value = calculate_percentage(self._total_numerator, self._total_denominator)


class PeriodUpdateProxy(ObjectReaderProxy):
    def __init__(self, update, period):
        super().__init__(update)
        self._period = period
        self._has_qualitative_data = None

    @property
    def period(self):
        return self._period

    @property
    def has_qualitative_data(self):
        if self._has_qualitative_data is None:
            self._has_qualitative_data = True \
                if self.period.indicator.is_qualitative and self.narrative \
                else False
        return self._has_qualitative_data

    @property
    def photo_url(self):
        return "https://rsr.akvo.org/media/{}".format(self.photo)

    @property
    def file_url(self):
        return "https://rsr.akvo.org/media/{}".format(self.file)


class ProjectUpdateProxy(ObjectReaderProxy):
    def __init__(self, update):
        super().__init__(update)

    @property
    def photo_url(self):
        return "https://rsr.akvo.org/media/{}".format(self.photo)
