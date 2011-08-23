# -*- coding: utf-8 -*-
"""
    Akvo RSR is covered by the GNU Affero General Public License.
    See more details in the license.txt file located at the root folder of the
    Akvo RSR module. For additional details on the GNU license please
    see < http://www.gnu.org/licenses/agpl.html >.
"""
from __future__ import absolute_import
from django.contrib.sites.models import Site
from django.http import HttpRequest, Http404
from django.utils import unittest
from ..middleware import PartnerSitesRouterMiddleware


__all__ = [
    'PartnerSitesRouterMiddlewareTestCase',
]


class PartnerSitesRouterMiddlewareTestCase(unittest.TestCase):

    def setUp(self):
        """Reusing middleware, Organisation and Partnersite objects where
        appropriate. Otherwise there is one request per use case."""
        self.mw = PartnerSitesRouterMiddleware()
        
        # set up a Site object
        # the_site = get_object_or_404(Site, pk=1)
        # change the_site to www.akvo.org
        

        self.bare_request = HttpRequest()
        self.bare_request.META['SERVER_NAME'] = 'www.akvo.org'
        self.bare_request.META['SERVER_PORT'] = '8000'

    def test_bare_host(self):
        """Tests bare akvo.org."""
        self.assertEqual(self.mw.process_request(self.bare_request), None)

