#!/usr/bin/env python

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

from helpers.seleniumclient import SeleniumClient
from helpers.testexecution import *

from web.webtestcase import AkvoWebTestCase


class HomePageTest(AkvoWebTestCase):

    def test_01_home_page_has_expected_sections(self):
        """web.home.HomePageTest  1. Home page has expected sections"""
        self.open_home_page()
        self.assert_page_contains_text_items(["Project updates",
                                            "Staff picks",
                                            "Most recent Akvo Blog article",
                                            "Subscribe via RSS",
                                            "Learn about Akvo",
                                            "Akvo at a glance"])

    def test_02_home_page_menu_has_expected_sections(self):
        """web.home.HomePageTest  2. Home page menu has expected sections"""
        self.open_home_page()
        self.assert_link_exists("Home")
        self.assert_link_exists("Akvopedia")
        self.assert_link_exists("Projects")
        self.assert_link_exists("Partners")
        self.assert_link_exists("Get involved")
        self.assert_link_exists("Blog")
        self.assert_link_exists("About")
        self.assert_link_exists("Register")
        self.assert_link_exists("Sign in")

    def test_03_home_page_footer_has_expected_links(self):
        """web.home.HomePageTest  3. Home page footer has expected links"""

        self.open_home_page()
        self.assert_link_exists("Open License")
        self.assert_link_exists("Terms of use")
        self.assert_link_exists("Privacy policy")
        self.assert_link_exists("Admin")
        self.assert_link_exists("Help & Support")
        self.assert_link_exists("Contact us")


def suite():
    return load_tests_from(HomePageTest)

if __name__ == "__main__":
    run_test_suite(suite())
    SeleniumClient().stop()
