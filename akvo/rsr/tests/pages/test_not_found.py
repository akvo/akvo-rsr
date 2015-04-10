# -*- coding: utf-8 -*-

"""Akvo RSR is covered by the GNU Affero General Public License.

See more details in the license.txt file located at the root folder of the Akvo RSR module.
For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.
"""

from django.conf import settings
from django.test import Client, TestCase


class NotFoundPageTest(TestCase):

    """Simple ping to non existing page."""

    def setUp(self):
        """Setup."""
        self.c = Client(HTTP_HOST=settings.RSR_DOMAIN)

    def test_not_found(self):
        """."""
        response = self.c.get('/does-not-exist')
        self.assertEqual(response.status_code, 404)
