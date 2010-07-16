#!/usr/bin/env python

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

import time

from helpers.elementparsing import *
from helpers.testexecution import *

from testcases.elementparsingtestcase import ElementParsingTestCase
from web.projects.viewcountverifier import ViewCountVerifier


class ProjectViewCountersTest(ElementParsingTestCase):

    def test_01_home_page_has_view_counters_for_featured_projects(self):
        """web.projects.ProjectViewCountersTest  1. Home page has view counters for featured projects"""

        count_verifier = ViewCountVerifier(self)
        view_count_xpath = "//div[@class='featured_update']/div/div/p[2]"
        project_identifier_xpath = "//a[@class='staffpicks_update_title']/@href"

        count_verifier.open_page("http://test.akvo.org")
        count_verifier.expect_exactly(3).view_counts_at_xpath(view_count_xpath)
        count_verifier.expect_exactly(3).project_identifiers_at_xpath(project_identifier_xpath)
        count_verifier.can_read_view_counts_at(view_count_xpath).with_project_identifiers_at(project_identifier_xpath)

    def test_02_project_listing_page_has_view_counters_for_featured_projects(self):
        """web.projects.ProjectViewCountersTest  2. Project listing page has view counters for featured projects"""

        self.fail("View counters for featured projects not found")

    def test_03_project_listing_page_has_view_counters_for_each_listed_project(self):
        """web.projects.ProjectViewCountersTest  3. Project listing page has view counters for each listed project"""

        projects_page_root = create_html_element_root_from("http://test.akvo.org/rsr/projects")
        count_verifier = ViewCountVerifier(self)
        view_count_xpath = "//table[@id='project_table']/tr/td/p"
        project_identifier_xpath = "//table[@id='project_table']/tr/td[1]/a[1]/@href"
        number_of_listed_projects = self.read_number_of_listed_projects(projects_page_root)

        count_verifier.set_page_root(projects_page_root)
        count_verifier.expect_exactly(number_of_listed_projects).view_counts_at_xpath(view_count_xpath)
        count_verifier.expect_exactly(number_of_listed_projects).project_identifiers_at_xpath(project_identifier_xpath)
        count_verifier.can_read_view_counts_at(view_count_xpath).with_project_identifiers_at(project_identifier_xpath)

    def read_number_of_listed_projects(self, projects_page_root):
        # where the project totals text is of the form: Projects 1-10 of 155
        projects_totals_text = text_for_elements_at_xpath(projects_page_root, "//div[@id='page_project_directory']/div[2]/div/span")[0]
        return int(projects_totals_text.split(' ')[1].split('-')[1])

    def test_04_project_page_has_view_counter(self):
        """web.projects.ProjectViewCountersTest  4. Project page has view counter"""

        count_verifier = ViewCountVerifier(self)
        view_count_xpath = "//div[@id='outer_leftwing']/div/h1/span"
        project_identifier_xpath = "//div[@id='tab_description']/p[3]/a/@href"

        count_verifier.open_page("http://test.akvo.org/rsr/project/170")
        count_verifier.expect_exactly(1).view_count_at_xpath(view_count_xpath)
        count_verifier.expect_exactly(1).project_identifier_at_xpath(project_identifier_xpath)
        count_verifier.can_read_view_counts_at(view_count_xpath).with_project_identifiers_at(project_identifier_xpath)

    def test_05_project_updates_page_has_view_counter(self):
        """web.projects.ProjectViewCountersTest  5. Project updates page has view counter"""

        count_verifier = ViewCountVerifier(self)
        view_count_xpath = "//div[@id='outer_leftwing']/div/h1/span"
        project_identifier_xpath = "//div[@id='outer_leftwing']/div/h1/a/@href"

        count_verifier.open_page("http://test.akvo.org/rsr/project/170/updates")
        count_verifier.expect_exactly(1).view_count_at_xpath(view_count_xpath)
        count_verifier.expect_exactly(1).project_identifier_at_xpath(project_identifier_xpath)
        count_verifier.can_read_view_counts_at(view_count_xpath).with_project_identifiers_at(project_identifier_xpath)


def suite():
    return load_tests_from(ProjectViewCountersTest)

if __name__ == "__main__":
    run_test_suite(suite())
