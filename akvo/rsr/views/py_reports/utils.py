# -*- coding: utf-8 -*-

"""Akvo RSR is covered by the GNU Affero General Public License.

See more details in the license.txt file located at the root folder of the
Akvo RSR module. For additional details on the GNU license please
see < http://www.gnu.org/licenses/agpl.html >.
"""

import io
from collections import OrderedDict
from datetime import date
from dateutil.parser import parse, ParserError
from django.conf import settings
from django.http import HttpResponse
from functools import cached_property
from weasyprint import HTML
from weasyprint.fonts import FontConfiguration
from akvo.rsr.models import Partnership
from akvo.rsr.project_overview import DisaggregationTarget, IndicatorType
from akvo.rsr.models.result.utils import QUANTITATIVE, QUALITATIVE, PERCENTAGE_MEASURE, calculate_percentage
from akvo.utils import ObjectReaderProxy, ensure_decimal, rsr_send_mail


def send_pdf_report(html, recipient, filename='reports.pdf'):
    font_config = FontConfiguration()
    pdf = HTML(string=html).write_pdf(font_config=font_config)
    attachments = [{'filename': filename, 'content': pdf, 'mimetype': 'application/pdf'}]
    rsr_send_mail(
        [recipient],
        subject='reports/email/subject.txt',
        message='reports/email/message.txt',
        attachments=attachments
    )


def send_excel_report(workbook, recipient, filename='report.xlsx'):
    stream = io.BytesIO()
    workbook.save(stream)
    stream.seek(0)
    attachments = [{
        'filename': filename,
        'content': stream.read(),
        'mimetype': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    }]
    rsr_send_mail(
        [recipient],
        subject='reports/email/subject.txt',
        message='reports/email/message.txt',
        attachments=attachments
    )


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


def is_using_indicator_target(project):
    program = project.get_program()
    targets_at = program.targets_at if program else project.targets_at
    return targets_at == 'indicator'


class ProjectProxy(ObjectReaderProxy):
    def __init__(self, project, results={}):
        super().__init__(project)
        self._results = []
        for r in sorted(results.values(), key=lambda it: get_order_or_id_attribute(it['item'])):
            self._results.append(ResultProxy(r['item'], self, r['indicators']))

    @property
    def results(self):
        return self._results

    @cached_property
    def quantitative_indicators_results(self):
        return [
            ResultWithQuantitativeIndicatorsProxy(result) for result in self._results
            if result.has_quantitative_indicators
        ]

    @cached_property
    def qualitative_indicators_results(self):
        return [
            ResultWithQualitativeIndicatorsProxy(result) for result in self._results
            if result.has_qualitative_indicators
        ]

    @cached_property
    def in_eutf_hierarchy(self):
        return self._real.in_eutf_hierarchy()

    @cached_property
    def use_indicator_target(self):
        program = self.get_program()
        targets_at = program.targets_at if program else self.targets_at
        return True if targets_at == 'indicator' else False

    @cached_property
    def partner_names(self):
        return ', '.join([p.name for p in self.all_partners()]) or ''

    @cached_property
    def partner_logos(self):
        return [
            {
                'url': f"https://rsr.akvo.org{o.logo.url}" if o.logo else '',
                'alt': o.name
            }
            for o in self.all_partners()
        ]

    @cached_property
    def funding_partners(self):
        return sorted([
            {
                'organisation': p.organisation.long_name,
                'amount': ensure_decimal(p.funding_amount),
                'percentage': calculate_percentage(ensure_decimal(p.funding_amount), ensure_decimal(self.funds))
            }
            for p in self.partnerships.filter(iati_organisation_role=Partnership.IATI_FUNDING_PARTNER)
        ], key=lambda x: x['percentage'], reverse=True)

    @cached_property
    def accountable_partner(self):
        return ', '.join([p.name for p in self.support_partners()]) or ''

    @cached_property
    def country_codes(self):
        return ', '.join([r.country for r in self.recipient_countries.all()]) or ''

    @cached_property
    def location_names(self):
        return [
            ", ".join(
                [_f for _f in [loc.city, getattr(loc.country, 'name', None)] if _f]
            )
            for loc
            in self.locations.all()
        ]

    @cached_property
    def keyword_labels(self):
        return ', '.join([k.label for k in self.keywords.all()]) or ''

    @cached_property
    def sector_labels(self):
        labels = [k.iati_sector_unicode() for k in self.sectors.all()]
        labels = [label if ',' not in label else f'"{label}"' for label in labels]
        return ', '.join(labels) or ''

    @cached_property
    def sector_names(self):
        sectors = [sector.iati_sector() for sector in self.sectors.all()]
        names = [iati_sector.name for iati_sector in sectors if hasattr(iati_sector, 'name')]
        return ', '.join(names)

    @cached_property
    def iati_status(self):
        return self.show_plain_status() or 'None'

    @property
    def absolute_url(self):
        return 'https://{}{}'.format(settings.RSR_DOMAIN, self.get_absolute_url())

    @property
    def date_start(self):
        return self.date_start_actual if self.date_start_actual else self.date_start_planned

    @property
    def date_end(self):
        return self.date_end_actual if self.date_end_actual else self.date_end_planned

    @cached_property
    def date_progress_percentage(self):
        if not self.date_start or not self.date_end:
            return 0
        numerator = date.today() - self.date_start
        denominator = self.date_end - self.date_start
        progress = calculate_percentage(numerator.days, denominator.days)
        return ensure_decimal(100) if progress > 100 else progress


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


