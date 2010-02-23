# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

from test_settings import *

from helpers.navigation import *

class RSRUserAdminTestCase(SeleniumTestCase):

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
