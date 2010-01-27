# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

# The SeleniumTestCase extends the standard unittest.TestCase to add some convenience methods
# for common testing actions and RSR-specific actions

from selenium import selenium
from unittest import TestCase

from test_settings import *

class SeleniumTestCase(TestCase):

    @classmethod
    def setup_class(cls):
        try:
            cls.selenium = selenium(SELENIUM_RC_HOST, SELENIUM_RC_PORT, BROWSER_ENVIRONMENT, SITE_UNDER_TEST)
            cls.selenium.start()
        except Exception as exception:
            print ">> Unable to start Selenium RC client: %s" % (exception)
            raise exception

    @classmethod
    def teardown_class(cls):
        try:
            cls.selenium.stop()
        except Exception as exception:
            print ">> Unable to stop Selenium RC client: %s" % (exception)

    def setUp(self):
        self.verification_errors = []

    def tearDown(self):
        self.failUnlessEqual([], self.verification_errors)

    def wait_for_page_to_load(self):
        self.selenium.wait_for_page_to_load(PAGE_LOAD_TIMEOUT)

    def open_page(self, path):
        self.selenium.open(path)
        self.wait_for_page_to_load()

    def open_home_page(self):
        self.open_page("/")

    def open_admin_page(self):
        self.open_page("/rsr/admin/")
        if self.selenium.is_text_present("Password:"):
            self.selenium.type("id_username", RSR_ADMIN_USERNAME)
            self.selenium.type("id_password", RSR_ADMIN_PASSWORD)
            self.click_submit_button_with_text("Log in")

    def open_project_page(self, project_number):
        self.open_page("/rsr/project/%i/" % (project_number))

    def click_element_at_path(self, element_path):
        self.selenium.click(element_path)
        self.wait_for_page_to_load()

    def click_link(self, link_text):
        self.click_element_at_path("link=%s" % (link_text))

    def click_tab(self, tab_element_path):
        self.click_element_at_path(tab_element_path)

    def click_javascript_tab(self, tab_element_path):
        self.selenium.click(tab_element_path) # client side, so no page load wait needed

    def click_button(self, button_name_or_path):
        self.click_element_at_path(button_name_or_path)

    def click_submit_button(self):
        self.click_button("//button[@type='submit']")

    def click_submit_button_with_text(self, button_text):
        self.click_element_at_path("//input[@value=\"%s\"]" % (button_text))

    def assert_location_contains(self, expected_text):
        self.failIf(self.selenium.get_location().find(expected_text) == -1,
                    "Page URL should contain: %s" % (expected_text))

    def assert_title_is(self, expected_title):
        self.failUnlessEqual(expected_title, self.selenium.get_title(),
            "\nExpected page title: %s\n  Actual page title: %s" % (expected_title, self.selenium.get_title()))

    def assert_title_starts_with(self, expected_title_start):
        self.failUnless(self.selenium.get_title().startswith(expected_title_start),
                        "\nExpected page title to start with: %s\n                Actual page title: %s" %
                        (expected_title_start, self.selenium.get_title()))

    def assert_page_contains_text(self, expected_text):
        self.failUnless(self.selenium.is_text_present(expected_text), "Page should contain: %s" % (expected_text))

    def assert_page_does_not_contain_text(self, unexpected_text):
        self.failIf(self.selenium.is_text_present(unexpected_text), "Page should not contain: %s" % (unexpected_text))

    def assert_page_contains_text_items(self, list_of_expected_text_items):
        for expected_text in list_of_expected_text_items:
            self.assert_page_contains_text(expected_text)

    def assert_page_does_not_contain_text_items(self, list_of_unexpected_text_items):
        for unexpected_text in list_of_unexpected_text_items:
            self.assert_page_does_not_contain_text(unexpected_text)

    def verify_text_at_path(self, expected_text, text_xpath):
        actual_text = self.selenium.get_text(text_xpath)
        self.failUnlessEqual(expected_text, actual_text,
            "\nExpected text at %s: %s\nActual text: %s" % (text_xpath, expected_text, actual_text))

    def verify_attribute_value_at_path(self, expected_attribute_value, attribute_xpath):
        actual_attribute_value = self.selenium.get_attribute(attribute_xpath)
        self.failUnlessEqual(expected_attribute_value, actual_attribute_value,
            "\nExpected attribute value at %s: %s\nActual attribute value: %s" %
                (attribute_xpath, expected_attribute_value, actual_attribute_value))

    def verify_element_size_at_path(self, expected_element_width, expected_element_height, element_path):
        actual_element_width = int(self.selenium.get_element_width(element_path))
        actual_element_height = int(self.selenium.get_element_height(element_path))
        self.failUnlessEqual(expected_element_width, actual_element_width,
            "\nExpected element width at %s: %i\nActual element width: %i" %
                (element_path, expected_element_width, actual_element_width))
        self.failUnlessEqual(expected_element_height, actual_element_height,
            "\nExpected element height at %s: %i\nActual element height: %i" %
                (element_path, expected_element_height, actual_element_height))
