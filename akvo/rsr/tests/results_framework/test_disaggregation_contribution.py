# -*- coding: utf-8 -*-

"""
Akvo RSR is covered by the GNU Affero General Public License.

See more details in the license.txt file located at the root folder of the Akvo RSR module.
For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.
"""

import datetime
from akvo.rsr.models import (
    Result, Indicator, IndicatorPeriod, IndicatorDimensionName,
    IndicatorDimensionValue)
from akvo.rsr.tests.base import BaseTestCase
from . import util


class DisaggregationContributionTestCase(BaseTestCase):

    def setUp(self):
        self.user = self.create_user("user@test.akvo.org", "password")
        self.project = self.create_project("Parent project")
        result = Result.objects.create(project=self.project, title="Result #1", type="1")
        indicator = Indicator.objects.create(result=result, title="Indicator #1", measure="1")
        self.period = IndicatorPeriod.objects.create(
            indicator=indicator,
            period_start=datetime.date.today(),
            period_end=datetime.date.today() + datetime.timedelta(days=1),
            target_value="100"
        )
        self.type = "Type 1"
        category = IndicatorDimensionName.objects.create(project=self.project, name="Category")
        IndicatorDimensionValue.objects.create(name=category, value=self.type)
        indicator.dimension_names.add(category)

    def test_no_contribution(self):
        # Given
        type = util.get_disaggregations(self.project).filter(value=self.type).first()

        # When
        util.create_period_update(
            period=self.period, user=self.user, value=1,
            disaggregations=[{'type': type, 'value': 20}])
        util.create_period_update(
            period=self.period, user=self.user, value=1,
            disaggregations=[{'type': type, 'value': 15}])

        # Then
        self.assertEqual(
            util.get_disaggregation_contributors(self.period, self.type).count(),
            0)

    def test_disaggregation_contribution_from_child_to_parent(self):
        # Given
        child1 = self.create_contributor("Child 1", self.project)
        child1_period = util.get_periods(child1).first()
        child1_type = util.get_disaggregations(child1).filter(value=self.type).first()

        child2 = self.create_contributor("Child 2", self.project)
        child2_period = util.get_periods(child2).first()
        child2_type = util.get_disaggregations(child2).filter(value=self.type).first()

        # When
        util.create_period_update(
            period=child1_period, user=self.user, value=1,
            disaggregations=[{'type': child1_type, 'value': 20}])
        util.create_period_update(
            period=child2_period, user=self.user, value=1,
            disaggregations=[{'type': child2_type, 'value': 15}])

        # Then
        self.assertEqual(
            util.get_disaggregation_contributors(self.period, self.type).count(),
            2)
        self.assertEqual(
            util.get_disaggregation_contributors(self.period, self.type, child1).value,
            20)
        self.assertEqual(
            util.get_disaggregation_contributors(self.period, self.type, child2).value,
            15)

    def test_multi_level_disaggregation_contribution(self):
        # Given
        child1 = self.create_contributor("Child 1", self.project)

        grandchild1 = self.create_contributor("Grandchild 1", child1)
        grandchild1_period = util.get_periods(grandchild1).first()
        grandchild1_type = util.get_disaggregations(grandchild1)\
            .filter(value=self.type).first()

        child2 = self.create_contributor("Child 2", self.project)

        grandchild2 = self.create_contributor("Grandchild 2", child2)
        grandchild2_period = util.get_periods(grandchild2).first()
        grandchild2_type = util.get_disaggregations(grandchild2)\
            .filter(value=self.type).first()

        # When
        util.create_period_update(
            period=grandchild1_period, user=self.user, value=1,
            disaggregations=[{'type': grandchild1_type, 'value': 20}])
        util.create_period_update(
            period=grandchild2_period, user=self.user, value=1,
            disaggregations=[{'type': grandchild2_type, 'value': 15}])

        # Then
        self.assertEqual(
            util.get_disaggregation_contributors(self.period, self.type).count(),
            2)
        self.assertEqual(
            util.get_disaggregation_contributors(self.period, self.type, child1).value,
            20)
        self.assertEqual(
            util.get_disaggregation_contributors(self.period, self.type, child2).value,
            15)

    def test_amend_disaggregation_contributions(self):
        # Given
        child1 = self.create_contributor("Child 1", self.project)

        grandchild1 = self.create_contributor("Grandchild 1", child1)
        grandchild1_period = util.get_periods(grandchild1).first()
        grandchild1_type = util.get_disaggregations(grandchild1)\
            .filter(value=self.type).first()

        child2 = self.create_contributor("Child 2", self.project)

        grandchild2 = self.create_contributor("Grandchild 2", child2)
        grandchild2_period = util.get_periods(grandchild2).first()
        grandchild2_type = util.get_disaggregations(grandchild2)\
            .filter(value=self.type).first()

        util.create_period_update(
            period=grandchild1_period, user=self.user, value=1,
            disaggregations=[{'type': grandchild1_type, 'value': 20}])
        target_amend_update = util.create_period_update(
            period=grandchild2_period, user=self.user, value=1,
            disaggregations=[{'type': grandchild2_type, 'value': 15}])

        # When
        util.amend_disaggregation_update(target_amend_update, self.type, 30)

        # Then
        self.assertEqual(
            util.get_disaggregation_contributors(self.period, self.type).count(),
            2)
        self.assertEqual(
            util.get_disaggregation_contributors(self.period, self.type, child1).value,
            20)
        self.assertEqual(
            util.get_disaggregation_contributors(self.period, self.type, child2).value,
            30)

    def test_delete_period_update_contributions(self):
        # Given
        child1 = self.create_contributor("Child 1", self.project)

        grandchild1 = self.create_contributor("Grandchild 1", child1)
        grandchild1_period = util.get_periods(grandchild1).first()
        grandchild1_type = util.get_disaggregations(grandchild1)\
            .filter(value=self.type).first()

        child2 = self.create_contributor("Child 2", self.project)
        child2_period = util.get_periods(child2).first()

        grandchild2 = self.create_contributor("Grandchild 2", child2)
        grandchild2_period = util.get_periods(grandchild2).first()
        grandchild2_type = util.get_disaggregations(grandchild2)\
            .filter(value=self.type).first()

        util.create_period_update(
            period=grandchild1_period, user=self.user, value=1,
            disaggregations=[{'type': grandchild1_type, 'value': 20}])
        target_update = util.create_period_update(
            period=grandchild2_period, user=self.user, value=1,
            disaggregations=[{'type': grandchild2_type, 'value': 15}])

        # When
        target_update.delete()

        # Then
        self.assertEqual(
            util.get_disaggregation_contributors(self.period, self.type).count(),
            2)
        self.assertEqual(
            util.get_disaggregation_contributors(self.period, self.type, child1).value,
            20)
        self.assertEqual(
            util.get_disaggregation_contributors(self.period, self.type, child2).value,
            None)

        self.assertEqual(
            util.get_disaggregation_contributors(child2_period, self.type).count(),
            1)
        self.assertEqual(
            util.get_disaggregation_contributors(child2_period, self.type, grandchild2).value,
            None)
