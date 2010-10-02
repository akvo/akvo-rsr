#!/usr/bin/env python

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

from unittest import TestCase

from helpers.dwspaths import *
from helpers.dwsurls import *
from helpers.testexecution import *

from web.navigation.menunavigationverifier import MenuNavigationVerifier


class MenuNavigationTest(TestCase):

    def setUp(self):
        self.navigation_verifier = MenuNavigationVerifier(self)

    def test_01_home_page_has_expected_menu_sections(self):
        """web.navigation.MenuNavigationTest  1. Home page has expected menu sections"""

        self.verify_expected_menu_sections_for(home_page_url())

    def test_02_focus_areas_page_has_expected_menu_sections(self):
        """web.navigation.MenuNavigationTest  2. Focus Areas page has expected menu sections"""

        self.verify_expected_menu_sections_for(focus_areas_url())

    def test_03_projects_page_has_expected_menu_sections(self):
        """web.navigation.MenuNavigationTest  3. Projects page has expected menu sections"""

        self.verify_expected_menu_sections_for(all_projects_url())

    def test_04_netherlands_page_has_expected_menu_sections(self):
        """web.navigation.MenuNavigationTest  4. Netherlands page has expected menu sections"""

        self.verify_expected_menu_sections_for(netherlands_url())

    def test_05_education_page_has_expected_menu_sections(self):
        """web.navigation.MenuNavigationTest  5. Education page has expected menu sections"""

        self.verify_expected_menu_sections_for(education_url())

    def test_06_directory_page_has_expected_menu_sections(self):
        """web.navigation.MenuNavigationTest  6. Directory page has expected menu sections"""

        self.verify_expected_menu_sections_for(directory_url())

    def test_07_news_page_has_expected_menu_sections(self):
        """web.navigation.MenuNavigationTest  7. News page has expected menu sections"""

        self.verify_expected_menu_sections_for(news_url())

    def test_08_about_page_has_expected_menu_sections(self):
        """web.navigation.MenuNavigationTest  8. About page has expected menu sections"""

        self.verify_expected_menu_sections_for(about_url())

    def verify_expected_menu_sections_for(self, page_url):
        self.navigation_verifier.open_page(page_url)
        self.navigation_verifier.expect_exactly(8).main_menu_sections()
        self.navigation_verifier.verify_expected_main_menu_paths([home_page(), focus_areas_page(), projects_page(),
                                                                  netherlands_page(), education_page(), directory_page(),
                                                                  news_page(), about_page()])


def suite():
    return load_tests_from(MenuNavigationTest)

if __name__ == "__main__":
    run_test_suite(suite())
