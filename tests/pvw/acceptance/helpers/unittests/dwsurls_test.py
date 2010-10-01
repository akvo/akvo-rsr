#!/usr/bin/env python

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

from unittest import TestCase

from helpers.dwspaths import *
from helpers.dwsurls import *
from helpers.testexecution import *


class DWSURLsTest(TestCase):

    def test_can_get_home_page_url(self):
        """helpers.unittests.DWSURLsTest  Can get URL for home page"""

        self.verify_url(SITE_UNDER_TEST, home_page_url())

    def test_can_get_focus_areas_url(self):
        """helpers.unittests.DWSURLsTest  Can get URL for Focus Areas page"""

        self.verify_url(self.full_url(focus_areas_page()), focus_areas_url())

    def test_can_get_all_projects_url(self):
        """helpers.unittests.DWSURLsTest  Can get URL for Projects page"""

        self.verify_url(self.full_url(all_projects_page()), all_projects_url())

    def test_can_get_netherlands_url(self):
        """helpers.unittests.DWSURLsTest  Can get URL for Netherlands page"""

        self.verify_url(self.full_url(netherlands_page()), netherlands_url())

    def test_can_get_education_url(self):
        """helpers.unittests.DWSURLsTest  Can get URL for Education page"""

        self.verify_url(self.full_url(education_page()), education_url())

    def test_can_get_directory_url(self):
        """helpers.unittests.DWSURLsTest  Can get URL for Directory page"""

        self.verify_url(self.full_url(directory_page()), directory_url())

    def test_can_get_news_url(self):
        """helpers.unittests.DWSURLsTest  Can get URL for News page"""

        self.verify_url(self.full_url(news_page()), news_url())

    def test_can_get_about_url(self):
        """helpers.unittests.DWSURLsTest  Can get URL for About page"""

        self.verify_url(self.full_url(about_page()), about_url())

    def full_url(self, path):
        return "%s%s" % (SITE_UNDER_TEST, path)

    def verify_url(self, expected_url, actual_url):
        self.failUnlessEqual(expected_url, actual_url, "\nExpected URL: %s\n  Actual URL: %s" % (expected_url, actual_url))


def suite():
    return load_tests_from(DWSURLsTest)

if __name__ == "__main__":
    run_test_suite(suite())
