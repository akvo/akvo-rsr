# -*- coding: utf-8 -*-

"""Akvo RSR is covered by the GNU Affero General Public License.

See more details in the license.txt file located at the root folder of the
Akvo RSR module. For additional details on the GNU license please
see < http://www.gnu.org/licenses/agpl.html >.
"""

import copy
from collections import namedtuple, OrderedDict
from datetime import datetime
from django.contrib.auth.decorators import login_required
from django.http import HttpResponse
from django.shortcuts import get_object_or_404
from django.template.loader import render_to_string
from akvo.rsr.decorators import with_download_indicator
from akvo.rsr.models import Project, IndicatorPeriod
from akvo.rsr.models.result.utils import calculate_percentage
from akvo.rsr.project_overview import get_periods_hierarchy_flatlist, make_object_tree_from_flatlist, IndicatorType, UpdateCollection
from akvo.utils import ensure_decimal, ObjectReaderProxy

from . import utils


@login_required
@with_download_indicator
def render_program_period_lables_overview(request, program_id):
    program = get_object_or_404(Project.objects.prefetch_related('locations', 'partners', 'related_projects'), id=program_id)
    program_view = build_view_object(program)
    now = datetime.today()
    html = render_to_string(
        'reports/program-period-labels-overview.html',
        context={
            'project': program_view,
            'today': now.strftime('%d-%b-%Y'),
        }
    )

    if request.GET.get('show-html', ''):
        return HttpResponse(html)

    filename = '{}-{}-program-labeled-period-overview.pdf'.format(now.strftime('%Y%b%d'), program.id)

    return utils.make_pdf_response(html, filename)


def build_view_object(program):
    indicators = get_program_indicators_with_labeled_periods_aggregate(program)
    results = OrderedDict()
    for indicator in indicators:
        result = indicator.result
        if result.id not in results:
            results[result.id] = {'item': result, 'indicators': []}
        results[result.id]['indicators'].append(indicator)
    return ProjectProxy(program, results)


def get_program_indicators_with_labeled_periods_aggregate(program):
    root_periods = IndicatorPeriod.objects\
        .select_related('indicator', 'indicator__result', 'label')\
        .prefetch_related('data', 'data__disaggregations')\
        .filter(indicator__result__project=program)
    periods = get_periods_hierarchy_flatlist(root_periods)
    indicators = group_periods_under_indicator(periods)
    indicators_tree = make_object_tree_from_flatlist(indicators.values(), 'parent_indicator')
    labels = program.period_labels.order_by('id').all()
    return [LabeledPeriodsIndicatorHierarchyProxy(i['item'], i['children'], labels) for i in indicators_tree if i['item'].selected_periods]


def group_periods_under_indicator(period_lists):
    indicators = {}
    for period in period_lists:
        indicator = period.indicator
        if indicator.id not in indicators:
            indicators[indicator.id] = LabelPeriodMapIndicator(indicator)
        indicators[indicator.id].add_period(period)
    return indicators


class ProjectProxy(utils.ProjectProxy):
    def __init__(self, project, results={}):
        super().__init__(project)
        for r in sorted(results.values(), key=lambda it: utils.get_order_or_id_attribute(it['item'])):
            self._results.append(ResultProxy(r['item'], self, r['indicators']))


class ResultProxy(utils.ResultProxy):
    def __init__(self, result, project, indicators=[]):
        super().__init__(result, project)
        for indicator in sorted(indicators, key=lambda it: utils.get_order_or_id_attribute(it)):
            self._indicators.append(indicator)


class LabelPeriodMapIndicator(ObjectReaderProxy):
    def __init__(self, indicator):
        super().__init__(indicator)
        self.selected_periods = OrderedDict()

    def add_period(self, period):
        if period.label is None:
            return
        self.selected_periods[period.label] = period


