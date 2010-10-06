#!/usr/bin/env python

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

from helpers.seleniumclient import SeleniumClient
from helpers.testexecution import *

from testcases.webtestcase import DWSWebTestCase
from verifiers.sharedpagecontentverifier import SharedPageContentVerifier


class FocusAreasPageContentTest(DWSWebTestCase):

    def setUp(self):
        DWSWebTestCase.setUp(self)
        self.content_verifier = SharedPageContentVerifier(self)
        self.open_focus_areas_page()

    def test_01_focus_areas_page_has_expected_main_menu_links(self):
        """web.content.FocusAreasPageContentTest  1. Focus Areas page has expected main menu links"""

        self.content_verifier.verify_expected_main_menu_links()

    def test_02_breadcrumb_bar_has_home_link(self):
        """web.content.FocusAreasPageContentTest  2. Breadcrumb bar has Home link"""

        self.assert_link_exists("Home")

    def test_03_focus_areas_panel_has_expected_sections_and_all_projects_link(self):
        """web.content.FocusAreasPageContentTest  3. Focus Areas panel has expected sections and all projects link"""

        self.assert_page_contains_text_items(["Focus Areas",
                                              "Clean Water",
                                              "International co-operation",
                                              "Governance",
                                              "Land & water"])
        self.assert_link_exists_starting_with_text("See a list of all projects")

    def test_04_clean_water_section_has_expected_links(self):
        """web.content.FocusAreasPageContentTest  4. Clean Water section has expected links"""

        self.assert_links_exist_starting_with_text(["Learn more about clean water",
                                                    "See clean water projects"])

    def test_05_international_cooperation_section_has_expected_links(self):
        """web.content.FocusAreasPageContentTest  5. International co-operation section has expected links"""

        self.assert_links_exist_starting_with_text(["Learn more about International co-operation",
                                                    "See International co-operation projects"])

    def test_06_governance_section_has_expected_links(self):
        """web.content.FocusAreasPageContentTest  6. Governance section has expected links"""

        self.assert_links_exist_starting_with_text(["Learn more about governance",
                                                    "See governance projects"])

    def test_07_land_and_water_section_has_expected_links(self):
        """web.content.FocusAreasPageContentTest  7. Land & water section has expected links"""

        self.assert_links_exist_starting_with_text(["Learn more about land & water",
                                                    "See land & water projects"])

    def test_08_dutch_water_history_panel_has_expected_content_and_links(self):
        """web.content.FocusAreasPageContentTest  8. Dutch water history panel has expected content and links"""

        self.content_verifier.verify_dutch_water_history_panel()

    def test_09_holland_water_valley_panel_has_expected_content_and_links(self):
        """web.content.FocusAreasPageContentTest  9. Holland water valley panel has expected content and links"""

        self.content_verifier.verify_holland_water_valley_panel()


def suite():
    return load_tests_from(FocusAreasPageContentTest)

if __name__ == "__main__":
    run_test_suite(suite())
    SeleniumClient().stop()
