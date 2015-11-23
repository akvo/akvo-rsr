# -*- coding: utf-8 -*-

"""Akvo RSR is covered by the GNU Affero General Public License.

See more details in the license.txt file located at the root folder of the Akvo RSR module.
For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.
"""

from akvo.codelists.models import Version

from django.conf import settings
from django.test import Client, TestCase


class PingTest(TestCase):

    """Simple ping test."""

    def setUp(self):
        """Setup."""
        self.c = Client(HTTP_HOST=settings.RSR_DOMAIN)
        iati_version = Version(code=settings.IATI_VERSION)
        iati_version.save()

    def test_redirect(self):
        """Ping /."""
        response = self.c.get('/', follow=True)
        expected_host = settings.RSR_DOMAIN
        self.assertRedirects(response=response, expected_url='/en/projects/', status_code=302,
                             target_status_code=200, host=expected_host)
