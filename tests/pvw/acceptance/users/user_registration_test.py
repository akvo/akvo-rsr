#!/usr/bin/env python

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

import nose

from test_settings import *

from seleniumclient import SeleniumClient
from users.useradmintestcase import UserAdminTestCase

class UserRegistrationTest(UserAdminTestCase):

    TEST_ACCOUNT_NAME = "UserRegistrationTest"
    ACTIVATION_LINK_PREFIX = "%s/rsr/accounts/activate/" % (SITE_UNDER_TEST)
    ACTIVATION_MESSAGE_SUBJECT = "Activate your RSR account"

    @classmethod
    def description(cls):
        return "User registration tests"

    def test_01_can_register_new_user(self):
        """>>  1. Can register a new user"""
        self.register_new_user_account()

        if self.selenium.is_text_present("Traceback"):
            self.fail("Unable to register a new user:\nTraceback details:\n%s" % self.selenium.get_value("traceback_area"))

        self.assert_page_does_not_contain_text("Error when registering")
        self.assert_title_is("%s - Registration complete" % (ORGANISATION_NAME))
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

    def test_04_can_activate_new_user_account(self):
        """>>  4. Can activate new user account"""
        self.open_activation_email()

        self.assert_link_exists_starting_with_text(self.ACTIVATION_LINK_PREFIX)

        activation_link = self.selenium.get_attribute("//div[@class='msg']/a[2]/@href")

        self.navigator.open_page(activation_link)
        self.assert_page_does_not_contain_text("account activation failed")
        self.assert_page_contains_text_items(["Thank you",
                                              "Your account will be activated as soon as we have reviewed your request"])

        self.delete_activation_email()

    def test_05_can_delete_user_account(self):
        """>>  5. Can delete user account"""
        self.open_user_admin_page()
        self.verify_user_admin_page_has_loaded()
        self.search_for_user_account(self.TEST_ACCOUNT_NAME)

        try:
            self.assert_page_contains_text(self.TEST_ACCOUNT_NAME)
        except AssertionError, error:
            self.fail("Expected '%s' username to exist (added earlier) for testing deletion:\n%s" %
                      (self.TEST_ACCOUNT_NAME, error))

        self.navigator.click_link(self.TEST_ACCOUNT_NAME)
        self.assert_title_starts_with("Change user")
        self.navigator.click_link("Delete")
        self.assert_title_starts_with("Are you sure")
        self.navigator.click_submit_button_with_text("Yes, I'm sure")
        self.verify_user_admin_page_has_loaded()
        self.assert_page_contains_text("The user \"%s\" was deleted successfully" % (self.TEST_ACCOUNT_NAME))
        self.search_for_user_account(self.TEST_ACCOUNT_NAME)

        try:
            self.assert_page_does_not_contain_text(self.TEST_ACCOUNT_NAME)
        except AssertionError, error:
            self.fail("The '%s' username should not appear in user listing after deletion:\n%s" %
                      (self.TEST_ACCOUNT_NAME, error))

    def register_new_user_account(self):
        self.select_organisation_and_open_user_details_entry_page()
        self.rsr_user.register_with(self.TEST_ACCOUNT_NAME, "UserRegistration", "Test", "deleteAfterTest", "deleteAfterTest",
                                    UAT_EMAIL_ADDRESS, UAT_EMAIL_ADDRESS)
        self.navigator.click_submit_button_with_text("Continue")

    def open_activation_email(self):
        self.open_gmail_inbox()
        self.search_gmail_inbox_for_text(self.ACTIVATION_MESSAGE_SUBJECT)
        self.assert_page_contains_text("Inbox %s" % (self.ACTIVATION_MESSAGE_SUBJECT))

        first_unread_message_path = "//span/b"
        first_read_message_path = "//span"

        if self.selenium.is_element_present(first_unread_message_path):
            self.navigator.click_element_at_path(first_unread_message_path)
        elif self.selenium.is_element_present(first_read_message_path):
            self.navigator.click_element_at_path(first_read_message_path)
        else:
            self.fail("Cannot find message element for activation email at [//span/b] or [//span]")

        self.assert_title_is("Google Mail - %s" % (self.ACTIVATION_MESSAGE_SUBJECT))
        self.assert_page_contains_text_items(["Someone, hopefully you, signed up for a new account",
                                              self.ACTIVATION_LINK_PREFIX])

    def delete_activation_email(self):
        self.open_activation_email()
        self.navigator.click_link("Delete")
        self.assert_title_starts_with("Google Mail - Search results")
        self.search_gmail_inbox_for_text(self.ACTIVATION_MESSAGE_SUBJECT)
        self.assert_page_does_not_contain_text("Inbox %s" % (self.ACTIVATION_MESSAGE_SUBJECT))


def suite():
    return nose.loader.TestLoader().loadTestsFromTestCase(UserRegistrationTest)

if __name__ == "__main__":
    nose.core.TextTestRunner(verbosity=2).run(suite())
    SeleniumClient().stop()
