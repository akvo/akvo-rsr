# -*- coding: utf-8 -*-

"""Akvo RSR is covered by the GNU Affero General Public License.

See more details in the license.txt file located at the root folder of the
Akvo RSR module. For additional details on the GNU license please
see < http://www.gnu.org/licenses/agpl.html >.
"""

import copy
from collections import namedtuple, OrderedDict
from akvo.rsr.models.result.utils import calculate_percentage
from akvo.rsr.project_overview import get_periods_hierarchy_flatlist, make_object_tree_from_flatlist, IndicatorType, UpdateCollection
from akvo.rsr.models import IndicatorPeriod
from akvo.utils import ensure_decimal, ObjectReaderProxy
from . import utils


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
        .select_related('indicator', 'indicator__result')\
        .prefetch_related('data', 'data__disaggregations')\
        .filter(indicator__result__project=program)
    periods = get_periods_hierarchy_flatlist(root_periods)
    indicators = group_periods_under_indicator(periods)
    indicators_tree = make_object_tree_from_flatlist(indicators.values(), 'parent_indicator')
    labels = program.period_labels.all()
    return [LabeledPeriodsIndicatorHierarchyProxy(i['item'], i['children'], labels) for i in indicators_tree if i['item'].labeled_periods]


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
        self.labeled_periods = {}

    def add_period(self, period):
        if period.label is None:
            return
        self.labeled_periods[period.label] = period


class LabeledPeriodsIndicatorHierarchyProxy(ObjectReaderProxy):
    def __init__(self, indicator, children, labels):
        super().__init__(indicator)
        self.labels = labels
        self.type = IndicatorType.get_type(indicator)
        self._children = children
        self._labeled_periods = None

    @property
    def labeled_periods(self):
        self._build()
        return self._labeled_periods.values()

    def get_labeled_period(self, label):
        self._build()
        return self._labeled_periods[label]

    def _build(self):
        if self._labeled_periods is None:
            self._build_labeled_periods()

    def _build_labeled_periods(self):
        self._labeled_periods = {}
        for lo in self.labels:
            self._labeled_periods[lo.label] = LabeledPeriod(lo, self.type)
        self._aggregate_values(self)

    def _aggregate_values(self, indicator):
        for period in indicator.periods.all():
            if period.label is None:
                continue
            label = period.label.label
            updates = UpdateCollection(period, self.type)
            if self.type == IndicatorType.UNIT:
                self._labeled_periods[label] = self._labeled_periods[label].add_value(updates.total_value, updates.disaggregations)
            else:
                self._labeled_periods[label] = self._labeled_periods[label].add_percentage_value(
                    updates.total_numerator, updates.total_denominator, updates.disaggregations
                )
        for c in self._children:
            child = LabeledPeriodsIndicatorHierarchyProxy(c['item'], c['children'], self.labels)
            for lo in self.labels:
                label = lo.label
                labeled_period = self._labeled_periods[label]
                child_labeled_period = child.get_labeled_period(label)
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
    ('label', 'type', 'value', 'numerator', 'denominator', 'disaggregations'),
    defaults=(None, None, None, {})
)):
    __slots__ = ()

    @property
    def actual_value(self):
        if self.type == IndicatorType.UNIT:
            return self.value
        else:
            return calculate_percentage(self.numerator, self.denominator)

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
