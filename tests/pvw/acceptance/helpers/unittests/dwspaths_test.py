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

    def test_can_get_open_license_page_path(self):
        """helpers.unittests.DWSPathsTest  Can get path for Open license page"""

        self.verify_path("/web/open_license", open_license_page())

    def test_can_get_terms_of_use_page_path(self):
        """helpers.unittests.DWSPathsTest  Can get path for Terms of use page"""

        self.verify_path("/web/terms_of_use", terms_of_use_page())

    def test_can_get_privacy_policy_page_path(self):
        """helpers.unittests.DWSPathsTest  Can get path for Privacy policy page"""

        self.verify_path("/web/privacy_policy", privacy_policy_page())

    def test_can_get_credits_page_path(self):
        """helpers.unittests.DWSPathsTest  Can get path for Credits page"""

        self.verify_path("/web/credits", credits_page())

    def test_can_get_admin_page_path(self):
        """helpers.unittests.DWSPathsTest  Can get path for Admin page"""

        self.verify_path("/web/admin", admin_page())

    def test_can_get_register_page_path(self):
        """helpers.unittests.DWSPathsTest  Can get path for Register page"""

        self.verify_path("/rsr/accounts/register1", register_page())

    def test_can_get_sign_in_page_path(self):
        """helpers.unittests.DWSPathsTest  Can get path for Sign in page"""

        self.verify_path("/rsr/signin/?next=/rsr/projects/all", sign_in_page())

    def test_can_get_contact_us_page_path(self):
        """helpers.unittests.DWSPathsTest  Can get path for Contact us page"""

        self.verify_path("/web/contact_us", contact_us_page())

    def test_can_get_akvo_home_page_path(self):
        """helpers.unittests.DWSPathsTest  Can get path for Akvo home page"""

        self.verify_path("http://www.akvo.org", akvo_home_page())

    def verify_path(self, expected_path, actual_path):
        self.failUnlessEqual(expected_path, actual_path, "\nExpected path: %s\n  Actual path: %s" % (expected_path, actual_path))


def suite():
    return load_tests_from(DWSPathsTest)

if __name__ == "__main__":
    run_test_suite(suite())
