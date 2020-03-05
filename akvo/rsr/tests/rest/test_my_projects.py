# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.

# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


from akvo.rsr.models import Sector
from akvo.rsr.tests.base import BaseTestCase


class MyProjectsViewSetTestCase(BaseTestCase):
    """Tests the my_projects endpoint."""

    def setUp(self):
        super(MyProjectsViewSetTestCase, self).setUp()
        self.project = self.create_project('Foo Test')
        self.email = self.password = 'example@foo.com'

    def test_my_projects_with_unicode_sector(self):
        # Given
        url = '/rest/v1/my_projects/?format=json'
        sector_code = "Women’s equality"
        Sector.objects.create(project=self.project, sector_code=sector_code)
        self.create_user(self.email, self.password, is_superuser=True)
        self.c.login(username=self.email, password=self.password)

        # When
        response = self.c.get(url, follow=True)

        # Then
        self.assertEqual(response.status_code, 200)
        projects = response.data['results']
        self.assertEqual(len(projects), 1)
        project = projects[0]
        self.assertEqual(len(project['sectors']), 1)
        self.assertEqual(project['sectors'][0]['code_label'], sector_code)

    def test_my_projects_with_unpublished_projects(self):
        # Given
        project = self.create_project('Unpublished', published=False)
        org = self.create_organisation('Organisation')
        self.make_partner(project, org)
        user = self.create_user(self.email, self.password)
        self.make_employment(user, org, 'Users')
        self.c.login(username=self.email, password=self.password)
        url = '/rest/v1/my_projects/?format=json'

        # When
        response = self.c.get(url, follow=True)

        # Then
        self.assertEqual(response.status_code, 200)
        projects = response.data['results']
        self.assertEqual(len(projects), 0)