class ResultWithQuantitativeIndicatorsProxy(ObjectReaderProxy):
    def __init__(self, result):
        super().__init__(result)

    @cached_property
    def indicators(self):
        return [it for it in self._real.indicators if it.is_quantitative]


class ResultWithQualitativeIndicatorsProxy(ObjectReaderProxy):
    def __init__(self, result):
        super().__init__(result)

    @cached_property
    def indicators(self):
        return [it for it in self._real.indicators if it.is_qualitative]


class ResultProxy(ObjectReaderProxy):
    def __init__(self, result, project, indicators={}):
        super().__init__(result)
        self._project = project
        self._indicators = []
        for i in sorted(indicators.values(), key=lambda it: get_order_or_id_attribute(it['item'])):
            self._indicators.append(IndicatorProxy(i['item'], self, i['periods']))

    @property
    def project(self):
        return self._project

    @property
    def indicators(self):
        return self._indicators

    @cached_property
    def iati_type_name(self):
        iati_type = self.iati_type()
        return iati_type.name if iati_type else ''

    @cached_property
    def has_quantitative_indicators(self):
        for indicator in self.indicators:
            if indicator.is_quantitative:
                return True
        return False

    @cached_property
    def has_qualitative_indicators(self):
        for indicator in self.indicators:
            if indicator.is_qualitative:
                return True
        return False


class IndicatorProxy(ObjectReaderProxy):
    def __init__(self, indicator, result, periods=[]):
        super().__init__(indicator)
        self._result = result
        self._periods = []
        for p in periods:
            self._periods.append(PeriodProxy(p, self))

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

    @cached_property
    def target_value(self):
        return ensure_decimal(self._real.target_value)

    @property
    def sum_of_period_values(self):
        value = 0
        for period in self._periods:
            value += ensure_decimal(period.actual_value)
        return value

    @property
    def periods(self):
        return self._periods

    @cached_property
    def progress(self):
        actual_values = 0
        target_values = 0
        for period in self.periods:
            actual_values += period.actual_value
            target_values += period.target_value
        return calculate_percentage(actual_values, self.target_value or target_values)

    @property
    def progress_str(self):
        return '{}%'.format(self.progress)

    @property
    def grade(self):
        return 'low' if self.progress <= 49 else 'high' if self.progress >= 85 else 'medium'

    @cached_property
    def disaggregations(self):
        disaggregations = {}
        for period in self.periods:
            for d in period.approved_updates.disaggregations.values():
                category = d['category']
                type = d['type']
                if category not in disaggregations:
                    disaggregations[category] = {}
                if type not in disaggregations[category]:
                    disaggregations[category][type] = {'value': 0, 'numerator': 0, 'denominator': 0}
                disaggregations[category][type]['value'] += (d['value'] or 0)
                disaggregations[category][type]['numerator'] += (d['numerator'] or 0)
                disaggregations[category][type]['denominator'] += (d['denominator'] or 0)
        if self.is_percentage:
            for category, types in disaggregations.item():
                for type in types.keys():
                    disaggregations[category][type]['value'] = calculate_percentage(
                        disaggregations[category][type]['numerator'],
                        disaggregations[category][type]['denominator']
                    )
        return disaggregations


