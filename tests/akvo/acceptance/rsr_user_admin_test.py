#!/usr/bin/env python

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

import nose

from seleniumextensions import SeleniumTestCase
from test_settings import *

from helpers.navigation import *

class RSRUserAdminTest(SeleniumTestCase):

    UAT_USER_NAME = "UserRegistrationTest"

    def setUp(self):
        SeleniumTestCase.setUp(self)
        self.navigator = SeleniumNavigator(self.selenium)
        self.rsr = RSRNavigator(self.selenium)

    def test_1_auth_admin_has_expected_sections(self):
        """>> 1. Auth admin has expected sections"""
        self.rsr.open_auth_admin_page()
        self.assert_title_starts_with("Auth administration")
        self.assert_page_contains_text_items(["Groups", "Permissions", "Users"])

    def test_2_can_register_new_user(self):
        """>> 2. Can register a new user"""
        self.rsr.open_home_page()
        self.assert_title_is("Akvo.org - See it happen")
        if self.selenium.is_text_present("Signed in as"):
            self.navigator.click_button("//div[@id='header_button']/a/span") # Sign out button
            self.assert_title_is("Akvo.org - See it happen")

        sel = self.selenium
        self.navigator.click_link("Register")
        self.assert_title_is("Register with Akvo RSR - Step 1")
        sel.select("id_organisation", "label=Akvo")
        self.navigator.click_submit_button()
        self.assert_title_is("Register with Akvo RSR - Step 2")
        sel.type("id_username", self.UAT_USER_NAME)
        sel.type("id_first_name", "UserRegistration")
        sel.type("id_last_name", "Test")
        sel.type("id_password1", "deleteAfterTest")
        sel.type("id_password2", "deleteAfterTest")
        sel.type("id_email", "akvo.uat@gmail.com")
        sel.type("id_email2", "akvo.uat@gmail.com")
        self.navigator.click_submit_button()

        if sel.is_text_present("Traceback"):
            self.fail("Unable to register a new user:\nTraceback details:\n%s" % sel.get_value("traceback_area"))

        self.assert_title_is("Registration complete")
        self.assert_page_contains_text_items(["Thank you!", "Please check your email account."])

    def test_3_can_delete_user_account(self):
        """>> 3. Can delete user account"""
        self.open_user_admin_page()
        self.search_for_uat_user_account()

        try:
            self.assert_page_contains_text(self.UAT_USER_NAME)
        except AssertionError, error:
            self.fail("Expected '%s' user name to exist (added earlier) for testing deletion:\n%s" %
                      (self.UAT_USER_NAME, error))

        self.navigator.click_link(self.UAT_USER_NAME)
        self.assert_title_starts_with("Change user")
        self.navigator.click_link("Delete")
        self.assert_title_starts_with("Are you sure")
        self.navigator.click_submit_button_with_text("Yes, I'm sure")
        self.verify_user_admin_page_has_loaded()
        self.assert_page_contains_text("The user \"%s\" was deleted successfully" % (self.UAT_USER_NAME))
        self.search_for_uat_user_account()

        try:
            self.assert_page_does_not_contain_text(self.UAT_USER_NAME)
        except AssertionError, error:
            self.fail("The '%s' user name should not appear in user listing after deletion:\n%s" %
                      (self.UAT_USER_NAME, error))

    def search_for_uat_user_account(self):
        self.selenium.type("searchbar", self.UAT_USER_NAME)
        self.navigator.click_submit_button_with_text("Search")

    def open_user_admin_page(self):
        try:
            self.rsr.open_auth_admin_page()
            self.navigator.click_link("Users")
            self.verify_user_admin_page_has_loaded()
        except Exception, exception:
            self.fail("Unable to open user admin page: %s" % (exception))

    def verify_user_admin_page_has_loaded(self):
        self.assert_title_starts_with("Select user to change")
        self.assert_page_contains_text("Select user to change")

if __name__ == "__main__":
    print "Running tests on: %s" % (SITE_UNDER_TEST)
    print "RSR user admin test:"
    suite = nose.loader.TestLoader().loadTestsFromTestCase(RSRUserAdminTest)
    nose.core.TextTestRunner(verbosity=2).run(suite)
