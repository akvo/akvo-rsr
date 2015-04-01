# -*- coding: utf-8 -*-

"""Akvo RSR is covered by the GNU Affero General Public License.

See more details in the license.txt file located at the root folder of the
Akvo RSR module. For additional details on the GNU license please
see < http://www.gnu.org/licenses/agpl.html >.
"""

from django.conf import settings
from django.test import TestCase
from django.test.client import RequestFactory
from akvo.rsr.middleware import (_is_rsr_host, _partner_site, HostDispatchMiddleware)
from akvo.rsr.models import PartnerSite, Organisation


class PagesRouterMiddlewareTestCase(TestCase):

    """Testing the routing mechanism."""

    def setUp(self):
        """Setup."""
        self.factory = RequestFactory()
        self.mw = HostDispatchMiddleware()
        self.RSR_DOMAIN = settings.RSR_DOMAIN
        self.AKVOAPP_DOMAIN = settings.AKVOAPP_DOMAIN
        o1 = Organisation(name='p1', long_name='Partner1')
        o1.save()
        ps1 = PartnerSite(organisation=o1, hostname='partner1', cname='projects.partner1.org')
        ps1.save()

        # Valid RSR hosts
        self.rsr_req0 = self.factory.get('/', {}, HTTP_HOST=self.RSR_DOMAIN)
        self.rsr_req1 = self.factory.get('/', {}, HTTP_HOST='127.0.0.1')
        self.rsr_req2 = self.factory.get('/', {}, HTTP_HOST='localhost')
        # Invalid but on the correct domain
        self.invalid_rsr_req0 = self.factory.get('/', {},
                                                 HTTP_HOST='notfound.{}'.format(self.RSR_DOMAIN))
        # Valid request to the app domain (used by third parties)
        self.naked_app_req0 = self.factory.get('/', {}, HTTP_HOST=self.AKVOAPP_DOMAIN)
        # self.valid_app_req0 = ...
        self.app_req0_hostname = 'partner1'
        self.app_req0 = self.factory.get('/', {},
                                         HTTP_HOST='{}.{}'.format(self.app_req0_hostname,
                                                                  self.AKVOAPP_DOMAIN))
        # Invalid request to the app domain (used by third parties)
        self.invalid_app_req0 = self.factory.get('/', {},
                                                 HTTP_HOST='notfound.{}'.format(self.RSR_DOMAIN))
        # Valid request with other host configured in a partner page
        self.valid_app_req0 = self.factory.get('/', {}, HTTP_HOST=ps1.cname)
        # Invalid request with other host
        self.invalid_req0 = self.factory.get('/', {}, HTTP_HOST='notfound.example.com')

    def test_is_rsr_host(self):
        """."""
        self.assertEqual(_is_rsr_host(self.rsr_req0.get_host()), True)
        self.assertEqual(_is_rsr_host(self.rsr_req1.get_host()), True)
        self.assertEqual(_is_rsr_host(self.rsr_req2.get_host()), True)
        self.assertEqual(_is_rsr_host(self.invalid_rsr_req0.get_host()), False)
        self.assertEqual(_is_rsr_host(self.naked_app_req0.get_host()), False)
        self.assertEqual(_is_rsr_host(self.app_req0.get_host()), False)
        self.assertEqual(_is_rsr_host(self.invalid_app_req0.get_host()), False)
        self.assertEqual(_is_rsr_host(self.invalid_req0.get_host()), False)

    def test_partner_site(self):
        """."""
        with self.assertRaises(PartnerSite.DoesNotExist):
            _partner_site(self.invalid_app_req0.get_host())

        # with self.assertRaises(PartnerSite.DoesNotExist):
        #     partner_site(self.app_req0.get_host())
        # self.assertEqual(partner_site(self.app_req0.get_host()).hostname, 'partner1')
        self.assertEqual(_partner_site(self.app_req0.get_host()).hostname, self.app_req0_hostname)
        self.assertEqual(_partner_site(self.valid_app_req0.get_host()).cname,
                         'projects.partner1.org')

        # print PartnerSite.objects.all()

        #
        # try:
        #     site = partner_site(self.invalid_app_req0.get_host())
        # except PartnerSite.DoesNotExist:
        #
        # with self.assertRaises(ObjectDoesNotExist) as cm:
        #     site = partner_site(self.invalid_app_req0.get_host())
        #
        # # self.assertEqual(cm, True)
        # the_exception = cm.exception
        # self.assertEqual(the_exception, PartnerSite.DoesNotExist)
        # self.assertEqual(the_exception.error_code, 3)

        # self.assertRaises(partner_site('partner.{}'.format(self.AKVOAPP_DOMAIN)))
        # self.assertEqual(True, True)
        # self.assertEqual(partner_site('partner.{}'.format(self.AKVOAPP_DOMAIN)), False)
    #
    #     self.req0 = self.factory.get('/', {}, HTTP_HOST=self.RSR_DOMAIN)
    #     self.req1 = self.factory.get('/', {}, HTTP_HOST='notfound.{}'.format(self.RSR_DOMAIN))
    #     self.req2 = self.factory.get('/', {}, HTTP_HOST=self.AKVOAPP_DOMAIN)
    #     self.req3 = self.factory.get('/', {}, HTTP_HOST='notfound.{}'.format(self.RSR_DOMAIN))
    #     # self.req4 = self.factory.get('/', {}, HTTP_HOST='valid.{}'.format(self.AKVOAPP_DOMAIN))
    #     self.req5 = self.factory.get('/', {},
    #       HTTP_HOST='notfound.{}'.format(self.AKVOAPP_DOMAIN))
    #
    # def test_is_rsr_instance(self):
    #     """."""
    #     self.assertEqual(is_rsr_instance(self.req0.get_host()), True)
    #     self.assertEqual(is_rsr_instance(self.req1.get_host()), True)
    #     self.assertEqual(is_rsr_instance(self.req2.get_host()), False)
    #     self.assertEqual(is_rsr_instance(self.req3.get_host()), False)
    #     self.assertEqual(is_rsr_instance(self.req5.get_host()), False)
    #
    # def test_is_rsr_domain(self):
    #     """."""
    #     self.assertEqual(is_rsr_domain(self.req0), True)
    #     self.assertEqual(is_rsr_domain(self.req1), False)
    #     self.assertEqual(is_rsr_domain(self.req2), False)
    #     self.assertEqual(is_rsr_domain(self.req3), False)
    #     self.assertEqual(is_rsr_domain(self.req5), False)
    #
    # def test_is_akvoapp_domain(self):
    #     """."""
    #     self.assertEqual(is_akvoapp_domain(self.req1), False)
    #     self.assertEqual(is_akvoapp_domain(self.req2), True)
    #     self.assertEqual(is_akvoapp_domain(self.req3), False)
    #     self.assertEqual(is_akvoapp_domain(self.req5), False)

