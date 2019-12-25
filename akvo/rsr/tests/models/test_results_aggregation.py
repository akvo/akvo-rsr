# -*- coding: utf-8 -*-

# Akvo Reporting is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


from unittest import TestCase

from decimal import Decimal
from django.contrib.auth import get_user_model
from django_pgviews.models import ViewSyncer

from akvo.rsr.models import (Indicator, IndicatorPeriod, IndicatorPeriodData, Project, Result,
                             PeriodActualValue, Disaggregation, IndicatorDimensionName,
                             IndicatorDimensionValue)
from akvo.rsr.models.result.indicator_period_aggregation import PeriodDisaggregation
from akvo.rsr.models.result.utils import PERCENTAGE_MEASURE

User = get_user_model()


class PeriodActualValueTestCase(TestCase):
    """Tests for the indicator period model"""

    def setUp(self):
        # Setup a project with results framework and a user
        self.project = Project.objects.create(title="Test project 1")
        self.result = Result.objects.create(project=self.project, title='Test Result')
        self.indicator = Indicator.objects.create(result=self.result, title='Test Indicator')
        self.period = IndicatorPeriod.objects.create(indicator=self.indicator,
                                                     actual_comment='initial actual comment')
        self.user, _ = User.objects.get_or_create(username='user1@com.com', email='user1@com.com')

        #  set up PG views
        vs = ViewSyncer()
        vs.run(True, True)

    def tearDown(self):
        User.objects.all().delete()

    def test_actual_value_with_two_approved_updates(self):
        # Given
        period = self.period
        user = self.user
        approved = IndicatorPeriodData.STATUS_APPROVED_CODE

        # When
        IndicatorPeriodData.objects.create(period=period, user=user, status=approved, value=17.1)
        IndicatorPeriodData.objects.create(period=period, user=user, status=approved,
                                           value=4711.2)

        # Then
        actual_value = PeriodActualValue.objects.get(period=period)
        self.assertEqual(actual_value.value, Decimal("4728.3"))

    def test_actual_value_with_one_approved_update(self):
        # Given
        period = self.period
        user = self.user
        approved = IndicatorPeriodData.STATUS_APPROVED_CODE
        draft = IndicatorPeriodData.STATUS_DRAFT_CODE

        # When
        IndicatorPeriodData.objects.create(period=period, user=user, status=approved, value=17)
        IndicatorPeriodData.objects.create(period=period, user=user, status=draft, value=4711)

        # Then
        actual_value = PeriodActualValue.objects.get(period=period)
        self.assertEqual(actual_value.value, 17)

    def test_actual_value_percentages_with_two_updates(self):
        # Given
        period = self.period
        user = self.user
        approved = IndicatorPeriodData.STATUS_APPROVED_CODE

        # When
        IndicatorPeriodData.objects.create(period=period, user=user, status=approved, value=None,
                                           numerator=3.14, denominator=17)
        IndicatorPeriodData.objects.create(period=period, user=user, status=approved, value=None,
                                           numerator=47.11, denominator=4711)

        # Then
        actual_value = PeriodActualValue.objects.get(period=period)
        self.assertEqual(actual_value.numerator, 50.25)
        self.assertEqual(actual_value.denominator, 4728)

    def test_actual_value_percentages_with_one_approved_updates(self):
        # Given
        period = self.period
        user = self.user
        approved = IndicatorPeriodData.STATUS_APPROVED_CODE
        draft = IndicatorPeriodData.STATUS_DRAFT_CODE

        # When
        IndicatorPeriodData.objects.create(period=period, user=user, status=approved,
                                           numerator=3.14, denominator=17)
        IndicatorPeriodData.objects.create(period=period, user=user, status=draft,
                                           numerator=47.11, denominator=4711)

        # Then
        actual_value = PeriodActualValue.objects.get(period=period)
        self.assertEqual(actual_value.numerator, Decimal("3.14"))
        self.assertEqual(actual_value.denominator, 17)


