#!/usr/bin/env python

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

import nose

from test_settings import *

from seleniumclient import SeleniumClient
from users.useradmintestcase import UserAdminTestCase

class UserDetailsEntryTest(UserAdminTestCase):

    TEST_ACCOUNT_NAME = "UserRegistrationTest"

    @classmethod
    def description(cls):
        return "User registration - user details entry tests"

    def test_01_cancel_link_on_user_details_entry_page_takes_user_back_to_home_page(self):
        """>>  1. Cancel link on user details entry page takes user back to home page"""
        self.select_organisation_and_open_user_details_entry_page()
        self.navigator.click_link("Cancel")
        self.verify_home_page_has_loaded()

    def test_02_user_details_entry_page_warns_if_no_user_details_entered(self):
        """>>  2. User details entry page warns if no user details are entered"""
        self.select_organisation_and_open_user_details_entry_page()
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

    def test_03_user_details_entry_page_warns_if_passwords_do_not_match(self):
        """>>  3. User details entry page warns if passwords do not match"""
        self.select_organisation_and_open_user_details_entry_page()
        self.rsr_user.register_with(self.TEST_ACCOUNT_NAME, "UserRegistration", "Test", "abc", "xyz",
                                    UAT_EMAIL_ADDRESS, UAT_EMAIL_ADDRESS)
        self.navigator.click_submit_button_with_text("Continue")

        try:
            self.assert_title_is(ORGANISATION_NAME)
            self.assert_page_contains_text_items(["Set up your account - Step 2",
                                                  "Error when registering",
                                                  "Passwords do not match"])
        except AssertionError, error:
            self.fail("Expected warnings for mismatched passwords: %s" % (error))

    def test_04_user_details_entry_page_warns_if_email_addresses_do_not_match(self):
        """>>  4. User details entry page warns if email addresses do not match"""
        self.select_organisation_and_open_user_details_entry_page()
        self.rsr_user.register_with(self.TEST_ACCOUNT_NAME, "UserRegistration", "Test", "deleteAfterTest", "deleteAfterTest",
                                    UAT_EMAIL_ADDRESS, "nonmatching@address.kom")
        self.navigator.click_submit_button_with_text("Continue")

        try:
            self.assert_title_is(ORGANISATION_NAME)
            self.assert_page_contains_text_items(["Set up your account - Step 2",
                                                  "Error when registering",
                                                  "Email addresses do not match"])
        except AssertionError, error:
            self.fail("Expected warnings for mismatched email addresses: %s" % (error))


def suite():
    return nose.loader.TestLoader().loadTestsFromTestCase(UserDetailsEntryTest)

if __name__ == "__main__":
    nose.core.TextTestRunner(verbosity=2).run(suite())
    SeleniumClient().stop()
