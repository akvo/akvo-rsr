# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

from helpers.elementparsing import *

from verifiers.viewcountrecorder import ViewCountRecorder


class ViewCountVerifier:

    def __init__(self, element_parsing_test_case):
        self.test_case = element_parsing_test_case
        self.view_count_recorder = ViewCountRecorder()

    def open_page(self, page_url):
        self.page_url = page_url
        self.page_root = create_html_element_root_from(page_url)
        self.page_text = elements_to_string(self.page_root)

    def expect_exactly(self, exact_value):
        self.expected_exact_value = exact_value
        return self

    def view_counter_on_page(self):
        self.view_counters_on_page()

    def view_counters_on_page(self):
        self.view_counts_on_page()
        self.view_counter_images_on_page()

    def view_counts_on_page(self):
        self.verify_page_has_expected_occurrences_of_text(" views", "view counts")

    def view_counter_images_on_page(self):
        self.verify_page_has_expected_occurrences_of_text("rsr/counter", "view counter images")

    def verify_page_has_expected_occurrences_of_text(self, expected_text, text_description):
        actual_occurrences_of_text = self.page_text.count(expected_text)
        self.test_case.failUnlessEqual(self.expected_exact_value, actual_occurrences_of_text,
                                       "\nExpected number of %s (when searching for '%s') at %s: %i\nActual number of %s: %i" %
                                            (text_description, expected_text, self.page_url, self.expected_exact_value,
                                             text_description, actual_occurrences_of_text))

    def standard_view_counter_at_xpath(self, view_count_xpath):
        self.standard_view_counters_at_xpath(view_count_xpath)

    def standard_view_counters_at_xpath(self, view_count_xpath):
        self.view_counters_and_counter_identifiers_with_xpaths(view_count_xpath, "%s/span/img/@src" % view_count_xpath)

    def view_counters_and_counter_identifiers_with_xpaths(self, view_count_xpath, counter_identifier_xpath):
        self.verify_expected_view_counters(view_count_xpath, counter_identifier_xpath)

    def verify_expected_view_counters(self, view_count_xpath, counter_identifier_xpath):
        self.verify_expected_view_counts_at_xpath(view_count_xpath)
        self.verify_expected_counter_identifiers_at_xpath(counter_identifier_xpath)
        self.can_read_view_counter_values_at_xpaths(view_count_xpath, counter_identifier_xpath)

    def verify_expected_view_counts_at_xpath(self, view_count_xpath):
        self.verify_elements_at_xpath(view_count_xpath)

    def verify_expected_counter_identifiers_at_xpath(self, counter_identifier_xpath):
        self.verify_elements_at_xpath(counter_identifier_xpath)

    def verify_elements_at_xpath(self, element_xpath):
        self.test_case.assert_element(self.page_root).has_exactly(self.expected_exact_value).elements_matching_xpath(element_xpath)

    def can_read_view_counter_values_at_xpaths(self, view_count_xpath, counter_identifier_xpath):
        # where view count text is of the form 'n views'
        view_count_text_elements = text_values_at_xpath(self.page_root, view_count_xpath)
        self.current_view_counts = map(lambda view_count_element: view_count_element.split(' ')[0], view_count_text_elements)
        self.current_identifiers = values_at_xpath(self.page_root, counter_identifier_xpath)
        self.view_count_recorder.record_view_counts(dict(zip(self.current_identifiers, self.current_view_counts)))

    def verify_counts_have_incremented_as_expected(self):
        self.test_case.failUnless(self.view_count_recorder.at_least_one_view_count_has_increased(),
                                  "View counts should have increased after successive page loads:\n%s" % (self.view_count_recorder))
