# -*- coding: utf-8 -*-

"""
Akvo RSR is covered by the GNU Affero General Public License.

See more details in the license.txt file located at the root folder of the Akvo RSR module.
For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.
"""

import json

from django.conf import settings
from django.test import Client, TestCase

from akvo.rsr.models import Country, Project, ProjectLocation


class ProjectLocationTest(TestCase):

    def setUp(self):
        self.c = Client(HTTP_HOST=settings.RSR_DOMAIN)
        # Delete all countries created in any migrations
        Country.objects.all().delete()

    def test_project_location_with_unicode_country(self):
        # Given
        country_name = u"Côte D'ivoire"
        project = Project.objects.create()
        project.publish()
        country = Country.objects.create(name=country_name, iso_code='CI')
        ProjectLocation.objects.create(location_target=project, country=country)
        url = '/rest/v1/project_location/'
        data = {'format': 'json', 'location_target': project.id}

        # When
        response = self.c.get(url, data)

        # Then
        self.assertEqual(response.status_code, 200)
        results = json.loads(response.content)['results']
        self.assertEqual(1, len(results))
        self.assertEqual(country_name, results[0]['country_label'])
