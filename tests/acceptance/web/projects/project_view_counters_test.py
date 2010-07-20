#!/usr/bin/env python

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

from helpers.elementparsing import *
from helpers.testexecution import *

from testcases.elementparsingtestcase import ElementParsingTestCase
from verifiers.viewcountverifier import ViewCountVerifier


class ProjectViewCountersTest(ElementParsingTestCase):

    def setUp(self):
        self.count_verifier = ViewCountVerifier(self)

    def test_01_home_page_has_view_counters_for_featured_projects(self):
        """web.projects.ProjectViewCountersTest  1. Home page has view counters for featured projects"""

        self.count_verifier.verify_multiple_view_counters_on_page("http://test.akvo.org", 3,
                                                                  "//div[@class='featured_update']/div/div/p[2]",
                                                                  "//div[@class='featured_update']/div/div/span/img/@src")

    def test_02_project_listing_page_has_view_counters_for_featured_projects(self):
        """web.projects.ProjectViewCountersTest  2. Project listing page has view counters for featured projects"""

        self.count_verifier.verify_multiple_view_counters_on_page("http://test.akvo.org/rsr/projects", 3,
                                                                  "//table[@id='project_showcase']/tr/td/div[3]/span",
                                                                  "//table[@id='project_showcase']/tr/td/div[3]/span/span/img/@src")

    def test_03_project_listing_page_has_view_counters_for_each_listed_project(self):
        """web.projects.ProjectViewCountersTest  3. Project listing page has view counters for each listed project"""

        projects_page_root = create_html_element_root_from("http://test.akvo.org/rsr/projects")
        self.count_verifier.set_page_root(projects_page_root)

        # listed projects don't yet have counter images so we use the project URL as the view counter identifier
        self.count_verifier.verify_expected_view_counters(self.number_of_listed_projects_in(projects_page_root),
                                                          "//table[@id='project_table']/tr/td/p",
                                                          "//table[@id='project_table']/tr/td[1]/a[1]/@href")

    def number_of_listed_projects_in(self, projects_page_root):
        # where the project totals text is of the form: Projects 1-10 of 155
        projects_totals_text = text_for_elements_at_xpath(projects_page_root, "//div[@id='page_project_directory']/div[2]/div/span")[0]
        return int(projects_totals_text.split(' ')[1].split('-')[1])

    def test_04_project_page_has_view_counter(self):
        """web.projects.ProjectViewCountersTest  4. Project page has view counter"""

        self.count_verifier.verify_single_view_counter_on_page("http://test.akvo.org/rsr/project/170",
                                                               "//div[@id='outer_leftwing']/div/h1/span",
                                                               "//div[@id='outer_leftwing']/div/h1/span/span/img/@src")

    def test_05_project_updates_page_has_view_counter(self):
        """web.projects.ProjectViewCountersTest  5. Project updates page has view counter"""

        self.count_verifier.verify_single_view_counter_on_page("http://test.akvo.org/rsr/project/170/updates",
                                                               "//div[@id='outer_leftwing']/div/h1/span",
                                                               "//div[@id='outer_leftwing']/div/h1/span/span/img/@src")


def suite():
    return load_tests_from(ProjectViewCountersTest)

if __name__ == "__main__":
    run_test_suite(suite())
