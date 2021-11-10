# -*- coding: utf-8 -*-

# Akvo Reporting is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.
from datetime import date

from django.contrib.auth import get_user_model
from django.test import TestCase

from akvo.rsr.tests.base import BaseTestCase
from akvo.rsr.models import BudgetItem, Partnership, Project, ProjectUpdate, Organisation, \
    OrganisationIndicatorLabel, RelatedProject, OrganisationCodelist


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

    def tearDown(self):
        Project.objects.all().delete()
        Organisation.objects.all().delete()

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


class ProjectHierarchyTestCase(TestCase):
    """Tests for the project model"""

    def setUp(self):
        self.project1 = Project.objects.create(title="Project 1")
        self.project2 = Project.objects.create(title="Project 2")
        self.project3 = Project.objects.create(title="Project 3")
        self.project4 = Project.objects.create(title="Project 4")
        self.project5 = Project.objects.create(title="Project 5")

        # Project 2 is child of project 1
        RelatedProject.objects.create(
            project=self.project1,
            related_project=self.project2,
            relation=RelatedProject.PROJECT_RELATION_CHILD
        )
        # Project 3 is child of project 2
        RelatedProject.objects.create(
            project=self.project2,
            related_project=self.project3,
            relation=RelatedProject.PROJECT_RELATION_CHILD
        )
        # Project 4 is child of project 2
        RelatedProject.objects.create(
            project=self.project2,
            related_project=self.project4,
            relation=RelatedProject.PROJECT_RELATION_CHILD
        )
        # Project 5 is child of project 4
        RelatedProject.objects.create(
            project=self.project4,
            related_project=self.project5,
            relation=RelatedProject.PROJECT_RELATION_CHILD
        )
        # Project relations tree:
        #   1
        #   |
        #   2
        #  / \
        # 3   4
        #      \
        #       5

    def tearDown(self):
        Project.objects.all().delete()

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
        ancestor_p2 = self.project2.ancestor()
        self.assertEqual(ancestor_p2, self.project1)
        ancestor_p3 = self.project3.ancestor()
        self.assertEqual(ancestor_p3, self.project1)
        ancestor_p4 = self.project4.ancestor()
        self.assertEqual(ancestor_p4, self.project1)
        ancestor_p5 = self.project5.ancestor()
        self.assertEqual(ancestor_p5, self.project1)
