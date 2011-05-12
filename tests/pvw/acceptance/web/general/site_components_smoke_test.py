#!/usr/bin/env python

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

from helpers.seleniumclient import SeleniumClient
from helpers.testexecution import *

from testcases.webtestcase import DWSWebTestCase


class SiteComponentsSmokeTest(DWSWebTestCase):

    def tearDown(self):
        self.assert_page_does_not_contain_text_items(["Traceback", "Error", "error"])

    def test_01_can_load_home_page(self):
        """web.general.SiteComponentsSmokeTest  1. Can load Home page"""

        self.open_home_page()
        self.assert_page_contains_text_items(["Recent articles", "Projects worldwide", "Focus areas"])

    def test_02_can_load_focus_areas_page(self):
        """web.general.SiteComponentsSmokeTest  2. Can load Focus Areas page (Drupal CMS content loads as expected)"""

        self.open_focus_areas_page()
        self.assert_page_contains_text_items(["Focus Areas", "Clean Water", "Governance", "Dutch Water History"])

    def test_03_can_load_projects_page(self):
        """web.general.SiteComponentsSmokeTest  3. Can load Projects page, which redirects to All Projects page (Django + RSR operates as expected)"""

        self.open_projects_page()
        self.assert_page_contains_text_items(["All projects", "Our projects"])

    def test_04_can_load_all_projects_page(self):
        """web.general.SiteComponentsSmokeTest  4. Can load All Projects page (Django + RSR operates as expected)"""

        self.open_all_projects_page()
        self.assert_page_contains_text_items(["All projects", "Our projects"])

    def test_05_can_load_netherlands_page(self):
        """web.general.SiteComponentsSmokeTest  5. Can load Netherlands page (Drupal CMS content loads as expected)"""

        self.open_netherlands_page()
        self.assert_page_contains_text_items(["The Netherlands now", "Dutch Water History"])

    def test_06_can_load_education_page(self):
        """web.general.SiteComponentsSmokeTest  6. Can load Education page (Drupal CMS content loads as expected)"""

        self.open_education_page()
        self.assert_page_contains_text_items(["Education", "Institutions"])

    def test_07_can_load_directory_page(self):
        """web.general.SiteComponentsSmokeTest  7. Can load Directory page (Drupal CMS content loads as expected)"""

        self.open_directory_page()
        self.assert_page_contains_text_items(["Directory of Dutch Water Expertise", "Dutch Water History"])

    def test_08_can_load_news_page(self):
        """web.general.SiteComponentsSmokeTest  8. Can load News page (blog content loads as expected)"""

        self.open_news_page()
        self.assert_page_contains_text_items(["Recent Posts", "Categories", "Archives"])

    def test_09_can_load_about_page(self):
        """web.general.SiteComponentsSmokeTest  9. Can load About page (Drupal CMS content loads as expected)"""

        self.open_about_page()
        self.assert_page_contains_text_items(["About", "Dutch Water sector", "an overview", "Dutch Water History"])


def suite():
    return load_tests_from(SiteComponentsSmokeTest)

if __name__ == "__main__":
    run_test_suite(suite())
    SeleniumClient().stop()
