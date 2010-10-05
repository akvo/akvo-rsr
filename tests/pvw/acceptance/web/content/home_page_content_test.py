#!/usr/bin/env python

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

from helpers.seleniumclient import SeleniumClient
from helpers.testexecution import *

from testcases.webtestcase import DWSWebTestCase
from verifiers.sharepagecontentverifier import SharedPageContentVerifier


class HomePageContentTest(DWSWebTestCase):

    def setUp(self):
        DWSWebTestCase.setUp(self)
        self.content_verifier = SharedPageContentVerifier(self)
        self.open_home_page()

    def test_01_home_page_has_expected_main_menu_links(self):
        """web.content.HomePageContentTest  1. Home page has expected main menu links"""

        self.content_verifier.verify_expected_main_menu_links()

    def test_02_dws_intro_panel_has_expected_content_and_links(self):
        """web.content.HomePageContentTest  2. DWS introduction panel has expected content and links"""

        self.assert_page_contains_text_items(["The Dutch water sector",
                                              "Your worldwide partner for water"])
        self.assert_links_exist_starting_with_text(["Find a partner",
                                                    "Our story"])

    def test_03_news_panel_has_expected_content_and_links(self):
        """web.content.HomePageContentTest  3. News panel has expected content and links"""

        self.assert_page_contains_text_items(["Latest news",
                                              "Recent articles",
                                              "Focus Areas",
                                              "Clean water",
                                              "Governance",
                                              "International cooperation",
                                              "Land & water"])
        self.assert_links_exist_starting_with_text(["RSS",
                                                    "View earlier articles"])

    def test_04_projects_worldwide_panel_has_expected_content_and_links(self):
        """web.content.HomePageContentTest  4. Projects worldwide panel has expected content and links"""

        self.assert_page_contains_text("Projects worldwide")
        self.assert_links_exist_starting_with_text(["See all",
                                                    "View large map"])

    def test_05_focus_areas_panel_has_expected_content_and_links(self):
        """web.content.HomePageContentTest  5. Focus Areas panel has expected content and links"""

        self.assert_page_contains_text_items(["Focus Areas",
                                              "Clean water",
                                              "Governance",
                                              "International cooperation",
                                              "Land & water"])
        self.assert_links_exist_starting_with_text(["See all",
                                                    "Read more",
                                                    "Clean water",
                                                    "Governance",
                                                    "International cooperation",
                                                    "Land & water"])


def suite():
    return load_tests_from(HomePageContentTest)

if __name__ == "__main__":
    run_test_suite(suite())
    SeleniumClient().stop()
