
import datetime

from akvo.rsr.models import (
    Result, Indicator, IndicatorPeriod, IndicatorDimensionName,
    IndicatorDimensionValue, IndicatorPeriodData, Disaggregation)
from akvo.rsr.tests.base import BaseTestCase


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
        disaggregations = self._get_disaggregations(self.project)
        type1 = disaggregations.filter(value=self.type1).first()
        type2 = disaggregations.filter(value=self.type2).first()

        # When
        self._create_period_update(
            period=self.period,
            disaggregations=[
                {'type': type1, 'value': 20},
                {'type': type2, 'value': 30},
            ],
            update={'value': 50}
        )
        self._create_period_update(
            period=self.period,
            disaggregations=[
                {'type': type1, 'value': 15},
                {'type': type2, 'value': 15},
            ],
            update={'value': 30}
        )

        # Then
        self.assertEqual(self.period.disaggregations.count(), 2)
        self.assertEqual(
            self._get_period_disaggregation(self.period, self.type1).value,
            20 + 15
        )
        self.assertEqual(
            self._get_period_disaggregation(self.period, self.type2).value,
            30 + 15
        )

    def test_aggregate_percentages_to_period(self):
        # Given
        disaggregations = self._get_disaggregations(self.project)
        type1 = disaggregations.filter(value=self.type1).first()
        type2 = disaggregations.filter(value=self.type2).first()

        # When
        self._create_period_update(
            period=self.period,
            disaggregations=[
                {'type': type1, 'numerator': 20, 'denominator': 50},
                {'type': type2, 'numerator': 30, 'denominator': 50},
            ],
            update={'numerator': 50, 'denominator': 100}
        )
        self._create_period_update(
            period=self.period,
            disaggregations=[
                {'type': type1, 'numerator': 15, 'denominator': 50},
                {'type': type2, 'numerator': 15, 'denominator': 50},
            ],
            update={'numerator': 30, 'denominator': 100}
        )

        # Then
        self.assertEqual(self.period.disaggregations.count(), 2)

        period_disaggregation1 = self._get_period_disaggregation(self.period, self.type1)
        self.assertEqual(period_disaggregation1.numerator, 20 + 15)
        self.assertEqual(period_disaggregation1.denominator, 50 + 50)

        period_disaggregation2 = self._get_period_disaggregation(self.period, self.type2)
        self.assertEqual(period_disaggregation2.numerator, 30 + 15)
        self.assertEqual(period_disaggregation2.denominator, 50 + 50)

    def test_aggregate_child_period_to_parent(self):
        # Given
        child1 = self._make_contributor("Child 1", self.project)
        child1_period = self._get_period(child1)
        child1_disaggregations = self._get_disaggregations(child1)
        child1_type1 = child1_disaggregations.filter(value=self.type1).first()
        child1_type2 = child1_disaggregations.filter(value=self.type2).first()

        child2 = self._make_contributor("Child 2", self.project)
        child2_period = self._get_period(child2)
        child2_disaggregations = self._get_disaggregations(child1)
        child2_type1 = child2_disaggregations.filter(value=self.type1).first()
        child2_type2 = child2_disaggregations.filter(value=self.type2).first()

        # When
        self._create_period_update(child1_period, [
            {'type': child1_type1, 'value': 20},
            {'type': child1_type2, 'value': 30},
        ])
        self._create_period_update(child2_period, [
            {'type': child2_type1, 'value': 15},
            {'type': child2_type2, 'value': 15},
        ])

        # Then
        self.assertEqual(
            self._get_period_disaggregation(self.period, self.type1).value,
            20 + 15
        )
        self.assertEqual(
            self._get_period_disaggregation(self.period, self.type2).value,
            30 + 15
        )

    def test_should_not_aggregate_unapproved_updates(self):
        # Given
        child = self._make_contributor("Child", self.project)
        child_period = self._get_period(child)
        child_disaggregations = self._get_disaggregations(child)
        child_type1 = child_disaggregations.filter(value=self.type1).first()
        child_type2 = child_disaggregations.filter(value=self.type2).first()

        # When
        self._create_period_update(
            period=child_period,
            disaggregations=[
                {'type': child_type1, 'value': 20},
                {'type': child_type2, 'value': 30},
            ],
            status=IndicatorPeriodData.STATUS_PENDING_CODE
        )

        # Then
        self.assertEqual(self.period.disaggregations.count(), 2)
        self.assertEqual(
            self._get_period_disaggregation(self.period, self.type1).value,
            None
        )
        self.assertEqual(
            self._get_period_disaggregation(self.period, self.type2).value,
            None
        )

        self.assertEqual(child_period.disaggregations.count(), 2)
        self.assertEqual(
            self._get_period_disaggregation(child_period, self.type1).value,
            None
        )
        self.assertEqual(
            self._get_period_disaggregation(child_period, self.type2).value,
            None
        )

    def test_project_with_aggregate_to_parent_off(self):
        # Given
        child = self._make_contributor("Child", self.project)
        child.aggregate_to_parent = False
        child.save()

        child_period = self._get_period(child)
        child_disaggregations = self._get_disaggregations(child)
        child_type1 = child_disaggregations.filter(value=self.type1).first()
        child_type2 = child_disaggregations.filter(value=self.type2).first()

        # When
        self._create_period_update(
            period=child_period,
            disaggregations=[
                {'type': child_type1, 'value': 20},
                {'type': child_type2, 'value': 30},
            ]
        )

        # Then
        self.assertEqual(self.period.disaggregations.count(), 0)

        self.assertEqual(child_period.disaggregations.count(), 2)
        self.assertEqual(
            self._get_period_disaggregation(child_period, self.type1).value,
            20
        )
        self.assertEqual(
            self._get_period_disaggregation(child_period, self.type2).value,
            30
        )

    def test_project_with_aggregate_children_off(self):
        # Given
        self.project.aggregate_children = False
        self.project.save()

        child = self._make_contributor("Child", self.project)
        child_period = self._get_period(child)
        child_disaggregations = self._get_disaggregations(child)
        child_type1 = child_disaggregations.filter(value=self.type1).first()
        child_type2 = child_disaggregations.filter(value=self.type2).first()

        # When
        self._create_period_update(
            period=child_period,
            disaggregations=[
                {'type': child_type1, 'value': 20},
                {'type': child_type2, 'value': 30},
            ]
        )

        # Then
        self.assertEqual(self.period.disaggregations.count(), 0)

        self.assertEqual(child_period.disaggregations.count(), 2)
        self.assertEqual(
            self._get_period_disaggregation(child_period, self.type1).value,
            20
        )
        self.assertEqual(
            self._get_period_disaggregation(child_period, self.type2).value,
            30
        )

    def test_aggregate_multi_level_hierarchy(self):
        # Given
        child = self._make_contributor("Child", self.project)
        child_period = self._get_period(child)

        grandchild = self._make_contributor("Grandchild", child)
        grandchild_period = self._get_period(grandchild)
        grandchild_disaggregations = self._get_disaggregations(grandchild)
        grandchild_type1 = grandchild_disaggregations.filter(value=self.type1).first()
        grandchild_type2 = grandchild_disaggregations.filter(value=self.type2).first()

        # When
        self._create_period_update(grandchild_period, [
            {'type': grandchild_type1, 'value': 20},
            {'type': grandchild_type2, 'value': 30},
        ])
        self._create_period_update(grandchild_period, [
            {'type': grandchild_type1, 'value': 15},
            {'type': grandchild_type2, 'value': 15},
        ])

        # Then
        self.assertEqual(grandchild_period.disaggregations.count(), 2)
        self.assertEqual(
            self._get_period_disaggregation(grandchild_period, self.type1).value,
            20 + 15
        )
        self.assertEqual(
            self._get_period_disaggregation(grandchild_period, self.type2).value,
            30 + 15
        )

        self.assertEqual(child_period.disaggregations.count(), 2)
        self.assertEqual(
            self._get_period_disaggregation(child_period, self.type1).value,
            20 + 15
        )
        self.assertEqual(
            self._get_period_disaggregation(child_period, self.type2).value,
            30 + 15
        )

        self.assertEqual(self.period.disaggregations.count(), 2)
        self.assertEqual(
            self._get_period_disaggregation(self.period, self.type1).value,
            20 + 15
        )
        self.assertEqual(
            self._get_period_disaggregation(self.period, self.type2).value,
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
        child = self._make_contributor("Child", self.project)
        child_period1 = self.period.child_periods.first()
        child_period2 = period2.child_periods.first()
        child_disaggregations = self._get_disaggregations(child)
        child_type1 = child_disaggregations.filter(value=self.type1).first()
        child_type2 = child_disaggregations.filter(value=self.type2).first()

        # When
        self._create_period_update(child_period1, [
            {'type': child_type1, 'value': 20},
            {'type': child_type2, 'value': 30},
        ])
        self._create_period_update(child_period2, [
            {'type': child_type1, 'value': 15},
            {'type': child_type2, 'value': 15},
        ])

        # Then
        self.assertEqual(child_period1.disaggregations.count(), 2)
        self.assertEqual(
            self._get_period_disaggregation(child_period1, self.type1).value,
            20
        )
        self.assertEqual(
            self._get_period_disaggregation(child_period1, self.type2).value,
            30
        )
        self.assertEqual(self.period.disaggregations.count(), 2)
        self.assertEqual(
            self._get_period_disaggregation(self.period, self.type1).value,
            20
        )
        self.assertEqual(
            self._get_period_disaggregation(self.period, self.type2).value,
            30
        )

        self.assertEqual(child_period2.disaggregations.count(), 2)
        self.assertEqual(
            self._get_period_disaggregation(child_period2, self.type1).value,
            15
        )
        self.assertEqual(
            self._get_period_disaggregation(child_period2, self.type2).value,
            15
        )
        self.assertEqual(period2.disaggregations.count(), 2)
        self.assertEqual(
            self._get_period_disaggregation(period2, self.type1).value,
            15
        )
        self.assertEqual(
            self._get_period_disaggregation(period2, self.type2).value,
            15
        )

    def test_sum_local_and_aggregated_updates(self):
        # Given
        child = self._make_contributor("Child", self.project)
        child_period = self._get_period(child)
        child_disaggregations = self._get_disaggregations(child)
        child_type1 = child_disaggregations.filter(value=self.type1).first()
        child_type2 = child_disaggregations.filter(value=self.type2).first()

        grandchild = self._make_contributor("Grandchild", child)
        grandchild_period = self._get_period(grandchild)
        grandchild_disaggregations = self._get_disaggregations(grandchild)
        grandchild_type1 = grandchild_disaggregations.filter(value=self.type1).first()
        grandchild_type2 = grandchild_disaggregations.filter(value=self.type2).first()

        # When
        self._create_period_update(grandchild_period, [
            {'type': grandchild_type1, 'value': 20},
            {'type': grandchild_type2, 'value': 30},
        ])
        self._create_period_update(child_period, [
            {'type': child_type1, 'value': 15},
            {'type': child_type2, 'value': 15},
        ])

        # Then
        self.assertEqual(grandchild_period.disaggregations.count(), 2)
        self.assertEqual(
            self._get_period_disaggregation(grandchild_period, self.type1).value,
            20
        )
        self.assertEqual(
            self._get_period_disaggregation(grandchild_period, self.type2).value,
            30
        )

        self.assertEqual(child_period.disaggregations.count(), 2)
        self.assertEqual(
            self._get_period_disaggregation(child_period, self.type1).value,
            20 + 15
        )
        self.assertEqual(
            self._get_period_disaggregation(child_period, self.type2).value,
            30 + 15
        )

        self.assertEqual(self.period.disaggregations.count(), 2)
        self.assertEqual(
            self._get_period_disaggregation(self.period, self.type1).value,
            20 + 15
        )
        self.assertEqual(
            self._get_period_disaggregation(self.period, self.type2).value,
            30 + 15
        )

    def test_amend_on_the_lowest_level_case1(self):
        # Given
        child = self._make_contributor("Child", self.project)
        child_period = self._get_period(child)

        grandchild1 = self._make_contributor("Grandchild 1", child)
        grandchild1_period = self._get_period(grandchild1)
        grandchild1_disaggregations = self._get_disaggregations(grandchild1)
        grandchild1_type1 = grandchild1_disaggregations.filter(value=self.type1).first()
        grandchild1_type2 = grandchild1_disaggregations.filter(value=self.type2).first()

        grandchild2 = self._make_contributor("Grandchild r", child)
        grandchild2_period = self._get_period(grandchild2)
        grandchild2_disaggregations = self._get_disaggregations(grandchild2)
        grandchild2_type1 = grandchild2_disaggregations.filter(value=self.type1).first()
        grandchild2_type2 = grandchild2_disaggregations.filter(value=self.type2).first()

        self._create_period_update(grandchild1_period, [
            {'type': grandchild1_type1, 'value': 20},
            {'type': grandchild1_type2, 'value': 30},
        ])
        target_amend_update = self._create_period_update(grandchild1_period, [
            {'type': grandchild1_type1, 'value': 15},
            {'type': grandchild1_type2, 'value': 15},
        ])
        self._create_period_update(grandchild2_period, [
            {'type': grandchild2_type1, 'value': 30},
            {'type': grandchild2_type2, 'value': 30},
        ])

        # When
        self._amend_period_update_type(target_amend_update, self.type1, 20)

        # Then
        self.assertEqual(self.period.disaggregations.count(), 2)
        self.assertEqual(
            self._get_period_disaggregation(self.period, self.type1).value,
            20 + 15 + 30 + (-15 + 20)
        )
        self.assertEqual(
            self._get_period_disaggregation(self.period, self.type2).value,
            30 + 15 + 30
        )

        self.assertEqual(child_period.disaggregations.count(), 2)
        self.assertEqual(
            self._get_period_disaggregation(child_period, self.type1).value,
            20 + 15 + 30 + (-15 + 20)
        )
        self.assertEqual(
            self._get_period_disaggregation(child_period, self.type2).value,
            30 + 15 + 30
        )

    def test_amend_on_the_lowest_level_case2(self):
        # Given
        child1 = self._make_contributor("Child 1", self.project)
        child1_period = self._get_period(child1)

        child2 = self._make_contributor("Child 2", self.project)
        child2_period = self._get_period(child2)

        grandchild1 = self._make_contributor("Grandchild 1", child1)
        grandchild1_period = self._get_period(grandchild1)
        grandchild1_disaggregations = self._get_disaggregations(grandchild1)
        grandchild1_type1 = grandchild1_disaggregations.filter(value=self.type1).first()
        grandchild1_type2 = grandchild1_disaggregations.filter(value=self.type2).first()

        grandchild2 = self._make_contributor("Grandchild r", child2)
        grandchild2_period = self._get_period(grandchild2)
        grandchild2_disaggregations = self._get_disaggregations(grandchild2)
        grandchild2_type1 = grandchild2_disaggregations.filter(value=self.type1).first()
        grandchild2_type2 = grandchild2_disaggregations.filter(value=self.type2).first()

        self._create_period_update(grandchild1_period, [
            {'type': grandchild1_type1, 'value': 20},
            {'type': grandchild1_type2, 'value': 30},
        ])
        target_amend_update = self._create_period_update(grandchild1_period, [
            {'type': grandchild1_type1, 'value': 15},
            {'type': grandchild1_type2, 'value': 15},
        ])
        self._create_period_update(grandchild2_period, [
            {'type': grandchild2_type1, 'value': 30},
            {'type': grandchild2_type2, 'value': 30},
        ])

        # When
        self._amend_period_update_type(target_amend_update, self.type1, 20)

        # Then
        self.assertEqual(self.period.disaggregations.count(), 2)
        self.assertEqual(
            self._get_period_disaggregation(self.period, self.type1).value,
            20 + 15 + 30 + (-15 + 20)
        )
        self.assertEqual(
            self._get_period_disaggregation(self.period, self.type2).value,
            30 + 15 + 30
        )

        self.assertEqual(child1_period.disaggregations.count(), 2)
        self.assertEqual(
            self._get_period_disaggregation(child1_period, self.type1).value,
            20 + 15 + (-15 + 20)
        )
        self.assertEqual(
            self._get_period_disaggregation(child1_period, self.type2).value,
            30 + 15
        )

        self.assertEqual(child2_period.disaggregations.count(), 2)
        self.assertEqual(
            self._get_period_disaggregation(child2_period, self.type1).value,
            30
        )
        self.assertEqual(
            self._get_period_disaggregation(child2_period, self.type2).value,
            30
        )

    def test_delete_on_the_lowest_level(self):
        # Given
        child1 = self._make_contributor("Child 1", self.project)
        child1_period = self._get_period(child1)
        grandchild1 = self._make_contributor("Grandchild 1", child1)
        grandchild1_period = self._get_period(grandchild1)
        grandchild1_disaggregations = self._get_disaggregations(grandchild1)
        grandchild1_type1 = grandchild1_disaggregations.filter(value=self.type1).first()
        grandchild1_type2 = grandchild1_disaggregations.filter(value=self.type2).first()

        child2 = self._make_contributor("Child 2", self.project)
        grandchild2 = self._make_contributor("Grandchild r", child2)
        grandchild2_period = self._get_period(grandchild2)
        grandchild2_disaggregations = self._get_disaggregations(grandchild2)
        grandchild2_type1 = grandchild2_disaggregations.filter(value=self.type1).first()
        grandchild2_type2 = grandchild2_disaggregations.filter(value=self.type2).first()

        self._create_period_update(grandchild1_period, [
            {'type': grandchild1_type1, 'value': 20},
            {'type': grandchild1_type2, 'value': 30},
        ])
        target_amend_update = self._create_period_update(grandchild1_period, [
            {'type': grandchild1_type1, 'value': 15},
            {'type': grandchild1_type2, 'value': 15},
        ])
        self._create_period_update(grandchild2_period, [
            {'type': grandchild2_type1, 'value': 30},
            {'type': grandchild2_type2, 'value': 30},
        ])

        # When
        target_amend_update.delete()

        # Then
        self.assertEqual(self.period.disaggregations.count(), 2)
        self.assertEqual(
            self._get_period_disaggregation(self.period, self.type1).value,
            20 + 15 + 30 + (-15)
        )
        self.assertEqual(
            self._get_period_disaggregation(self.period, self.type2).value,
            30 + 15 + 30 + (-15)
        )

        self.assertEqual(child1_period.disaggregations.count(), 2)
        self.assertEqual(
            self._get_period_disaggregation(child1_period, self.type1).value,
            20 + 15 + (-15)
        )
        self.assertEqual(
            self._get_period_disaggregation(child1_period, self.type2).value,
            30 + 15 + (-15)
        )

    def _amend_period_update_type(self, update, type, value):
        disaggregation = update.disaggregations.filter(dimension_value__value=type).first()
        disaggregation.value = value
        disaggregation.save()

    def _create_period_update(self, period, disaggregations=[], update={}, status=IndicatorPeriodData.STATUS_APPROVED_CODE):
        data = IndicatorPeriodData.objects.create(
            period=period,
            user=self.user,
            value=update.get('value', None),
            numerator=update.get('numerator', None),
            denominator=update.get('denominator', None),
            status=status
        )
        for d in disaggregations:
            Disaggregation.objects.create(
                update=data,
                dimension_value=d['type'],
                value=d.get('value', None),
                numerator=d.get('numerator', None),
                denominator=d.get('denominator', None)
            )

        return data

    def _make_contributor(self, title, parent):
        child = self.create_project(title)
        self.make_parent(parent, child)
        child.import_results()

        return child

    def _get_period(self, project):
        return IndicatorPeriod.objects.filter(indicator__result__project=project).first()

    def _get_disaggregations(self, project):
        return IndicatorDimensionValue.objects.filter(name__project=project)

    def _get_period_disaggregation(self, period, type):
        return period.disaggregations.filter(dimension_value__value=type).first()
