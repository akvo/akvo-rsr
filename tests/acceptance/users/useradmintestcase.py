# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

from test_settings import *

from seleniumextensions import SeleniumTestCase

from helpers.gmailreader import GMailReader
from helpers.navigation import RSRNavigator, SeleniumNavigator
from users.rsruser import RSRUser

class UserAdminTestCase(SeleniumTestCase):

    def setUp(self):
        SeleniumTestCase.setUp(self)
        self.navigator = SeleniumNavigator(self.selenium)
        self.rsr = RSRNavigator(self.selenium)
        self.rsr_user = RSRUser(self.selenium)
        self.gmail_reader = GMailReader(self.selenium)

    def open_sign_in_or_register_page(self):
        self.rsr.open_home_page()
        self.assert_title_is(ORGANISATION_NAME)
        self.assert_link_exists("Sign In")
        self.navigator.click_link("Sign In")
        self.assert_title_is(ORGANISATION_NAME)
        self.assert_location_contains("rsr/signin/?next=/")

    def open_organisation_selection_page_for_user_registration(self):
        self.open_sign_in_or_register_page()
        self.assert_link_exists("Register")
        self.navigator.click_link("Register")
        self.assert_title_is(ORGANISATION_NAME)
        self.assert_location_contains("rsr/accounts/register1")

    def select_organisation_and_open_user_details_entry_page(self):
        self.open_organisation_selection_page_for_user_registration()
        self.selenium.select("id_organisation", "label=Administrators")
        self.assert_submit_button_with_text_exists("Continue")
        self.navigator.click_submit_button_with_text("Continue")
        self.assert_title_is(ORGANISATION_NAME)
        self.assert_location_contains("rsr/accounts/register2/?org_id=")

    def verify_home_page_has_loaded(self):
        self.assert_title_is(ORGANISATION_NAME)
        self.assert_page_contains_text_items(["Focus Areas", "Get Solutions", "Education",
                                              "Directory", "News", "About", "Recent contributions"])

    def open_user_admin_page(self):
        try:
            self.rsr.open_user_admin_page()
            self.verify_user_admin_page_has_loaded()
        except Exception, exception:
            self.fail("Unable to open user admin page: %s" % (exception))

    def verify_user_admin_page_has_loaded(self):
        self.assert_title_is("Select user to change | %s RSR admin" % (ORGANISATION_NAME))
        self.assert_page_contains_text_items(["%s RSR admin" % (ORGANISATION_NAME),
                                              "Select user to change"])


    def search_for_user_account(self, username):
        self.selenium.type("searchbar", username)
        self.navigator.click_submit_button_with_text("Search")

    def open_gmail_inbox(self):
        self.gmail_reader.open_inbox()
        self.assert_title_is("Google Mail - Inbox")

    def search_gmail_inbox_for_text(self, search_text):
        self.gmail_reader.search_inbox_for_text(search_text)
        self.assert_title_starts_with("Google Mail - Search results")
