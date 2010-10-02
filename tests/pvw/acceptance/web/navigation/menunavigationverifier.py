# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

from helpers.elementparsing import *

from verifiers.baseelementparsingverifier import BaseElementParsingVerifier


class MenuNavigationVerifier(BaseElementParsingVerifier):

    MAIN_MENU_PATHS_XPATH = "//div[@id='header_container']/a/@href | //div[@id='header_container']/ul/li/a/@href"

    def main_menu_sections(self):
        actual_main_menu_sections = len(values_at_xpath(self.page_root, self.MAIN_MENU_PATHS_XPATH))

        self.test_case.failUnlessEqual(self.expected_exact_value, actual_main_menu_sections,
                                       "\nExpected main menu sections: %i\n  Actual main menu sections: %i" %
                                            (self.expected_exact_value, actual_main_menu_sections))

    def verify_expected_main_menu_paths(self, expected_main_menu_paths):
        main_menu_paths = values_at_xpath(self.page_root, self.MAIN_MENU_PATHS_XPATH)

        for index in range(len(expected_main_menu_paths)):
            expected_path = expected_main_menu_paths[index]
            actual_path = main_menu_paths[index]
            self.test_case.failUnless(actual_path.find(expected_path) > -1,
                                      "\nExpected main menu path at index %i: %s\n  Actual main menu path at index %i: %s" %
                                            (index, expected_path, index, actual_path))
