# -*- coding: utf-8 -*-

"""
Akvo RSR is covered by the GNU Affero General Public License.

See more details in the license.txt file located at the root folder of the Akvo RSR module.
For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.
"""

from django.conf import settings
from django.test import Client

from akvo.codelists.models import Country, Version
from akvo.rsr.tests.base import BaseTestCase
from akvo.rsr.models import Partnership, PartnerSite, ProjectUpdate


class ProjectTypeaheadTest(BaseTestCase):

    def setUp(self):
        super(ProjectTypeaheadTest, self).setUp()
        self.organisation = self.create_organisation('Akvo')
        self.partner_site = PartnerSite.objects.create(
            organisation=self.organisation,
            piwik_id=1,
            hostname='akvo'
        )

        for i in range(1, 6):
            published = i < 4
            project = self.create_project(title='Project - {}'.format(i), published=published)

            # Add a partnership for a couple of projects
            if i in {1, 4}:
                self.make_partner(
                    project, self.organisation, Partnership.IATI_REPORTING_ORGANISATION)

        # Additional organisation for typeahead/organisations end-point
        self.create_organisation('UNICEF')

    def _create_client(self, host=None):
        """ Create and return a client with the given host."""
        if not host:
            host = settings.RSR_DOMAIN
        return Client(HTTP_HOST=host)

    def test_published_projects_on_rsr_host(self):
        # Given
        url = '/rest/v1/typeaheads/projects?format=json&published=1'
        client = self._create_client()

        # When
        response = client.get(url)

        # Then
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data['results']), 3)

    def test_all_projects_on_rsr_host(self):
        # Given
        url = '/rest/v1/typeaheads/projects?format=json'
        client = self._create_client()

        # When
        response = client.get(url)

        # Then
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data['results']), 5)

    def test_published_projects_on_partner_site(self):
        # Given
        url = '/rest/v1/typeaheads/projects?format=json&published=1'
        host = 'akvo.{}'.format(settings.AKVOAPP_DOMAIN)
        client = self._create_client(host)

        # When
        response = client.get(url)

        # Then
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data['results']), 1)

    def test_all_projects_on_partner_site(self):
        # Given
        url = '/rest/v1/typeaheads/projects?format=json'
        host = 'akvo.{}'.format(settings.AKVOAPP_DOMAIN)
        client = self._create_client(host)

        # When
        response = client.get(url)

        # Then
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data['results']), 2)

    def test_show_only_partner_orgs_on_partner_site(self):
        # Given
        url = '/rest/v1/typeaheads/organisations?format=json&partners=1'
        host = 'akvo.{}'.format(settings.AKVOAPP_DOMAIN)
        client = self._create_client(host)

        # When
        response = client.get(url)

        # Then
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data['results']), 1)

    def test_show_all_orgs_on_partner_site(self):
        # Given
        url = '/rest/v1/typeaheads/organisations?format=json'
        host = 'akvo.{}'.format(settings.AKVOAPP_DOMAIN)
        client = self._create_client(host)

        # When
        response = client.get(url)

        # Then
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data['results']), 2)

    def test_shows_all_orgs_on_rsr_site_when_only_partners_requested(self):
        # Given
        url = '/rest/v1/typeaheads/organisations?format=json&partners=1'
        client = self._create_client()

        # When
        response = client.get(url)

        # Then
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data['results']), 2)

    def test_show_all_orgs_on_rsr_site(self):
        # Given
        url = '/rest/v1/typeaheads/organisations?format=json'
        client = self._create_client()

        # When
        response = client.get(url)

        # Then
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data['results']), 2)


