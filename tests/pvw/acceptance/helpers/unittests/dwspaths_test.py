#!/usr/bin/env python

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

from unittest import TestCase

from helpers.dwspaths import *
from helpers.testexecution import *


class DWSPathsTest(TestCase):

    def test_can_get_home_page_path(self):
        """helpers.unittests.DWSPathsTest  Can get path for Home page"""

        self.verify_path("/", home_page())

    def test_can_get_focus_areas_page_path(self):
        """helpers.unittests.DWSPathsTest  Can get path for Focus Areas page"""

        self.verify_path("/web/focus-areas", focus_areas_page())

    def test_can_get_projects_page_path(self):
        """helpers.unittests.DWSPathsTest  Can get path for Projects page"""

        self.verify_path("/rsr/projects", projects_page())

    def test_can_get_all_projects_page_path(self):
        """helpers.unittests.DWSPathsTest  Can get path for All Projects page"""

        self.verify_path("/rsr/projects/all", all_projects_page())

    def test_can_get_netherlands_page_path(self):
        """helpers.unittests.DWSPathsTest  Can get path for Netherlands page"""

        self.verify_path("/web/netherlands", netherlands_page())

    def test_can_get_education_page_path(self):
        """helpers.unittests.DWSPathsTest  Can get path for Education page"""

        self.verify_path("/web/education", education_page())

    def test_can_get_directory_page_path(self):
        """helpers.unittests.DWSPathsTest  Can get path for Directory page"""

        self.verify_path("/web/directory", directory_page())

    def test_can_get_news_page_path(self):
        """helpers.unittests.DWSPathsTest  Can get path for News page"""

        self.verify_path("/news", news_page())

    def test_can_get_about_page_path(self):
        """helpers.unittests.DWSPathsTest  Can get path for About page"""

        self.verify_path("/web/about", about_page())

    def verify_path(self, expected_path, actual_path):
        self.failUnlessEqual(expected_path, actual_path, "\nExpected path: %s\n  Actual path: %s" % (expected_path, actual_path))


def suite():
    return load_tests_from(DWSPathsTest)

if __name__ == "__main__":
    run_test_suite(suite())
