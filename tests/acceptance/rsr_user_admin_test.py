#!/usr/bin/env python

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

import nose

from seleniumextensions import SeleniumTestCase
from test_settings import *

from helpers.navigation import *

class RSRUserAdminTest(SeleniumTestCase):

    def setUp(self):
        SeleniumTestCase.setUp(self)
        self.navigator = SeleniumNavigator(self.selenium)
        self.rsr = RSRNavigator(self.selenium)

    def test_1_can_register_new_user(self):
        """>> 1. Can register a new user"""
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
        sel.type("id_username", "UATregistrationtest")
        sel.type("id_first_name", "Registration")
        sel.type("id_last_name", "UAT")
        sel.type("id_password1", "deleteAfterTest")
        sel.type("id_password2", "deleteAfterTest")
        sel.type("id_email", "akvo.uat@gmail.com")
        sel.type("id_email2", "akvo.uat@gmail.com")
        self.navigator.click_submit_button()

        if sel.is_text_present("Traceback"):
            self.fail("Unable to register a new user:\nTraceback details:\n%s" % sel.get_value("traceback_area"))

        self.assert_title_is("Registration complete")
        self.assert_page_contains_text_items(["Thank you!", "Please check your email account."])

if __name__ == "__main__":
    print "Running tests on: %s" % (SITE_UNDER_TEST)
    print "RSR user admin test:"
    suite = nose.loader.TestLoader().loadTestsFromTestCase(RSRUserAdminTest)
    nose.core.TextTestRunner(verbosity=2).run(suite)
