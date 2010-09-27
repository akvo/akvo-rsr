#!/usr/bin/env python

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

from helpers.seleniumclient import SeleniumClient
from helpers.testexecution import *

from web.webtestcase import AkvoWebTestCase


class AkvoPlatformComponentsTest(AkvoWebTestCase):

    def can_load_section_with_expected_title(self, section, expected_page_title):
        self.open_home_page()
        self.navigator.click_link(section)
        self.assert_title_contains(expected_page_title)
    
    def test_1_can_load_home_page_with_expected_content(self):
        """web.home.AkvoPlatformComponentsTest  1. Can load Home page with expected content"""
        self.open_home_page()
        self.assert_page_contains_text_items(["Project updates",
                                              "Staff picks",
                                              "Most recent Akvo Blog article",
                                              "Learn about Akvo",
                                              "Akvo at a glance"])
        
    def test_2_can_load_akvopedia_page_with_expected_content(self):
        """web.home.AkvoPlatformComponentsTest  2. Can load Akvopedia page with expected content (checks MediaWiki operates as expected)"""
        self.can_load_section_with_expected_title("Akvopedia", "Akvopedia")
        self.assert_location_contains("/wiki/")
        self.assert_page_contains_text_items(["Water portal", "Sanitation portal", "Approaches portal",
                                              "Featured content", "Contributing to Akvopedia", "Editorial support"])

    def test_3_can_load_projects_page_with_expected_content(self):
        """web.home.AkvoPlatformComponentsTest  3. Can load Projects page with expected content (checks Django + RSR operates as expected)"""
        self.can_load_section_with_expected_title("Projects", "Akvo RSR - Project listing")
        self.assert_location_contains("/rsr/projects")
        self.assert_page_contains_text_items(["Featured projects", "Akvo at a glance", "Project listing"])

    def test_4_can_load_partners_page_with_expected_content(self):
        """web.home.AkvoPlatformComponentsTest  4. Can load Partners page with expected content (checks Drupal content is loaded)"""
        self.can_load_section_with_expected_title("Partners", "Strategic partners | Akvo")
        self.assert_location_contains("/web/")
        self.assert_page_contains_text_items(["Partners", "Strategic partners"])

    def test_5_can_load_get_involved_page_with_expected_content(self):
        """web.home.AkvoPlatformComponentsTest  5. Can load Get involved page with expected content (checks Drupal content is loaded)"""
        self.can_load_section_with_expected_title("Get involved", "How you can help | Akvo")
        self.assert_location_contains("/web/")
        self.assert_page_contains_text_items(["Get involved", "Akvo platform", "How you can help"])

    def test_6_can_load_blog_with_expected_content(self):
        """web.home.AkvoPlatformComponentsTest  6. Can load Blog with expected content (checks Wordpress operates as expected)"""
        self.can_load_section_with_expected_title("Blog", "Akvo blog")
        self.assert_location_contains("/blog/")
        self.assert_page_contains_text_items(["Categories", "Archives", "Search blog", "Recent Posts"])

    def test_7_can_load_about_page_with_expected_content(self):
        """web.home.AkvoPlatformComponentsTest  7. Can load About page with expected content"""
        self.can_load_section_with_expected_title("About", "What we do | Akvo")
        self.assert_location_contains("/web/")
        self.assert_page_contains_text_items(["About Akvo", "Get involved", "What we do"])


def suite():
    return load_tests_from(AkvoPlatformComponentsTest)

if __name__ == "__main__":
    run_test_suite(suite())
    SeleniumClient().stop()
