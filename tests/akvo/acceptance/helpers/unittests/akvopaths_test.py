#!/usr/bin/env python

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

from unittest import TestCase

from helpers.akvopaths import *
from helpers.testexecution import *


class AkvoPathsTest(TestCase):

    def test_can_get_home_page_path(self):
        """helpers.unittests.AkvoPathsTest  Can get path for Home page"""

        self.verify_path("/", home_page())

    def test_can_get_projects_page_path(self):
        """helpers.unittests.AkvoPathsTest  Can get path for Projects page"""

        self.verify_path("/rsr/projects", projects_page())

    def test_can_get_all_projects_page_path(self):
        """helpers.unittests.AkvoPathsTest  Can get path for All Projects page"""

        self.verify_path("/rsr/projects/all", all_projects_page())

    def test_can_get_focus_areas_page_path(self):
        """helpers.unittests.AkvoPathsTest  Can get path for Focus Areas page"""

        self.verify_path("/web/focus-areas", focus_areas_page())

    def test_can_get_partners_page_path(self):
        """helpers.unittests.AkvoPathsTest  Can get path for Partners page"""

        self.verify_path("/web/partners", partners_page())

    def test_can_get_akvopedia_page_path(self):
        """helpers.unittests.AkvoPathsTest  Can get path for Akvopedia page"""

        self.verify_path("/wiki", akvopedia_page())

    def test_can_get_about_page_path(self):
        """helpers.unittests.AkvoPathsTest  Can get path for About page"""

        self.verify_path("/web/get_involved", about_page())

    def test_can_get_blog_page_path(self):
        """helpers.unittests.AkvoPathsTest  Can get path for Blog page"""

        self.verify_path("/blog", blog_page())

    def test_can_get_register_page_path(self):
        """helpers.unittests.AkvoPathsTest  Can get path for Register page"""

        self.verify_path("/rsr/accounts/register1", register_page())

    def test_can_get_sign_in_page_path(self):
        """helpers.unittests.AkvoPathsTest  Can get path for Sign in page"""

        self.verify_path("/rsr/signin/?next=/rsr/projects/all", sign_in_page())

    def verify_path(self, expected_path, actual_path):
        self.failUnlessEqual(expected_path, actual_path, "\nExpected path: %s\n  Actual path: %s" % (expected_path, actual_path))


def suite():
    return load_tests_from(AkvoPathsTest)

if __name__ == "__main__":
    run_test_suite(suite())
