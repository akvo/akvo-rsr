# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

from helpers.akvopaths import *
from helpers.navigation import AkvoSiteNavigator, SeleniumNavigator

from testcases.seleniumtestcase import SeleniumTestCase


class AkvoWebTestCase(SeleniumTestCase):

    def setUp(self):
        SeleniumTestCase.setUp(self)
        self.navigator = SeleniumNavigator(self.selenium)
        self.site_navigator = AkvoSiteNavigator(self.selenium)

    def open_home_page(self):
        self.site_navigator.open_home_page()
        self.assert_title_is("Akvo.org - See it happen")

    def open_projects_page(self):
        self.site_navigator.open_projects_page()
        self.verify_location_and_page_title(all_projects_page(), "Akvo.org - All projects")

    def open_all_projects_page(self):
        self.site_navigator.open_all_projects_page()
        self.verify_location_and_page_title(all_projects_page(), "Akvo.org - All projects")

    def open_focus_areas_page(self):
        self.site_navigator.open_focus_areas_page()
        self.verify_location_and_cms_page_title(focus_areas_page(), "Focus areas")

    def open_partners_page(self):
        self.site_navigator.open_partners_page()
        self.verify_location_and_cms_page_title(partners_page(), "Strategic partners")

    def open_akvopedia_page(self):
        self.site_navigator.open_akvopedia_page()
        self.verify_location_and_page_title(akvopedia_page(), "Akvopedia")

    def open_about_page(self):
        self.site_navigator.open_about_page()
        self.verify_location_and_cms_page_title(about_page(), "How you can help")

    def open_blog_page(self):
        self.site_navigator.open_blog_page()
        self.verify_location_and_page_title(blog_page(), "Akvo blog")

    def verify_location_and_cms_page_title(self, expected_location, expected_title_prefix):
        self.verify_location_and_page_title(expected_location, "%s | Akvo - the open source for water and sanitation" % expected_title_prefix)

    def verify_location_and_page_title(self, expected_location, expected_title):
        self.assert_location_contains(expected_location)
        self.assert_title_is(expected_title)
