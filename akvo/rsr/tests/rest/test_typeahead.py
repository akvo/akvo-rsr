# -*- coding: utf-8 -*-

"""
Akvo RSR is covered by the GNU Affero General Public License.

See more details in the license.txt file located at the root folder of the Akvo RSR module.
For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.
"""

from django.conf import settings
from django.test import Client, TestCase

from akvo.rsr.models import Organisation, Partnership, PartnerSite, Project, PublishingStatus


class ProjectTypeaheadTest(TestCase):

    def setUp(self):
        super(ProjectTypeaheadTest, self).setUp()
        self.organisation = self._create_organisation('Akvo')
        self.partner_site = PartnerSite.objects.create(
            organisation=self.organisation,
            piwik_id=1,
            hostname='akvo'
        )

        for i in range(1, 6):
            project = Project.objects.create(title='Project - {}'.format(i))

            if i < 4:
                publishing_status = project.publishingstatus
                publishing_status.status = PublishingStatus.STATUS_PUBLISHED
                publishing_status.save()

            # Add a partnership for a couple of projects
            if i in {1, 4}:
                Partnership.objects.create(
                    organisation=self.organisation,
                    project=project,
                    iati_organisation_role=Partnership.IATI_REPORTING_ORGANISATION
                )

        # Additional organisation for typeahead/organisations end-point
        self._create_organisation('UNICEF')

    def _create_client(self, host=None):
        """ Create and return a client with the given host."""
        if not host:
            host = settings.RSR_DOMAIN
        return Client(HTTP_HOST=host)

    def _create_organisation(self, name):
        long_name = '{} organisation'.format(name)
        return Organisation.objects.create(name=name, long_name=long_name)

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
