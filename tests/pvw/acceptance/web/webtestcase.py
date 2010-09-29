# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

from extensions.seleniumtestcase import SeleniumTestCase
from helpers.navigation import DWSNavigator, SeleniumNavigator

class DWSWebTestCase(SeleniumTestCase):

    def setUp(self):
        SeleniumTestCase.setUp(self)
        self.navigator = SeleniumNavigator(self.selenium)
        self.site_navigator = DWSNavigator(self.selenium)

    def open_home_page(self):
        self.site_navigator.open_home_page()
        self.assert_title_is("Dutch Water Sector")

    def open_focus_areas_page(self):
        self.site_navigator.open_focus_areas_page()
        self.assert_title_is("Focus Areas | Dutch Water Sector")
