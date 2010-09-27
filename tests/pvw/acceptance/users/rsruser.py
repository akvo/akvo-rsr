# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

class RSRUser:

    def __init__(self, selenium_client):
        self.selenium = selenium_client

    def register_with(self, user_name, first_name, last_name, password, password_confirmation, email, email_confirmation):
        sel = self.selenium
        sel.type("id_username", user_name)
        sel.type("id_first_name", first_name)
        sel.type("id_last_name", last_name)
        sel.type("id_password1", password)
        sel.type("id_password2", password_confirmation)
        sel.type("id_email", email)
        sel.type("id_email2", email_confirmation)
