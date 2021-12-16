# -*- coding: utf-8 -*-

# Akvo Reporting is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.
from datetime import date
from unittest.mock import patch

from django.contrib.auth import get_user_model
from django.db import models
from django.test import TestCase

from akvo.rsr.factories.project import ProjectFactory
from akvo.rsr.models import (
    BudgetItem, Organisation, OrganisationCodelist, OrganisationIndicatorLabel, Partnership,
    Project, ProjectUpdate,
)
from akvo.rsr.models.tree.errors import NodesWillBeOrphaned
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

    def test_delete_parent_with_children(self):
        """
        In a project hierarchy with children, it shouldn't be possible to just remove a parent

        All children will suffer
        """
        parent = ProjectFactory(title="parent")
        child = ProjectFactory(title="child")
        child.set_parent(parent, True).save()

        subchild = ProjectFactory(title="subchild")
        subchild.set_parent(child, True).save()

        with self.assertRaises(NodesWillBeOrphaned):
            child.delete_parent()


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

        self.project2.set_parent(self.project1, True).save()
        self.project3.set_parent(self.project2, True).save()
        self.project4.set_parent(self.project2, True).save()
        self.project5.set_parent(self.project4, True).save()

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
