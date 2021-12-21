# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.

# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


from akvo.rsr.models import Country, ProjectLocation, Sector
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

    def test_showing_restricted_projects(self):
        # Accessible project
        project = self.create_project('Project 1')
        org = self.create_organisation('Organisation')
        self.make_partner(project, org)
        # Restricted project
        project_2 = self.create_project('Project 2')
        self.make_partner(project_2, org)
        project_2.use_project_roles = True
        project_2.save(update_fields=['use_project_roles'])
        # Make employment
        user = self.create_user(self.email, self.password)
        self.make_employment(user, org, 'Users')
        self.c.login(username=self.email, password=self.password)

        # Show only accessible project
        # Given
        url = '/rest/v1/my_projects/?format=json'

        # When
        response = self.c.get(url, follow=True)

        # Then
        self.assertEqual(response.status_code, 200)
        projects = response.data['results']
        self.assertEqual(len(projects), 1)
        self.assertEqual(projects[0]['title'], project.title)

        # Show restricted projects also
        # Given
        url = '/rest/v1/my_projects/?format=json&show_restricted=1'

        # When
        response = self.c.get(url, follow=True)

        # Then
        self.assertEqual(response.status_code, 200)
        projects = response.data['results']
        self.assertEqual(len(projects), 2)

    def test_filter_country(self):
        # The endpoint requires a user in order to return results
        self.create_user(self.email, self.password, is_superuser=True)
        self.c.login(username=self.email, password=self.password)

        # Project with requested location
        project = self.create_project('Project 1')
        ProjectLocation.objects.create(
            location_target=project,
            country=Country.objects.get(iso_code="et")
        )
        org = self.create_organisation('Organisation')
        self.make_partner(project, org)
        # Project without location
        project_2 = self.create_project('Project 2')
        self.make_partner(project_2, org)

        url = '/rest/v1/my_projects/?format=json&country=Ethiopia'

        response = self.c.get(url, follow=True)
        self.assertEqual(response.status_code, 200)
        # Ensure only one project is in the results
        projects = response.data['results']
        self.assertEqual(len(projects), 1)
        self.assertEqual(projects[0]["id"], project.id)
