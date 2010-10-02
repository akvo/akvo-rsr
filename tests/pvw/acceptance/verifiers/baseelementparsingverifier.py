# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

from helpers.elementparsing import *


class BaseElementParsingVerifier:

    def __init__(self, element_parsing_test_case):
        self.test_case = element_parsing_test_case

    def open_page(self, page_url):
        self.page_url = page_url
        self.page_root = create_html_element_root_from(page_url)
        self.page_text = elements_to_string(self.page_root)

    def expect_exactly(self, exact_value):
        self.expected_exact_value = exact_value
        return self