class PeriodProxy(ObjectReaderProxy):
    def __init__(self, period, indicator):
        super().__init__(period)
        self.type = IndicatorType.get_type(period.indicator)
        self._indicator = indicator

    @property
    def indicator(self):
        return self._indicator

    @cached_property
    def period_start(self):
        return get_period_start(self._real, self.indicator.result.project.in_eutf_hierarchy)

    @cached_property
    def period_end(self):
        return get_period_end(self._real, self.indicator.result.project.in_eutf_hierarchy)

    @property
    def actual_value(self):
        return self.approved_updates.total_value

    @property
    def actual_comment(self):
        return self.approved_updates.actual_comments

    @property
    def narrative(self):
        return self.approved_updates.narrative

    @property
    def scores(self):
        return self.approved_updates.scores

    @cached_property
    def target_value(self):
        return ensure_decimal(self._real.target_value)

    @cached_property
    def progress(self):
        return calculate_percentage(self.actual_value, self.target_value)

    @property
    def progress_str(self):
        return '{}%'.format(self.progress)

    @property
    def grade(self):
        return 'low' if self.progress <= 49 else 'high' if self.progress >= 85 else 'medium'

    @cached_property
    def approved_updates(self):
        return ApprovedUpdateCollection(self, self.type)

    @cached_property
    def has_qualitative_data(self):
        if self.indicator.is_qualitative:
            for update in self.approved_updates:
                if update.has_qualitative_data:
                    return True
        return False

    @cached_property
    def disaggregation_targets(self):
        print('disaggregation_targets hits')
        disaggregations = [
            DisaggregationTarget(t)
            for t in self._real.disaggregation_targets.all()
        ]
        return {(d.category, d.type): d for d in disaggregations}

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

    def __iter__(self):
        return iter(self.data)

    def __len__(self):
        return len(self.data)

    @cached_property
    def data(self):
        return [PeriodUpdateProxy(update, self.period) for update in self.period._real.approved_updates.order_by('-created_at')]

    @cached_property
    def total_value(self):
        if self.type == IndicatorType.PERCENTAGE:
            return calculate_percentage(self.total_numerator, self.total_denominator)
        total = 0
        for update in self.data:
            if update.value:
                total += update.value
        return total

    @cached_property
    def total_numerator(self):
        if self.type != IndicatorType.PERCENTAGE:
            return None
        total = 0
        for update in self.data:
            if update.numerator is not None:
                total += update.numerator
        return total

    @cached_property
    def total_denominator(self):
        if self.type != IndicatorType.PERCENTAGE:
            return None
        total = 0
        for update in self.data:
            if update.denominator is not None:
                total += update.denominator
        return total

    @cached_property
    def actual_comments(self):
        update_texts = [
            f"{update.last_modified_at.strftime('%d-%m-%Y')}: {update.text}"
            for update in self.data
            if update.text.strip()
        ]
        actual_comments = ' | '.join(update_texts)
        if len(actual_comments) >= 2000:  # max_size
            actual_comments = '{} ...'.format(actual_comments[:1995])
        return actual_comments

    @cached_property
    def narrative(self):
        if not self.data:
            return ''
        return self.data[0].narrative

    @cached_property
    def scores(self):
        if not self.data:
            return []
        return self.data[0].scores

    @cached_property
    def disaggregations(self):
        disaggregations = {}
        for update in self.data:
            for d in update.disaggregations.all():
                key = (d.dimension_value.name.name, d.dimension_value.value)
                if key not in disaggregations:
                    disaggregations[key] = {
                        'category': d.dimension_value.name.name,
                        'type': d.dimension_value.value,
                        'value': 0,
                        'numerator': d.numerator,
                        'denominator': d.denominator,
                    }

                disaggregations[key]['value'] += 0 if d.value is None else d.value
        return disaggregations


class PeriodUpdateProxy(ObjectReaderProxy):
    def __init__(self, update, period):
        super().__init__(update)
        self._period = period

    @property
    def period(self):
        return self._period

    @cached_property
    def has_qualitative_data(self):
        return True if self.period.indicator.is_qualitative and (self.narrative or self.score_indices) else False

    @cached_property
    def scores(self):
        scores = self.period.indicator.scores
        if not scores:
            return []
        selected = {max(0, idx - 1) for idx in self.score_indices}
        return [score for key, score in enumerate(scores) if key in selected]

    @cached_property
    def narrative(self):
        return self._real.narrative.replace(u'\u200b', '')

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
        return f"https://rsr.akvo.org/{self.photo.url}" if self.photo else ''


def hex_to_rgb(hex_color):
    hex = hex_color.lstrip('#')
    if len(hex) == 3:
        hex = ''.join([i * 2 for i in hex])
    return tuple(int(hex[i:i + 2], 16) for i in [0, 2, 4])


def lighten_color(hex_color, tint_value):
    r, g, b = tuple(int(max(min(c + tint_value, 255), 0)) for c in hex_to_rgb(hex_color))
    return f"#{r:02x}{g:02x}{b:02x}"
