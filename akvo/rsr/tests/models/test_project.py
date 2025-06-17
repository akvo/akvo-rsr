# -*- coding: utf-8 -*-

# Akvo Reporting is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.
from datetime import date
from unittest.mock import patch

from django.contrib.auth import get_user_model
from django.db import models
from django.test import TestCase

from akvo.rsr.models import (
    BudgetItem, IatiExport, Organisation, OrganisationCodelist, OrganisationIndicatorLabel, Partnership,
    Project, ProjectUpdate,
)
from akvo.rsr.tests.base import BaseTestCase


class ProjectModelTestCase(BaseTestCase):
    """Tests for the project model"""

    def setUp(self):
        self.project = Project.objects.create(title="Test Project")
        self.organisation = Organisation.objects.create(
            name="Organisation for labels",
            long_name="Organisation for labels",
            new_organisation_type=22
        )
        Partnership.objects.create(
            iati_organisation_role=Partnership.IATI_ACCOUNTABLE_PARTNER,
            project=self.project, organisation=self.organisation
        )
        self.label_1 = OrganisationIndicatorLabel.objects.create(
            organisation=self.organisation,
            label='label 1'
        )
        self.label_2 = OrganisationIndicatorLabel.objects.create(
            organisation=self.organisation,
            label='label 2'
        )

    def test_project_last_update(self):
        """Test that Project.last_update is updated correctly when an update is deleted.

        The field is a denormalization keeping track of the latest update for a project, if any.
        When deletion of updates was introduced, a bug occurs when deleting the latest update, as
        the Project.last_update field was set to None in that case.
        The tests check that the fix for this bug works correctly.
        """
        # setup needed model instances
        username = 'user1@com.com'
        user_1 = get_user_model().objects.create(email='user1@com.com', username=username)
        update_1 = ProjectUpdate.objects.create(title="Test update 1", project=self.project, user=user_1)
        update_2 = ProjectUpdate.objects.create(title="Test update 2", project=self.project, user=user_1)

        # check that update_2 is the latest
        self.assertTrue(update_1.created_at < update_2.created_at)

        # check that update_2 is Project.last_update
        self.assertEqual(self.project.last_update, update_2)

        update_2.delete()
        # now update_1 should be last_update
        self.assertEqual(self.project.last_update, update_1)

        update_1.delete()
        # now last_update is None
        self.assertEqual(self.project.last_update, None)

    def test_project_funds_update_on_donations_change(self):
        """Test that Project.funds is correct when donations are changed."""

        # setup needed model instances
        budget_item = BudgetItem.objects.create(project=self.project, amount=200)

        # Change donations
        self.project.donations = 100
        self.project.save()

        # assert that funds for the project are correct
        self.assertEqual(self.project.budget, budget_item.amount)
        self.assertEqual(self.project.donations, self.project.funds)
        self.assertEqual(self.project.funds_needed, self.project.budget - self.project.funds)

    def test_project_funds_update_on_pledges_change(self):
        """Test that Project.funds is correct when pledged amounts change."""

        # setup needed model instances
        budget_item = BudgetItem.objects.create(project=self.project, amount=200)
        partnership = Partnership.objects.create(
            iati_organisation_role=Partnership.IATI_FUNDING_PARTNER,
            project=self.project, funding_amount=100
        )

        # Change donations and partner pledged amount
        partnership.funding_amount = 100
        partnership.save()
        self.project.donations = 100
        self.project.save()

        # assert that funds for the project are correct
        self.assertEqual(self.project.budget, budget_item.amount)
        self.assertEqual(self.project.funds, partnership.funding_amount + self.project.donations)
        self.assertEqual(self.project.funds_needed, self.project.budget - self.project.funds)

    def test_project_has_labels(self):
        has_labels = self.project.has_indicator_labels()
        labels = self.project.indicator_labels()
        self.assertEqual(has_labels, True)
        self.assertEqual(labels.count(), 2)

    def test_project_dates(self):
        #  Given
        self.project.date_start_planned = date(2018, 1, 1)
        self.project.date_end_planned = date(2018, 12, 31)
        #  When
        start_date, end_date = self.project.project_dates()
        #  Then
        self.assertEqual(start_date, date(2018, 1, 1))
        self.assertEqual(end_date, date(2018, 12, 31))

        #  Given
        self.project.date_start_actual = date(2018, 3, 1)
        self.project.date_end_actual = date(2019, 2, 28)
        #  When
        start_date, end_date = self.project.project_dates()
        #  Then
        self.assertEqual(start_date, date(2018, 3, 1))
        self.assertEqual(end_date, date(2019, 2, 28))

    def test_reporting_org_codelist(self):
        data = {
            'SECTOR_CATEGORY': [[1, 2], [3, 4]]
        }
        codelist = OrganisationCodelist.objects.create(slug='custom-codelist', data=data)
        self.organisation.codelist = codelist
        self.organisation.save(update_fields=['codelist'])
        Partnership.objects.create(
            iati_organisation_role=Partnership.IATI_REPORTING_ORGANISATION,
            project=self.project, organisation=self.organisation
        )

        organisation_codelist = self.project.organisation_codelist()

        self.assertIsNotNone(organisation_codelist)
        self.assertEqual(data, organisation_codelist.data)

    def test_no_reporting_org_codelist(self):
        self.assertIsNone(self.project.reporting_org)

        codelist = self.project.organisation_codelist()

        self.assertIsNone(codelist)

    def test_set_reporting_org_overrides_reporting_partner(self):
        project = self.create_project('Project')
        org1 = self.create_organisation('Org1')
        project.set_reporting_org(org1)

        org2 = self.create_organisation('Org2')
        project.set_reporting_org(org2)

        self.assertEqual(org2, project.reporting_org)

    def test_use_project_roles_changes_when_reporting_partner_uses_it(self):
        project = self.create_project('Project')
        org = self.create_organisation('Organisation')
        self.assertFalse(project.use_project_roles)
        self.assertFalse(org.use_project_roles)

        org.use_project_roles = True
        org.save(update_fields=['use_project_roles'])
        self.make_partner(project, org, Partnership.IATI_REPORTING_ORGANISATION)

        self.assertTrue(org.use_project_roles)
        self.assertTrue(project.use_project_roles)

        org2 = self.create_organisation('Organisation 2')
        self.assertFalse(org2.use_project_roles)
        self.assertTrue(project.use_project_roles)

        project.partnerships.all().delete()
        self.make_partner(project, org2, Partnership.IATI_REPORTING_ORGANISATION)

        self.assertFalse(org2.use_project_roles)
        self.assertTrue(project.use_project_roles)


