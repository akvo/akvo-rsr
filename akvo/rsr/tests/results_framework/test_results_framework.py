# -*- coding: utf-8 -*-

"""
Akvo RSR is covered by the GNU Affero General Public License.

See more details in the license.txt file located at the root folder of the Akvo RSR module.
For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.
"""

import datetime
import unittest

from akvo.rsr.models import (Project, PublishingStatus, Result, Indicator, IndicatorPeriod,
                             IndicatorPeriodData, IndicatorReference, User, RelatedProject)

from django.test import TestCase


class ResultsFrameworkTestCase(TestCase):
    """Tests the results framework."""

    def setUp(self):
        """
        In order to correctly test the results framework, we need the following objects in the
        database:

        - A user (to place updates).
        - Published parent project with child projects.
        """

        # Create (super)user
        self.user = User.objects.create_superuser(
            username="Super user",
            email="superuser.results@test.akvo.org",
            password="password"
        )

        # Create parent project
        self.parent_project = Project.objects.create(
            title="Parent project",
            subtitle="Parent project (subtitle)",
        )

        # Publish parent project
        publishing_status = PublishingStatus.objects.get(project=self.parent_project.pk)
        publishing_status.status = 'published'
        publishing_status.save(update_fields=['status', ])

        # Create child project
        self.child_project = Project.objects.create(
            title="Child project",
            subtitle="Child project (subtitle)",
        )

        # Publish child project
        publishing_status = PublishingStatus.objects.get(project=self.child_project.pk)
        publishing_status.status = 'published'
        publishing_status.save(update_fields=['status', ])

        # Link child to parent
        RelatedProject.objects.create(
            project=self.parent_project,
            related_project=self.child_project,
            relation=RelatedProject.PROJECT_RELATION_CHILD,
        )

        # Create results framework
        result = Result.objects.create(project=self.parent_project, title="Result #1", type="1", )
        indicator = Indicator.objects.create(result=result, title="Indicator #1", measure="1", )
        self.period = IndicatorPeriod.objects.create(
            indicator=indicator,
            period_start=datetime.date.today(),
            period_end=datetime.date.today() + datetime.timedelta(days=1),
            target_value="100"
        )
        self.reference = IndicatorReference.objects.create(
            indicator=indicator,
            reference='ABC',
            vocabulary='1',
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

    def test_new_indicator_cloned_to_child(self):
        """Test that new indicators are cloned in children that have imported results."""
        # Given
        # # Child project has already imported results from parent.
        result = self.parent_project.results.first()

        # When
        Indicator.objects.create(result=result, title="Indicator #2", measure="1")

        # Then
        self.assertEqual(
            Indicator.objects.filter(result__project=self.parent_project).count(),
            Indicator.objects.filter(result__project=self.child_project).count()
        )

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

    def test_update(self):
        """
        Test if placing updates will update the actual value of the period.
        """
        indicator_update = IndicatorPeriodData.objects.create(
            user=self.user,
            period=self.period,
            data="10"
        )
        self.assertEqual(self.period.actual_value, "")

        indicator_update.status = "A"
        indicator_update.save()
        self.assertEqual(self.period.actual_value, "10")

        indicator_update_2 = IndicatorPeriodData.objects.create(
            user=self.user,
            period=self.period,
            data="5"
        )
        self.assertEqual(self.period.actual_value, "10")

        indicator_update_2.status = "A"
        indicator_update_2.save()
        self.assertEqual(self.period.actual_value, "15")

    def test_edit_and_delete_updates(self):
        """
        Test if editing or deleting updates will update the actual value of the period.
        """
        indicator_update = IndicatorPeriodData.objects.create(
            user=self.user,
            period=self.period,
            data="10"
        )
        self.assertEqual(self.period.actual_value, "")

        indicator_update.status = "A"
        indicator_update.save()
        self.assertEqual(self.period.actual_value, "10")

        indicator_update.data = "11"
        indicator_update.save()
        self.assertEqual(self.period.actual_value, "11")

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
            data="10"
        )
        self.assertEqual(self.period.actual_value, "")

        indicator_update.status = "A"
        indicator_update.save()
        self.assertEqual(self.period.actual_value, "10")

        child_period = IndicatorPeriod.objects.filter(
            indicator__result__project=self.child_project).first()

        indicator_update_2 = IndicatorPeriodData.objects.create(
            user=self.user,
            period=child_period,
            data="15"
        )
        self.assertEqual(child_period.actual_value, "")

        indicator_update_2.status = "A"
        indicator_update_2.save()
        self.assertEqual(child_period.actual_value, "15")

        parent_period = IndicatorPeriod.objects.filter(
            indicator__result__project=self.parent_project).first()
        self.assertEqual(parent_period.actual_value, "25")

    def test_update_without_aggregations(self):
        """
        Test if placing an update on the child project without an aggregation will not update the
        actual value of the parent project's period.
        """
        indicator_update = IndicatorPeriodData.objects.create(
            user=self.user,
            period=self.period,
            data="10"
        )
        self.assertEqual(self.period.actual_value, "")

        indicator_update.status = "A"
        indicator_update.save()
        self.assertEqual(self.period.actual_value, "10")

        parent_project = self.period.indicator.result.project
        parent_project.aggregate_children = False
        parent_project.save(update_fields=['aggregate_children', ])

        child_period = IndicatorPeriod.objects.filter(
            indicator__result__project=self.child_project).first()

        indicator_update_2 = IndicatorPeriodData.objects.create(
            user=self.user,
            period=child_period,
            data="15"
        )
        self.assertEqual(child_period.actual_value, "")

        indicator_update_2.status = "A"
        indicator_update_2.save()
        self.assertEqual(child_period.actual_value, "15")

        parent_period = IndicatorPeriod.objects.filter(
            indicator__result__project=self.parent_project).first()
        self.assertEqual(parent_period.actual_value, "10")

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
        child_project_2 = Project.objects.create(
            title="Child project 2",
            subtitle="Child project 2 (subtitle)",
        )

        # Publish child 2 project
        child_project_2.publish()

        # Link child 2 to parent
        RelatedProject.objects.create(
            project=self.parent_project,
            related_project=child_project_2,
            relation=RelatedProject.PROJECT_RELATION_CHILD,
        )

        # Import results framework into child 2
        self.import_status, self.import_message = child_project_2.import_results()

        child_period = IndicatorPeriod.objects.filter(
            indicator__result__project=self.child_project).first()
        child_2_period = IndicatorPeriod.objects.filter(
            indicator__result__project=child_project_2).first()

        indicator_update = IndicatorPeriodData.objects.create(
            user=self.user,
            period=child_period,
            data="30"
        )
        self.assertEqual(child_period.actual_value, "")

        indicator_update.status = "A"
        indicator_update.save()
        self.assertEqual(child_period.actual_value, "30")
        self.assertEqual(parent_indicator.periods.first().actual_value, "30")

        indicator_update_2 = IndicatorPeriodData.objects.create(
            user=self.user,
            period=child_2_period,
            data="20"
        )
        self.assertEqual(child_2_period.actual_value, "")

        indicator_update_2.status = "A"
        indicator_update_2.save()
        self.assertEqual(child_2_period.actual_value, "20")
        self.assertEqual(parent_indicator.periods.first().actual_value, "25")

    def test_import_state_after_change(self):
        # Given
        self.assertEqual(1, self.period.child_periods.count())
        child_period = IndicatorPeriod.objects.filter(
            indicator__result__project=self.child_project
        ).first()

        # When
        self.period.period_start = datetime.date.today() + datetime.timedelta(days=-10)
        self.period.save()

        # Then
        self.assertEqual(1, self.period.child_periods.count())
        # Re-fetch the child here otherwise period_start will be stale
        child_period = self.period.child_periods.first()
        self.assertEqual(child_period.period_start, self.period.period_start)

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
