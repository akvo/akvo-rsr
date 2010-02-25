#!/usr/bin/env python

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

import nose

from test_settings import *

from users.useradmintestcase import UserAdminTestCase

class UserRegistrationTest(UserAdminTestCase):

    TEST_USER_NAME = "UserRegistrationTest"

    def test_01_can_register_new_user(self):
        """>>  1. Can register a new user"""
        self.register_new_user_account()

        if self.selenium.is_text_present("Traceback"):
            self.fail("Unable to register a new user:\nTraceback details:\n%s" % self.selenium.get_value("traceback_area"))

        self.assert_page_does_not_contain_text("Error when registering")
        self.assert_title_is("Registration complete")
        self.assert_page_contains_text_items(["Thank you", "Please check your email account"])

    def test_02_user_details_entry_page_warns_if_username_is_already_in_use(self):
        """>>  2. User details entry page warns if username is already in use"""
        self.register_new_user_account()

        try:
            self.assert_title_is(ORGANISATION_NAME)
            self.assert_page_contains_text_items(["Set up your account - Step 2",
                                                  "Error when registering",
                                                  "A user with that username already exists"])
        except AssertionError, error:
            self.fail("Expected warnings when username already in use: %s" % (error))

    def test_03_user_details_entry_page_warns_if_email_address_is_already_in_use(self):
        """>>  3. User details entry page warns if email address is already in use"""
        self.register_new_user_account()

        try:
            self.assert_title_is(ORGANISATION_NAME)
            self.assert_page_contains_text_items(["Set up your account - Step 2",
                                                  "Error when registering",
                                                  "This email address is already in use",
                                                  "Please supply a different email address"])
        except AssertionError, error:
            self.fail("Expected warnings when email address already in use: %s" % (error))

    def register_new_user_account(self):
        self.select_organisation_and_open_user_details_entry_page()
        self.rsr_user.register_with(self.TEST_USER_NAME, "UserRegistration", "Test", "deleteAfterTest", "deleteAfterTest",
                                    UAT_EMAIL_ADDRESS, UAT_EMAIL_ADDRESS)
        self.navigator.click_submit_button_with_text("Continue")

if __name__ == "__main__":
    print "Running tests on: %s" % (SITE_UNDER_TEST)
    print "User registration test:"
    suite = nose.loader.TestLoader().loadTestsFromTestCase(UserRegistrationTest)
    nose.core.TextTestRunner(verbosity=2).run(suite)
