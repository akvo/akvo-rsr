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
        email = password = 'example@foo.com'
        self.create_user(email, password, is_superuser=True)
        self.c.login(username=email, password=password)

    def test_my_projects_with_unicode_sector(self):
        # Given
        url = '/rest/v1/my_projects/?format=json'
        sector_code = u"Women’s equality"
        Sector.objects.create(project=self.project, sector_code=sector_code)

        # When
        response = self.c.get(url, follow=True)

        # Then
        self.assertEqual(response.status_code, 200)
        projects = response.data['results']
        self.assertEqual(len(projects), 1)
        project = projects[0]
        self.assertEqual(len(project['sectors']), 1)
        self.assertEqual(project['sectors'][0]['code_label'], sector_code)
