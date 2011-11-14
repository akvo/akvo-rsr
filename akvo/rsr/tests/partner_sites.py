# -*- coding: utf-8 -*-
"""
    Akvo RSR is covered by the GNU Affero General Public License.
    See more details in the license.txt file located at the root folder of the
    Akvo RSR module. For additional details on the GNU license please
    see < http://www.gnu.org/licenses/agpl.html >.
"""
from __future__ import absolute_import
from django.contrib.sites.models import Site
from django.contrib.sites import models
from django.db import IntegrityError
from django.http import HttpRequest, Http404
from django.utils import unittest
from django.test.client import Client
from ..middleware import PartnerSitesRouterMiddleware

'''
__all__ = [
    #'PartnerSitesRouterMiddlewareTestCase',
]


class PartnerSitesRouterMiddlewareTestCase(unittest.TestCase):

    def setUp(self):
        """Reusing middleware, Organisation and Partnersite objects where
        appropriate. Otherwise there is one request per use case."""
        self.client = Client()
        self.mw = PartnerSitesRouterMiddleware()

        # Configure default Site object
        site_1 = Site.objects.get(pk=1) 
        site_1.domain = 'www.akvo.org'
        site_1.name = 'www.akvo.org'
        site_1.development_domain = 'akvo.dev'
        site_1.save()

        self.akvo_request = HttpRequest()
        self.akvo_request.META['SERVER_NAME'] = 'www.akvo.org'
        self.akvo_request.META['SERVER_PORT'] = '8000'

        self.nonvalid_request = HttpRequest()
        self.nonvalid_request.META['SERVER_NAME'] = 'www.nonvalid.org'
        self.nonvalid_request.META['SERVER_PORT'] = '8000'

        self.valid_request = HttpRequest()
        self.valid_request.META['SERVER_NAME'] = 'partner.akvo.org'
        self.valid_request.META['SERVER_PORT'] = '8000'

        try:
            s = models.Site.objects.create(
                name='partner.akvo.org', 
                domain='partner.akvo.org',
                organisation_id=272,
                partner_domain='projects.a4a.org',
                enabled=True)
            s.save()

        except IntegrityError, e:
            pass
        
        #print models.Site.objects.all()


    def test_akvo_host(self):
        """Tests bare www.akvo.org."""
        self.assertEqual(self.mw.process_request(self.akvo_request), None)

    def test_nonvalid_host(self):
        """Tests nonvalid host."""
        valid_host = True
        
        try:
            mw_response = self.mw.process_request(self.nonvalid_request) 
        except Http404, e:
            valid_host = False

        self.assertEqual(valid_host, False)

    def test_valid_host(self):
        self.assertEqual(self.mw.process_request(self.akvo_request), None)
'''
