# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

from helpers.elementparsing import *

from verifiers.viewcountrecorder import ViewCountRecorder


class ViewCountVerifier:

    def __init__(self, element_parsing_test_case):
        self.test_case = element_parsing_test_case
        self.view_count_recorder = ViewCountRecorder()

    def verify_standard_view_counters_on_page(self, page_url, expected_number_of_view_counters, view_count_xpath):
        self.verify_view_counters_on_page(page_url, expected_number_of_view_counters, view_count_xpath, "%s/span/img/@src" % view_count_xpath)

    def verify_view_counters_on_page(self, page_url, expected_number_of_view_counters, view_count_xpath, counter_identifier_xpath):
        self.open_page(page_url)
        self.verify_expected_view_counters(expected_number_of_view_counters, view_count_xpath, counter_identifier_xpath)

    def verify_expected_view_counters(self, expected_number_of_view_counters, view_count_xpath, counter_identifier_xpath):
        self.expect_exactly(expected_number_of_view_counters).view_counts_at_xpath(view_count_xpath)
        self.expect_exactly(expected_number_of_view_counters).counter_identifiers_at_xpath(counter_identifier_xpath)
        self.can_read_view_counts_at(view_count_xpath).with_counter_identifiers_at(counter_identifier_xpath)

    def open_page(self, page_url):
        self.set_page_root(create_html_element_root_from(page_url))

    def set_page_root(self, new_page_root):
        self.page_root = new_page_root

    def expect_exactly(self, exact_value):
        self.expected_exact_value = exact_value
        return self

    def view_counts_at_xpath(self, view_count_xpath):
        self.verify_elements_at_xpath(view_count_xpath)

    def counter_identifiers_at_xpath(self, counter_identifier_xpath):
        self.verify_elements_at_xpath(counter_identifier_xpath)

    def verify_elements_at_xpath(self, element_xpath):
        self.test_case.assert_element(self.page_root).has_exactly(self.expected_exact_value).elements_matching_xpath(element_xpath)

    def can_read_view_counts_at(self, view_count_xpath):
        # where view count text is of the form 'n views'
        view_count_text_elements = text_values_at_xpath(self.page_root, view_count_xpath)
        self.current_view_counts = map(lambda view_count_element: view_count_element.split(' ')[0], view_count_text_elements)
        return self

    def with_counter_identifiers_at(self, counter_identifier_xpath):
        self.current_identifiers = values_at_xpath(self.page_root, counter_identifier_xpath)
        self.view_count_recorder.record_view_counts(dict(zip(self.current_identifiers, self.current_view_counts)))

    def verify_counts_have_incremented_as_expected(self):
        self.test_case.failUnless(self.view_count_recorder.at_least_one_view_count_has_increased(),
                                  "View counts should have increased after successive page loads:\n%s" % (self.view_count_recorder))
