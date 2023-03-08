# -*- coding: utf-8 -*-

"""Akvo RSR is covered by the GNU Affero General Public License.

See more details in the license.txt file located at the root folder of the Akvo RSR module.
For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.
"""
from akvo.rsr.models import (
    Project, Result, Indicator, IndicatorPeriod, IndicatorPeriodData, Disaggregation, DisaggregationTarget,
    IndicatorDimensionName, IndicatorDimensionValue, IndicatorPeriodLabel, IndicatorPeriodDataComment,
)
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
        self.period_labels = []
        self.partners = []
        self.contributors = []
        self._disaggregations_map = {}

    def with_title(self, title):
        self.title = title
        return self

    def with_period_labels(self, labels):
        self.period_labels = labels
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

    def with_contributors(self, contributors):
        self.contributors = contributors
        return self

    def build(self):
        project = BaseTestCase.create_project(self.title)
        for label in self.period_labels:
            IndicatorPeriodLabel.objects.create(label=label, project=project)
        for partner, role in self.partners:
            BaseTestCase.make_partner(project, partner, role)
        self._build_disaggregations(project)
        for params in self.results:
            self._build_result(project, params)
        self._build_contributors(self.contributors, project)
        return ProjectFacade(project)

    def _build_result(self, project, params):
        indicators = params.get('indicators', [{'title': random_string()}])
        kwargs = params.copy()
        if 'indicators' in kwargs:
            del kwargs['indicators']
        kwargs['project'] = project
        result = Result.objects.create(**kwargs)
        for params in indicators:
            self._build_indicator(project, result, params)

    def _build_indicator(self, project, result, params):
        periods = params.get('periods', [{'period_start': date.today(), 'period_end': date.today() + timedelta(days=30)}])
        kwargs = params.copy()
        if 'periods' in kwargs:
            del kwargs['periods']
        enumerators = kwargs.pop('enumerators', [])
        kwargs['result'] = result
        indicator = Indicator.objects.create(**kwargs)
        for dimension_name in project.dimension_names.all():
            indicator.dimension_names.add(dimension_name)
        for params in periods:
            self._build_period(project, indicator, params)
        for enumerator in enumerators:
            indicator.enumerators.add(enumerator)

    def _build_period(self, project, indicator, params):
        disaggregation_targets = params.get('disaggregation_targets', {})
        kwargs = params.copy()
        if 'disaggregation_targets' in kwargs:
            del kwargs['disaggregation_targets']
        if 'label' in kwargs:
            label, _ = IndicatorPeriodLabel.objects.get_or_create(label=kwargs['label'], project=project)
            kwargs['label'] = label
        kwargs['indicator'] = indicator
        period = IndicatorPeriod.objects.create(**kwargs)
        for cat, types in disaggregation_targets.items():
            for t, value in types.items():
                type = self._disaggregations_map[(cat, t)]
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
                self._disaggregations_map[(key, t)] = type

    def _build_contributors(self, contributors, lead):
        for contributor in contributors:
            project = BaseTestCase.create_contributor(contributor['title'], lead)
            self._build_contributors(contributor.get('contributors', []), project)


class ProjectFacade(object):
    """
    Test helper to work alongside the ProjectFixtureBuilder to make accessing project
    results framework object more easy for testing purpose.
    """
    def __init__(self, project: Project):
        self.project = project
        self._descendants = None

    def __getattr__(self, attr):
        return getattr(self.project, attr)

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

    def get_label(self, label):
        return self.project.period_labels.get(label=label)

    def get_period(self, **kwargs):
        return PeriodFacade(self, self.periods.get(**kwargs))

    def get_contributor(self, **kwargs):
        if self._descendants is None:
            self._descendants = self.project.descendants()
        return ProjectFacade(self._descendants.get(**kwargs))


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

    @property
    def object(self):
        return self.period

    def get_disaggregation_target(self, category, type):
        dv = self.project.get_disaggregation(category, type)
        return DisaggregationTarget.objects.get(period=self.period, dimension_value=dv)

    def set_label(self, label):
        self.period.label = label
        self.period.save()
        return self

    def add_update(self, user, value=None, numerator=None, denominator=None,
                   disaggregations={}, status=IndicatorPeriodData.STATUS_APPROVED_CODE, comments=[]):
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
        for comment in comments:
            IndicatorPeriodDataComment.objects.create(data=data, user=user, comment=comment)
        return data
