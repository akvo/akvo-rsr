#!/usr/bin/env python

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

from helpers.seleniumclient import SeleniumClient
from helpers.testexecution import *

from testcases.webtestcase import DWSWebTestCase
from verifiers.sharepagecontentverifier import SharedPageContentVerifier


class NetherlandsPageContentTest(DWSWebTestCase):

    def setUp(self):
        DWSWebTestCase.setUp(self)
        self.content_verifier = SharedPageContentVerifier(self)
        self.open_netherlands_page()

    def test_01_netherlands_page_has_expected_main_menu_links(self):
        """web.content.NetherlandsPageContentTest  1. Netherlands page has expected main menu links"""

        self.content_verifier.verify_expected_main_menu_links()

    def test_02_breadcrumb_bar_has_home_link(self):
        """web.content.NetherlandsPageContentTest  2. Breadcrumb bar has Home link"""

        self.assert_link_exists("Home")

    def test_03_netherlands_now_panel_has_expected_content(self):
        """web.content.NetherlandsPageContentTest  3. The Netherlands now panel has expected content"""

        self.assert_page_contains_text_items(["The Netherlands now",
                                              "Part of our culture and history",
                                              "Going Dutch, water style"])

    def test_04_dutch_water_history_panel_has_expected_content_and_links(self):
        """web.content.NetherlandsPageContentTest  4. Dutch water history panel has expected content and links"""

        self.content_verifier.verify_dutch_water_history_panel()

    def test_05_holland_water_valley_panel_has_expected_content_and_links(self):
        """web.content.NetherlandsPageContentTest  5. Holland water valley panel has expected content and links"""

        self.content_verifier.verify_holland_water_valley_panel()


def suite():
    return load_tests_from(NetherlandsPageContentTest)

if __name__ == "__main__":
    run_test_suite(suite())
    SeleniumClient().stop()
