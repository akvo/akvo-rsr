# -*- coding: utf-8 -*-

# Akvo Reporting is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

from django.contrib.auth import get_user_model
from django.test import TestCase

from akvo.rsr.models import (
    Organisation, Partnership, PartnerSite, Project, ProjectUpdate, PublishingStatus
)

User = get_user_model()


class PartnerSiteModelTestCase(TestCase):
    """Tests for the partner site model"""

    def setUp(self):
        # Clear all projects, users since some tests may not tear down!
        self.tearDown()

        # Setup a project with results framework and a user
        self.project_1 = Project.objects.create(title="Test project 1")
        self.project_1.publishingstatus.status = PublishingStatus.STATUS_PUBLISHED
        self.project_1.publishingstatus.save()
        self.project_2 = Project.objects.create(title="Test project 2")
        self.project_2.publishingstatus.status = PublishingStatus.STATUS_PUBLISHED
        self.project_2.publishingstatus.save()
        self.org_1 = Organisation.objects.create(name='Org 1', long_name='Organisation 1')
        self.org_2 = Organisation.objects.create(name='Org 2', long_name='Organisation 2')
        self.user = User.objects.create(username='user1@com.com', email='user1@com.com')
        self.update_1 = ProjectUpdate.objects.create(title="Test update 1", project=self.project_1,
                                                     user=self.user)
        self.update_2 = ProjectUpdate.objects.create(title="Test update 2", project=self.project_1,
                                                     user=self.user)
        self.partnership_1 = Partnership.objects.create(
            project=self.project_1,
            organisation=self.org_1,
            iati_organisation_role=Partnership.IATI_EXTENDING_PARTNER,
        )
        self.partnership_2 = Partnership.objects.create(
            project=self.project_2,
            organisation=self.org_1,
            iati_organisation_role=Partnership.IATI_EXTENDING_PARTNER,
        )
        self.partnership_3 = Partnership.objects.create(
            project=self.project_1,
            organisation=self.org_2,
            iati_organisation_role=Partnership.IATI_EXTENDING_PARTNER,
        )

    def tearDown(self):
        Project.objects.all().delete()
        User.objects.all().delete()
        Organisation.objects.all().delete()
        ProjectUpdate.objects.all().delete()
        Partnership.objects.all().delete()
        PartnerSite.objects.all().delete()

    def test_pages_projects(self):
        """Basic test that page.projects returns the correct number of projects"""

        # Given
        org_1 = self.org_1
        org_2 = self.org_2

        # When
        page_1 = PartnerSite.objects.create(organisation=org_1, hostname="page1", piwik_id=0)
        page_2 = PartnerSite.objects.create(organisation=org_2, hostname="page2", piwik_id=0)

        # Then
        projects_1 = page_1.projects()
        self.assertEqual(projects_1.count(), 2)
        projects_2 = page_2.projects()
        self.assertEqual(projects_2.count(), 1)
