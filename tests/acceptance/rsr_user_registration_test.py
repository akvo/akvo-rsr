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

    def test_11_can_register_new_user(self):
        """>> 11. Can register a new user"""
        self.select_organisation_and_open_user_details_entry_page()
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
