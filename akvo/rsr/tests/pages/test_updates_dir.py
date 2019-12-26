# -*- coding: utf-8 -*-

"""Akvo RSR is covered by the GNU Affero General Public License.

See more details in the license.txt file located at the root folder of the Akvo RSR module.
For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.
"""

from django.conf import settings
from django.test import Client, TestCase
from ..utils import contains_template_errors


class PingTest(TestCase):

    """Simple ping."""

    def setUp(self):
        """Setup."""
        self.c = Client(HTTP_HOST=settings.RSR_DOMAIN)
        self.resp = self.c.get('/updates/')
        self.en_resp = self.c.get('/en/updates/')
        self.es_resp = self.c.get('/es/updates/')

    def test_ping(self):
        """Ping /updates/."""
        self.assertEqual(self.en_resp.status_code, 200)
        self.assertEqual(self.es_resp.status_code, 200)

    def test_redirect(self):
        """Test /updates/ redirect."""
        self.assertEqual(self.resp.status_code, 302)

    def test_template_markup(self):
        """Check for common template errors."""
        self.assertFalse(contains_template_errors(self.resp.content.decode('utf8')))