class PeriodDisaggregationTestCase(TestCase):
    """Tests for the indicator period model"""

    def setUp(self):
        # Setup a project with results framework and a user
        self.user, _ = User.objects.get_or_create(username='user1@com.com', email='user1@com.com')
        self.project = Project.objects.create(title="Test project 1")
        self.result = Result.objects.create(project=self.project, title='Test Result')
        self.indicator = Indicator.objects.create(result=self.result, title='Test Indicator')
        self.period = IndicatorPeriod.objects.create(indicator=self.indicator,
                                                     actual_comment='initial actual comment')
        self.dimension_name1 = IndicatorDimensionName.objects.create(
            project=self.project,
            name="Flavor"
        )
        self.dimension_name2 = IndicatorDimensionName.objects.create(
            project=self.project,
            name="Color"
        )
        self.dimension_value1 = IndicatorDimensionValue.objects.create(
            name=self.dimension_name1,
            value="Vanilla"
        )
        self.dimension_value2 = IndicatorDimensionValue.objects.create(
            name=self.dimension_name1,
            value="Chocolate"
        )
        self.dimension_value3 = IndicatorDimensionValue.objects.create(
            name=self.dimension_name2,
            value="Red"
        )
        self.indicator.dimension_names.add(self.dimension_name1)
        self.indicator.dimension_names.add(self.dimension_name2)
        self.update1 = IndicatorPeriodData.objects.create(
            period=self.period, user=self.user, value=17.11, status='A',
            numerator='17.11', denominator='100',
        )
        self.update1.refresh_from_db()
        self.update2 = IndicatorPeriodData.objects.create(
            period=self.period, user=self.user, value=47.89, status='A',
            numerator='47.89', denominator='100',
        )
        self.update2.refresh_from_db()
        self.update3 = IndicatorPeriodData.objects.create(
            period=self.period, user=self.user, value=88.88, status='D',
            numerator='88.88', denominator='100',
        )
        self.update3.refresh_from_db()
        #  set up PG views
        vs = ViewSyncer()
        vs.run(True, True)

    def tearDown(self):
        User.objects.all().delete()

    def test_disaggregated_values_aggregated_over_period(self):
        # Given
        indicator = self.indicator
        period = self.period
        update1 = self.update1
        update2 = self.update2
        update3 = self.update3
        dimension_value1 = self.dimension_value1
        dimension_value2 = self.dimension_value2
        dimension_value3 = self.dimension_value3

        # When
        Disaggregation.objects.create(
            dimension_value=dimension_value1, update=update1, value=11.1
        )
        Disaggregation.objects.create(
            dimension_value=dimension_value2, update=update1, value=6.01
        )
        Disaggregation.objects.create(
            dimension_value=dimension_value3, update=update1, value=23.45
        )
        Disaggregation.objects.create(
            dimension_value=dimension_value1, update=update2, value=31.57
        )
        Disaggregation.objects.create(
            dimension_value=dimension_value2, update=update2, value=16.32
        )
        # Note the following disaggregation are for draft updates and should not be included in the SUM
        Disaggregation.objects.create(
            dimension_value=dimension_value1, update=update3, value=12.34
        )
        Disaggregation.objects.create(
            dimension_value=dimension_value2, update=update3, value=47.11
        )
        period_disaggregations = PeriodDisaggregation.objects.filter(
            indicator=indicator, period=period
        )
        # Then
        vanilla = period_disaggregations.get(dimension_name="Flavor", dimension_value="Vanilla")
        chocolate = period_disaggregations.get(dimension_name="Flavor", dimension_value="Chocolate")
        red = period_disaggregations.get(dimension_name="Color", dimension_value="Red")
        self.assertEqual(vanilla.value, Decimal("42.67"))
        self.assertEqual(chocolate.value, Decimal("22.33"))
        self.assertEqual(red.value, Decimal("23.45"))

    def test_disaggregated_percentages_aggregated_over_period(self):
        # Given
        indicator = self.indicator
        period = self.period
        update1 = self.update1
        update2 = self.update2
        dimension_value1 = self.dimension_value1
        dimension_value2 = self.dimension_value2

        # When
        Disaggregation.objects.create(
            dimension_value=dimension_value1, update=update1, numerator=3.14, denominator=17
        )
        Disaggregation.objects.create(
            dimension_value=dimension_value2, update=update1, numerator=3.14, denominator=17
        )
        Disaggregation.objects.create(
            dimension_value=dimension_value1, update=update2, numerator=2.72, denominator=34
        )
        Disaggregation.objects.create(
            dimension_value=dimension_value2, update=update2, numerator=1.62, denominator=51
        )
        period_disaggregations = PeriodDisaggregation.objects.filter(
            indicator=indicator, period=period
        )
        # Then
        vanilla = period_disaggregations.get(dimension_name="Flavor", dimension_value="Vanilla")
        chocolate = period_disaggregations.get(dimension_name="Flavor", dimension_value="Chocolate")
        self.assertEqual(vanilla.numerator, Decimal("5.86"))
        self.assertEqual(vanilla.denominator, Decimal("51"))
        self.assertEqual(chocolate.numerator, Decimal("4.76"))
        self.assertEqual(chocolate.denominator, Decimal("68"))

    def test_incomplete_disaggregations_marked_on_save(self):
        # Given
        update1 = self.update1
        dimension_value1 = self.dimension_value1
        dimension_value2 = self.dimension_value2

        # When
        disaggregation1 = Disaggregation.objects.create(
            dimension_value=dimension_value1, update=update1, value=8)
        disaggregation2 = Disaggregation.objects.create(
            dimension_value=dimension_value2, update=update1, value=9)
        disaggregation1.refresh_from_db()
        disaggregation2.refresh_from_db()

        # Then
        self.assertTrue(disaggregation1.incomplete_data)
        self.assertTrue(disaggregation2.incomplete_data)

    def test_incomplete_percentage_disaggregation_marked_on_save(self):
        # Given
        self.indicator.measure = PERCENTAGE_MEASURE
        self.indicator.save()
        update1 = self.update1
        dimension_value1 = self.dimension_value1
        dimension_value2 = self.dimension_value2

        # When
        disaggregation1 = Disaggregation.objects.create(
            dimension_value=dimension_value1, update=update1, numerator=8, denominator=50)
        disaggregation2 = Disaggregation.objects.create(
            dimension_value=dimension_value2, update=update1, numerator=9, denominator=50)
        disaggregation1.refresh_from_db()
        disaggregation2.refresh_from_db()

        # Then
        self.assertTrue(disaggregation1.incomplete_data)
        self.assertTrue(disaggregation2.incomplete_data)

    def test_incomplete_disaggregations_marked_on_update_change(self):
        # Given
        update1 = self.update1
        self.update1.value = 18
        self.update1.save()
        dimension_value1 = self.dimension_value1
        dimension_value2 = self.dimension_value2
        disaggregation1 = Disaggregation.objects.create(
            dimension_value=dimension_value1, update=update1, value=9)
        disaggregation2 = Disaggregation.objects.create(
            dimension_value=dimension_value2, update=update1, value=9)
        disaggregation1.refresh_from_db()
        disaggregation2.refresh_from_db()
        self.assertFalse(disaggregation1.incomplete_data)
        self.assertFalse(disaggregation2.incomplete_data)

        # When
        self.update1.value = 20
        self.update1.save()
        disaggregation1.refresh_from_db()
        disaggregation2.refresh_from_db()

        # Then
        self.assertTrue(disaggregation1.incomplete_data)
        self.assertTrue(disaggregation2.incomplete_data)