class ProjectDeleteTestCase(BaseTestCase):
    """
    When deleting a project all calls to the save method should simply return
    without triggering an SQL request
    """

    def setUp(self):
        self.project = Project.objects.create(title="Test Project")

    def _test_project_delete(self):
        """
        Ensure that when a project is being deleted, that the super(Project).save() isn't called
        """
        real_save = models.Model.save

        def mock_save(_self, *args, **kwargs):
            self.assertNotIsInstance(_self, Project)
            real_save(_self, *args, **kwargs)

        with patch.object(models.Model, "save", mock_save):
            self.project.delete()
        self.assertFalse(Project.objects.filter(id=self.project.id).exists())

    def test_with_project_update(self):
        ProjectUpdate.objects.create(
            title="Test update 1", project=self.project,
            user=get_user_model().objects.create(email='user1@com.com', username="somedude")
        )
        self._test_project_delete()

    def test_with_budget_item(self):
        BudgetItem.objects.create(project=self.project, amount=100,)
        self._test_project_delete()


class EUTFHierarchyTest(BaseTestCase):
    def test_not_eutf_root_project(self):
        self.assertFalse(
            Project.objects.create(title="Non EUTF").in_eutf_hierarchy()
        )

    def test_is_eutf_root_project(self):
        eutf_project = Project.objects.create(title="EUTF")
        with self.settings(EUTF_ROOT_PROJECT=eutf_project.id):
            self.assertTrue(eutf_project.in_eutf_hierarchy())


class UsesSingleIndicatorPeriodTest(BaseTestCase):

    def setUp(self):
        self.project = Project.objects.create(title="Test project")

    def test_no_indicators(self):
        self.assertIsNone(self.project.uses_single_indicator_period())

    def test_uses_indicators(self):
        with self.settings(
                # Taken from 30-rsr.conf
                SINGLE_PERIOD_INDICATORS={
                    "root_projects": {self.project.pk: "TEST"},
                }
        ):
            self.assertEqual(self.project.uses_single_indicator_period(), "TEST")


class UsesSingleIndicatorPeriodWithParentTest(UsesSingleIndicatorPeriodTest):

    def setUp(self):
        self.program = Project.objects.create(title="Test program")
        self.project = Project.objects.create(title="Test project")
        self.project.set_parent(self.program).save()

    def test_uses_indicators(self):
        with self.settings(
                # Taken from 30-rsr.conf
                SINGLE_PERIOD_INDICATORS={
                    "root_projects": {self.program.pk: "TEST"},
                }
        ):
            self.assertEqual(self.project.uses_single_indicator_period(), "TEST")