class LabeledPeriodsIndicatorHierarchyProxy(ObjectReaderProxy):
    def __init__(self, indicator, children, labels):
        super().__init__(indicator)
        self.labels = labels
        self.type = IndicatorType.get_type(indicator)
        self._children = children
        self._labeled_periods = None
        self._disaggregations = None

    @property
    def labeled_periods(self):
        self._build()
        return self._labeled_periods.values()

    @property
    def disaggregations(self):
        if self._disaggregations is None:
            self._disaggregations = {}
            for period in self.labeled_periods:
                for d in period.disaggregations.values():
                    category = d['category']
                    type = d['type']
                    if category not in self.disaggregations:
                        self._disaggregations[category] = {}
                    if type not in self._disaggregations[category]:
                        self._disaggregations[category][type] = {'value': 0, 'numerator': 0, 'denominator': 0}
                    self._disaggregations[category][type]['value'] += (d['value'] or 0)
                    self._disaggregations[category][type]['numerator'] += (d['numerator'] or 0)
                    self._disaggregations[category][type]['denominator'] += (d['denominator'] or 0)

            if self.type == IndicatorType.PERCENTAGE:
                for category, types in self._disaggregations.items():
                    for type in types.keys():
                        self._disaggregations[category][type]['value'] = calculate_percentage(
                            self._disaggregations[category][type]['numerator'],
                            self._disaggregations[category][type]['denominator']
                        )

        return self._disaggregations

    def get_labeled_period(self, label):
        self._build()
        return self._labeled_periods[label] if label in self._labeled_periods else None

    def _build(self):
        if self._labeled_periods is None:
            self._build_labeled_periods()

    def _build_labeled_periods(self):
        self._labeled_periods = OrderedDict()

        for label_obj, period in self.selected_periods.items():
            label = str(label_obj)
            if label not in self._labeled_periods:
                self._labeled_periods[label] = LabeledPeriod(period, label_obj, self.type)
            updates = UpdateCollection(period, self.type)
            if self.type == IndicatorType.UNIT:
                self._labeled_periods[label] = self._labeled_periods[label].add_value(updates.total_value, updates.disaggregations)
            else:
                self._labeled_periods[label] = self._labeled_periods[label].add_percentage_value(
                    updates.total_numerator, updates.total_denominator, updates.disaggregations
                )
        for c in self._children:
            child = LabeledPeriodsIndicatorHierarchyProxy(c['item'], c['children'], self.labels)
            for child_labeled_period in child.labeled_periods:
                label_obj = child_labeled_period.label
                label = str(label_obj)
                if label not in self._labeled_periods:
                    self._labeled_periods[label] = LabeledPeriod(child_labeled_period.period.parent_period, label_obj, self.type)
                labeled_period = self._labeled_periods[label]
                if self.type == IndicatorType.UNIT:
                    labeled_period = labeled_period.add_value(
                        child_labeled_period.actual_value,
                        child_labeled_period.disaggregations
                    )
                else:
                    labeled_period = labeled_period.add_percentage_value(
                        child_labeled_period.numerator,
                        child_labeled_period.denominator,
                        child_labeled_period.disaggregations
                    )
                self._labeled_periods[label] = labeled_period


class LabeledPeriod(namedtuple(
    'LabeledPeriod',
    ('period', 'label', 'type', 'value', 'numerator', 'denominator', 'disaggregations'),
    defaults=(None, None, None, {})
)):
    __slots__ = ()

    @property
    def target_value(self):
        return ensure_decimal(self.period.target_value)

    @property
    def actual_value(self):
        if self.type == IndicatorType.UNIT:
            return ensure_decimal(self.value)
        else:
            return calculate_percentage(self.numerator, self.denominator)

    @property
    def progress(self):
        return calculate_percentage(self.actual_value, self.target_value)

    def add_value(self, value, disaggregations={}):
        return self._replace(
            value=ensure_decimal(self.value) + ensure_decimal(value),
            disaggregations=self._add_disaggregation(disaggregations)
        )

    def add_percentage_value(self, numerator, denominator, disaggregations={}):
        return self._replace(
            numerator=ensure_decimal(self.numerator) + ensure_decimal(numerator),
            denominator=ensure_decimal(self.denominator) + ensure_decimal(denominator),
            disaggregations=self._add_disaggregation(disaggregations)
        )

    def get_disaggregation_of(self, category, type):
        key = (category, type)
        if key not in self.disaggregations:
            return None
        if self.type == IndicatorType.UNIT:
            return self.disaggregations[key]['value']
        d = self.disaggregations[key]
        return calculate_percentage(d['numerator'], d['denominator'])

    def _add_disaggregation(self, new):
        result = copy.deepcopy(self.disaggregations)
        for key in new:
            if key not in result:
                result[key] = new[key].copy()
            elif self.type == IndicatorType.UNIT:
                result[key]['value'] += new[key]['value']
            else:
                result[key]['numerator'] += new[key]['numerator']
                result[key]['denominator'] += new[key]['denominator']
        return result
