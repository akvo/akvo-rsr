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
    def setup_class(cls, browser_config = "*firefoxchrome"):
        try:
            cls.selenium = selenium("localhost", 4444, browser_config, SITE_UNDER_TEST)
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
            self.click_submit_button("Log in")

    def click_link(self, link):
        self.selenium.click("link=%s" % (link))
        self.wait_for_page_to_load()

    def click_submit_button(self, button_text):
        self.selenium.click("//input[@value='%s']" % (button_text))
        self.wait_for_page_to_load()

    def assert_title_is(self, expected_title):
        self.failUnlessEqual(expected_title, self.selenium.get_title(),
            "\nExpected page title: %s\n  Actual page title: %s" % (expected_title, self.selenium.get_title()))

    def assert_title_starts_with(self, expected_title_start):
        self.failUnless(self.selenium.get_title().startswith(expected_title_start),
                        "\nExpected page title to start with: %s\n                Actual page title: %s" %
                        (expected_title_start, self.selenium.get_title()))

    def assert_page_contains_text(self, expected_text):
        self.failUnless(self.selenium.is_text_present(expected_text), "Page should contain: %s" % (expected_text))

    def assert_page_contains_text_items(self, list_of_expected_text_items):
        for expected_text in list_of_expected_text_items:
            self.assert_page_contains_text(expected_text)

    def assert_location_contains(self, expected_text):
        self.failIf(self.selenium.get_location().find(expected_text) == -1,
                    "Page URL should contain: %s" % (expected_text))
