# -*- coding: utf-8 -*-

"""
Akvo RSR is covered by the GNU Affero General Public License.

See more details in the license.txt file located at the root folder of the Akvo RSR module.
For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.
"""

from __future__ import print_function

from unittest import skip

import django_perf_rec
from django.conf import settings
from django.test import Client, TestCase

from akvo.rsr.iso3166 import ISO_3166_COUNTRIES
from akvo.rsr.models import (
    Country, Keyword, Organisation, PartnerSite, Partnership, Project, ProjectLocation, RecipientCountry
)


@skip('Needs Django >= 1.8')
class ProjectPerfomanceTestCase(TestCase):
    """Test performance of project views."""

    def setUp(self):
        return

    def test_project_directory_listing(self):
        with django_perf_rec.record():
            self.client.get('/en/projects/', follow=True)


class ProjectViewsTestCase(TestCase):
    """Test the project views."""

    def setUp(self):
        super(ProjectViewsTestCase, self).setUp()
        self.c = Client(HTTP_HOST=settings.RSR_DOMAIN)

    def test_should_add_page_size_limit_links(self):
        # Given
        url = '/en/projects/'
        page_limit_1 = 'href="?limit=20&amp;page=1"'
        page_limit_2 = 'href="?limit=50&amp;page=1"'
        page_limit_3 = 'href="?limit=100&amp;page=1"'

        # When
        response = self.c.get(url, follow=True)

        # Then
        self.assertIn(page_limit_1, response.content)
        self.assertIn(page_limit_2, response.content)
        self.assertIn(page_limit_3, response.content)

    def test_should_add_page_size_limit_parameter(self):
        # Given
        org = Organisation.objects.create()
        url = '/en/projects/'
        data = {'organisation': org.id}
        page_limit_1 = 'href="?limit=20&amp;organisation={}&amp;page=1"'.format(org.id)
        page_limit_2 = 'href="?limit=50&amp;organisation={}&amp;page=1"'.format(org.id)
        page_limit_3 = 'href="?limit=100&amp;organisation={}&amp;page=1"'.format(org.id)

        # When
        response = self.c.get(url, data=data, follow=True)

        # Then
        self.assertIn(page_limit_1, response.content)
        self.assertIn(page_limit_2, response.content)
        self.assertIn(page_limit_3, response.content)

    def test_should_replace_page_size_limit_parameter(self):
        # Given
        url = '/en/projects/'
        data = {'limit': 10}
        page_limit_1 = 'href="?limit=20&amp;page=1"'
        page_limit_2 = 'href="?limit=50&amp;page=1"'
        page_limit_3 = 'href="?limit=100&amp;page=1"'

        # When
        response = self.c.get(url, data=data, follow=True)

        # Then
        self.assertIn(page_limit_1, response.content)
        self.assertIn(page_limit_2, response.content)
        self.assertIn(page_limit_3, response.content)

    def test_should_show_keyword_projects_in_partner_site(self):
        # Given
        hostname = 'akvo'
        partner_projects = False
        org = Organisation.objects.create(name=hostname)
        keyword = Keyword.objects.create(label=hostname)
        partner_site = PartnerSite.objects.create(
            hostname=hostname,
            partner_projects=partner_projects,
            organisation=org,
            piwik_id=10,
        )
        partner_site.keywords.add(keyword)
        project_title = '{} awesome project'.format(hostname)
        project = Project.objects.create(title=project_title)
        project.keywords.add(keyword)
        project.publish()
        url = '/en/projects/'
        self.c = Client(HTTP_HOST='{}.{}'.format(hostname, settings.AKVOAPP_DOMAIN))

        # When
        response = self.c.get(url, follow=True)

        # Then
        self.assertIn(project_title, response.content)

    def test_should_show_all_partner_projects(self):
        # Given
        hostname = 'akvo'
        partner_projects = True
        org = Organisation.objects.create(name=hostname)
        PartnerSite.objects.create(
            hostname=hostname,
            partner_projects=partner_projects,
            organisation=org,
            piwik_id=10,
        )
        project_title1 = '{} awesome project {}'.format(hostname, 1)
        project1 = Project.objects.create(title=project_title1)
        project1.publish()
        Partnership.objects.create(organisation=org, project=project1)
        project_title2 = '{} awesome project {}'.format(hostname, 2)
        project2 = Project.objects.create(title=project_title2)
        project2.publish()
        Partnership.objects.create(organisation=org, project=project2)
        url = '/en/projects/'
        self.c = Client(HTTP_HOST='{}.{}'.format(hostname, settings.AKVOAPP_DOMAIN))

        # When
        response = self.c.get(url, follow=True)

        # Then
        self.assertIn(project_title1, response.content)
        self.assertIn(project_title2, response.content)

    def test_should_show_partner_projects_with_keyword(self):
        # Given
        hostname = 'akvo'
        partner_projects = True
        org = Organisation.objects.create(name=hostname)
        keyword = Keyword.objects.create(label=hostname)
        partner_site = PartnerSite.objects.create(
            hostname=hostname,
            partner_projects=partner_projects,
            organisation=org,
            piwik_id=10,
        )
        partner_site.keywords.add(keyword)
        project_title1 = '{} awesome project {}'.format(hostname, 1)
        project1 = Project.objects.create(title=project_title1)
        project1.keywords.add(keyword)
        project1.publish()
        Partnership.objects.create(organisation=org, project=project1)
        project_title2 = '{} awesome project {}'.format(hostname, 2)
        project2 = Project.objects.create(title=project_title2)
        project2.publish()
        Partnership.objects.create(organisation=org, project=project2)
        url = '/en/projects/'
        self.c = Client(HTTP_HOST='{}.{}'.format(hostname, settings.AKVOAPP_DOMAIN))

        # When
        response = self.c.get(url, follow=True)

        # Then
        self.assertIn(project_title1, response.content)
        self.assertNotIn(project_title2, response.content)

    def test_should_show_all_country_projects(self):
        # Given
        project_title1 = 'Project 1'
        project_title2 = 'Project 2'
        project_title3 = 'Project 3'
        url = '/en/projects/?location=262'
        latitude, longitude = ('11.8948112', '42.5807153')
        country_code = 'DJ'
        # No recipient country
        project1 = Project.objects.create(title=project_title1)
        project1.publish()
        # Recipient Country - DJ
        project2 = Project.objects.create(title=project_title2)
        project2.publish()
        RecipientCountry.objects.create(project=project2, country=country_code)
        # ProjectLocation in DJ
        self.setup_country_objects()
        project3 = Project.objects.create(title=project_title3)
        project3.publish()
        project_location = ProjectLocation.objects.create(location_target=project3,
                                                          latitude=latitude,
                                                          longitude=longitude)

        # When
        response = self.c.get(url, follow=True)

        # Then
        self.assertNotIn(project_title1, response.content)
        self.assertIn(project_title2, response.content)
        self.assertEqual(project_location.country.iso_code, country_code.lower())
        self.assertIn(project_title3, response.content)

    def setup_country_objects(self):
        for iso_code, name in ISO_3166_COUNTRIES:
            Country.objects.create(name=name, iso_code=iso_code)
