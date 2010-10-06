#!/usr/bin/env python

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

from helpers.seleniumclient import SeleniumClient
from helpers.testexecution import *

from testcases.webtestcase import DWSWebTestCase
from verifiers.sharepagecontentverifier import SharedPageContentVerifier


class EducationPageContentTest(DWSWebTestCase):

    def setUp(self):
        DWSWebTestCase.setUp(self)
        self.content_verifier = SharedPageContentVerifier(self)
        self.open_education_page()

    def test_01_education_page_has_expected_main_menu_links(self):
        """web.content.EducationPageContentTest  1. Education page has expected main menu links"""

        self.content_verifier.verify_expected_main_menu_links()

    def test_02_breadcrumb_bar_has_home_link(self):
        """web.content.EducationPageContentTest  2. Breadcrumb bar has Home link"""

        self.assert_link_exists("Home")

    def test_03_education_panel_has_expected_content_and_links(self):
        """web.content.EducationPageContentTest  3. Education panel has expected content and links"""

        self.assert_page_contains_text_items(["Education",
                                              "Want to learn about",
                                              "Want to know more?"])
        self.assert_link_exists_starting_with_text("schools, institutes and universities in the Netherlands")

    def test_04_institutions_panel_has_expected_content_and_links(self):
        """web.content.EducationPageContentTest  4. Institutions panel has expected content and links"""

        self.assert_page_contains_text("Institutions")
        self.assert_links_exist_starting_with_text(["NHL",
                                                    "Saxion",
                                                    "Van Hall",
                                                    "Wetsus Academy",
                                                    "WUR",
                                                    "HZ",
                                                    "Rotterdam",
                                                    "TUD",
                                                    "UNESCO-IHE"])


def suite():
    return load_tests_from(EducationPageContentTest)

if __name__ == "__main__":
    run_test_suite(suite())
    SeleniumClient().stop()