class UserOrganisationTypeaheadTest(BaseTestCase):

    def test_anonymous_user_organisations_typeahead(self):
        # Given
        self.create_organisation('Foo')
        url = '/rest/v1/typeaheads/user_organisations?format=json'

        # When
        response = self.c.get(url, follow=True)

        # Then
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['count'], 0)

    def test_authenticated_user_organisations_typeahead(self):
        # Given
        org = self.create_organisation('Foo')
        username = password = 'foo@example.com'
        user = self.create_user(username, password)
        self.c.login(username=username, password=password)
        url = '/rest/v1/typeaheads/user_organisations?format=json'
        self.make_employment(user, org, 'Admins')

        # When
        response = self.c.get(url, follow=True)

        # Then
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['count'], 1)
        organisation = response.data['results'][0]
        self.assertEqual(organisation['id'], org.pk)
        self.assertEqual(organisation['name'], org.name)

    def test_admin_user_organisations_typeahead(self):
        # Given
        org = self.create_organisation('Foo')
        username = password = 'foo@example.com'
        self.create_user(username, password, is_admin=True)
        self.c.login(username=username, password=password)
        url = '/rest/v1/typeaheads/user_organisations?format=json'

        # When
        response = self.c.get(url, follow=True)

        # Then
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['count'], 1)
        organisation = response.data['results'][0]
        self.assertEqual(organisation['id'], org.pk)
        self.assertEqual(organisation['name'], org.name)


class UserProjectTypeaheadTest(BaseTestCase):

    def test_anonymous_user_projects_typeahead(self):
        # Given
        org = self.create_organisation('Foo')
        project = self.create_project('Project')
        self.make_partner(project, org)
        url = '/rest/v1/typeaheads/user_projects?format=json'

        # When
        response = self.c.get(url, follow=True)

        # Then
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['count'], 0)

    def test_authenticated_user_projects_typeahead(self):
        # Given
        org = self.create_organisation('Foo')
        project = self.create_project('Project')
        self.make_partner(project, org)
        username = password = 'foo@example.com'
        user = self.create_user(username, password)
        self.make_employment(user, org, 'Admins')
        self.c.login(username=username, password=password)
        url = '/rest/v1/typeaheads/user_projects?format=json'

        # When
        response = self.c.get(url, follow=True)

        # Then
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['count'], 1)
        result = response.data['results'][0]
        self.assertEqual(result['id'], project.pk)
        self.assertEqual(result['title'], project.title)

    def test_admin_user_projects_typeahead(self):
        # Given
        org = self.create_organisation('Foo')
        project = self.create_project('Project')
        self.make_partner(project, org)
        username = password = 'foo@example.com'
        self.create_user(username, password, is_admin=True)
        self.c.login(username=username, password=password)
        url = '/rest/v1/typeaheads/user_projects?format=json'

        # When
        response = self.c.get(url, follow=True)

        # Then
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['count'], 1)
        result = response.data['results'][0]
        self.assertEqual(result['id'], project.pk)
        self.assertEqual(result['title'], project.title)


class CountryTypeaheadTest(BaseTestCase):

    def setUp(self):
        super(CountryTypeaheadTest, self).setUp()
        version, _ = Version.objects.get_or_create(code=settings.IATI_VERSION)
        # Delete all the countries created in migrations
        Country.objects.all().delete()
        Country.objects.create(name='India', version=version)
        Country.objects.create(name='Netherlands', version=version)

    def test_countries_typeahead(self):
        # Given
        url = '/rest/v1/typeaheads/countries?format=json'

        # When
        response = self.c.get(url, follow=True)

        # Then
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['count'], 2)


class ProjectUpdateTypeaheadTest(BaseTestCase):

    def setUp(self):
        super(ProjectUpdateTypeaheadTest, self).setUp()

    def test_project_update_typeahead(self):
        # Given
        project = self.create_project('Foo')
        user = self.create_user('foo@example.com')
        ProjectUpdate.objects.create(project=project, user=user, title='First')
        ProjectUpdate.objects.create(project=project, user=user, title='Second')
        url = '/rest/v1/typeaheads/project_updates?format=json'

        # When
        response = self.c.get(url, follow=True)

        # Then
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['count'], 2)
        self.assertEqual({up['title'] for up in response.data['results']}, {'First', 'Second'})
