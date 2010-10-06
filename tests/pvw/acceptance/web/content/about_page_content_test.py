#!/usr/bin/env python

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

from helpers.seleniumclient import SeleniumClient
from helpers.testexecution import *

from testcases.webtestcase import DWSWebTestCase
from verifiers.sharepagecontentverifier import SharedPageContentVerifier


class AboutPageContentTest(DWSWebTestCase):

    def setUp(self):
        DWSWebTestCase.setUp(self)
        self.content_verifier = SharedPageContentVerifier(self)
        self.open_about_page()

    def test_01_about_page_has_expected_main_menu_links(self):
        """web.content.AboutPageContentTest  1. About page has expected main menu links"""

        self.content_verifier.verify_expected_main_menu_links()

    def test_02_breadcrumb_bar_has_home_link(self):
        """web.content.AboutPageContentTest  2. Breadcrumb bar has Home link"""

        self.assert_link_exists("Home")

    def test_03_about_panel_has_expected_content_and_links(self):
        """web.content.AboutPageContentTest  3. About panel has expected content and links"""

        self.assert_page_contains_text_items(["About",
                                              "Dutch Water sector",
                                              "an overview",
                                              "Learn more about"])
        self.assert_links_exist(["The public sector",
                                 "Knowledge institutes - research and academia",
                                 "Non-governmental organisations (NGOs)",
                                 "Private companies"])

    def test_04_about_listing_panel_has_expected_links(self):
        """web.content.AboutPageContentTest  4. About listing panel has expected links"""

        self.assert_links_exist_starting_with_text(["Dutch Water sector",
                                                    "Public sector",
                                                    "Knowledge institutes",
                                                    "NGOs",
                                                    "Private companies",
                                                    "Contact us"])

    def test_05_dutch_water_history_panel_has_expected_content_and_links(self):
        """web.content.AboutPageContentTest  5. Dutch water history panel has expected content and links"""

        self.content_verifier.verify_dutch_water_history_panel()


def suite():
    return load_tests_from(AboutPageContentTest)

if __name__ == "__main__":
    run_test_suite(suite())
    SeleniumClient().stop()
