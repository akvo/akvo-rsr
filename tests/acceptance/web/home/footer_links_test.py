#!/usr/bin/env python

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

from helpers.seleniumclient import SeleniumClient
from helpers.testexecution import *

from web.webtestcase import AkvoWebTestCase

class FooterLinksTest(AkvoWebTestCase):

    def test_01_home_page_footer_has_expected_links(self):
        """web.home.FooterLinksTest  1. Home page footer has open license, terms of use, privacy policy, admin and help links"""

        self.open_home_page()
        self.assert_link_exists("Open License")
        self.assert_link_exists("Terms of use")
        self.assert_link_exists("Privacy policy")
        self.assert_link_exists("Admin")
        self.assert_link_exists("Help & Support")

    def test_02_open_license_link_redirects_to_licensing_page(self):
        """web.home.FooterLinksTest  2. Open License link redirects to licensing page"""

        self.open_home_page()
        self.assert_link_exists("Open License")
        self.navigator.click_link("Open License")
        self.assert_location_contains("web/open_license")
        self.assert_title_starts_with("Akvo licensing and copyrights")
        self.assert_page_contains_text_items(["Akvo licensing and copyrights",
                                              "Akvo Foundation software",
                                              "Akvo Contributor Agreement"])

    def test_03_terms_of_use_link_redirects_to_terms_of_use_page(self):
        """web.home.FooterLinksTest  3. Terms of use link redirects to Terms of use page"""

        self.open_home_page()
        self.assert_link_exists("Terms of use")
        self.navigator.click_link("Terms of use")
        self.assert_location_contains("web/terms_of_use")
        self.assert_title_starts_with("Terms of use")
        self.assert_page_contains_text("use of and services provided by this website")

    def test_04_privacy_link_redirects_to_privacy_policy_page(self):
        """web.home.FooterLinksTest  4. Privacy policy link redirects to privacy policy page"""

        self.open_home_page()
        self.assert_link_exists("Privacy policy")
        self.navigator.click_link("Privacy policy")
        self.assert_location_contains("web/privacy_policy")
        self.assert_title_starts_with("Privacy policy")
        self.assert_page_contains_text_items(["Privacy policy",
                                              "handling of your personal information is governed by"])

    def test_05_admin_link_redirects_to_rsr_admin_login_page(self):
        """web.home.FooterLinksTest  5. Admin link redirects to RSR Admin login page"""

        self.open_home_page()
        self.assert_link_exists("Admin")
        self.navigator.click_link("Admin")
        self.assert_location_contains("rsr/admin")
        self.assert_title_is("Log in | Akvo RSR site admin")
        self.assert_page_contains_text("Akvo RSR administration")

    def test_06_help_link_redirects_to_tender(self):
        """web.home.FooterLinksTest  6. Help & Support link redirects to Akvo support site on Tender"""

        self.open_home_page()
        self.assert_link_exists("Help & Support")
        self.navigator.click_link("Help & Support")
        self.assert_location_contains("help.akvo.org")
        self.assert_title_is("Welcome - Akvo Support")
        self.assert_page_contains_text("Akvo Support")


def suite():
    return load_tests_from(FooterLinksTest)

if __name__ == "__main__":
    run_test_suite(suite())
    SeleniumClient().stop()
