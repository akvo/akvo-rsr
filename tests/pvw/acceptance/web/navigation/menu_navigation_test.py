#!/usr/bin/env python

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

from helpers.seleniumclient import SeleniumClient
from helpers.testexecution import *

from web.webtestcase import DWSWebTestCase


class MenuNavigationTest(DWSWebTestCase):

    def test_01_home_page_menu_has_expected_sections(self):
        """web.navigation.MenuNavigationTest  1. Home page menu has expected sections"""

        self.open_home_page()
        self.assert_link_exists("Focus Areas")
        self.assert_link_exists("Projects")
        self.assert_link_exists("Netherlands")
        self.assert_link_exists("Education")
        self.assert_link_exists("Directory")
        self.assert_link_exists("News")
        self.assert_link_exists("About")

    def test_02_focus_areas_link_redirects_to_focus_areas_page(self):
        """web.navigation.MenuNavigationTest  2. Focus Areas link redirects to Focus Areas page"""

        self.open_home_page()
        self.assert_link_exists("Focus Areas")
        self.navigator.click_link("Focus Areas")
        self.assert_location_contains("web/focus-areas")
        self.assert_title_is("Focus Areas | Dutch Water Sector")
        self.assert_page_contains_text_items(["Focus Areas",
                                              "Clean Water",
                                              "International co-operation",
                                              "Governance",
                                              "Land & water"])


def suite():
    return load_tests_from(MenuNavigationTest)

if __name__ == "__main__":
    run_test_suite(suite())
    SeleniumClient().stop()
