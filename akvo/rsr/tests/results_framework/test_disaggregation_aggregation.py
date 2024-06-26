
import datetime

from akvo.rsr.models import (
    Result, Indicator, IndicatorPeriod, IndicatorDimensionName,
    IndicatorDimensionValue, IndicatorPeriodData)
from akvo.rsr.usecases.period_update_aggregation import aggregate
from akvo.rsr.tests.base import BaseTestCase
from . import util


class AggregateDisaggregationToParentTestCase(BaseTestCase):

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
        self.type1 = "Type 1"
        self.type2 = "Type 2"
        category = IndicatorDimensionName.objects.create(project=self.project, name="Category 1")
        IndicatorDimensionValue.objects.create(name=category, value=self.type1)
        IndicatorDimensionValue.objects.create(name=category, value=self.type2)
        self.indicator.dimension_names.add(category)

    def test_aggregate_to_period(self):
        # Given
        disaggregations = util.get_disaggregations(self.project)
        type1 = disaggregations.filter(value=self.type1).first()
        type2 = disaggregations.filter(value=self.type2).first()

        # When
        util.create_period_update(
            period=self.period,
            user=self.user,
            disaggregations=[
                {'type': type1, 'value': 20},
                {'type': type2, 'value': 30},
            ],
            value=50
        )
        aggregate(self.period)
        util.create_period_update(
            period=self.period,
            user=self.user,
            disaggregations=[
                {'type': type1, 'value': 15},
                {'type': type2, 'value': 15},
            ],
            value=30
        )
        aggregate(self.period)

        # Then
        self.assertEqual(self.period.disaggregations.count(), 2)
        self.assertEqual(
            util.get_period_disaggregation(self.period, self.type1).value,
            20 + 15
        )
        self.assertEqual(
            util.get_period_disaggregation(self.period, self.type2).value,
            30 + 15
        )

    def test_aggregate_percentages_to_period(self):
        # Given
        disaggregations = util.get_disaggregations(self.project)
        type1 = disaggregations.filter(value=self.type1).first()
        type2 = disaggregations.filter(value=self.type2).first()

        # When
        util.create_period_update(
            period=self.period,
            user=self.user,
            disaggregations=[
                {'type': type1, 'numerator': 20, 'denominator': 50},
                {'type': type2, 'numerator': 30, 'denominator': 50},
            ],
            numerator=50,
            denominator=100
        )
        aggregate(self.period)
        util.create_period_update(
            period=self.period,
            user=self.user,
            disaggregations=[
                {'type': type1, 'numerator': 15, 'denominator': 50},
                {'type': type2, 'numerator': 15, 'denominator': 50},
            ],
            numerator=30,
            denominator=100
        )
        aggregate(self.period)

        # Then
        self.assertEqual(self.period.disaggregations.count(), 2)

        period_disaggregation1 = util.get_period_disaggregation(self.period, self.type1)
        self.assertEqual(period_disaggregation1.numerator, 20 + 15)
        self.assertEqual(period_disaggregation1.denominator, 50 + 50)

        period_disaggregation2 = util.get_period_disaggregation(self.period, self.type2)
        self.assertEqual(period_disaggregation2.numerator, 30 + 15)
        self.assertEqual(period_disaggregation2.denominator, 50 + 50)

    def test_aggregate_child_period_to_parent(self):
        # Given
        child1 = self.create_contributor("Child 1", self.project)
        child1_period = util.get_periods(child1).first()
        child1_disaggregations = util.get_disaggregations(child1)
        child1_type1 = child1_disaggregations.filter(value=self.type1).first()
        child1_type2 = child1_disaggregations.filter(value=self.type2).first()

        child2 = self.create_contributor("Child 2", self.project)
        child2_period = util.get_periods(child2).first()
        child2_disaggregations = util.get_disaggregations(child2)
        child2_type1 = child2_disaggregations.filter(value=self.type1).first()
        child2_type2 = child2_disaggregations.filter(value=self.type2).first()

        # When
        util.create_period_update(child1_period, self.user, disaggregations=[
            {'type': child1_type1, 'value': 20},
            {'type': child1_type2, 'value': 30},
        ])
        aggregate(child1_period)
        util.create_period_update(child2_period, self.user, disaggregations=[
            {'type': child2_type1, 'value': 15},
            {'type': child2_type2, 'value': 15},
        ])
        aggregate(child2_period)

        # Then
        self.assertEqual(
            util.get_period_disaggregation(self.period, self.type1).value,
            20 + 15
        )
        self.assertEqual(
            util.get_period_disaggregation(self.period, self.type2).value,
            30 + 15
        )

    def test_should_not_aggregate_unapproved_updates(self):
        # Given
        child = self.create_contributor("Child", self.project)
        child_period = util.get_periods(child).first()
        child_disaggregations = util.get_disaggregations(child)
        child_type1 = child_disaggregations.filter(value=self.type1).first()
        child_type2 = child_disaggregations.filter(value=self.type2).first()

        # When
        util.create_period_update(
            period=child_period,
            user=self.user,
            disaggregations=[
                {'type': child_type1, 'value': 20},
                {'type': child_type2, 'value': 30},
            ],
            status=IndicatorPeriodData.STATUS_PENDING_CODE
        )
        aggregate(child_period)

        # Then
        self.assertEqual(self.period.disaggregations.count(), 2)
        self.assertEqual(
            util.get_period_disaggregation(self.period, self.type1).value,
            None
        )
        self.assertEqual(
            util.get_period_disaggregation(self.period, self.type2).value,
            None
        )

        self.assertEqual(child_period.disaggregations.count(), 2)
        self.assertEqual(
            util.get_period_disaggregation(child_period, self.type1).value,
            None
        )
        self.assertEqual(
            util.get_period_disaggregation(child_period, self.type2).value,
            None
        )

    def test_project_with_aggregate_to_parent_off(self):
        # Given
        child = self.create_contributor("Child", self.project)
        child.aggregate_to_parent = False
        child.save()

        child_period = util.get_periods(child).first()
        child_disaggregations = util.get_disaggregations(child)
        child_type1 = child_disaggregations.filter(value=self.type1).first()
        child_type2 = child_disaggregations.filter(value=self.type2).first()

        # When
        util.create_period_update(
            period=child_period,
            user=self.user,
            disaggregations=[
                {'type': child_type1, 'value': 20},
                {'type': child_type2, 'value': 30},
            ]
        )
        aggregate(child_period)

        # Then
        self.assertEqual(self.period.disaggregations.count(), 0)

        self.assertEqual(child_period.disaggregations.count(), 2)
        self.assertEqual(
            util.get_period_disaggregation(child_period, self.type1).value,
            20
        )
        self.assertEqual(
            util.get_period_disaggregation(child_period, self.type2).value,
            30
        )

    def test_project_with_aggregate_children_off(self):
        # Given
        self.project.aggregate_children = False
        self.project.save()

        child = self.create_contributor("Child", self.project)
        child_period = util.get_periods(child).first()
        child_disaggregations = util.get_disaggregations(child)
        child_type1 = child_disaggregations.filter(value=self.type1).first()
        child_type2 = child_disaggregations.filter(value=self.type2).first()

        # When
        util.create_period_update(
            period=child_period,
            user=self.user,
            disaggregations=[
                {'type': child_type1, 'value': 20},
                {'type': child_type2, 'value': 30},
            ]
        )
        aggregate(child_period)

        # Then
        self.assertEqual(self.period.disaggregations.count(), 0)

        self.assertEqual(child_period.disaggregations.count(), 2)
        self.assertEqual(
            util.get_period_disaggregation(child_period, self.type1).value,
            20
        )
        self.assertEqual(
            util.get_period_disaggregation(child_period, self.type2).value,
            30
        )

    def test_aggregate_multi_level_hierarchy(self):
        # Given
        child = self.create_contributor("Child", self.project)
        child_period = util.get_periods(child).first()

        grandchild = self.create_contributor("Grandchild", child)
        grandchild_period = util.get_periods(grandchild).first()
        grandchild_disaggregations = util.get_disaggregations(grandchild)
        grandchild_type1 = grandchild_disaggregations.filter(value=self.type1).first()
        grandchild_type2 = grandchild_disaggregations.filter(value=self.type2).first()

        # When
        util.create_period_update(grandchild_period, self.user, disaggregations=[
            {'type': grandchild_type1, 'value': 20},
            {'type': grandchild_type2, 'value': 30},
        ])
        aggregate(grandchild_period)
        util.create_period_update(grandchild_period, self.user, disaggregations=[
            {'type': grandchild_type1, 'value': 15},
            {'type': grandchild_type2, 'value': 15},
        ])
        aggregate(grandchild_period)

        # Then
        self.assertEqual(grandchild_period.disaggregations.count(), 2)
        self.assertEqual(
            util.get_period_disaggregation(grandchild_period, self.type1).value,
            20 + 15
        )
        self.assertEqual(
            util.get_period_disaggregation(grandchild_period, self.type2).value,
            30 + 15
        )

        self.assertEqual(child_period.disaggregations.count(), 2)
        self.assertEqual(
            util.get_period_disaggregation(child_period, self.type1).value,
            20 + 15
        )
        self.assertEqual(
            util.get_period_disaggregation(child_period, self.type2).value,
            30 + 15
        )

        self.assertEqual(self.period.disaggregations.count(), 2)
        self.assertEqual(
            util.get_period_disaggregation(self.period, self.type1).value,
            20 + 15
        )
        self.assertEqual(
            util.get_period_disaggregation(self.period, self.type2).value,
            30 + 15
        )

    def test_aggregate_multiple_periods(self):
        # Given
        period2 = IndicatorPeriod.objects.create(
            indicator=self.indicator,
            period_start=datetime.date.today(),
            period_end=datetime.date.today() + datetime.timedelta(days=1),
            target_value="200"
        )
        child = self.create_contributor("Child", self.project)
        child_period1 = self.period.child_periods.first()
        child_period2 = period2.child_periods.first()
        child_disaggregations = util.get_disaggregations(child)
        child_type1 = child_disaggregations.filter(value=self.type1).first()
        child_type2 = child_disaggregations.filter(value=self.type2).first()

        # When
        util.create_period_update(child_period1, self.user, disaggregations=[
            {'type': child_type1, 'value': 20},
            {'type': child_type2, 'value': 30},
        ])
        aggregate(child_period1)
        util.create_period_update(child_period2, self.user, disaggregations=[
            {'type': child_type1, 'value': 15},
            {'type': child_type2, 'value': 15},
        ])
        aggregate(child_period2)

        # Then
        self.assertEqual(child_period1.disaggregations.count(), 2)
        self.assertEqual(
            util.get_period_disaggregation(child_period1, self.type1).value,
            20
        )
        self.assertEqual(
            util.get_period_disaggregation(child_period1, self.type2).value,
            30
        )
        self.assertEqual(self.period.disaggregations.count(), 2)
        self.assertEqual(
            util.get_period_disaggregation(self.period, self.type1).value,
            20
        )
        self.assertEqual(
            util.get_period_disaggregation(self.period, self.type2).value,
            30
        )

        self.assertEqual(child_period2.disaggregations.count(), 2)
        self.assertEqual(
            util.get_period_disaggregation(child_period2, self.type1).value,
            15
        )
        self.assertEqual(
            util.get_period_disaggregation(child_period2, self.type2).value,
            15
        )
        self.assertEqual(period2.disaggregations.count(), 2)
        self.assertEqual(
            util.get_period_disaggregation(period2, self.type1).value,
            15
        )
        self.assertEqual(
            util.get_period_disaggregation(period2, self.type2).value,
            15
        )

    def test_sum_local_and_aggregated_updates(self):
        # Given
        child = self.create_contributor("Child", self.project)
        child_period = util.get_periods(child).first()
        child_disaggregations = util.get_disaggregations(child)
        child_type1 = child_disaggregations.filter(value=self.type1).first()
        child_type2 = child_disaggregations.filter(value=self.type2).first()

        grandchild = self.create_contributor("Grandchild", child)
        grandchild_period = util.get_periods(grandchild).first()
        grandchild_disaggregations = util.get_disaggregations(grandchild)
        grandchild_type1 = grandchild_disaggregations.filter(value=self.type1).first()
        grandchild_type2 = grandchild_disaggregations.filter(value=self.type2).first()

        # When
        util.create_period_update(grandchild_period, self.user, disaggregations=[
            {'type': grandchild_type1, 'value': 20},
            {'type': grandchild_type2, 'value': 30},
        ])
        aggregate(grandchild_period)
        util.create_period_update(child_period, self.user, disaggregations=[
            {'type': child_type1, 'value': 15},
            {'type': child_type2, 'value': 15},
        ])
        aggregate(child_period)

        # Then
        self.assertEqual(grandchild_period.disaggregations.count(), 2)
        self.assertEqual(
            util.get_period_disaggregation(grandchild_period, self.type1).value,
            20
        )
        self.assertEqual(
            util.get_period_disaggregation(grandchild_period, self.type2).value,
            30
        )

        self.assertEqual(child_period.disaggregations.count(), 2)
        self.assertEqual(
            util.get_period_disaggregation(child_period, self.type1).value,
            20 + 15
        )
        self.assertEqual(
            util.get_period_disaggregation(child_period, self.type2).value,
            30 + 15
        )

        self.assertEqual(self.period.disaggregations.count(), 2)
        self.assertEqual(
            util.get_period_disaggregation(self.period, self.type1).value,
            20 + 15
        )
        self.assertEqual(
            util.get_period_disaggregation(self.period, self.type2).value,
            30 + 15
        )

    def test_amend_on_the_lowest_level_case1(self):
        # Given
        child = self.create_contributor("Child", self.project)
        child_period = util.get_periods(child).first()

        grandchild1 = self.create_contributor("Grandchild 1", child)
        grandchild1_period = util.get_periods(grandchild1).first()
        grandchild1_disaggregations = util.get_disaggregations(grandchild1)
        grandchild1_type1 = grandchild1_disaggregations.filter(value=self.type1).first()
        grandchild1_type2 = grandchild1_disaggregations.filter(value=self.type2).first()

        grandchild2 = self.create_contributor("Grandchild r", child)
        grandchild2_period = util.get_periods(grandchild2).first()
        grandchild2_disaggregations = util.get_disaggregations(grandchild2)
        grandchild2_type1 = grandchild2_disaggregations.filter(value=self.type1).first()
        grandchild2_type2 = grandchild2_disaggregations.filter(value=self.type2).first()

        util.create_period_update(grandchild1_period, self.user, disaggregations=[
            {'type': grandchild1_type1, 'value': 20},
            {'type': grandchild1_type2, 'value': 30},
        ])
        aggregate(grandchild1_period)
        target_amend_update = util.create_period_update(grandchild1_period, self.user, disaggregations=[
            {'type': grandchild1_type1, 'value': 15},
            {'type': grandchild1_type2, 'value': 15},
        ])
        aggregate(grandchild1_period)
        util.create_period_update(grandchild2_period, self.user, disaggregations=[
            {'type': grandchild2_type1, 'value': 30},
            {'type': grandchild2_type2, 'value': 30},
        ])
        aggregate(grandchild2_period)

        # When
        util.amend_disaggregation_update(target_amend_update, self.type1, 20)
        aggregate(grandchild1_period)

        # Then
        self.assertEqual(self.period.disaggregations.count(), 2)
        self.assertEqual(
            util.get_period_disaggregation(self.period, self.type1).value,
            20 + 15 + 30 + (-15 + 20)
        )
        self.assertEqual(
            util.get_period_disaggregation(self.period, self.type2).value,
            30 + 15 + 30
        )

        self.assertEqual(child_period.disaggregations.count(), 2)
        self.assertEqual(
            util.get_period_disaggregation(child_period, self.type1).value,
            20 + 15 + 30 + (-15 + 20)
        )
        self.assertEqual(
            util.get_period_disaggregation(child_period, self.type2).value,
            30 + 15 + 30
        )

    def test_amend_on_the_lowest_level_case2(self):
        # Given
        child1 = self.create_contributor("Child 1", self.project)
        child1_period = util.get_periods(child1).first()

        child2 = self.create_contributor("Child 2", self.project)
        child2_period = util.get_periods(child2).first()

        grandchild1 = self.create_contributor("Grandchild 1", child1)
        grandchild1_period = util.get_periods(grandchild1).first()
        grandchild1_disaggregations = util.get_disaggregations(grandchild1)
        grandchild1_type1 = grandchild1_disaggregations.filter(value=self.type1).first()
        grandchild1_type2 = grandchild1_disaggregations.filter(value=self.type2).first()

        grandchild2 = self.create_contributor("Grandchild r", child2)
        grandchild2_period = util.get_periods(grandchild2).first()
        grandchild2_disaggregations = util.get_disaggregations(grandchild2)
        grandchild2_type1 = grandchild2_disaggregations.filter(value=self.type1).first()
        grandchild2_type2 = grandchild2_disaggregations.filter(value=self.type2).first()

        util.create_period_update(grandchild1_period, self.user, disaggregations=[
            {'type': grandchild1_type1, 'value': 20},
            {'type': grandchild1_type2, 'value': 30},
        ])
        aggregate(grandchild1_period)
        target_amend_update = util.create_period_update(grandchild1_period, self.user, disaggregations=[
            {'type': grandchild1_type1, 'value': 15},
            {'type': grandchild1_type2, 'value': 15},
        ])
        aggregate(grandchild1_period)
        util.create_period_update(grandchild2_period, self.user, disaggregations=[
            {'type': grandchild2_type1, 'value': 30},
            {'type': grandchild2_type2, 'value': 30},
        ])
        aggregate(grandchild2_period)

        # When
        util.amend_disaggregation_update(target_amend_update, self.type1, 20)
        aggregate(grandchild1_period)

        # Then
        self.assertEqual(self.period.disaggregations.count(), 2)
        self.assertEqual(
            util.get_period_disaggregation(self.period, self.type1).value,
            20 + 15 + 30 + (-15 + 20)
        )
        self.assertEqual(
            util.get_period_disaggregation(self.period, self.type2).value,
            30 + 15 + 30
        )

        self.assertEqual(child1_period.disaggregations.count(), 2)
        self.assertEqual(
            util.get_period_disaggregation(child1_period, self.type1).value,
            20 + 15 + (-15 + 20)
        )
        self.assertEqual(
            util.get_period_disaggregation(child1_period, self.type2).value,
            30 + 15
        )

        self.assertEqual(child2_period.disaggregations.count(), 2)
        self.assertEqual(
            util.get_period_disaggregation(child2_period, self.type1).value,
            30
        )
        self.assertEqual(
            util.get_period_disaggregation(child2_period, self.type2).value,
            30
        )

    def test_delete_on_the_lowest_level(self):
        # Given
        child1 = self.create_contributor("Child 1", self.project)
        child1_period = util.get_periods(child1).first()
        grandchild1 = self.create_contributor("Grandchild 1", child1)
        grandchild1_period = util.get_periods(grandchild1).first()
        grandchild1_disaggregations = util.get_disaggregations(grandchild1)
        grandchild1_type1 = grandchild1_disaggregations.filter(value=self.type1).first()
        grandchild1_type2 = grandchild1_disaggregations.filter(value=self.type2).first()

        child2 = self.create_contributor("Child 2", self.project)
        grandchild2 = self.create_contributor("Grandchild r", child2)
        grandchild2_period = util.get_periods(grandchild2).first()
        grandchild2_disaggregations = util.get_disaggregations(grandchild2)
        grandchild2_type1 = grandchild2_disaggregations.filter(value=self.type1).first()
        grandchild2_type2 = grandchild2_disaggregations.filter(value=self.type2).first()

        util.create_period_update(grandchild1_period, self.user, disaggregations=[
            {'type': grandchild1_type1, 'value': 20},
            {'type': grandchild1_type2, 'value': 30},
        ])
        aggregate(grandchild1_period)
        target_update = util.create_period_update(grandchild1_period, self.user, disaggregations=[
            {'type': grandchild1_type1, 'value': 15},
            {'type': grandchild1_type2, 'value': 15},
        ])
        aggregate(grandchild1_period)
        util.create_period_update(grandchild2_period, self.user, disaggregations=[
            {'type': grandchild2_type1, 'value': 30},
            {'type': grandchild2_type2, 'value': 30},
        ])
        aggregate(grandchild2_period)

        # When
        target_update.delete()
        aggregate(grandchild1_period)

        # Then
        self.assertEqual(self.period.disaggregations.count(), 2)
        self.assertEqual(
            util.get_period_disaggregation(self.period, self.type1).value,
            20 + 15 + 30 + (-15)
        )
        self.assertEqual(
            util.get_period_disaggregation(self.period, self.type2).value,
            30 + 15 + 30 + (-15)
        )

        self.assertEqual(child1_period.disaggregations.count(), 2)
        self.assertEqual(
            util.get_period_disaggregation(child1_period, self.type1).value,
            20 + 15 + (-15)
        )
        self.assertEqual(
            util.get_period_disaggregation(child1_period, self.type2).value,
            30 + 15 + (-15)
        )
