#!/usr/bin/env python

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

import nose

from test_settings import *

from helpers.navigation import *
from helpers.rsruseradmin import *

from users.rsruseradmintestcase import *

class SignInOrRegisterTest(RSRUserAdminTestCase):

    def setUp(self):
        SeleniumTestCase.setUp(self)
        self.navigator = SeleniumNavigator(self.selenium)
        self.rsr = RSRNavigator(self.selenium)
        self.rsr_user = RSRUser(self.selenium)

    def test_01_home_page_has_sign_in_link(self):
        """>>  1. Home page has Sign in link"""
        self.rsr.open_home_page()
        self.assert_title_is(ORGANISATION_NAME)
        self.assert_link_exists("Sign In")

    def test_02_sign_in_link_loads_sign_in_or_register_page(self):
        """>>  2. Sign in link loads sign-in-or-register page"""
        self.open_sign_in_or_register_page()
        self.assert_page_contains_text_items(["I have an online account",
                                              "Enter username",
                                              "Enter password",
                                              "I forgot my username and/or password",
                                              "I don't have an online account",
                                              "Register and you'll be able to",
                                              "Create updates on your organisation's projects",
                                              "Leave comments on projects",
                                              "Get Started now"])
        self.assert_link_exists("Register")
        self.assert_link_exists("I forgot my username and/or password")

    def test_03_register_link_loads_organisation_selection_page(self):
        """>>  3. Register link loads organisation selection page"""
        self.open_organisation_selection_page_for_user_registration()
        self.assert_page_contains_text_items(["Set up your account - Step 1",
                                            "Select the organisation that you belong to"])
        self.assert_link_exists("Cancel")
        self.assert_submit_button_with_text_exists("Continue")

    def test_04_cancel_link_on_organisation_selection_page_takes_user_back_to_home_page(self):
        """>>  4. Cancel link on organisation selection page takes user back to home page"""
        self.open_organisation_selection_page_for_user_registration()
        self.navigator.click_link("Cancel")
        self.verify_home_page_has_loaded()

if __name__ == "__main__":
    print "Running tests on: %s" % (SITE_UNDER_TEST)
    print "RSR user registration navigation test:"
    suite = nose.loader.TestLoader().loadTestsFromTestCase(SignInOrRegisterTest)
    nose.core.TextTestRunner(verbosity=2).run(suite)
