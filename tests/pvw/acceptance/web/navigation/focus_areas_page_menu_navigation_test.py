#!/usr/bin/env python

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

from helpers.seleniumclient import SeleniumClient
from helpers.testexecution import *

from web.navigation.menunavigationverifier import MenuNavigationVerifier
from web.webtestcase import DWSWebTestCase


class FocusAreasPageMenuNavigationTest(DWSWebTestCase):

    def setUp(self):
        DWSWebTestCase.setUp(self)
        self.navigation_verifier = MenuNavigationVerifier(self)

    def test_01_focus_areas_page_menu_has_expected_sections(self):
        """web.navigation.FocusAreasPageMenuNavigationTest  1. Focus Areas page menu has expected sections"""

        self.open_starting_page()
        self.navigation_verifier.verify_expected_menu_links()

    def test_02_focus_areas_link_redirects_to_focus_areas_page(self):
        """web.navigation.FocusAreasPageMenuNavigationTest  2. Focus Areas link redirects to Focus Areas page"""

        self.open_starting_page()
        self.navigation_verifier.verify_navigation_to_focus_areas_page()

    def test_03_projects_link_redirects_to_projects_page(self):
        """web.navigation.FocusAreasPageMenuNavigationTest  3. Projects link redirects to Projects page"""

        self.open_starting_page()
        self.navigation_verifier.verify_navigation_to_projects_page()

    def test_04_netherlands_link_redirects_to_netherlands_page(self):
        """web.navigation.FocusAreasPageMenuNavigationTest  4. Netherlands link redirects to Netherlands page"""

        self.open_starting_page()
        self.navigation_verifier.verify_navigation_to_netherlands_page()

    def test_05_education_link_redirects_to_education_page(self):
        """web.navigation.FocusAreasPageMenuNavigationTest  5. Education link redirects to Education page"""

        self.open_starting_page()
        self.navigation_verifier.verify_navigation_to_education_page()

    def test_06_directory_link_redirects_to_directory_page(self):
        """web.navigation.FocusAreasPageMenuNavigationTest  6. Directory link redirects to Directory page"""

        self.open_starting_page()
        self.navigation_verifier.verify_navigation_to_directory_page()

    def test_07_news_link_redirects_to_news_page(self):
        """web.navigation.FocusAreasPageMenuNavigationTest  7. News link redirects to blog home page"""

        self.open_starting_page()
        self.navigation_verifier.verify_navigation_to_news_page()

    def test_08_about_link_redirects_to_about_page(self):
        """web.navigation.FocusAreasPageMenuNavigationTest  8. About link redirects to About page"""

        self.open_starting_page()
        self.navigation_verifier.verify_navigation_to_about_page()

    def open_starting_page(self):
        self.open_focus_areas_page()


def suite():
    return load_tests_from(FocusAreasPageMenuNavigationTest)

if __name__ == "__main__":
    run_test_suite(suite())
    SeleniumClient().stop()
