#!/usr/bin/env python

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

from helpers.seleniumclient import SeleniumClient
from helpers.testexecution import *

from testcases.webtestcase import DWSWebTestCase
from verifiers.sharedpagecontentverifier import SharedPageContentVerifier


class DirectoryPageContentTest(DWSWebTestCase):

    def setUp(self):
        DWSWebTestCase.setUp(self)
        self.content_verifier = SharedPageContentVerifier(self)
        self.open_directory_page()

    def test_01_directory_page_has_expected_main_menu_links(self):
        """web.content.DirectoryPageContentTest  1. Directory page has expected main menu links"""

        self.content_verifier.verify_expected_main_menu_links()

    def test_02_breadcrumb_bar_has_home_link(self):
        """web.content.DirectoryPageContentTest  2. Breadcrumb bar has Home link"""

        self.assert_link_exists("Home")

    def test_03_directory_panel_has_expected_content_and_links(self):
        """web.content.DirectoryPageContentTest  3. Directory panel has expected content and links"""

        self.assert_page_contains_text_items(["Directory of Dutch Water Expertise",
                                              "NWP",
                                              "Access our database"])
        self.assert_links_exist(["Dutchwatersector.org",
                                 "Netherlands Water Partnership",
                                 "http://www.dutchwatersector.org"])

    def test_04_dutch_water_history_panel_has_expected_content_and_links(self):
        """web.content.DirectoryPageContentTest  4. Dutch water history panel has expected content and links"""

        self.content_verifier.verify_dutch_water_history_panel()

    def test_05_focus_panel_has_expected_content_and_links(self):
        """web.content.DirectoryPageContentTest  5. Focus panel has expected content and links"""

        self.assert_page_contains_text("Focus: Land & Water")
        self.assert_link_exists_starting_with_text("Learn more")


def suite():
    return load_tests_from(DirectoryPageContentTest)

if __name__ == "__main__":
    run_test_suite(suite())
    SeleniumClient().stop()
