# -*- coding: utf-8 -*-

"""Akvo RSR is covered by the GNU Affero General Public License.

See more details in the license.txt file located at the root folder of the Akvo RSR module.
For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.
"""
from akvo.rsr.models import (
    Result, Indicator, IndicatorPeriod, IndicatorPeriodData, Disaggregation, DisaggregationTarget,
    IndicatorDimensionName, IndicatorDimensionValue)
from akvo.rsr.tests.base import BaseTestCase
from datetime import date, timedelta
import random
import string


def contains_template_errors(markup):
    """Itterate over the markup looking for common errors."""
    common_errors = ['{%', '%}', '{{', '}}']
    return any(x in markup for x in common_errors)


def random_string(length=5):
    return ''.join(random.choice(string.ascii_lowercase) for i in range(length))


class ProjectFixtureBuilder(object):
    """
    Test data builder to build project with results framework to make arranging setup data
    easier and more readable.
    """
    def __init__(self):
        self.title = random_string()
        self.results = []
        self.disaggregations = {}
        self.partners = []
        self._disaggregations_cache = {}

    def with_title(self, title):
        self.title = title
        return self

    def with_disaggregations(self, disaggregations):
        self.disaggregations = disaggregations
        return self

    def with_results(self, results):
        self.results = results
        return self

    def with_partner(self, org, role=None):
        self.partners.append((org, role))
        return self

    def build(self):
        project = BaseTestCase.create_project(self.title)
        for partner, role in self.partners:
            BaseTestCase.make_partner(project, partner, role)
        self._build_disaggregations(project)
        for params in self.results:
            self._build_result(project, params)

        return ProjectFacade(project)

    def _build_result(self, project, params):
        indicators = params.get('indicators', [{'title': random_string()}])
        kwargs = params.copy()
        if 'indicators' in kwargs:
            del kwargs['indicators']
        kwargs['project'] = project
        result = Result.objects.create(**kwargs)
        for params in indicators:
            self._build_indicator(result, params)

    def _build_indicator(self, result, params):
        periods = params.get('periods', [{'period_start': date.today(), 'period_end': date.today() + timedelta(days=30)}])
        kwargs = params.copy()
        if 'periods' in kwargs:
            del kwargs['periods']
        kwargs['result'] = result
        indicator = Indicator.objects.create(**kwargs)
        for params in periods:
            self._build_period(indicator, params)

    def _build_period(self, indicator, params):
        disaggregation_targets = params.get('disaggregation_targets', {})
        kwargs = params.copy()
        if 'disaggregation_targets' in kwargs:
            del kwargs['disaggregation_targets']
        kwargs['indicator'] = indicator
        period = IndicatorPeriod.objects.create(**kwargs)
        for cat, types in disaggregation_targets.items():
            for t, value in types.items():
                type = self._disaggregations_cache[(cat, t)]
                DisaggregationTarget.objects.create(
                    period=period,
                    dimension_value=type,
                    value=value
                )

    def _build_disaggregations(self, project):
        for key, types in self.disaggregations.items():
            category = IndicatorDimensionName.objects.create(project=project, name=key)
            for t in types:
                type = IndicatorDimensionValue.objects.create(name=category, value=t)
                self._disaggregations_cache[(key, t)] = type


class ProjectFacade(object):
    """
    Test helper to work alongside the ProjectFixtureBuilder to make accessing project
    results framework object more easy for testing purpose.
    """
    def __init__(self, project):
        self.project = project

    @property
    def object(self):
        return self.project

    @property
    def results(self):
        return self.object.results

    @property
    def indicators(self):
        return Indicator.objects.filter(result__project=self.project)

    @property
    def periods(self):
        return IndicatorPeriod.objects.filter(indicator__result__project=self.project)

    def get_disaggregation(self, category, type):
        return IndicatorDimensionValue.objects.get(
            name__project=self.project, name__name=category, value=type)

    def get_period(self, **kwargs):
        return PeriodFacade(self, self.periods.get(**kwargs))


class PeriodFacade(object):
    """
    Test helper to work alongside the ProjectFixtureBuilder and ProjectFacade to make
    period update action more easy for testing purpose.
    """
    def __init__(self, project, period):
        self.project = project
        self.period = period

    def __getattr__(self, attr):
        return getattr(self.period, attr)

    def get_disaggregation_target(self, category, type):
        dv = self.project.get_disaggregation(category, type)
        return DisaggregationTarget.objects.get(period=self.period, dimension_value=dv)

    def add_update(self, user, value=None, numerator=None, denominator=None,
                   disaggregations={}, status=IndicatorPeriodData.STATUS_APPROVED_CODE):
        data = IndicatorPeriodData.objects.create(
            period=self.period,
            user=user,
            value=value,
            numerator=numerator,
            denominator=denominator,
            status=status
        )
        for category, types in disaggregations.items():
            for type, vals in types.items():
                dv = self.project.get_disaggregation(category, type)
                Disaggregation.objects.create(
                    update=data,
                    dimension_value=dv,
                    value=vals.get('value', None),
                    numerator=vals.get('numerator', None),
                    denominator=vals.get('denominator', None)
                )
        return data
