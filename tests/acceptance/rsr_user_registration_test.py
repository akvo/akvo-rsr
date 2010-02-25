#!/usr/bin/env python

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

import nose

from test_settings import *

from rsruseradmintestcase import *

from helpers.navigation import *
from helpers.rsruseradmin import *

class RSRUserRegistrationTest(RSRUserAdminTestCase):

    TEST_USER_NAME = "UserRegistrationTest"

    def test_07_cancel_link_on_set_up_your_account_page_takes_user_back_to_home_page(self):
        """>>  7. Cancel link on Set up your account page takes user back to home page"""
        self.select_organisation_and_open_set_up_your_account_page()
        self.navigator.click_link("Cancel")
        self.verify_home_page_has_loaded()

    def test_08_set_up_your_account_page_warns_if_no_user_details_entered(self):
        """>>  8. Set up your account page warns if no user details are entered"""
        self.select_organisation_and_open_set_up_your_account_page()
        self.navigator.click_submit_button_with_text("Continue")

        try:
            self.assert_title_is(ORGANISATION_NAME)
            self.assert_page_contains_text_items(["Set up your account - Step 2",
                                                  "Error when registering",
                                                  "Please review messages below"])
            self.verify_field_is_required_warning_at_path("//div[@id='maincontainer']/div[1]/div/form/fieldset/ul/li[2]/div")
            self.verify_field_is_required_warning_at_path("//div[@id='maincontainer']/div[1]/div/form/fieldset/ul/li[3]/div[1]")
            self.verify_field_is_required_warning_at_path("//div[@id='maincontainer']/div[1]/div/form/fieldset/ul/li[3]/div[2]")
            self.verify_field_is_required_warning_at_path("//div[@id='maincontainer']/div[1]/div/form/fieldset/ul/li[4]/div[1]")
            self.verify_field_is_required_warning_at_path("//div[@id='maincontainer']/div[1]/div/form/fieldset/ul/li[4]/div[2]")
            self.verify_field_is_required_warning_at_path("//div[@id='maincontainer']/div[1]/div/form/fieldset/ul/li[5]/div[1]")
            self.verify_field_is_required_warning_at_path("//div[@id='maincontainer']/div[1]/div/form/fieldset/ul/li[5]/div[2]")

        except AssertionError, error:
            self.fail("Expected warnings for missing user details: %s" % (error))

    def test_09_set_up_your_account_page_warns_if_passwords_do_not_match(self):
        """>>  9. Set up your account page warns if passwords do not match"""
        self.select_organisation_and_open_set_up_your_account_page()
        self.rsr_user.register_with(self.TEST_USER_NAME, "UserRegistration", "Test", "abc", "xyz",
                                    UAT_EMAIL_ADDRESS, UAT_EMAIL_ADDRESS)
        self.navigator.click_submit_button_with_text("Continue")

        try:
            self.assert_title_is(ORGANISATION_NAME)
            self.assert_page_contains_text_items(["Set up your account - Step 2",
                                                  "Error when registering",
                                                  "Passwords do not match"])
        except AssertionError, error:
            self.fail("Expected warnings for mismatched passwords: %s" % (error))

    def test_10_set_up_your_account_page_warns_if_email_addresses_do_not_match(self):
        """>> 10. Set up your account page warns if email addresses do not match"""
        self.select_organisation_and_open_set_up_your_account_page()
        self.rsr_user.register_with(self.TEST_USER_NAME, "UserRegistration", "Test", "deleteAfterTest", "deleteAfterTest",
                                    UAT_EMAIL_ADDRESS, "nonmatching@address.kom")
        self.navigator.click_submit_button_with_text("Continue")

        try:
            self.assert_title_is(ORGANISATION_NAME)
            self.assert_page_contains_text_items(["Set up your account - Step 2",
                                                  "Error when registering",
                                                  "Email addresses do not match"])
        except AssertionError, error:
            self.fail("Expected warnings for mismatched email addresses: %s" % (error))

    def test_11_can_register_new_user(self):
        """>> 11. Can register a new user"""
        self.select_organisation_and_open_set_up_your_account_page()
        self.rsr_user.register_with(self.TEST_USER_NAME, "UserRegistration", "Test", "deleteAfterTest", "deleteAfterTest",
                                    UAT_EMAIL_ADDRESS, UAT_EMAIL_ADDRESS)
        self.navigator.click_submit_button_with_text("Continue")

        if self.selenium.is_text_present("Traceback"):
            self.fail("Unable to register a new user:\nTraceback details:\n%s" % self.selenium.get_value("traceback_area"))

        self.assert_page_does_not_contain_text("Error when registering")
        self.assert_title_is("Registration complete")
        self.assert_page_contains_text_items(["Thank you", "Please check your email account"])

if __name__ == "__main__":
    print "Running tests on: %s" % (SITE_UNDER_TEST)
    print "RSR user registration test:"
    suite = nose.loader.TestLoader().loadTestsFromTestCase(RSRUserRegistrationTest)
    nose.core.TextTestRunner(verbosity=2).run(suite)
