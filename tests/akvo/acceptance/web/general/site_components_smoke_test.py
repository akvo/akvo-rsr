#!/usr/bin/env python

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

from helpers.seleniumclient import SeleniumClient
from helpers.testexecution import *

from testcases.webtestcase import AkvoWebTestCase


class SiteComponentsSmokeTest(AkvoWebTestCase):

    def tearDown(self):
        self.assert_page_does_not_contain_text_items(["Traceback", "Error", "error"])

    def test_01_can_load_home_page(self):
        """web.general.SiteComponentsSmokeTest  1. Can load Home page"""

        self.open_home_page()
        self.assert_page_contains_text_items(["Most recent project updates", "Project focus areas"])

    def test_02_can_load_projects_page(self):
        """web.general.SiteComponentsSmokeTest  2. Can load Projects page, which redirects to All Projects page (Django + RSR operates as expected)"""

        self.open_projects_page()
        self.verify_basic_content_for_projects_page()

    def test_03_can_load_all_projects_page(self):
        """web.general.SiteComponentsSmokeTest  3. Can load All Projects page (Django + RSR operate as expected)"""

        self.open_all_projects_page()
        self.verify_basic_content_for_projects_page()

    def verify_basic_content_for_projects_page(self):
        self.assert_page_contains_text_items(["All projects", "Name", "Location", "Status", "Funding"])

    def test_04_can_load_focus_areas_page(self):
        """web.general.SiteComponentsSmokeTest  4. Can load Focus Areas page (CMS content loads as expected)"""

        self.open_focus_areas_page()
        self.assert_page_contains_text_items(["Focus areas", "Water and sanitation"])

    def test_05_can_load_partners_page(self):
        """web.general.SiteComponentsSmokeTest  5. Can load Partners page (CMS content loads as expected)"""

        self.open_partners_page()
        self.assert_page_contains_text("Strategic partners")

    def test_06_can_load_akvopedia_page(self):
        """web.general.SiteComponentsSmokeTest  6. Can load Akvopedia page (Wiki operates as expected)"""

        self.open_akvopedia_page()
        self.assert_page_contains_text_items(["Welcome to Akvopedia", "Water portal", "Sanitation portal"])

    def test_07_can_load_about_page(self):
        """web.general.SiteComponentsSmokeTest  7. Can load About page (CMS content loads as expected)"""

        self.open_about_page()
        self.assert_page_contains_text_items(["About us", "How it works"])

    def test_0_can_load_blog_page(self):
        """web.general.SiteComponentsSmokeTest  8. Can load Akvo blog"""

        self.open_blog_page()
        self.assert_page_contains_text_items(["Blog", "Categories", "Archives"])


def suite():
    return load_tests_from(SiteComponentsSmokeTest)

if __name__ == "__main__":
    run_test_suite(suite())
    SeleniumClient().stop()