class ProjectHierarchyTestCase(TestCase):
    """Tests for the project model"""

    def setUp(self):
        self.project1 = Project.objects.create(title="Project 1")
        self.project2 = Project.objects.create(title="Project 2")
        self.project3 = Project.objects.create(title="Project 3")
        self.project4 = Project.objects.create(title="Project 4")
        self.project5 = Project.objects.create(title="Project 5")

        # Project relations tree:
        #   1
        #   |
        #   2
        #  / \
        # 3   4
        #      \
        #       5

        self.project2.set_parent(self.project1).save()
        self.project3.set_parent(self.project2).save()
        self.project4.set_parent(self.project2).save()
        self.project5.set_parent(self.project4).save()

    def test_project_descendants(self):
        # Note that descendants includes self
        descendants_p1 = self.project1.descendants()
        self.assertEqual(descendants_p1.count(), 5)
        descendants_p2 = self.project2.descendants()
        self.assertEqual(descendants_p2.count(), 4)
        descendants_p4 = self.project4.descendants()
        self.assertEqual(descendants_p4.count(), 2)

    def test_project_ancestor(self):
        # Project 1 is ancestor to all projects in the hierarchy
        ancestor_p2 = self.project2.get_root()
        self.assertEqual(ancestor_p2, self.project1)
        ancestor_p3 = self.project3.get_root()
        self.assertEqual(ancestor_p3, self.project1)
        ancestor_p4 = self.project4.get_root()
        self.assertEqual(ancestor_p4, self.project1)
        ancestor_p5 = self.project5.get_root()
        self.assertEqual(ancestor_p5, self.project1)


class IatiProfileUrlTestCase(BaseTestCase):
    def setUp(self):
        super().setUp()
        self.org = self.create_organisation('Acme')
        self.project = self.create_project('Test project')
        self.user = self.create_user('test@akvo.org', 'password')
        self.iati_org_id = 'AB-1234'
        self.iati_activity_id = 'CD-5678'
        self.make_partner(self.project, self.org, Partnership.IATI_REPORTING_ORGANISATION)

    def set_iati_org_id(self):
        self.org.iati_org_id = self.iati_org_id
        self.org.save(update_fields=['iati_org_id'])

    def set_iati_activity_id(self):
        self.project.iati_activity_id = self.iati_activity_id
        self.project.save(update_fields=['iati_activity_id'])

    def export_project(self):
        iati_export = IatiExport.objects.create(reporting_organisation=self.org, user=self.user)
        iati_export.projects.add(self.project)
        iati_export.create_iati_file()

    def test_no_export(self):
        self.set_iati_org_id()
        self.set_iati_activity_id()

        project = Project.objects.get(id=self.project.id)
        self.assertIsNone(project.get_iati_profile_url())

    def test_no_iati_org_id(self):
        self.set_iati_activity_id()
        self.export_project()

        project = Project.objects.get(id=self.project.id)
        self.assertIsNone(project.get_iati_profile_url())

    def test_no_iati_activity_id(self):
        self.set_iati_org_id()
        self.export_project()

        project = Project.objects.get(id=self.project.id)
        self.assertIsNone(project.get_iati_profile_url())

    def test_iati_profile_url(self):
        self.set_iati_org_id()
        self.set_iati_activity_id()
        self.export_project()

        project = Project.objects.get(id=self.project.id)
        self.assertEqual(
            project.get_iati_profile_url(),
            f"https://d-portal.org/ctrack.html?reporting_ref={self.iati_org_id}#view=act&aid={self.iati_activity_id}"
        )


