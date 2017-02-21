# -*- coding: utf-8 -*-

"""Akvo RSR is covered by the GNU Affero General Public License.

See more details in the license.txt file located at the root folder of the Akvo RSR module.
For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.
"""

from django.conf import settings
from django.core.exceptions import DisallowedHost
from django.test import Client, TestCase
from django.test.client import RequestFactory
from akvo.rsr.middleware import _is_rsr_host, _is_naked_app_host, _partner_site
from akvo.rsr.models import PartnerSite, Organisation
from akvo.codelists.models import Version

STOCK_RSR_NETLOC = "http://{}".format(settings.RSR_DOMAIN)
AKVOAPP_NETLOC = "http://{}".format(settings.AKVOAPP_DOMAIN)


class ValidStockRSRTestCase(TestCase):

    """Testing request to stock RSR.

    valid hosts :
    - settings.RSR_DOMAIN
    - 127.0.0.1
    - localhost
    """

    def setUp(self):
        """Setup."""
        self.factory = RequestFactory()
        self.req_RSR_DOMAIN = self.factory.get('/', {}, HTTP_HOST=settings.RSR_DOMAIN)
        self.req_127 = self.factory.get('/', {}, HTTP_HOST='127.0.0.1')
        self.req_localhost = self.factory.get('/', {}, HTTP_HOST='localhost')

    def test_is_rsr_host(self):
        """Test request to normal RSR host."""
        self.assertTrue(_is_rsr_host(self.req_RSR_DOMAIN.get_host()))
        self.assertTrue(_is_rsr_host(self.req_127.get_host()))
        self.assertTrue(_is_rsr_host(self.req_localhost.get_host()))


class HostHeaderTestCase(TestCase):

    """Testing boot traffic."""

    def test_underscore_host(self):
        """When host is '_'."""
        self.c = Client(HTTP_HOST='_')
        resp = self.c.get('/')
        self.assertEqual(resp.status_code, 302)

    def test_empy_host(self):
        """When host is ''."""
        self.c = Client(HTTP_HOST='')
        resp = self.c.get('/')
        self.assertEqual(resp.status_code, 302)

    def test_oddchar_host(self):
        """When host is ''."""
        self.c = Client(HTTP_HOST='$')
        resp = self.c.get('/')
        self.assertEqual(resp.status_code, 302)

    def test_wildcard_host(self):
        """When host is ''*.live.akvo-ops.org"""
        self.c = Client(HTTP_HOST='*.live.akvo-ops.org')
        resp = self.c.get('/')
        self.assertEqual(resp.status_code, 302)


class InValidStockRSRTestCase(TestCase):

    """Testing request to stock RSR.

    invalid hosts :
    - "invalid_host"
    - ""
    """

    def setUp(self):
        """Setup."""
        self.factory = RequestFactory()
        self.req_not_found_host = self.factory.get('/', {}, HTTP_HOST='not-found.akvo.org')
        self.req_not_found_host2 = self.factory.get('/', {}, HTTP_HOST='not-found.test.akvo.org')
        self.req_invalid_host = self.factory.get('/', {}, HTTP_HOST='invalid_host')
        self.req_empty_host = self.factory.get('/', {}, HTTP_HOST='')

    def test_is_rsr_host(self):
        """Test request to normal RSR host."""
        self.assertFalse(_is_rsr_host(self.req_not_found_host.get_host()))
        self.assertFalse(_is_rsr_host(self.req_not_found_host2.get_host()))
        with self.assertRaises(DisallowedHost):
            _is_rsr_host(self.req_invalid_host.get_host())
        with self.assertRaises(DisallowedHost):
            _is_rsr_host(self.req_empty_host.get_host())


class NakedAKVOAPP_DOMAINTestCase(TestCase):

    """Testing request to naked AKVOAPP_DOMAIN."""

    def test_is_rsr_host(self):
        """Make sure AKVOAPP domain is not a valid stock RSR host."""
        self.assertFalse(_is_rsr_host(settings.AKVOAPP_DOMAIN))

    def test_is_akvoapp_host(self):
        """Make sure AKVOAPP domain is a valid app domain."""
        self.assertTrue(_is_naked_app_host(settings.AKVOAPP_DOMAIN))

    def test_akvoapp_redirect(self):
        """Call naked app domain will return a redirect to the stock RSR page.

        Since that page
        redirects to /projets there is another 302 in the target status code.
        """
        c = Client(HTTP_HOST=settings.AKVOAPP_DOMAIN)
        resp_naked = c.get('/', follow=True)
        self.assertRedirects(response=resp_naked, expected_url=STOCK_RSR_NETLOC,
                             status_code=302, target_status_code=302)


class ValidAkvoPageTestCase(TestCase):

    """Testing request to valid Akvo pages."""

    def setUp(self):
        """Setup."""
        valid_host = "partner1.{}".format(settings.AKVOAPP_DOMAIN)
        self.c = Client(HTTP_HOST=valid_host)
        o1 = Organisation.objects.create(name='p1', long_name='Partner1')
        PartnerSite.objects.create(
            organisation=o1,
            hostname='partner1',
            cname='projects.partner1.org',
            piwik_id=0,
        )
        iati_version = Version(code=settings.IATI_VERSION)
        iati_version.save()

    def test_partner_site(self):
        """."""
        self.assertTrue("partner1.{}".format(settings.AKVOAPP_DOMAIN))

    def test_valid_partner_site(self):
        """."""
        valid_resp = self.c.get('/', follow=True)
        expected_host = "partner1.{}".format(settings.AKVOAPP_DOMAIN)
        # print valid_resp.redirect_chain
        self.assertRedirects(response=valid_resp, expected_url="/en/projects/",
                             status_code=302, target_status_code=200, host=expected_host)


class ValidCnameAkvoPageTestCase(TestCase):

    """Testing request to valid Akvo pages."""

    def setUp(self):
        """Setup."""
        # valid_host = "partner1.{}".format(settings.AKVOAPP_DOMAIN)
        self.cname = "projects.partner1.org"
        self.c = Client(HTTP_HOST=self.cname)
        o1 = Organisation.objects.create(name='p1', long_name='Partner1')
        PartnerSite.objects.create(
            organisation=o1,
            hostname='partner1',
            cname=self.cname,
            piwik_id=0,
        )
        iati_version = Version(code=settings.IATI_VERSION)
        iati_version.save()

    def test_partner_site(self):
        """."""
        self.assertTrue(_partner_site(self.cname))

    def test_valid_partner_site(self):
        """."""
        valid_resp = self.c.get('/', follow=True)
        # expected_host = "partner1.{}".format(settings.AKVOAPP_DOMAIN)
        self.assertRedirects(response=valid_resp, expected_url="/en/projects/",
                             status_code=302, target_status_code=200, host=self.cname)


class InvalidAkvoPageTestCase(TestCase):

    """Testing request to stock RSR.

    invalid hosts :
    - "invalid_host"
    - ""
    """

    def setUp(self):
        """Setup."""
        self.c = Client(HTTP_HOST=settings.AKVOAPP_DOMAIN)

    def test_partner_site(self):
        """."""
        with self.assertRaises(PartnerSite.DoesNotExist):
                _partner_site("invalid.{}".format(settings.AKVOAPP_DOMAIN))

    def test_invalid_partner_site(self):
        """."""
        invalid_resp = self.c.get('/')
        self.assertRedirects(response=invalid_resp, expected_url=STOCK_RSR_NETLOC,
                             status_code=302, target_status_code=302)
