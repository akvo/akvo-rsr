# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

from helpers.elementparsing import *

from verifiers.baseelementparsingverifier import BaseElementParsingVerifier


class FooterNavigationVerifier(BaseElementParsingVerifier):

    FOOTER_LINKS_XPATH = "//div[@id='footer']/p/a/@href"

    def footer_links(self):
        actual_number_of_footer_links = len(values_at_xpath(self.page_root, self.FOOTER_LINKS_XPATH))

        self.test_case.failUnlessEqual(self.expected_exact_value, actual_number_of_footer_links,
                                       "\nExpected number of footer links: %i\n  Actual number of footer links: %i" %
                                            (self.expected_exact_value, actual_number_of_footer_links))

    def verify_expected_footer_link_paths(self, list_of_expected_paths):
        footer_link_paths = values_at_xpath(self.page_root, self.FOOTER_LINKS_XPATH)

        for index in range(len(list_of_expected_paths)):
            expected_path = list_of_expected_paths[index]
            actual_path = footer_link_paths[index]
            self.test_case.failUnless(actual_path.find(expected_path) > -1,
                                      "\nExpected footer link path at index %i: %s\n  Actual footer link path at index %i: %s" %
                                            (index, expected_path, index, actual_path))
