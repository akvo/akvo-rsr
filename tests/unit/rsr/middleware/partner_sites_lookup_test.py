from django.utils import unittest

from testing.helpers.execution import TestSuiteLoader, TestRunner


class PartnerSitesLookup(object):

    PARTNER_SITES_DOMAINS = ('akvoapp.org', 'akvotest.org', 'akvotest2.org', 'akvoapp.dev')

    def __init__(self, partner_site_domains=PARTNER_SITES_DOMAINS):
        self.partner_site_domains = partner_site_domains
    
    def is_partner_site(self, domain):
        domain_parts = domain.split('.')
        if len(domain_parts) >= 3:
            domain_name = '%s.%s' % tuple(domain_parts[-2:])
            if domain_name in self.partner_site_domains:
                return True
        return False


class PartnerSitesLookupTest(unittest.TestCase):

    def setUp(self):
        super(PartnerSitesLookupTest, self).setUp()
        self.partner_sites_lookup = PartnerSitesLookup()
    
    def test_has_known_partner_site_domains(self):
        """tests.rsr.middleware.partner_sites_lookup_test  Can recognise non partner site domain"""
        self.assertIn('akvoapp.org', PartnerSitesLookup.PARTNER_SITES_DOMAINS)
        self.assertIn('akvotest.org', PartnerSitesLookup.PARTNER_SITES_DOMAINS)
        self.assertIn('akvotest2.org', PartnerSitesLookup.PARTNER_SITES_DOMAINS)
        self.assertIn('akvoapp.dev', PartnerSitesLookup.PARTNER_SITES_DOMAINS)
    
    def test_can_recoginse_non_partner_site_domain(self):
        """tests.rsr.middleware.partner_sites_lookup_test  Can recognise non partner site domain"""
        self.assertFalse(self.partner_sites_lookup.is_partner_site('www.akvo.org'), 'Should not be recognised as a partner site')

    def test_can_recoginse_partner_site_domain(self):
        """tests.rsr.middleware.partner_sites_lookup_test  Can recognise partner site domain"""
        self.assertTrue(self.partner_sites_lookup.is_partner_site('connect4change.akvoapp.org'), 'Should be recognised as a partner site')
    

def suite():
    return TestSuiteLoader().load_tests_from(PartnerSitesLookupTest)


if __name__ == '__main__':
    from test_settings import TEST_MODE
    TestRunner(TEST_MODE).run_test_suite(suite())


import mox

from django.core.management import setup_environ
import akvo.settings
setup_environ(akvo.settings)

from django.contrib.sites.models import Site, SiteManager

from testing.helpers.execution import TestRunner, TestSuiteLoader


class SiteFinder(object):

    def __init__(self, site_objects):
        self.site_objects = site_objects

    def find(self, domain_name):
        return self.site_objects.get_or_create(domain=domain_name, name=domain_name)


class SiteFinderTest(mox.MoxTestBase):

    def setUp(self):
        super(SiteFinderTest, self).setUp()
        self.mock_site_model_manager = self.mox.CreateMock(SiteManager)
        self.mock_site = self.mox.CreateMock(Site)
        self.site_finder = SiteFinder(self.mock_site_model_manager)
    
    def test_can_find_site_object_given_domain_name(self):
        """rsr.tests.middleware.site_finder_test  Can find site object given a domain name"""
        expected_site_tuple = (self.mock_site, True)
        self.mock_site_model_manager.get_or_create(domain='some.domain.org', name='some.domain.org').AndReturn(expected_site_tuple)
        self.mox.ReplayAll()
        actual_site_tuple = self.site_finder.find('some.domain.org')
        self.assertEqual(expected_site_tuple, actual_site_tuple)


def suite():
    return TestSuiteLoader().load_tests_from(SiteFinderTest)


if __name__ == '__main__':
    from test_settings import TEST_MODE
    TestRunner(TEST_MODE).run_test_suite(suite())
