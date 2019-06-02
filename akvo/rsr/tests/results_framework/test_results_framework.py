# -*- coding: utf-8 -*-

"""
Akvo RSR is covered by the GNU Affero General Public License.

See more details in the license.txt file located at the root folder of the Akvo RSR module.
For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.
"""

import datetime
import unittest

from akvo.rsr.models import (
    Result, Indicator, IndicatorPeriod, IndicatorPeriodData, IndicatorReference, IndicatorDimension,
    RelatedProject)
from akvo.rsr.models.related_project import MultipleParentsDisallowed, ParentChangeDisallowed
from akvo.rsr.models.result.utils import QUALITATIVE
from akvo.rsr.tests.base import BaseTestCase


class ResultsFrameworkTestCase(BaseTestCase):
    """Tests the results framework."""

    def setUp(self):
        """
        In order to correctly test the results framework, we need the following objects in the
        database:

        - A user (to place updates).
        - Published parent project with child projects.
        """

        # Create user
        self.user = self.create_user("user@test.akvo.org", "password")

        # Create projects and relationship
        self.parent_project = self.create_project("Parent project")
        self.child_project = self.create_project("Child project")
        self.make_parent(self.parent_project, self.child_project)

        # Create results framework
        self.result = Result.objects.create(project=self.parent_project, title="Result #1", type="1")
        self.indicator = Indicator.objects.create(
            result=self.result,
            title="Indicator #1",
            measure="1",
            description='This is the best indicator',
        )
        self.period = IndicatorPeriod.objects.create(
            indicator=self.indicator,
            period_start=datetime.date.today(),
            period_end=datetime.date.today() + datetime.timedelta(days=1),
            target_value="100"
        )
        self.reference = IndicatorReference.objects.create(
            indicator=self.indicator,
            reference='ABC',
            vocabulary='1',
        )
        self.dimension = IndicatorDimension.objects.create(
            indicator=self.indicator,
            name='Foo',
            value='Bar',
        )

        # Import results framework into child
        self.import_status, self.import_message = self.child_project.import_results()

    def test_import_in_child(self):
        """
        Test if imported the results framework in the child was successful.
        """
        self.assertEqual(self.import_status, 1)
        self.assertEqual(self.import_message, "Results imported")

        child_period = IndicatorPeriod.objects.filter(
            indicator__result__project=self.child_project).first()
        self.assertEqual(child_period.indicator.result.parent_result, self.period.indicator.result)
        self.assertEqual(child_period.parent_period, self.period)

        child_reference = child_period.indicator.references.first()
        self.assertEqual(child_reference.reference, self.reference.reference)
        self.assertEqual(child_reference.vocabulary, self.reference.vocabulary)
        self.assertEqual(child_reference.vocabulary_uri, self.reference.vocabulary_uri)

        child_dimension = child_period.indicator.dimensions.first()
        self.assertEqual(child_dimension.name, self.dimension.name)
        self.assertEqual(child_dimension.value, self.dimension.value)

    def test_new_indicator_cloned_to_child(self):
        """Test that new indicators are cloned in children that have imported results."""
        # Given
        # # Child project has already imported results from parent.
        result = self.result

        # When
        parent_indicator = Indicator.objects.create(
            result=result,
            title="Indicator #2",
            measure="1",
            description='Second best indicator',
            baseline_year='2017',
            baseline_value='value',
            baseline_comment='comment',
            export_to_iati=False,
        )

        # Then
        self.assertEqual(
            Indicator.objects.filter(result=result).count(),
            Indicator.objects.filter(result__project=self.child_project).count()
        )
        parent_indicator = Indicator.objects.get(id=parent_indicator.id)
        child_indicator = Indicator.objects.get(result__project=self.child_project,
                                                parent_indicator=parent_indicator)
        self.assertEqual(child_indicator.title, parent_indicator.title)
        self.assertEqual(child_indicator.measure, parent_indicator.measure)
        self.assertEqual(child_indicator.ascending, parent_indicator.ascending)
        self.assertEqual(child_indicator.description, parent_indicator.description)
        self.assertEqual(child_indicator.baseline_year, parent_indicator.baseline_year)
        self.assertEqual(child_indicator.baseline_value, parent_indicator.baseline_value)
        self.assertEqual(child_indicator.baseline_comment, parent_indicator.baseline_comment)
        self.assertEqual(child_indicator.export_to_iati, parent_indicator.export_to_iati)

    def test_child_indicator_state_updates_after_change(self):
        """Test that updating indicator propagates to children."""

        # Given
        self.indicator.title = "Indicator #200"
        self.indicator.measure = "2"
        # # these properties were not set already, and hence should be updated too
        self.indicator.baseline_year = 2010
        self.indicator.baseline_value = 'value',
        self.indicator.baseline_comment = 'comment'
        self.indicator.export_to_iati = False

        # When
        self.indicator.save()

        # Then
        parent_indicator = Indicator.objects.get(id=self.indicator.id)
        child_indicator = Indicator.objects.get(result__project=self.child_project,
                                                parent_indicator=parent_indicator)
        self.assertEqual(child_indicator.title, parent_indicator.title)
        self.assertEqual(child_indicator.measure, parent_indicator.measure)
        self.assertEqual(child_indicator.ascending, parent_indicator.ascending)
        self.assertEqual(child_indicator.description, parent_indicator.description)
        self.assertEqual(child_indicator.baseline_year, parent_indicator.baseline_year)
        self.assertEqual(child_indicator.baseline_value, parent_indicator.baseline_value)
        self.assertEqual(child_indicator.baseline_comment, parent_indicator.baseline_comment)
        self.assertEqual(child_indicator.export_to_iati, parent_indicator.export_to_iati)

    def test_child_indicator_state_not_overwritten_after_change(self):
        """Test that updating indicator doesn't overwrite child indicators."""

        # Given
        child_indicator = Indicator.objects.get(result__project=self.child_project,
                                                parent_indicator=self.indicator)
        new_value = 'NEW VALUE'
        child_indicator.baseline_value = new_value
        child_indicator.baseline_comment = new_value
        child_indicator.baseline_year = 2002
        child_indicator.description = new_value
        child_indicator.save()

        # When
        self.indicator.baseline_year = 2010
        self.indicator.baseline_value = 'value',
        self.indicator.baseline_comment = 'comment'
        self.indicator.description = 'description'
        self.indicator.save()

        # Then
        parent_indicator = Indicator.objects.get(id=self.indicator.id)
        child_indicator = Indicator.objects.get(result__project=self.child_project,
                                                parent_indicator=parent_indicator)
        self.assertEqual(child_indicator.title, parent_indicator.title)
        self.assertEqual(child_indicator.measure, parent_indicator.measure)
        self.assertEqual(child_indicator.ascending, parent_indicator.ascending)
        self.assertEqual(child_indicator.description, new_value)
        self.assertEqual(child_indicator.baseline_year, 2002)
        self.assertEqual(child_indicator.baseline_value, new_value)
        self.assertEqual(child_indicator.baseline_comment, new_value)

    def test_new_period_cloned_to_child(self):
        """Test that new periods are cloned in children that have imported results."""
        # Given
        # # Child project has already imported results from parent.
        indicator = self.indicator

        # When
        parent_period = IndicatorPeriod.objects.create(
            indicator=indicator,
            period_start=datetime.date.today() - datetime.timedelta(days=10),
            period_end=datetime.date.today() + datetime.timedelta(days=10),
        )

        # Then
        self.assertEqual(
            IndicatorPeriod.objects.filter(indicator=indicator).count(),
            IndicatorPeriod.objects.filter(indicator__in=indicator.child_indicators.all()).count()
        )
        child_period = IndicatorPeriod.objects.get(indicator__result__project=self.child_project,
                                                   parent_period=parent_period)
        self.assertEqual(child_period.period_start, parent_period.period_start)
        self.assertEqual(child_period.period_end, parent_period.period_end)
        self.assertEqual(child_period.target_value, parent_period.target_value)
        self.assertEqual(child_period.target_comment, parent_period.target_comment)
        self.assertEqual(child_period.actual_comment, parent_period.actual_comment)

    def test_child_period_state_updates_after_change(self):
        """Test that updating period propagates to children."""
        # Given
        self.period.period_start = datetime.datetime.today() + datetime.timedelta(days=30)
        self.period.period_end = datetime.datetime.today() + datetime.timedelta(days=300)
        # # these properties were not set already, and hence should be updated too
        self.period.target_comment = "Target comment"
        self.period.actual_comment = "Actual comment"

        # When
        self.period.save()

        # Then
        parent_period = IndicatorPeriod.objects.get(id=self.period.pk)
        child_period = self.period.child_periods.first()
        self.assertEqual(child_period.period_start, parent_period.period_start)
        self.assertEqual(child_period.period_end, parent_period.period_end)
        self.assertEqual(child_period.target_comment, parent_period.target_comment)
        self.assertEqual(child_period.actual_comment, parent_period.actual_comment)

    def test_child_period_state_not_overwritten_after_change(self):
        """Test that changes made to child period are not overwritten."""
        # Given
        child_period = self.period.child_periods.first()
        target_value = "300"
        comment = "NEW COMMENT"
        child_period.target_value = target_value
        child_period.target_comment = comment
        child_period.actual_comment = comment
        child_period.save()

        # When
        self.period.target_value = "10"
        self.period.target_comment = "PARENT " + comment
        self.period.actual_comment = "PARENT " + comment
        self.period.save()

        # Then
        parent_period = IndicatorPeriod.objects.get(id=self.period.pk)
        child_period = self.period.child_periods.first()
        self.assertEqual(child_period.period_start, parent_period.period_start)
        self.assertEqual(child_period.period_end, parent_period.period_end)
        self.assertEqual(child_period.target_value, target_value)
        self.assertEqual(child_period.target_comment, comment)
        self.assertEqual(child_period.actual_comment, comment)

    def test_import_does_not_create_deleted_indicators(self):
        """Test that import does not create indicators that have been deleted from child."""
        # Given
        title = 'Indicator #2'
        result = self.parent_project.results.first()
        child_result = result.child_results.first()
        # New indicator created (also cloned to child)
        Indicator.objects.create(result=result, title=title, measure='1')

        # When
        # Import results framework into child
        child_result.indicators.get(title=title).delete()
        import_status, import_message = self.child_project.import_results()

        # Then
        self.assertEqual(import_status, 1)
        self.assertEqual(import_message, "Results imported")

        self.assertEqual(
            1,
            Indicator.objects.filter(result__project=self.child_project).count()
        )

    def test_indicator_update_does_not_create_deleted_indicators(self):
        """Test that indicator update doesn't create indicators deleted from child."""
        # Given
        title = 'Indicator #2'
        result = self.parent_project.results.first()
        # New indicator created (also cloned to child)
        indicator = Indicator.objects.create(result=result, title=title, measure='1')
        # Assert indicator has been cloned to child
        self.assertEqual(indicator.child_indicators.count(), 1)

        # When
        # Delete the child indicator
        indicator.child_indicators.first().delete()
        self.assertEqual(0, indicator.child_indicators.count())
        # Modify the parent indicator
        indicator.title = 'Indicator number two'
        indicator.save()

        # Then
        self.assertEqual(0, indicator.child_indicators.count())

    def test_import_does_not_create_deleted_periods(self):
        """Test that import does not create periods deleted from child."""
        # Given
        indicator = self.indicator
        child_indicator = indicator.child_indicators.first()
        # New indicator period created (also cloned to child)
        IndicatorPeriod.objects.create(indicator=indicator)

        # When
        # Import results framework into child
        child_indicator.periods.last().delete()
        import_status, import_message = self.child_project.import_results()

        # Then
        self.assertEqual(import_status, 1)
        self.assertEqual(import_message, "Results imported")
        self.assertEqual(1, child_indicator.periods.count())

    def test_period_update_does_not_create_deleted_periods(self):
        """Test that period update does not create periods deleted from child."""
        # Given
        # result = self.parent_project.results.first()
        # child_result = result.child_results.first()
        indicator = self.indicator
        child_indicator = self.indicator.child_indicators.first()
        # New indicator period created (also cloned to child)
        indicator_period = IndicatorPeriod.objects.create(indicator=indicator)

        # When
        # Import results framework into child
        child_indicator.periods.last().delete()
        # Update indicator period
        indicator_period.target_value = 100
        indicator_period.save()

        # Then
        self.assertEqual(1, child_indicator.periods.count())

    def test_new_dimension_cloned_to_child(self):
        """Test that new dimensions are cloned in children that have imported results."""
        # Given
        # # Child project has already imported results from parent.
        indicator = self.indicator

        # When
        dimension = IndicatorDimension.objects.create(
            indicator=indicator,
            name='Baz',
            value='Quux',
        )

        # Then
        self.assertEqual(
            IndicatorDimension.objects.filter(indicator=indicator).count(),
            IndicatorDimension.objects.filter(indicator__in=indicator.child_indicators.all()).count(),
        )
        self.assertEqual(indicator.child_indicators.count(), dimension.child_dimensions.count())

    def test_child_dimension_state_updates_after_change(self):
        """Test that updating period propagates to children."""
        # Given
        self.dimension.name = 'Baz'
        self.dimension.value = 'Quux',

        # When
        self.dimension.save()

        # Then
        parent_dimension = IndicatorDimension.objects.get(id=self.dimension.pk)
        child_period = IndicatorPeriod.objects.filter(
            indicator__result__project=self.child_project).first()
        child_dimension = child_period.indicator.dimensions.first()
        self.assertEqual(child_dimension.name, parent_dimension.name)
        self.assertEqual(child_dimension.value, parent_dimension.value)

    def test_import_does_not_create_deleted_dimensions(self):
        """Test that import does not create dimensions deleted from child."""
        # Given
        indicator = self.indicator
        child_indicator = indicator.child_indicators.first()
        # New dimension created (also cloned to child)
        IndicatorDimension.objects.create(indicator=indicator)

        # When
        # Import results framework into child
        child_indicator.dimensions.last().delete()
        import_status, import_message = self.child_project.import_results()

        # Then
        self.assertEqual(import_status, 1)
        self.assertEqual(import_message, "Results imported")
        self.assertEqual(1, child_indicator.dimensions.count())

    def test_dimension_update_does_not_create_deleted_dimension(self):
        """Test that dimension update does not create dimension deleted from child."""
        # Given
        indicator = self.indicator
        child_indicator = self.indicator.child_indicators.first()
        # New dimension created (also cloned to child)
        dimension = IndicatorDimension.objects.create(indicator=indicator)

        # When
        # Import results framework into child
        child_indicator.dimensions.last().delete()
        # Update dimension
        dimension.name = 'Baz'
        dimension.value = 'Quux'
        dimension.save()

        # Then
        self.assertEqual(1, child_indicator.dimensions.count())

    def test_update(self):
        """
        Test if placing updates will update the actual value of the period.
        """
        indicator_update = IndicatorPeriodData.objects.create(
            user=self.user,
            period=self.period,
            value="10"
        )
        self.assertEqual(self.period.actual_value, "")

        indicator_update.status = "A"
        indicator_update.save()
        self.assertEqual(self.period.actual_value, "10.00")

        indicator_update_2 = IndicatorPeriodData.objects.create(
            user=self.user,
            period=self.period,
            value="5"
        )
        self.assertEqual(self.period.actual_value, "10.00")

        indicator_update_2.status = "A"
        indicator_update_2.save()
        self.assertEqual(self.period.actual_value, "15.00")

    def test_edit_and_delete_updates(self):
        """
        Test if editing or deleting updates will update the actual value of the period.
        """
        indicator_update = IndicatorPeriodData.objects.create(
            user=self.user,
            period=self.period,
            value="10"
        )
        self.assertEqual(self.period.actual_value, "")

        indicator_update.status = "A"
        indicator_update.save()
        self.assertEqual(self.period.actual_value, "10.00")

        indicator_update.value = "11"
        indicator_update.save()
        self.assertEqual(self.period.actual_value, "11.00")

        indicator_update.delete()
        self.assertEqual(self.period.actual_value, "0")

    def test_update_on_child(self):
        """
        Test if placing an update on the child project will update the actual value of the period,
        and of the parent project's period.
        """
        indicator_update = IndicatorPeriodData.objects.create(
            user=self.user,
            period=self.period,
            value="10"
        )
        self.assertEqual(self.period.actual_value, "")

        indicator_update.status = "A"
        indicator_update.save()
        self.assertEqual(self.period.actual_value, "10.00")

        child_period = IndicatorPeriod.objects.filter(
            indicator__result__project=self.child_project).first()

        indicator_update_2 = IndicatorPeriodData.objects.create(
            user=self.user,
            period=child_period,
            value=15
        )
        self.assertEqual(child_period.actual_value, "")

        indicator_update_2.status = "A"
        indicator_update_2.save()
        self.assertEqual(child_period.actual_value, "15.00")

        parent_period = IndicatorPeriod.objects.filter(
            indicator__result__project=self.parent_project).first()
        self.assertEqual(parent_period.actual_value, "25.00")

    def test_update_without_aggregations(self):
        """
        Test if placing an update on the child project without an aggregation will not update the
        actual value of the parent project's period.
        """
        indicator_update = IndicatorPeriodData.objects.create(
            user=self.user,
            period=self.period,
            value=10
        )
        self.assertEqual(self.period.actual_value, "")

        indicator_update.status = "A"
        indicator_update.save()
        self.assertEqual(self.period.actual_value, "10.00")

        parent_project = self.period.indicator.result.project
        parent_project.aggregate_children = False
        parent_project.save(update_fields=['aggregate_children', ])

        child_period = IndicatorPeriod.objects.filter(
            indicator__result__project=self.child_project).first()

        indicator_update_2 = IndicatorPeriodData.objects.create(
            user=self.user,
            period=child_period,
            value=15
        )
        self.assertEqual(child_period.actual_value, "")

        indicator_update_2.status = "A"
        indicator_update_2.save()
        self.assertEqual(child_period.actual_value, "15.00")

        parent_period = IndicatorPeriod.objects.filter(
            indicator__result__project=self.parent_project).first()
        self.assertEqual(parent_period.actual_value, "10.00")

    def test_updates_with_percentages(self):
        """
        Test if placing an update on two child projects will give the average of the two in the
        parent project.
        """
        parent_indicator = Indicator.objects.filter(
            title="Indicator #1", result__project=self.parent_project).first()
        parent_indicator.measure = '2'
        parent_indicator.save()

        child_indicator = Indicator.objects.filter(
            title="Indicator #1", result__project=self.child_project).first()
        self.assertEqual(child_indicator.measure, "2")

        # Create child 2 project
        child_project_2 = self.create_project("Child project 2")

        # Link child 2 to parent
        self.make_parent(self.parent_project, child_project_2)

        # Import results framework into child 2
        self.import_status, self.import_message = child_project_2.import_results()

        child_period = IndicatorPeriod.objects.filter(
            indicator__result__project=self.child_project).first()
        child_2_period = IndicatorPeriod.objects.filter(
            indicator__result__project=child_project_2).first()

        indicator_update = IndicatorPeriodData.objects.create(
            user=self.user,
            period=child_period,
            numerator="4",
            denominator="6",
        )
        self.assertEqual(child_period.actual_value, "")

        indicator_update.status = "A"
        indicator_update.save()
        self.assertEqual(child_period.actual_value, "66.67")
        self.assertEqual(parent_indicator.periods.first().actual_value, "66.67")

        indicator_update_2 = IndicatorPeriodData.objects.create(
            user=self.user,
            period=child_2_period,
            numerator="2",
            denominator="4",
        )
        self.assertEqual(child_2_period.actual_value, "")

        indicator_update_2.status = "A"
        indicator_update_2.save()
        self.assertEqual(child_2_period.actual_value, "50.0")
        self.assertEqual(parent_indicator.periods.first().actual_value, "60.0")

    def test_delete_recreate_child_indicator_period_link_to_parent(self):
        # Given
        parent_period = IndicatorPeriod.objects.filter(
            indicator__result__project=self.parent_project
        ).first()
        child_period = IndicatorPeriod.objects.filter(
            indicator__result__project=self.child_project
        ).first()
        child_indicator = child_period.indicator

        # When
        child_period.delete()
        IndicatorPeriod.objects.create(
            indicator=child_indicator,
            parent_period=parent_period,
            period_start=self.period.period_start,
            period_end=self.period.period_end,
        )

        # Then
        self.assertEqual(1, self.period.child_periods.count())
        # Re-fetch the child here otherwise period_start will be stale
        child_period = self.period.child_periods.first()
        self.assertEqual(child_period.period_start, self.period.period_start)

    def test_should_permit_creating_child_only_indicators(self):
        # Given
        child_result = Result.objects.get(project=self.child_project)
        title = 'Child only indicator'
        measure = '1'
        ascending = True
        indicator = Indicator.objects.create(
            result=child_result, title='', measure=measure, ascending=ascending
        )
        # When
        # # When creating new indicators, clean is called during update & that
        # is when validation errors seem to be occuring.
        indicator.title = title
        indicator.clean()
        indicator.save()

        # Then
        self.assertEqual(child_result.indicators.count(), 2)
        new_indicator = Indicator.objects.get(title=title, result=child_result)
        self.assertEqual(new_indicator.title, title)
        self.assertEqual(new_indicator.measure, measure)
        self.assertEqual(new_indicator.ascending, ascending)

    def test_should_permit_creating_periods_on_child_only_indicators(self):
        # Given
        child_result = Result.objects.get(project=self.child_project)
        title = 'Child only indicator'
        measure = '1'
        ascending = True
        indicator = Indicator.objects.create(
            result=child_result, title=title, measure=measure, ascending=ascending
        )
        period_start = datetime.date.today()
        period_end = datetime.date.today() + datetime.timedelta(days=10)
        period = IndicatorPeriod.objects.create(indicator=indicator, period_end=period_end)

        # When
        # # When creating new periods, clean is called during update & that
        # is when validation errors seem to be occuring.
        period.period_start = period_start
        period.clean()
        period.save()

        # Then
        self.assertEqual(indicator.periods.count(), 1)
        period = IndicatorPeriod.objects.get(indicator=indicator)
        self.assertEqual(period.period_start, period_start)
        self.assertEqual(period.period_end, period_end)

    def test_qualitative_indicator(self):
        indicator = Indicator.objects.create(
            result=self.result, title="Indicator #2", type=QUALITATIVE,
        )
        period = IndicatorPeriod.objects.create(
            indicator=indicator,
            period_start=datetime.date.today(),
            period_end=datetime.date.today() + datetime.timedelta(days=1),
            target_value="A qualitative target description",
            locked=False,
        )
        narrative = (u"abcdefghijklmnompqrstuvwxyz abcdefghijklmnompqrstuvwxyz "
                     u"abcdefghijklmnompqrstuvwxyz abcdefghijklmnompqrstuvwxyz "
                     u"abcdefghijklmnompqrstuvwxyz abcdefghijklmnompqrstuvwxyz "
                     u"abcdefghijklmnompqrstuvwxyz abcdefghijklmnompqrstuvwxyz "
                     u"abcdefghijklmnompqrstuvwxyz abcdefghijklmnompqrstuvwxyz "
                     u"abcdefghijklmnompqrstuvwxyz abcdefghijklmnompqrstuvwxyz "
                     u"abcdefghijklmnompqrstuvwxyz abcdefghijklmnompqrstuvwxyz "
                     u"abcdefghijklmnompqrstuvwxyz abcdefghijklmnompqrstuvwxyz "
                     u"abcdefghijklmnompqrstuvwxyz abcdefghijklmnompqrstuvwxyz "
                     u"abcdefghijklmnompqrstuvwxyz abcdefghijklmnompqrstuvwxyz ")
        update = IndicatorPeriodData.objects.create(user=self.user, period=period, narrative=narrative)
        update.clean()
        update.save()
        self.assertEqual(update.narrative, narrative)

    @unittest.skip('See TODO in IndicatorPeriod.clean')
    def test_prevent_creating_new_periods_on_child_indicators(self):
        # Given
        child_result = Result.objects.get(project=self.child_project)
        child_indicator = child_result.indicators.first()
        period_start = datetime.date.today()
        period_end = datetime.date.today() + datetime.timedelta(days=10)
        period = IndicatorPeriod.objects.create(indicator=child_indicator, period_end=period_end)

        # When

        # FIXME: This period shouldn't get created - some kind of validation
        # error should occur!
        period.period_start = period_start
        period.clean()
        period.save()

        # Then
        self.assertEqual(child_indicator.periods.count(), 1)

    def test_copying_results_framework(self):
        # Given
        project = self.create_project(title='Sample Project')

        # When
        project.copy_results(self.parent_project)

        # Then
        # Results are copied?
        self.assertEqual(set(project.results.values_list('title', flat=True)),
                         set(self.parent_project.results.values_list('title', flat=True)))
        result = Result.objects.get(project=project)

        # Indicators are copied?
        self.assertEqual(
            set(Indicator.objects.filter(result__project=project).values_list('title', flat=True)),
            set(Indicator.objects.filter(result__project=self.parent_project).values_list('title', flat=True))
        )
        indicator = Indicator.objects.get(result=result)
        self.assertIsNone(indicator.parent_indicator)

        # Periods are copied?
        self.assertEqual(
            set(IndicatorPeriod.objects.filter(indicator=indicator).values_list('period_start', 'period_end')),
            set(IndicatorPeriod.objects.filter(indicator=self.indicator).values_list('period_start', 'period_end'))
        )
        indicator_period = IndicatorPeriod.objects.get(indicator=indicator)
        self.assertIsNone(indicator_period.parent_period)

    def test_prevent_adding_multiple_parents(self):
        # Given
        project = self.create_project(title='New Parent Project')

        # When
        with self.assertRaises(MultipleParentsDisallowed):
            self.make_parent(project, self.child_project)

    def test_prevent_changing_parents_if_results_imported(self):
        # Given
        project = self.create_project(title='New Parent Project')
        related_project = RelatedProject.objects.get(
            project=self.parent_project, related_project=self.child_project
        )

        # When/Then
        related_project.project = project
        with self.assertRaises(ParentChangeDisallowed):
            related_project.save()

    def test_prevent_deleting_parent_if_results_imported(self):
        # Given
        related_project = RelatedProject.objects.get(
            project=self.parent_project, related_project=self.child_project
        )

        # When/Then
        with self.assertRaises(ParentChangeDisallowed):
            related_project.delete()

    def test_allow_changing_parents_if_results_not_imported(self):
        # Given
        project = self.create_project(title='New Parent Project')
        related_project = RelatedProject.objects.get(
            project=self.parent_project, related_project=self.child_project
        )
        Result.objects.filter(project=self.child_project).delete()

        # When
        related_project.project = project
        related_project.save()

        # Then
        self.assertEqual(self.child_project.parents_all().first().id, project.id)
