
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
        self.dimension_name = IndicatorDimensionName.objects.create(project=self.project, name="Gender")
        self.dimension_value1 = IndicatorDimensionValue.objects.create(name=self.dimension_name, value="Men")
        self.dimension_value2 = IndicatorDimensionValue.objects.create(name=self.dimension_name, value="Women")
        self.indicator.dimension_names.add(self.dimension_name)

    def test_aggregate_to_period(self):
        # Given

        # When
        update1 = IndicatorPeriodData.objects.create(period=self.period, user=self.user, value=50, status='A')
        update1_disaggregation1 = Disaggregation.objects.create(dimension_value=self.dimension_value1, update=update1, value=20)
        update1_disaggregation2 = Disaggregation.objects.create(dimension_value=self.dimension_value2, update=update1, value=30)

        update2 = IndicatorPeriodData.objects.create(period=self.period, user=self.user, value=30, status='A')
        update2_disaggregation1 = Disaggregation.objects.create(dimension_value=self.dimension_value1, update=update2, value=15)
        update2_disaggregation2 = Disaggregation.objects.create(dimension_value=self.dimension_value2, update=update2, value=15)

        # Then
        self.assertEqual(self.period.disaggregations.count(), 2)

        period_disaggregation1 = self.period.disaggregations.filter(dimension_value=self.dimension_value1).get()
        self.assertEqual(
            period_disaggregation1.value,
            update1_disaggregation1.value + update2_disaggregation1.value
        )

        period_disaggregation2 = self.period.disaggregations.filter(dimension_value=self.dimension_value2).get()
        self.assertEqual(
            period_disaggregation2.value,
            update1_disaggregation2.value + update2_disaggregation2.value
        )

    def test_aggregate_percentages_to_period(self):
        # Given

        # When
        update1 = IndicatorPeriodData.objects.create(period=self.period, user=self.user, numerator=50, denominator=100, status='A')
        update1_disaggregation1 = Disaggregation.objects.create(dimension_value=self.dimension_value1, update=update1, numerator=20, denominator=50)
        update1_disaggregation2 = Disaggregation.objects.create(dimension_value=self.dimension_value2, update=update1, numerator=30, denominator=50)

        update2 = IndicatorPeriodData.objects.create(period=self.period, user=self.user, numerator=30, denominator=100, status='A')
        update2_disaggregation1 = Disaggregation.objects.create(dimension_value=self.dimension_value1, update=update2, numerator=15, denominator=50)
        update2_disaggregation2 = Disaggregation.objects.create(dimension_value=self.dimension_value2, update=update2, numerator=15, denominator=50)

        # Then
        self.assertEqual(self.period.disaggregations.count(), 2)

        period_disaggregation1 = self.period.disaggregations.filter(dimension_value=self.dimension_value1).get()
        self.assertEqual(
            period_disaggregation1.numerator,
            update1_disaggregation1.numerator + update2_disaggregation1.numerator
        )
        self.assertEqual(
            period_disaggregation1.denominator,
            update1_disaggregation1.denominator + update2_disaggregation1.denominator
        )

        period_disaggregation2 = self.period.disaggregations.filter(dimension_value=self.dimension_value2).get()
        self.assertEqual(
            period_disaggregation2.numerator,
            update1_disaggregation2.numerator + update2_disaggregation2.numerator
        )
        self.assertEqual(
            period_disaggregation2.denominator,
            update1_disaggregation2.denominator + update2_disaggregation2.denominator
        )

    def test_aggregate_child_period_to_parent(self):
        # Given
        child1 = self.create_project("Child 1")
        self.make_parent(self.project, child1)
        child1.import_results()

        child1_period = IndicatorPeriod.objects.filter(indicator__result__project=child1).get()
        child1_dimension_value1 = IndicatorDimensionValue.objects\
            .filter(name__project=child1, parent_dimension_value=self.dimension_value1)\
            .get()
        child1_dimension_value2 = IndicatorDimensionValue.objects\
            .filter(name__project=child1, parent_dimension_value=self.dimension_value2)\
            .get()

        child2 = self.create_project("Child 2")
        self.make_parent(self.project, child2)
        child2.import_results()

        child2_period = IndicatorPeriod.objects.filter(indicator__result__project=child2).get()
        child2_dimension_value1 = IndicatorDimensionValue.objects\
            .filter(name__project=child2, parent_dimension_value=self.dimension_value1)\
            .get()
        child2_dimension_value2 = IndicatorDimensionValue.objects\
            .filter(name__project=child2, parent_dimension_value=self.dimension_value2)\
            .get()

        # When
        update1 = IndicatorPeriodData.objects.create(period=child1_period, user=self.user, value=50, status='A')
        update1_disaggregation1 = Disaggregation.objects.create(dimension_value=child1_dimension_value1, update=update1, value=20)
        update1_disaggregation2 = Disaggregation.objects.create(dimension_value=child1_dimension_value2, update=update1, value=30)

        update2 = IndicatorPeriodData.objects.create(period=child2_period, user=self.user, value=30, status='A')
        update2_disaggregation1 = Disaggregation.objects.create(dimension_value=child2_dimension_value1, update=update2, value=15)
        update2_disaggregation2 = Disaggregation.objects.create(dimension_value=child2_dimension_value2, update=update2, value=15)

        # Then
        period_disaggregation1 = self.period.disaggregations.filter(dimension_value=self.dimension_value1).get()
        self.assertEqual(
            period_disaggregation1.value,
            update1_disaggregation1.value + update2_disaggregation1.value
        )

        period_disaggregation2 = self.period.disaggregations.filter(dimension_value=self.dimension_value2).get()
        self.assertEqual(
            period_disaggregation2.value,
            update1_disaggregation2.value + update2_disaggregation2.value
        )

    def test_aggregate_multi_level_hierarchy(self):
        # Given
        child = self.create_project("Child")
        self.make_parent(self.project, child)
        child.import_results()

        child_dimension_value1 = IndicatorDimensionValue.objects\
            .filter(name__project=child, parent_dimension_value=self.dimension_value1)\
            .get()
        child_dimension_value2 = IndicatorDimensionValue.objects\
            .filter(name__project=child, parent_dimension_value=self.dimension_value2)\
            .get()

        grandchild = self.create_project("Grandchild")
        self.make_parent(child, grandchild)
        grandchild.import_results()

        grandchild_period = IndicatorPeriod.objects.filter(indicator__result__project=grandchild).get()
        grandchild_dimension_value1 = IndicatorDimensionValue.objects\
            .filter(name__project=grandchild, parent_dimension_value=child_dimension_value1)\
            .get()
        grandchild_dimension_value2 = IndicatorDimensionValue.objects\
            .filter(name__project=grandchild, parent_dimension_value=child_dimension_value2)\
            .get()

        # When
        update1 = IndicatorPeriodData.objects.create(period=grandchild_period, user=self.user, value=50, status='A')
        update1_disaggregation1 = Disaggregation.objects.create(dimension_value=grandchild_dimension_value1, update=update1, value=20)
        update1_disaggregation2 = Disaggregation.objects.create(dimension_value=grandchild_dimension_value2, update=update1, value=30)

        update2 = IndicatorPeriodData.objects.create(period=grandchild_period, user=self.user, value=30, status='A')
        update2_disaggregation1 = Disaggregation.objects.create(dimension_value=grandchild_dimension_value1, update=update2, value=15)
        update2_disaggregation2 = Disaggregation.objects.create(dimension_value=grandchild_dimension_value2, update=update2, value=15)

        # Then
        self.assertEqual(self.period.disaggregations.count(), 2)

        period_disaggregation1 = self.period.disaggregations.filter(dimension_value=self.dimension_value1).get()
        self.assertEqual(
            period_disaggregation1.value,
            update1_disaggregation1.value + update2_disaggregation1.value
        )

        period_disaggregation2 = self.period.disaggregations.filter(dimension_value=self.dimension_value2).get()
        self.assertEqual(
            period_disaggregation2.value,
            update1_disaggregation2.value + update2_disaggregation2.value
        )
