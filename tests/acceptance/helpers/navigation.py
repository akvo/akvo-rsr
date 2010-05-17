# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

# The SeleniumNavigator and RSRNavigator facilitate common navigation operations

from test_settings import *

class SeleniumNavigator:

    def __init__(self, selenium_client):
        self.selenium = selenium_client

    def wait_for_page_to_load(self):
        self.selenium.wait_for_page_to_load(PAGE_LOAD_TIMEOUT)

    def open_page(self, path):
        self.selenium.open(path)
        self.wait_for_page_to_load()

    def click_element_at_path(self, element_path):
        self.selenium.click(element_path)
        self.wait_for_page_to_load()

    def click_link(self, link_text):
        self.click_element_at_path("link=%s" % (link_text))

    def click_tab(self, tab_element_path):
        self.click_element_at_path(tab_element_path)

    def click_javascript_tab(self, tab_element_path):
        self.selenium.click(tab_element_path) # client side, so no page load wait needed

    def click_button(self, button_name_or_path):
        self.click_element_at_path(button_name_or_path)

    def click_submit_button(self):
        self.click_button("//button[@type='submit']")

    def click_submit_button_with_text(self, button_text):
        self.click_element_at_path("//input[@value=\"%s\"]" % (button_text))

class RSRNavigator:

    def __init__(self, selenium_client):
        self.selenium = selenium_client
        self.navigator = SeleniumNavigator(self.selenium)

    def open_home_page(self):
        self.navigator.open_page("/")

    def open_admin_page(self, extended_admin_path = ""):
        self.navigator.open_page("/rsr/admin/%s" % (extended_admin_path))
        if self.selenium.is_text_present("Password:"):
            self.selenium.type("id_username", SUPERUSER_USERNAME)
            self.selenium.type("id_password", SUPERUSER_PASSWORD)
            self.navigator.click_submit_button_with_text("Log in")

    def open_auth_admin_page(self):
        self.open_admin_page("auth/")

    def open_user_admin_page(self):
        self.open_admin_page("auth/user/")

    def open_rsr_admin_page(self):
        self.open_admin_page("rsr/")

    def open_project_page(self, project_number):
        self.navigator.open_page("/rsr/project/%i/" % (project_number))
