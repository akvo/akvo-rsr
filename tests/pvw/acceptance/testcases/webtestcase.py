# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

from helpers.dwspaths import *
from helpers.navigation import DWSNavigator, SeleniumNavigator

from testcases.seleniumtestcase import SeleniumTestCase


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
        self.verify_location_and_page_title(focus_areas_page(), "Focus Areas | Dutch Water Sector")

    def open_projects_page(self):
        self.site_navigator.open_projects_page()
        self.verify_location_and_page_title(all_projects_page(), "Dutch Water Sector - All projects")

    def open_all_projects_page(self):
        self.site_navigator.open_all_projects_page()
        self.verify_location_and_page_title(all_projects_page(), "Dutch Water Sector - All projects")

    def open_netherlands_page(self):
        self.site_navigator.open_netherlands_page()
        self.verify_location_and_page_title(netherlands_page(), "The Netherlands now | Dutch Water Sector")

    def open_education_page(self):
        self.site_navigator.open_education_page()
        self.verify_location_and_page_title(education_page(), "Education | Dutch Water Sector")

    def open_directory_page(self):
        self.site_navigator.open_directory_page()
        self.verify_location_and_page_title(directory_page(), "Directory of Dutch Water Expertise | Dutch Water Sector")

    def open_news_page(self):
        self.site_navigator.open_news_page()
        self.verify_location_and_page_title(news_page(), "News | Dutch Water Sector")

    def open_about_page(self):
        self.site_navigator.open_about_page()
        self.verify_location_and_page_title(about_page(), "About | Dutch Water Sector")

    def verify_location_and_page_title(self, expected_location, expected_title):
        self.assert_location_contains(expected_location)
        self.assert_title_is(expected_title)