# class PagesRouterMiddlewareTestCase(TestCase):
#
#     """Testing the routing mechanism."""
#
#     def setUp(self):
#         """Setup."""
#         self.factory = RequestFactory()
#         self.mw = ReallySimpleRouterMiddleware()
#
#         self.req1 = self.factory.get('/', {}, HTTP_HOST='rsr.akvo.org')
#         self.req2 = self.factory.get('/', {}, HTTP_HOST='rsr.test.akvo.org')
#         self.req3 = self.factory.get('/', {}, HTTP_HOST='rsr.uat.akvo.org')
#         self.req4 = self.factory.get('/', {}, HTTP_HOST='rsr.localdev.akvo.org')
#         self.req5 = self.factory.get('/', {}, HTTP_HOST='notfound.akvo.org')
#
#         self.req5 = self.factory.get('/', {}, HTTP_HOST='akvoapp.org')
#         self.req6 = self.factory.get('/', {}, HTTP_HOST='test.akvoapp.org')
#         self.req7 = self.factory.get('/', {}, HTTP_HOST='uat.akvoapp.org')
#         self.req8 = self.factory.get('/', {}, HTTP_HOST='localdev.akvoapp.org')
#         self.req5 = self.factory.get('/', {}, HTTP_HOST='notfound.akvoapp.org')
#
#         # RSR_DOMAIN = 'rsr.localdev.akvo.org'
#         # AKVOAPP_DOMAIN = 'localakvoapp.org'
#
#     def test_get_domain(self):
#         """."""
#         self.assertEqual(get_domain(self.req0), "rsr.akvo.org")
#         self.assertEqual(get_domain(self.req1), "rsr.akvo.org")
#         self.assertEqual(get_domain(self.req2), "rsr.localdev.akvo.org")
#
#     def test_process_request(self):
#         """Test inbound."""
#         self.assertEqual(None, None)
