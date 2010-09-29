# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

class MenuNavigationVerifier:

    def __init__(self, web_test_case):
        self.web_test_case = web_test_case

    def verify_expected_menu_links(self):
        self.web_test_case.assert_link_exists("Focus Areas")
        self.web_test_case.assert_link_exists("Projects")
        self.web_test_case.assert_link_exists("Netherlands")
        self.web_test_case.assert_link_exists("Education")
        self.web_test_case.assert_link_exists("Directory")
        self.web_test_case.assert_link_exists("News")
        self.web_test_case.assert_link_exists("About")

    def verify_navigation_to_focus_areas_page(self):
        self.verify_and_click_link("Focus Areas")
        self.verify_location_and_page_title("web/focus-areas", "Focus Areas | Dutch Water Sector")
        self.web_test_case.assert_page_contains_text_items(["Focus Areas",
                                                            "Clean Water",
                                                            "International co-operation",
                                                            "Governance",
                                                            "Land & water"])

    def verify_navigation_to_projects_page(self):
        self.verify_and_click_link("Projects")
        self.verify_location_and_page_title("rsr/projects/all", "Dutch Water Sector - All projects")
        self.web_test_case.assert_page_contains_text_items(["All projects",
                                                            "Our projects",
                                                            "Country",
                                                            "Continent",
                                                            "Status",
                                                            "Latest update"])

    def verify_navigation_to_netherlands_page(self):
        self.verify_and_click_link("Netherlands")
        self.verify_location_and_page_title("web/netherlands", "The Netherlands now | Dutch Water Sector")
        self.web_test_case.assert_page_contains_text_items(["The Netherlands now",
                                                            "Part of our culture and history",
                                                            "Dutch Water History",
                                                            "Holland Water Valley"])

    def verify_navigation_to_education_page(self):
        self.verify_and_click_link("Education")
        self.verify_location_and_page_title("web/education", "Education | Dutch Water Sector")
        self.web_test_case.assert_page_contains_text_items(["Education",
                                                            "Want to learn",
                                                            "Institutions"])

    def verify_navigation_to_directory_page(self):
        self.verify_and_click_link("Directory")
        self.verify_location_and_page_title("web/directory", "Directory of Dutch Water Expertise | Dutch Water Sector")
        self.web_test_case.assert_page_contains_text_items(["Directory of Dutch Water Expertise",
                                                            "Dutch Water History",
                                                            "Focus: Land & Water"])

    def verify_navigation_to_news_page(self):
        self.verify_and_click_link("News")
        self.verify_location_and_page_title("news", "News | Dutch Water Sector")
        self.web_test_case.assert_page_contains_text_items(["Search for",
                                                            "Recent Posts",
                                                            "Archives"])

    def verify_navigation_to_about_page(self):
        self.verify_and_click_link("About")
        self.verify_location_and_page_title("web/about", "About | Dutch Water Sector")
        self.web_test_case.assert_page_contains_text_items(["About",
                                                            "Dutch Water History",
                                                            "Public sector",
                                                            "Knowledge institutes"])

    def verify_and_click_link(self, expected_link_name):
        self.web_test_case.assert_link_exists(expected_link_name)
        self.web_test_case.navigator.click_link(expected_link_name)

    def verify_location_and_page_title(self, expected_location, expected_title):
        self.web_test_case.assert_location_contains(expected_location)
        self.web_test_case.assert_title_is(expected_title)
