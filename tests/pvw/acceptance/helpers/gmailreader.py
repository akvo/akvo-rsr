# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

from test_settings import *

from helpers.navigation import SeleniumNavigator

class GMailReader:

    GMAIL_INBOX_URL = "http://mail.google.com/mail/?ui=html&hl=en-GB" # basic HTML view with UK English

    def __init__(self, selenium_client):
        self.selenium = selenium_client
        self.navigator = SeleniumNavigator(self.selenium)

    def open_inbox(self):
        self.navigator.open_page(self.GMAIL_INBOX_URL)

        if self.field_with_id_exists("Email") and self.field_with_id_exists("Passwd"):
            self.selenium.type("Email", GMAIL_USERNAME)
            self.selenium.type("Passwd", GMAIL_PASSWORD)
            self.navigator.click_button("signIn")
            self.navigator.open_page(self.GMAIL_INBOX_URL)

    def search_inbox_for_text(self, search_text):
        self.selenium.type("q", search_text)
        self.navigator.click_button("nvp_site_mail")

    def field_with_id_exists(self, expected_field_id):
        return self.selenium.is_element_present("//input[@id=\"%s\"]" % (expected_field_id))
