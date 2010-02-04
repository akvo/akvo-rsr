#!/usr/bin/env python

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

import nose

from seleniumextensions import SeleniumTestCase
from test_settings import *

from helpers.navigation import *

class RSRUserRegistrationTest(SeleniumTestCase):

    def setUp(self):
        SeleniumTestCase.setUp(self)
        self.navigator = SeleniumNavigator(self.selenium)
        self.rsr = RSRNavigator(self.selenium)

    def test_01_home_page_has_register_link(self):
        """>> 1. Home page has Register link"""
        self.rsr.open_home_page()
        self.assert_title_is("Akvo.org - See it happen")
        self.assert_link_exists("Register")

    def test_02_register_link_loads_organisation_selection_page(self):
        """>> 2. Register link loads organisation selection page"""
        self.open_home_page_and_start_user_registration()
        self.assert_page_contains_text_items(["Set up your account",
                                              "Step 1 of 2",
                                              "Select the organisation that you belong to"])

    def test_03_register_page_warns_if_organisation_is_not_selected(self):
        """>> 3. Register page warns if organisation is not selected"""
        self.open_home_page_and_start_user_registration()
        self.navigator.click_submit_button() # Continue button

        try:
            self.assert_title_is("Register with Akvo RSR - Step 1")
            self.assert_page_contains_text_items(["Set up your account",
                                                  "Step 1 of 2",
                                                  "Select the organisation that you belong to",
                                                  "A problem occurred",
                                                  "This field is required"])
        except AssertionError as error:
            self.fail("Expected warning if organisation was not selected: %s" % (error))

    def test_04_can_select_organisation_and_load_user_details_entry_page(self):
        """>> 4. Can select organisation and load user details entry page"""
        self.select_organisation_and_open_user_details_entry_page()
        self.assert_page_contains_text_items(["Set up your account",
                                              "Step 2 of 2",
                                              "Enter a username",
                                              "Enter your first and last name",
                                              "Enter a password",
                                              "Enter your email address"])

    def open_home_page_and_start_user_registration(self):
        self.rsr.open_home_page()
        self.assert_title_is("Akvo.org - See it happen")
        self.assert_link_exists("Register")
        self.navigator.click_link("Register")
        self.assert_title_is("Register with Akvo RSR - Step 1")
        self.assert_location_contains("rsr/accounts/register1")

    def select_organisation_and_open_user_details_entry_page(self):
        self.open_home_page_and_start_user_registration()
        self.selenium.select("id_organisation", "label=Akvo")
        self.navigator.click_submit_button() # Continue button
        self.assert_title_is("Register with Akvo RSR - Step 2")
        self.assert_location_contains("rsr/accounts/register2")

if __name__ == "__main__":
    print "Running tests on: %s" % (SITE_UNDER_TEST)
    print "RSR user registration test:"
    suite = nose.loader.TestLoader().loadTestsFromTestCase(RSRUserRegistrationTest)
    nose.core.TextTestRunner(verbosity=2).run(suite)
