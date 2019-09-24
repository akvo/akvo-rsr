# -*- coding: utf-8 -*-

"""
Akvo RSR is covered by the GNU Affero General Public License.

See more details in the license.txt file located at the root folder of the Akvo RSR module.
For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.
"""

import datetime
from akvo.rsr.models import (
    Result, Indicator, IndicatorPeriod, IndicatorDimensionName,
    IndicatorDimensionValue, IndicatorPeriodData, Disaggregation)
from akvo.rsr.tests.base import BaseTestCase


class DisaggregationContributionTestCase(BaseTestCase):

    def setUp(self):
        self.user = self.create_user("user@test.akvo.org", "password")
        self.project = self.create_project("Parent project")
        self.result = Result.objects.create(project=self.project, title="Result #1", type="1")
        self.indicator = Indicator.objects.create(result=self.result, title="Indicator #1", measure="1")
        self.period = IndicatorPeriod.objects.create(
            indicator=self.indicator,
            period_start=datetime.date.today(),
            period_end=datetime.date.today() + datetime.timedelta(days=1),
            target_value="100"
        )
        self.dimension_name = IndicatorDimensionName.objects.create(project=self.project, name="Gender")
        self.dimension_value = IndicatorDimensionValue.objects.create(name=self.dimension_name, value="Men")
        self.indicator.dimension_names.add(self.dimension_name)

    def test_no_contribution(self):
        # Given

        # When
        update1 = IndicatorPeriodData.objects.create(period=self.period, user=self.user, value=1, status='A')
        Disaggregation.objects.create(dimension_value=self.dimension_value, update=update1, value=20)

        update2 = IndicatorPeriodData.objects.create(period=self.period, user=self.user, value=1, status='A')
        Disaggregation.objects.create(dimension_value=self.dimension_value, update=update2, value=15)

        # Then
        period_disaggregation = self.period.disaggregations.filter(dimension_value=self.dimension_value).get()

        self.assertEqual(period_disaggregation.contributors.count(), 0)


    def test_disaggregation_contribution_from_child_to_parent(self):
        # Given
        child1 = self.create_project("Child 1")
        self.make_parent(self.project, child1)
        child1.import_results()

        child1_period = IndicatorPeriod.objects.filter(indicator__result__project=child1).get()
        child1_dimension_value = IndicatorDimensionValue.objects\
            .filter(name__project=child1, parent_dimension_value=self.dimension_value)\
            .get()

        child2 = self.create_project("Child 2")
        self.make_parent(self.project, child2)
        child2.import_results()

        child2_period = IndicatorPeriod.objects.filter(indicator__result__project=child2).get()
        child2_dimension_value = IndicatorDimensionValue.objects\
            .filter(name__project=child2, parent_dimension_value=self.dimension_value)\
            .get()

        # When
        update1 = IndicatorPeriodData.objects.create(period=child1_period, user=self.user, value=1, status='A')
        update1_disaggregation = Disaggregation.objects.create(dimension_value=child1_dimension_value, update=update1, value=20)

        update2 = IndicatorPeriodData.objects.create(period=child2_period, user=self.user, value=1, status='A')
        update2_disaggregation = Disaggregation.objects.create(dimension_value=child2_dimension_value, update=update2, value=15)

        # Then
        period_disaggregation = self.period.disaggregations.filter(dimension_value=self.dimension_value).get()

        self.assertEqual(period_disaggregation.contributors.count(), 2)

        contribution1 = period_disaggregation.contributors.filter(contributing_project=child1).get()
        contribution2 = period_disaggregation.contributors.filter(contributing_project=child2).get()

        self.assertEqual(contribution1.value, update1_disaggregation.value)
        self.assertEqual(contribution2.value, update2_disaggregation.value)

    def test_multi_level_disaggregation_contribution(self):
        # Given
        child1 = self.create_project("Child 1")
        self.make_parent(self.project, child1)
        child1.import_results()

        child1_dimension_value = IndicatorDimensionValue.objects\
            .filter(name__project=child1, parent_dimension_value=self.dimension_value)\
            .get()

        grandchild1 = self.create_project("Grandchild 1")
        self.make_parent(child1, grandchild1)
        grandchild1.import_results()

        grandchild1_period = IndicatorPeriod.objects.filter(indicator__result__project=grandchild1).get()
        grandchild1_dimension_value = IndicatorDimensionValue.objects\
            .filter(name__project=grandchild1, parent_dimension_value=child1_dimension_value)\
            .get()

        child2 = self.create_project("Child 2")
        self.make_parent(self.project, child2)
        child2.import_results()

        child2_dimension_value = IndicatorDimensionValue.objects\
            .filter(name__project=child2, parent_dimension_value=self.dimension_value)\
            .get()

        grandchild2 = self.create_project("Grandchild 2")
        self.make_parent(child2, grandchild2)
        grandchild2.import_results()

        grandchild2_period = IndicatorPeriod.objects.filter(indicator__result__project=grandchild2).get()
        grandchild2_dimension_value = IndicatorDimensionValue.objects\
            .filter(name__project=grandchild2, parent_dimension_value=child2_dimension_value)\
            .get()

        # When
        update1 = IndicatorPeriodData.objects.create(period=grandchild1_period, user=self.user, value=1, status='A')
        update1_disaggregation = Disaggregation.objects.create(dimension_value=grandchild1_dimension_value, update=update1, value=20)

        update2 = IndicatorPeriodData.objects.create(period=grandchild2_period, user=self.user, value=1, status='A')
        update2_disaggregation = Disaggregation.objects.create(dimension_value=grandchild2_dimension_value, update=update2, value=15)

        # Then
        period_disaggregation = self.period.disaggregations.filter(dimension_value=self.dimension_value).get()

        self.assertEqual(period_disaggregation.contributors.count(), 2)

        contribution1 = period_disaggregation.contributors.filter(contributing_project=child1).get()
        contribution2 = period_disaggregation.contributors.filter(contributing_project=child2).get()

        self.assertEqual(contribution1.value, update1_disaggregation.value)
        self.assertEqual(contribution2.value, update2_disaggregation.value)
