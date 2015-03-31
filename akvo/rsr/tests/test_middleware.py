# -*- coding: utf-8 -*-

"""Akvo RSR is covered by the GNU Affero General Public License.

See more details in the license.txt file located at the root folder of the
Akvo RSR module. For additional details on the GNU license please
see < http://www.gnu.org/licenses/agpl.html >.
"""

from django.test import TestCase
from django.test.client import RequestFactory
from akvo.rsr.middleware2 import get_domain, ReallySimpleRouterMiddleware


class PagesRouterMiddlewareTestCase(TestCase):

    """Testing the routing mechanism."""

    def setUp(self):
        """Setup."""
        self.factory = RequestFactory()
        self.mw = ReallySimpleRouterMiddleware()
        self.req0 = self.factory.get('/')
        self.req1 = self.factory.get('/', {}, HTTP_HOST='rsr.akvo.org')
        self.req2 = self.factory.get('/', {}, HTTP_HOST='rsr.localdev.akvo.org')

    def test_get_domain(self):
        """."""
        self.assertEqual(get_domain(self.req0), "rsr.akvo.org")
        self.assertEqual(get_domain(self.req1), "rsr.akvo.org")
        self.assertEqual(get_domain(self.req2), "rsr.localdev.akvo.org")

    def test_process_request(self):
        """Test inbound."""
        self.assertEqual(None, None)
