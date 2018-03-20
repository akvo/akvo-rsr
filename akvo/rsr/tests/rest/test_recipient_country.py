# -*- coding: utf-8 -*-

"""
Akvo RSR is covered by the GNU Affero General Public License.

See more details in the license.txt file located at the root folder of the Akvo RSR module.
For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.
"""

import json

from akvo.codelists.store.codelists_v202 import COUNTRY
from akvo.codelists.models import Country, Version
from akvo.rsr.models import Project, RecipientCountry

from django.conf import settings
from django.test import TestCase, Client


class RecipientCountryTestCase(TestCase):
    """Tests the recipient country REST endpoints."""

    def setUp(self):
        self.c = Client(HTTP_HOST=settings.RSR_DOMAIN)
        version, _ = Version.objects.get_or_create(code=settings.IATI_VERSION, url='http://iati.org')
        for code, name in COUNTRY[1:]:
            Country.objects.create(name=name, code=code, version=version)

    def tearDown(self):
        Project.objects.all().delete()
        Country.objects.all().delete()
        RecipientCountry.objects.all().delete()

    def test_unicode_recipient_country_name(self):
        """Checks that a recipient country with a unicode name can be fetched."""

        # Given
        project = Project.objects.create(title="REST test project")
        project.publish()
        recipient_country = RecipientCountry.objects.create(
            project=project,
            country="CI",
        )

        # When
        response = self.c.get('/rest/v1/recipient_country/?format=json&project={}'.format(project.id))

        # Then
        self.assertEqual(response.status_code, 200)
        country = json.loads(response.content)['results'][0]['country']
        self.assertEqual(recipient_country.country, country)
