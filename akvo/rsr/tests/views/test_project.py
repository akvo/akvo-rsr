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

from akvo.rsr.models import Organisation


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
        page_limit_1 = 'href="?limit=20"'
        page_limit_2 = 'href="?limit=100"'
        page_limit_3 = 'href="?limit=200"'

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
        page_limit_1 = 'href="?limit=20&amp;organisation={}"'.format(org.id)
        page_limit_2 = 'href="?limit=100&amp;organisation={}"'.format(org.id)
        page_limit_3 = 'href="?limit=200&amp;organisation={}"'.format(org.id)

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
        page_limit_1 = 'href="?limit=20"'
        page_limit_2 = 'href="?limit=100"'
        page_limit_3 = 'href="?limit=200"'

        # When
        response = self.c.get(url, data=data, follow=True)

        # Then
        self.assertIn(page_limit_1, response.content)
        self.assertIn(page_limit_2, response.content)
        self.assertIn(page_limit_3, response.content)
