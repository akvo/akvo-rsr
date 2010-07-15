#!/usr/bin/env python

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

import time

from testcases.elementparsingtestcase import ElementParsingTestCase
from helpers.testexecution import *

from web.projects.viewcountverifier import ViewCountVerifier


class ProjectViewCountersTest(ElementParsingTestCase):

    def test_01_counters_for_featured_projects_on_home_page_increment_as_expected(self):
        """web.projects.ProjectViewCountersTest  1. Counters for featured projects on home page increment as expected"""

        count_verifier = ViewCountVerifier(self)
        view_count_xpath = "//div[@class='featured_update']/div/div/p[2]"
        project_identifier_xpath = "//a[@class='staffpicks_update_title']/@href"

        # featured projects on the home page are seldom displayed in the same order so we need to read the page
        # a few times and verify that view counts have incremented as expected for matching projects
        for page_loads in range(4):
            count_verifier.open_page("http://test.akvo.org")
            count_verifier.expect_exactly(3).view_counts_at_xpath(view_count_xpath)
            count_verifier.expect_exactly(3).project_identifiers_at_xpath(project_identifier_xpath)
            count_verifier.read_view_counts_at(view_count_xpath).with_project_identifiers_at(project_identifier_xpath)
            time.sleep(1)

        count_verifier.verify_counts_have_incremented_as_expected()


def suite():
    return load_tests_from(ProjectViewCountersTest)

if __name__ == "__main__":
    run_test_suite(suite())
