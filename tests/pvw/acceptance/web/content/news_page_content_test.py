#!/usr/bin/env python

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

from helpers.seleniumclient import SeleniumClient
from helpers.testexecution import *

from testcases.webtestcase import DWSWebTestCase
from verifiers.sharepagecontentverifier import SharedPageContentVerifier


class NewsPageContentTest(DWSWebTestCase):

    def setUp(self):
        DWSWebTestCase.setUp(self)
        self.content_verifier = SharedPageContentVerifier(self)
        self.open_news_page()

    def test_01_news_page_has_expected_main_menu_links(self):
        """web.content.NewsPageContentTest  1. News page has expected main menu links"""

        self.content_verifier.verify_expected_main_menu_links()

    def test_02_breadcrumb_bar_has_home_link(self):
        """web.content.NewsPageContentTest  2. Breadcrumb bar has Home link"""

        self.assert_link_exists("Home")

    def test_03_news_page_has_expected_sections_and_links(self):
        """web.content.NewsPageContentTest  3. News page has expected sections and links"""

        self.assert_page_contains_text_items(["Search for",
                                              "Recent Posts",
                                              "Participate",
                                              "Categories",
                                              "Tags",
                                              "Blogroll",
                                              "Archives"])
        self.assert_links_exist(["Register",
                                 "Log in",
                                 "Entries RSS",
                                 "Comments RSS",
                                 "WordPress.org",
                                 "Netherlands Water Partnership blog"])


def suite():
    return load_tests_from(NewsPageContentTest)

if __name__ == "__main__":
    run_test_suite(suite())
    SeleniumClient().stop()
