#!/usr/bin/env python

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

from unittest import TestCase

from helpers.dwspaths import *
from helpers.dwsurls import *
from helpers.testexecution import *

from web.navigation.footernavigationverifier import FooterNavigationVerifier


class FooterNavigationTest(TestCase):

    EXPECTED_HOME_PAGE_FOOTER_LINK_PATHS = [open_license_page(), terms_of_use_page(), privacy_policy_page(), credits_page(),
                                            contact_us_page(), akvo_home_page()]

    EXPECTED_CMS_PAGE_FOOTER_LINK_PATHS = [open_license_page(), terms_of_use_page(), privacy_policy_page(), credits_page(),
                                           admin_page(), contact_us_page()]

    EXPECTED_PROJECTS_PAGE_FOOTER_LINK_PATHS = [open_license_page(), terms_of_use_page(), privacy_policy_page(), credits_page(),
                                                admin_page(), register_page(), sign_in_page(), contact_us_page()]

    def setUp(self):
        self.navigation_verifier = FooterNavigationVerifier(self)

    def test_01_home_page_has_expected_footer_links(self):
        """web.navigation.FooterNavigationTest  1. Home page has expected footer links"""

        self.verify_expected_footer_links(home_page_url(), 6, self.EXPECTED_HOME_PAGE_FOOTER_LINK_PATHS)

    def test_02_focus_areas_page_has_expected_footer_links(self):
        """web.navigation.FooterNavigationTest  2. Focus Areas page has expected footer links"""

        self.verify_expected_cms_page_footer_links(focus_areas_url())

    def test_03_projects_page_has_expected_footer_links(self):
        """web.navigation.FooterNavigationTest  3. Projects page has expected footer links"""

        self.verify_expected_footer_links(projects_url(), 8, self.EXPECTED_PROJECTS_PAGE_FOOTER_LINK_PATHS)

    def test_04_netherlands_page_has_expected_footer_links(self):
        """web.navigation.FooterNavigationTest  4. Netherlands page has expected footer links"""

        self.verify_expected_cms_page_footer_links(netherlands_url())

    def test_05_education_page_has_expected_footer_links(self):
        """web.navigation.FooterNavigationTest  5. Education page has expected footer links"""

        self.verify_expected_cms_page_footer_links(education_url())

    def test_06_directory_page_has_expected_footer_links(self):
        """web.navigation.FooterNavigationTest  6. Directory page has expected footer links"""

        self.verify_expected_cms_page_footer_links(directory_url())

    def test_07_news_page_has_expected_footer_links(self):
        """web.navigation.FooterNavigationTest  7. News page has expected footer links"""

        self.verify_expected_cms_page_footer_links(news_url())

    def test_08_about_page_has_expected_footer_links(self):
        """web.navigation.FooterNavigationTest  8. About page has expected footer links"""

        self.verify_expected_cms_page_footer_links(about_url())

    def verify_expected_cms_page_footer_links(self, page_url):
        self.verify_expected_footer_links(page_url, 6, self.EXPECTED_CMS_PAGE_FOOTER_LINK_PATHS)

    def verify_expected_footer_links(self, page_url, expected_number_of_links, expected_paths):
        self.navigation_verifier.open_page(page_url)
        self.navigation_verifier.expect_exactly(expected_number_of_links).footer_links()
        self.navigation_verifier.verify_expected_footer_link_paths(expected_paths)


def suite():
    return load_tests_from(FooterNavigationTest)

if __name__ == "__main__":
    run_test_suite(suite())
