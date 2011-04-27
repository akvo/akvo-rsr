#!/usr/bin/env python

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

from unittest import TestCase

from helpers.rsrpath import *
from helpers.testexecution import *


class RSRPathTest(TestCase):

    def test_can_get_home_page_path(self):
        """helpers.unittests.RSRPathTest  Can get home page path"""

        self.verify_path(SITE_UNDER_TEST, home_page_path())

    def test_can_get_rsr_project_listing_path(self):
        """helpers.unittests.RSRPathTest  Can get RSR project listing path"""

        self.verify_path(self.url_path(SITE_UNDER_TEST, "/rsr/projects"), project_listing_path())

    def test_can_get_path_for_a_specified_rsr_project(self):
        """helpers.unittests.RSRPathTest  Can get path for a specified RSR project"""

        self.verify_path(self.url_path(SITE_UNDER_TEST, "/rsr/project/108"), project_path(108))

    def test_can_get_project_updates_path_for_a_specified_rsr_project(self):
        """helpers.unittests.RSRPathTest  Can get project updates path for a specified RSR project"""

        self.verify_path(self.url_path(SITE_UNDER_TEST, "/rsr/project/108/updates"), project_updates_path(108))

    def test_can_get_project_widget_path_for_a_specified_rsr_project_and_widget_type(self):
        """helpers.unittests.RSRPathTest  Can get project widget path for a specified RSR project and widget type"""

        self.verify_path(self.url_path(SITE_UNDER_TEST, "/rsr/widget/cobranded-short/project/108"), project_widget_path(108, "cobranded-short"))

    def test_can_get_project_listing_widget_path_for_a_specified_rsr_organisation(self):
        """helpers.unittests.RSRPathTest  Can get project listing widget path for a specified RSR organisation"""

        self.verify_path(self.url_path(SITE_UNDER_TEST, "/rsr/widget/project-list/organisation/15"), project_listing_widget_path_for_organisation(15))

    def url_path(self, base_url, path):
        return "%s%s" % (base_url, path)

    def verify_path(self, expected_path, actual_path):
        self.failUnlessEqual(expected_path, actual_path, "\nExpected path: %s\n  Actual path: %s" % (expected_path, actual_path))


def suite():
    return load_tests_from(RSRPathTest)

if __name__ == "__main__":
    run_test_suite(suite())
