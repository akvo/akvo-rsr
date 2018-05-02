# -*- coding: utf-8 -*-

"""
Akvo RSR is covered by the GNU Affero General Public License.

See more details in the license.txt file located at the root folder of the Akvo RSR module.
For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.
"""

import os

from django.core.cache import cache
from django.conf import settings
from django.test import Client, TestCase

from akvo.rsr.iso3166 import ISO_3166_COUNTRIES
from akvo.rsr.models import (
    Country, Keyword, Organisation, Partnership, PartnerSite, Project, ProjectLocation,
    PublishingStatus, RecipientCountry
)


class ProjectTypeaheadTest(TestCase):

    def setUp(self):
        super(ProjectTypeaheadTest, self).setUp()
        self.organisation = self._create_organisation('Akvo')
        self.partner_site = PartnerSite.objects.create(
            organisation=self.organisation,
            piwik_id=1,
            hostname='akvo'
        )

        self.image = os.path.join(settings.MEDIA_ROOT, 'test-image.png')
        with open(self.image, 'w+b'):
            pass

        for i in range(1, 6):
            project = Project.objects.create(title='Project - {}'.format(i),
                                             current_image=self.image)
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

    def tearDown(self):
        os.remove(self.image)
        cache.clear()

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

    def test_should_show_keyword_projects_in_partner_site(self):
        # Given
        hostname = 'akvo'
        host = '{}.{}'.format(hostname, settings.AKVOAPP_DOMAIN)
        partner_projects = False
        keyword = Keyword.objects.create(label=hostname)
        self.partner_site.partner_projects = partner_projects
        self.partner_site.save()
        self.partner_site.keywords.add(keyword)
        project_title = '{} awesome project'.format(hostname)
        project = Project.objects.create(title=project_title, current_image=self.image)
        project.keywords.add(keyword)
        project.publish()
        url = '/rest/v1/typeaheads/project_filters?format=json'
        client = self._create_client(host)

        # When
        response = client.get(url, follow=True)

        # Then
        self.assertEqual(len(response.data['projects']), 1)
        self.assertEqual(project_title, response.data['projects'][0]['title'])

    def test_should_show_all_partner_projects(self):
        # Given
        hostname = 'akvo'
        host = '{}.{}'.format(hostname, settings.AKVOAPP_DOMAIN)
        url = '/rest/v1/typeaheads/project_filters?format=json'
        client = self._create_client(host)

        # When
        response = client.get(url, follow=True)

        # Then
        self.assertEqual(len(response.data['projects']), 1)
        self.assertIn('Project - 1', response.data['projects'][0]['title'])

    def test_should_show_all_country_projects(self):
        # Given
        titles = ['Project - {}'.format(i) for i in range(0, 6)]
        projects = [None] + [Project.objects.get(title=title) for title in titles[1:]]
        url = '/rest/v1/typeaheads/project_filters?format=json&location=262'
        latitude, longitude = ('11.8948112', '42.5807153')
        country_code = 'DJ'
        # Add a Recipient Country - DJ
        RecipientCountry.objects.create(project=projects[2], country=country_code)
        # ProjectLocation in DJ
        self.setup_country_objects()
        project_location = ProjectLocation.objects.create(location_target=projects[3],
                                                          latitude=latitude,
                                                          longitude=longitude)
        project_location = ProjectLocation.objects.create(location_target=projects[4],
                                                          latitude=latitude,
                                                          longitude=longitude)
        project_location = ProjectLocation.objects.create(location_target=projects[5],
                                                          latitude=latitude,
                                                          longitude=longitude)

        # ProjectLocation with no country
        ProjectLocation.objects.create(location_target=projects[3],
                                       latitude=None,
                                       longitude=None)
        client = self._create_client()

        # When
        response = client.get(url, follow=True)

        # Then
        projects = response.data['projects']
        self.assertEqual(len(projects), 2)
        response_titles = {project['title'] for project in projects}
        self.assertIn(titles[2], response_titles)
        self.assertIn(titles[3], response_titles)
        self.assertEqual(project_location.country.iso_code, country_code.lower())

    def setup_country_objects(self):
        for iso_code, name in ISO_3166_COUNTRIES:
            Country.objects.create(name=name, iso_code=iso_code)
