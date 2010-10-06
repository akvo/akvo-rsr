#!/usr/bin/env python

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

from helpers.seleniumclient import SeleniumClient
from helpers.testexecution import *

from testcases.webtestcase import DWSWebTestCase
from verifiers.sharedpagecontentverifier import SharedPageContentVerifier


class ProjectsPageContentTest(DWSWebTestCase):

    def setUp(self):
        DWSWebTestCase.setUp(self)
        self.content_verifier = SharedPageContentVerifier(self)
        self.open_projects_page()

    def test_01_projects_page_has_expected_main_menu_links(self):
        """web.content.ProjectsPageContentTest  1. Projects page has expected main menu links"""

        self.content_verifier.verify_expected_main_menu_links()

    def test_02_breadcrumb_bar_has_home_link(self):
        """web.content.ProjectsPageContentTest  2. Breadcrumb bar has Home link"""

        self.assert_link_exists("Home")

    def test_03_all_projects_panel_has_expected_content_and_links(self):
        """web.content.ProjectsPageContentTest  3. All projects panel has expected content and links"""

        self.assert_page_contains_text_items(["All projects",
                                              "Our projects",
                                              "results)"])
        self.assert_links_exist_starting_with_text(["list of all project participants",
                                                    "Name",
                                                    "Country",
                                                    "Continent",
                                                    "Status",
                                                    "Latest update"])


def suite():
    return load_tests_from(ProjectsPageContentTest)

if __name__ == "__main__":
    run_test_suite(suite())
    SeleniumClient().stop()
