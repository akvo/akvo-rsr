#!/usr/bin/env python

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

from unittest import TestCase

from helpers.akvopaths import *
from helpers.akvourls import *
from helpers.testexecution import *

from web.navigation.menunavigationverifier import MenuNavigationVerifier


class MenuNavigationTest(TestCase):

    EXPECTED_MENU_LINKS = [home_page(), projects_page(), focus_areas_page(), partners_page(),
                           akvopedia_page(), about_page(), blog_page()]

    EXPECTED_MENU_LINKS_WITH_SIGN_IN = EXPECTED_MENU_LINKS + [register_page(), sign_in_page()]

    def setUp(self):
        self.navigation_verifier = MenuNavigationVerifier(self)

    def test_01_home_page_has_expected_menu_sections(self):
        """web.navigation.MenuNavigationTest  1. Home page has expected menu sections"""
        self.verify_menu_links_with_sign_in_for(home_url())

    def test_02_projects_page_has_expected_menu_sections(self):
        """web.navigation.MenuNavigationTest  2. Projects page has expected menu sections"""
        self.verify_menu_links_with_sign_in_for(projects_url())

    def test_03_focus_areas_page_has_expected_menu_sections(self):
        """web.navigation.MenuNavigationTest  3. Focus Areas page has expected menu sections"""
        self.verify_menu_links_for(focus_areas_url())

    def test_04_partners_page_has_expected_menu_sections(self):
        """web.navigation.MenuNavigationTest  4. Partners page has expected menu sections"""
        self.verify_menu_links_for(partners_url())

    def test_05_akvopedia_page_has_expected_menu_sections(self):
        """web.navigation.MenuNavigationTest  5. Akvopedia page has expected menu sections"""
        self.verify_menu_links_for(akvopedia_url())

    def test_06_about_page_has_expected_menu_sections(self):
        """web.navigation.MenuNavigationTest  6. About page has expected menu sections"""
        self.verify_menu_links_for(about_url())

    def test_07_blog_page_has_expected_menu_sections(self):
        """web.navigation.MenuNavigationTest  7. Blog page has expected menu sections"""
        self.verify_menu_links_for(blog_url())

    def verify_menu_links_with_sign_in_for(self, page_url):
        self.verify_expected_menu_links_for(page_url, 9, self.EXPECTED_MENU_LINKS_WITH_SIGN_IN)

    def verify_menu_links_for(self, page_url):
        self.verify_expected_menu_links_for(page_url, 7, self.EXPECTED_MENU_LINKS)

    def verify_expected_menu_links_for(self, page_url, expected_number_of_links, expected_menu_links):
        self.navigation_verifier.open_page(page_url)
        self.navigation_verifier.expect_exactly(expected_number_of_links).main_menu_sections()
        self.navigation_verifier.verify_expected_main_menu_paths(expected_menu_links)


def suite():
    return load_tests_from(MenuNavigationTest)

if __name__ == "__main__":
    run_test_suite(suite())
