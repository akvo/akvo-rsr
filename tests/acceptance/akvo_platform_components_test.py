#!/usr/bin/env python

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

import nose, sys

from seleniumextensions import SeleniumTestCase
from test_settings import *

from helpers.navigation import *

class AkvoPlatformComponentsTest(SeleniumTestCase):

    def setUp(self):
        SeleniumTestCase.setUp(self)
        self.navigator = SeleniumNavigator(self.selenium)
        self.rsr = RSRNavigator(self.selenium)

    def can_load_section_with_expected_title(self, section, expected_page_title):
        self.rsr.open_home_page()
        self.navigator.click_link(section)
        self.assert_title_starts_with(expected_page_title)
    
    def test_1_can_load_home_page_with_expected_content(self):
        """>> 1. Can load Home page with expected content"""
        self.rsr.open_home_page()
        self.assert_title_is("Akvo.org - See it happen")
        self.assert_page_contains_text_items(["Projects you can fund", "Most recent Akvo Blog article",
                                              "Learn about Akvo", "Akvo at a glance"])
        
    def test_2_can_load_akvopedia_page_with_expected_content(self):
        """>> 2. Can load Akvopedia page with expected content (checks MediaWiki operates as expected)"""
        self.can_load_section_with_expected_title("Akvopedia", "Main Page - Akvopedia")
        self.assert_location_contains("/wiki/")
        self.assert_page_contains_text_items(["Water portal", "Sanitation portal", "Approaches portal",
                                              "Featured content", "Contributing to Akvopedia", "Editorial support"])

    def test_3_can_load_blog_with_expected_content(self):
        """>> 3. Can load Blog with expected content (checks Wordpress operates as expected)"""
        self.can_load_section_with_expected_title("Blog", "Akvo blog")
        self.assert_location_contains("/blog/")
        self.assert_page_contains_text_items(["Categories", "Archives", "Search blog", "Recent Posts"])

    def test_4_can_load_get_involved_page_with_expected_content(self):
        """>> 4. Can load Get involved page with expected content (checks Drupal content is loaded)"""
        self.can_load_section_with_expected_title("Get involved", "How you can help | Akvo.org")
        self.assert_location_contains("/web/")
        self.assert_page_contains_text_items(["Get involved", "Akvo platform", "How you can help"])

    def test_5_can_load_about_page_with_expected_content(self):
        """>> 5. Can load About page with expected content"""
        self.can_load_section_with_expected_title("About", "What we do | Akvo.org")
        self.assert_location_contains("/web/")
        self.assert_page_contains_text_items(["About Akvo", "Get involved", "What we do"])

    def test_6_can_load_projects_page_with_expected_content(self):
        """>> 6. Can load Projects page with expected content (checks Django + RSR operates as expected)"""
        self.can_load_section_with_expected_title("Projects", "Akvo RSR - Project listing")
        self.assert_location_contains("/rsr/projects")
        self.assert_page_contains_text_items(["Featured projects", "Akvo at a glance", "Project listing"])

    # ignored test -- doesn't match Partners page in production
    def in_progress_7_can_load_partners_page_with_expected_content(self):
        """>> 7. Can load Partners page with expected content (checks Drupal content is loaded)"""
        self.can_load_section_with_expected_title("Partners", "Strategic partners | Akvo")
        self.assert_location_contains("/web/")
        self.assert_page_contains_text_items(["Partners", "Strategic partners"])

if __name__ == "__main__":
    print "Running tests on: %s" % (SITE_UNDER_TEST)
    print "Akvo platform components test:"
    suite = nose.loader.TestLoader().loadTestsFromTestCase(AkvoPlatformComponentsTest)
    nose.core.TextTestRunner(verbosity=2).run(suite)
