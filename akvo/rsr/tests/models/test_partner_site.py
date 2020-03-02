# -*- coding: utf-8 -*-

# Akvo Reporting is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

from django.contrib.auth import get_user_model

from akvo.rsr.tests.base import BaseTestCase
from akvo.rsr.models import (
    Organisation, Partnership, PartnerSite, Project, ProjectUpdate
)

User = get_user_model()


class PartnerSiteModelTestCase(BaseTestCase):
    """Tests for the partner site model"""

    def setUp(self):
        super(PartnerSiteModelTestCase, self).setUp()

        # Clear all projects, users since some tests may not tear down!
        self.tearDown()

        # Setup a project with results framework and a user
        self.project_1 = self.create_project("Test project 1")
        self.project_2 = self.create_project("Test project 2")
        self.org_1 = self.create_organisation('Org 1')
        self.org_2 = self.create_organisation('Org 2')
        self.user = self.create_user('user1@com.com')
        self.update_1 = ProjectUpdate.objects.create(title="Test update 1", project=self.project_1,
                                                     user=self.user)
        self.update_2 = ProjectUpdate.objects.create(title="Test update 2", project=self.project_1,
                                                     user=self.user)
        self.partnership_1 = self.make_partner(
            self.project_1, self.org_1, Partnership.IATI_EXTENDING_PARTNER)
        self.partnership_2 = self.make_partner(
            self.project_2, self.org_1, Partnership.IATI_EXTENDING_PARTNER)
        self.partnership_3 = self.make_partner(
            self.project_1, self.org_2, Partnership.IATI_EXTENDING_PARTNER)

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

    def test_redirect_logo_url(self):
        # When
        response = self.c.get('/en/logo/', follow=False)

        # Then
        self.assertEqual(302, response.status_code)
        self.assertTrue(response.url.endswith('/rsr/images/rsrLogo.svg'))

    def test_partner_site_redirect_logo_url(self):
        # Given
        site = PartnerSite.objects.create(organisation=self.org_1, hostname="page1", piwik_id=0)
        site.custom_logo = 'custom.png'
        site.save()
        self.c.defaults['HTTP_HOST'] = '{}.localakvoapp.org'.format(site.hostname)

        # When
        response = self.c.get('/en/logo/', follow=False)

        # Then
        self.assertEqual(302, response.status_code)
        self.assertEqual(response.url, '/media/custom.png')
