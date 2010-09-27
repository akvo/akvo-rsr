#!/usr/bin/env python

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

from helpers.elementparsing import *
from helpers.rsrpath import *
from helpers.testexecution import *

from testcases.elementparsingtestcase import ElementParsingTestCase
from verifiers.viewcountverifier import ViewCountVerifier


class ProjectViewCountersTest(ElementParsingTestCase):

    def setUp(self):
        self.count_verifier = ViewCountVerifier(self)

    def test_01_home_page_has_view_counters_for_featured_projects(self):
        """web.projects.ProjectViewCountersTest  1. Home page has view counters for featured projects"""

        self.count_verifier.open_page(home_page_path())
        self.count_verifier.expect_exactly(3).view_counters_and_counter_identifiers_with_xpaths("//div[@class='featured_update']/div/div/p[2]",
                                                                                                "//div[@class='featured_update']/div/div/span/img/@src")

    def test_02_project_listing_page_has_view_counters_for_featured_projects(self):
        """web.projects.ProjectViewCountersTest  2. Project listing page has view counters for featured projects"""

        self.count_verifier.open_page(project_listing_path())
        self.count_verifier.expect_exactly(13).view_counts_on_page() # includes view counts for listed projects on the same page
        self.count_verifier.expect_exactly(3).view_counter_images_on_page() # currently only for the featured projects
        self.count_verifier.expect_exactly(3).standard_view_counters_at_xpath("//table[@id='project_showcase']/tr/td/div[3]/span")

    def test_03_project_listing_page_has_view_counters_for_each_listed_project(self):
        """web.projects.ProjectViewCountersTest  3. Project listing page has view counters for each listed project"""

        self.count_verifier.open_page(project_listing_path())
        self.count_verifier.expect_exactly(13).view_counts_on_page() # includes view counts for listed projects on the same page
        self.count_verifier.expect_exactly(3).view_counter_images_on_page() # currently only for the featured projects

        # listed projects don't yet have counter images so we use the project URL as the view counter identifier
        self.count_verifier.expect_exactly(10).view_counters_and_counter_identifiers_with_xpaths("//table[@id='project_table']/tr/td/p",
                                                                                                 "//table[@id='project_table']/tr/td[1]/a[1]/@href")

    def test_04_project_page_has_view_counter(self):
        """web.projects.ProjectViewCountersTest  4. Project page has view counter"""

        self.count_verifier.open_page(project_path(170))
        self.count_verifier.expect_exactly(1).standard_view_counter_at_xpath("//div[@id='outer_leftwing']/div/h1/span")

    def test_05_project_updates_page_has_view_counter(self):
        """web.projects.ProjectViewCountersTest  5. Project updates page has view counter"""

        self.count_verifier.open_page(project_updates_path(170))
        self.count_verifier.expect_exactly(1).standard_view_counter_at_xpath("//div[@id='outer_leftwing']/div/h1/span")


def suite():
    return load_tests_from(ProjectViewCountersTest)

if __name__ == "__main__":
    run_test_suite(suite())
