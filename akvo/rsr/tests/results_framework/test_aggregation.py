# -*- coding: utf-8 -*-

"""
Akvo RSR is covered by the GNU Affero General Public License.

See more details in the license.txt file located at the root folder of the Akvo RSR module.
For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.
"""

import datetime
import unittest

from akvo.rsr.models import (Project, Result, Indicator, IndicatorPeriod,
                             IndicatorPeriodData, User, RelatedProject)

from django.test import TestCase


class UnitAggregationTestCase(TestCase):

    indicator_measure = '1'
    APPROVED = IndicatorPeriodData.STATUS_APPROVED_CODE

    def setUp(self):
        # Create (super)user
        self.user = User.objects.create_superuser(
            username="Super user",
            email="superuser.results@test.akvo.org",
            password="password"
        )

        # Create a couple of projects - child and parent
        self.parent_project = self.create_published_project('Parent project')
        self.child_project = self.create_child_project('Child project')

        # Create results framework
        self.result = Result.objects.create(
            project=self.parent_project, title='Result #1', type='1'
        )
        self.indicator = Indicator.objects.create(
            result=self.result, title='Indicator #1', measure=self.indicator_measure
        )
        self.period = IndicatorPeriod.objects.create(
            indicator=self.indicator,
            period_start=datetime.date.today(),
            period_end=datetime.date.today() + datetime.timedelta(days=1),
            target_value="100"
        )

        # Import status
        self.import_status = 0

    @staticmethod
    def create_published_project(title):
        # create project
        project = Project.objects.create(
            title=title,
            subtitle="{} (subtitle)".format(title),
        )
        project.publish()
        return project

    def create_child_project(self, title):
        child_project = self.create_published_project(title)
        # Link child to parent
        RelatedProject.objects.create(
            project=self.parent_project,
            related_project=child_project,
            relation='2',
        )
        return child_project

    def create_indicator_period_update(self, data, relative_data=True, indicator_period=None):
        indicator_period_data = IndicatorPeriodData.objects.create(
            period=indicator_period if indicator_period is not None else self.period,
            user=self.user,
            data=data,
            relative_data=relative_data,
            status=self.APPROVED
        )
        return indicator_period_data

    def get_child_period(self, indicator_period, child_project=None):
        if child_project is None:
            child_project = self.child_project
        return indicator_period.child_periods.get(indicator__result__project=child_project)

    def test_should_set_period_actual_value(self):
        # Given
        actual_value = '40'
        period = IndicatorPeriod.objects.get(id=self.period.id)

        # When
        period.actual_value = actual_value
        period.save()

        # Then
        period = IndicatorPeriod.objects.get(id=self.period.id)
        self.assertEqual(actual_value, period.actual_value)

    def test_should_set_period_int_actual_value(self):
        # Given
        actual_value = 40
        period = IndicatorPeriod.objects.get(id=self.period.id)

        # When
        period.actual_value = actual_value
        period.save()

        # Then
        period = IndicatorPeriod.objects.get(id=self.period.id)
        self.assertEqual(unicode(actual_value), period.actual_value)

    def test_can_set_non_numeric_actual_value(self):
        # Given
        actual_value = 'n/a'
        period = IndicatorPeriod.objects.get(id=self.period.id)

        # When
        period.actual_value = actual_value
        period.save()

        # Then
        period = IndicatorPeriod.objects.get(id=self.period.id)
        self.assertEqual(actual_value, period.actual_value)

    # FIXME: Any initially set value for the actual_value cannot be kept track
    # of, the way the models are currently setup. Only update values are
    # considered and this value computed. Ensure that this field is read-only
    # in all inputs, and any indicator with no periods should have this value
    # as '0' or non-numeric.
    @unittest.skip('BUG?!: IndicatorPeriod actual_value seems to get overwritten')
    def test_should_update_actual_value_with_relative_data_update(self):
        # Given
        actual_value = 40
        increment = 2
        period = IndicatorPeriod.objects.get(id=self.period.id)
        period.actual_value = actual_value
        period.save()

        # When
        self.create_indicator_period_update(data=increment)

        # Then
        period = IndicatorPeriod.objects.get(id=self.period.id)
        self.assertEqual(unicode(actual_value + increment), period.actual_value)

    def test_should_update_actual_value_with_non_relative_data_update(self):
        # Given
        relative_data = False
        actual_value = 40
        new_value = 42
        period = IndicatorPeriod.objects.get(id=self.period.id)
        period.actual_value = actual_value
        period.save()

        # When
        self.create_indicator_period_update(data=new_value, relative_data=relative_data)

        # Then
        period = IndicatorPeriod.objects.get(id=self.period.id)
        self.assertEqual(unicode(new_value), period.actual_value)

    def test_should_aggregate_update_int_data(self):
        # Given
        increment = 2
        relative_data = True
        self.create_indicator_period_update(data=increment, relative_data=relative_data)

        # When
        self.create_indicator_period_update(data=increment, relative_data=relative_data)

        # Then
        period = IndicatorPeriod.objects.get(id=self.period.id)
        self.assertEqual(unicode(increment * 2), period.actual_value)

    def test_should_aggregate_update_str_negative_data(self):
        # Given
        original = 5
        increment = -2
        relative_data = True
        self.create_indicator_period_update(data=str(original), relative_data=relative_data)

        # When
        self.create_indicator_period_update(data=str(increment), relative_data=relative_data)

        # Then
        period = IndicatorPeriod.objects.get(id=self.period.id)
        self.assertEqual(unicode(original + increment), period.actual_value)

    def test_should_replace_update_int_data(self):
        # Given
        value = 2
        new_value = 20
        relative_data = False
        self.create_indicator_period_update(data=value, relative_data=relative_data)

        # When
        self.create_indicator_period_update(data=new_value, relative_data=relative_data)

        # Then
        period = IndicatorPeriod.objects.get(id=self.period.id)
        self.assertEqual(unicode(new_value), period.actual_value)

    def test_should_replace_with_non_numeric_update_data(self):
        # Given
        value = '2'
        new_value = 'something went wrong'
        relative_data = True
        self.create_indicator_period_update(data=value, relative_data=relative_data)

        # When
        self.create_indicator_period_update(data=new_value, relative_data=relative_data)

        # Then
        period = IndicatorPeriod.objects.get(id=self.period.id)
        self.assertEqual(unicode(new_value), period.actual_value)

    # Single child tests

    def test_should_copy_child_period_value(self):
        # Given
        value = 5
        self.period.actual_value = value
        self.period.save()
        self.child_project.import_results()
        child_value = 10
        child_indicator_period = self.get_child_period(self.period)

        # When
        self.create_indicator_period_update(
            data=child_value,
            indicator_period=child_indicator_period
        )

        # Then
        period = IndicatorPeriod.objects.get(id=self.period.id)
        self.assertEqual(unicode(child_value), period.actual_value)

    def test_should_not_aggregate_child_period_value(self):
        # Given
        self.parent_project.aggregate_children = False
        self.parent_project.save()
        value = 5
        self.period.actual_value = value
        self.period.save()
        self.child_project.import_results()
        child_value = 10
        child_indicator_period = self.get_child_period(self.period)

        # When
        self.create_indicator_period_update(
            data=child_value,
            indicator_period=child_indicator_period
        )

        # Then
        period = IndicatorPeriod.objects.get(id=self.period.id)
        self.assertEqual(unicode(value), period.actual_value)

    # Multiple children tests

    def test_should_aggregate_child_indicators_values(self):
        # Given
        child_project_2 = self.create_child_project('Child project 2')
        self.child_project.import_results()
        child_project_2.import_results()
        child_indicator_period = self.get_child_period(self.period)
        child_indicator_period_2 = self.get_child_period(self.period, child_project_2)
        value = 5

        # When
        self.create_indicator_period_update(data=value, indicator_period=child_indicator_period)
        self.create_indicator_period_update(data=value, indicator_period=child_indicator_period_2)

        # Then
        period = IndicatorPeriod.objects.get(id=self.period.id)
        self.assertEqual(unicode(value * 2), period.actual_value)

    def test_should_not_aggregate_excluded_child_period_values(self):
        # Given
        child_project_2 = self.create_child_project('Child project 2')
        self.child_project.import_results()
        child_project_2.import_results()
        child_project_2.aggregate_to_parent = False
        child_project_2.save()
        child_indicator_period = self.get_child_period(self.period)
        child_indicator_period_2 = self.get_child_period(self.period, child_project_2)
        value = 5

        # When
        self.create_indicator_period_update(data=value, indicator_period=child_indicator_period)
        self.create_indicator_period_update(data=value, indicator_period=child_indicator_period_2)

        # Then
        period = IndicatorPeriod.objects.get(id=self.period.id)
        self.assertEqual(unicode(value), period.actual_value)


class PercentageAggregationTestCase(UnitAggregationTestCase):
    """Tests the aggregation of percentage measure indicators."""

    indicator_measure = '2'

    def test_should_aggregate_child_indicators_values(self):
        """Overriden since aggregation for percentage indicators is average."""

        # Given
        child_project_2 = self.create_child_project('Child project 2')
        self.child_project.import_results()
        child_project_2.import_results()
        child_indicator_period = self.get_child_period(self.period)
        child_indicator_period_2 = self.get_child_period(self.period, child_project_2)
        value = 5

        # When
        self.create_indicator_period_update(data=value, indicator_period=child_indicator_period)
        self.create_indicator_period_update(data=value, indicator_period=child_indicator_period_2)

        # Then
        period = IndicatorPeriod.objects.get(id=self.period.id)
        self.assertEqual(unicode(value), period.actual_value)
