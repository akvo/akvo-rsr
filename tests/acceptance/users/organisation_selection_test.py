#!/usr/bin/env python

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

import nose

from test_settings import *

from users.useradmintestcase import UserAdminTestCase

class OrganisationSelectionTest(UserAdminTestCase):

    def test_01_cancel_link_on_organisation_selection_page_takes_user_back_to_home_page(self):
        """>>  1. Cancel link on organisation selection page takes user back to home page"""
        self.open_organisation_selection_page_for_user_registration()
        self.navigator.click_link("Cancel")
        self.verify_home_page_has_loaded()

    def test_02_organisation_selection_page_warns_if_organisation_is_not_selected(self):
        """>>  2. Organisation selection page warns if organisation is not selected"""
        self.open_organisation_selection_page_for_user_registration()
        self.navigator.click_submit_button_with_text("Continue")

        try:
            self.assert_title_is(ORGANISATION_NAME)
            self.assert_page_contains_text_items(["Set up your account - Step 1",
                                                  "Select the organisation that you belong to",
                                                  "This field is required"])
        except AssertionError, error:
            self.fail("Expected warning if organisation was not selected: %s" % (error))

    def test_03_can_select_organisation_and_load_user_details_entry_page(self):
        """>>  3. Can select organisation and load user details entry page"""
        self.select_organisation_and_open_set_up_your_account_page()
        self.assert_page_contains_text_items(["Set up your account - Step 2",
                                              "Enter a username",
                                              "Enter your first and last name",
                                              "Enter a password",
                                              "Enter your email address"])
        self.assert_link_exists("Cancel")
        self.assert_submit_button_with_text_exists("Continue")

if __name__ == "__main__":
    print "Running tests on: %s" % (SITE_UNDER_TEST)
    print "User registration - organisation selection tests:"
    suite = nose.loader.TestLoader().loadTestsFromTestCase(OrganisationSelectionTest)
    nose.core.TextTestRunner(verbosity=2).run(suite)
