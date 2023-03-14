# -*- coding: utf-8 -*-

"""Akvo RSR is covered by the GNU Affero General Public License.

See more details in the license.txt file located at the root folder of the
Akvo RSR module. For additional details on the GNU license please
see < http://www.gnu.org/licenses/agpl.html >.
"""

import copy
from collections import OrderedDict
from datetime import datetime
from decimal import Decimal
from dataclasses import dataclass, field, replace
from functools import cached_property
from typing import Optional, Dict, Any
from django.contrib.auth.decorators import login_required
from django.shortcuts import get_object_or_404
from django.template.loader import render_to_string
from akvo.rsr.models import Project, IndicatorPeriod, IndicatorPeriodLabel
from akvo.rsr.models.result.utils import calculate_percentage
from akvo.rsr.project_overview import get_periods_hierarchy_flatlist, make_object_tree_from_flatlist, IndicatorType, UpdateCollection
from akvo.utils import ensure_decimal, ObjectReaderProxy

from . import utils

REPORT_NAME = 'program_period_labels_overview_pdf_report'


@login_required
def add_email_report_job(request, program_id):
    program = get_object_or_404(Project, pk=program_id)
    payload = {
        'program_id': program.id,
    }
    recipient = request.user.email

    return utils.make_async_email_report_task(handle_email_report, payload, recipient, REPORT_NAME)


def handle_email_report(params, recipient):
    program = Project.objects.prefetch_related('locations', 'partners', 'related_projects').get(pk=params['program_id'])
    program_view = build_view_object(program)
    now = datetime.today()
    html = render_to_string(
        'reports/program-period-labels-overview.html',
        context={
            'project': program_view,
            'today': now.strftime('%d-%b-%Y'),
        }
    )
    filename = '{}-{}-program-labeled-period-overview.pdf'.format(now.strftime('%Y%b%d'), program.id)

    return utils.send_pdf_report(html, recipient, filename)


def build_view_object(program):
    indicators = get_program_indicators_with_labeled_periods_aggregate(program)
    results = OrderedDict()
    for indicator in indicators:
        result = indicator.result
        results.setdefault(result.id, {'item': result, 'indicators': []})
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
        indicators.setdefault(indicator.id, LabelPeriodMapIndicator(indicator))
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

    @property
    def labeled_periods(self):
        self._build()
        return self._labeled_periods.values()

    @cached_property
    def is_cumulative(self):
        return self._real.is_cumulative()

    @cached_property
    def disaggregations(self):
        disaggregations = self._get_cumulative_disaggregations() if self.is_cumulative else self._get_non_cumulative_disaggregations()
        if self.type == IndicatorType.PERCENTAGE:
            for category, types in disaggregations.items():
                for type in types.keys():
                    disaggregations[category][type]['value'] = calculate_percentage(
                        disaggregations[category][type]['numerator'],
                        disaggregations[category][type]['denominator']
                    )
        return disaggregations

    def _get_cumulative_disaggregations(self):
        disaggregations = {}
        latest_period = sorted(self.labeled_periods, key=lambda p: p.period.period_start)[-1] if self.labeled_periods else None
        if not latest_period:
            return disaggregations
        for d in latest_period.period_disaggregations.values():
            category = d['category']
            type = d['type']
            disaggregations.setdefault(category, {})[type] = {
                'value': d['value'],
                'numerator': d['numerator'],
                'denominator': d['denominator'],
            }
        return disaggregations

    def _get_non_cumulative_disaggregations(self):
        disaggregations = {}
        for period in self.labeled_periods:
            for d in period.disaggregations.values():
                category = d['category']
                type = d['type']
                disaggregations.setdefault(category, {}).setdefault(type, {'value': 0, 'numerator': 0, 'denominator': 0})
                disaggregations[category][type]['value'] += (d['value'] or 0)
                disaggregations[category][type]['numerator'] += (d['numerator'] or 0)
                disaggregations[category][type]['denominator'] += (d['denominator'] or 0)
        return disaggregations

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
            self._labeled_periods.setdefault(label, LabeledPeriod(period=period, label=label_obj, type=self.type, cumulative=self.is_cumulative))
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
                labeled_period = self._labeled_periods.setdefault(label, LabeledPeriod(
                    period=child_labeled_period.period.parent_period,
                    label=label_obj,
                    type=self.type,
                    cumulative=self.is_cumulative
                ))
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


@dataclass(frozen=True)
class LabeledPeriod:
    period: IndicatorPeriod
    label: IndicatorPeriodLabel
    type: IndicatorType
    cumulative: bool = False
    value: Optional[Decimal] = None
    numerator: Optional[Decimal] = None
    denominator: Optional[Decimal] = None
    disaggregations: Dict[Any, Any] = field(default_factory=dict)

    @property
    def target_value(self):
        return ensure_decimal(self.period.target_value)

    @property
    def actual_value(self):
        if self.cumulative:
            return ensure_decimal(self.period.actual_value)
        if self.type == IndicatorType.UNIT:
            return ensure_decimal(self.value)
        else:
            return calculate_percentage(self.numerator, self.denominator)

    @property
    def progress(self):
        return calculate_percentage(self.actual_value, self.target_value)

    def add_value(self, value, disaggregations={}):
        return replace(
            self,
            value=ensure_decimal(self.value) + ensure_decimal(value),
            disaggregations=self._add_disaggregation(disaggregations)
        )

    def add_percentage_value(self, numerator, denominator, disaggregations={}):
        return replace(
            self,
            numerator=ensure_decimal(self.numerator) + ensure_decimal(numerator),
            denominator=ensure_decimal(self.denominator) + ensure_decimal(denominator),
            disaggregations=self._add_disaggregation(disaggregations)
        )

    def get_disaggregation_of(self, category, type):
        key = (category, type)
        if key not in self.disaggregations and key not in self.period_disaggregations:
            return None
        if self.cumulative:
            return self.period_disaggregations.get(key, {'value': None})['value']
        if self.type == IndicatorType.UNIT:
            return self.disaggregations[key]['value']
        d = self.disaggregations[key]
        return calculate_percentage(d['numerator'], d['denominator'])

    def _add_disaggregation(self, disaggregations):
        result = copy.deepcopy(self.disaggregations)
        for key, disaggregation in disaggregations.items():
            if key not in result:
                result[key] = disaggregation.copy()
            elif self.type == IndicatorType.UNIT:
                result[key]['value'] += disaggregation['value']
            else:
                result[key]['numerator'] += disaggregation['numerator']
                result[key]['denominator'] += disaggregation['denominator']
        return result

    @cached_property
    def period_disaggregations(self):
        disaggregations = {}
        for d in self.period.disaggregations.all():
            category = d.dimension_value.name.name
            type = d.dimension_value.value
            disaggregations[(category, type)] = {
                'category': category,
                'type': type,
                'value': d.value,
                'numerator': d.numerator,
                'denominator': d.denominator,
            }
        return disaggregations
