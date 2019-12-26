# -*- coding: utf-8 -*-

"""
Akvo RSR is covered by the GNU Affero General Public License.

See more details in the license.txt file located at the root folder of the Akvo RSR module.
For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.
"""

from akvo.rsr.tests.base import BaseTestCase
from akvo.rsr.models import Country, ProjectLocation


class ProjectLocationTest(BaseTestCase):
    def test_project_location_with_unicode_country(self):
        # Given
        country_name = "Côte D'ivoire"
        project = self.create_project("Test Project")
        country, _ = Country.objects.get_or_create(
            name=country_name, defaults=dict(iso_code="ci")
        )
        ProjectLocation.objects.create(
            location_target=project, country=country
        )
        url = "/rest/v1/project_location/"
        data = {"format": "json", "location_target": project.id}

        # When
        response = self.c.get(url, data)

        # Then
        self.assertEqual(response.status_code, 200)
        results = response.data["results"]
        self.assertEqual(1, len(results))
        self.assertEqual(country_name, results[0]["country_label"])

    def test_project_location_country_from_iso_code(self):
        # Given
        self.create_user('foo@example.com', 'password', is_superuser=True)
        country_name = "Côte D'ivoire"
        project = self.create_project("Test Project")
        country, _ = Country.objects.get_or_create(
            name=country_name, defaults=dict(iso_code="ci")
        )
        url = "/rest/v1/project_location/"
        data = {
            "location_target": project.pk,
            "latitude": 7.539988999999999,
            "longitude": -5.547080000000051,
            "city": "Côte d'Ivoire",
            "country_iso_code": "CI",
        }
        self.c.login(username='foo@example.com', password='password')

        # When
        response = self.c.post(url, data)

        # Then
        self.assertEqual(response.status_code, 201)
        data = response.data
        self.assertEqual(data['location_target'], project.pk)
        self.assertEqual(data['country_iso_code'], country.iso_code)
        self.assertEqual(data['country_label'], country.name)