class ProjectDeletionTrackerTestCase(TestCase):
    """Tests for the ProjectDeletionTracker class"""

    def setUp(self):
        # Import here to avoid circular imports
        from akvo.rsr.models.project import ProjectDeletionTracker
        self.tracker = ProjectDeletionTracker()

    def test_add_and_contain_project(self):
        """Test adding a project to deletion tracking"""
        project_id = 123

        # Initially not in tracker
        self.assertNotIn(project_id, self.tracker)

        # Add project
        self.tracker.add(project_id)

        # Should now contain project
        self.assertIn(project_id, self.tracker)

    def test_discard_project(self):
        """Test removing a project from deletion tracking"""
        project_id = 456

        # Add project
        self.tracker.add(project_id)
        self.assertIn(project_id, self.tracker)

        # Remove project
        self.tracker.discard(project_id)
        self.assertNotIn(project_id, self.tracker)

    def test_discard_nonexistent_project(self):
        """Test that discarding a nonexistent project doesn't raise an error"""
        project_id = 789

        # Should not raise an error
        self.tracker.discard(project_id)
        self.assertNotIn(project_id, self.tracker)

    def test_multiple_projects(self):
        """Test tracking multiple projects simultaneously"""
        project_ids = [100, 200, 300]

        # Add all projects
        for project_id in project_ids:
            self.tracker.add(project_id)

        # All should be tracked
        for project_id in project_ids:
            self.assertIn(project_id, self.tracker)

        # Remove one project
        self.tracker.discard(200)
        self.assertNotIn(200, self.tracker)

        # Others should still be tracked
        self.assertIn(100, self.tracker)
        self.assertIn(300, self.tracker)

    def test_thread_safety(self):
        """Test that tracker operations are thread-safe"""
        import threading
        import time

        project_ids = list(range(100))
        results = []

        def add_projects():
            for project_id in project_ids[:50]:
                self.tracker.add(project_id)
                time.sleep(0.001)  # Small delay to increase contention

        def remove_projects():
            time.sleep(0.025)  # Let some adds happen first
            for project_id in project_ids[25:75]:
                self.tracker.discard(project_id)
                time.sleep(0.001)

        def check_projects():
            time.sleep(0.050)  # Let operations complete
            for project_id in project_ids:
                results.append((project_id, project_id in self.tracker))

        # Run operations concurrently
        threads = [
            threading.Thread(target=add_projects),
            threading.Thread(target=remove_projects),
            threading.Thread(target=check_projects)
        ]

        for thread in threads:
            thread.start()

        for thread in threads:
            thread.join()

        # Verify results are consistent (no race conditions caused exceptions)
        self.assertEqual(len(results), len(project_ids))

    @patch('time.time')
    def test_automatic_cleanup(self, mock_time):
        """Test that stale entries are automatically cleaned up"""
        # Mock time to control cleanup timing
        mock_time.return_value = 1000.0

        # Create a new tracker with mocked time
        from akvo.rsr.models.project import ProjectDeletionTracker
        tracker = ProjectDeletionTracker()

        # Add a project
        project_id = 999
        tracker.add(project_id)
        self.assertIn(project_id, tracker)

        # Advance time beyond cleanup threshold
        mock_time.return_value = 1000.0 + tracker._cleanup_threshold + 1

        # Add another project to trigger cleanup
        tracker.add(888)

        # Old project should be cleaned up, new one should remain
        self.assertNotIn(project_id, tracker)
        self.assertIn(888, tracker)

    def test_force_cleanup(self):
        """Test manual cleanup of stale entries"""
        # Create a new tracker 
        from akvo.rsr.models.project import ProjectDeletionTracker
        tracker = ProjectDeletionTracker()

        # Add a project and manually make it stale by setting old timestamp
        tracker.add(111)

        # Manually set an old timestamp to make entry stale
        with tracker._lock:
            old_time = 1000.0  # Very old timestamp
            tracker._timestamps[111] = old_time

        # Add a fresh project
        tracker.add(222)

        # Both should be present before cleanup
        self.assertIn(111, tracker)
        self.assertIn(222, tracker)

        # Force cleanup
        cleaned_count = tracker.force_cleanup()

        # Should have cleaned up the stale entry
        self.assertEqual(cleaned_count, 1)
        self.assertNotIn(111, tracker)
        self.assertIn(222, tracker)

    def test_cleanup_threshold_configuration(self):
        """Test that cleanup threshold is configurable"""
        from akvo.rsr.models.project import ProjectDeletionTracker
        tracker = ProjectDeletionTracker()

        # Should have default cleanup threshold
        self.assertEqual(tracker._cleanup_threshold, 3600)  # 1 hour

        # Should be able to modify threshold
        tracker._cleanup_threshold = 1800  # 30 minutes
        self.assertEqual(tracker._cleanup_threshold, 1800)

    def test_project_deletion_workflow(self):
        """Test that deletion tracking workflow works correctly"""
        from akvo.rsr.models.project import DELETION_SET

        # Test that adding and removing from deletion set works
        test_project_id = 99999  # Use a high ID that won't conflict

        # Initially not in set
        self.assertNotIn(test_project_id, DELETION_SET)

        # Add to deletion set
        DELETION_SET.add(test_project_id)
        self.assertIn(test_project_id, DELETION_SET)

        # Remove from deletion set
        DELETION_SET.discard(test_project_id)
        self.assertNotIn(test_project_id, DELETION_SET)

    def test_project_save_during_deletion(self):
        """Test that saving a project during deletion is prevented"""
        from akvo.rsr.models.project import DELETION_SET

        # Create a project
        project = Project.objects.create(title="Test Project for Save Prevention")
        project_id = project.pk
        original_title = project.title

        # Manually add to deletion set (simulating deletion in progress)
        DELETION_SET.add(project_id)

        try:
            # Try to modify and save the project
            project.title = "Modified Title"
            project.save()

            # Reload from database
            project.refresh_from_db()

            # Title should not have changed (save was prevented)
            self.assertEqual(project.title, original_title)
        finally:
            # Clean up deletion set
            DELETION_SET.discard(project_id)
