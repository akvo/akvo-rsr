#!/usr/bin/env python

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

from unittest import TestCase

from helpers.externalurls import *
from helpers.testexecution import *


class ExternalURLsTest(TestCase):

    def test_can_get_akvo_source_code_url(self):
        """helpers.unittests.ExternalURLsTest  Can get URL for Akvo source code"""
        self.verify_url("http://github.com/akvo", akvo_source_code_url())

    def test_can_get_akvo_support_url(self):
        """helpers.unittests.ExternalURLsTest  Can get URL for Akvo help & support"""
        self.verify_url("http://help.akvo.org", akvo_support_url())

    def test_can_get_report_a_problem_url(self):
        """helpers.unittests.ExternalURLsTest  Can get URL for Reporting a problem"""
        self.verify_url("http://help.akvo.org/discussion/new", report_a_problem_url())

    def verify_url(self, expected_url, actual_url):
        self.assertEqual(expected_url, actual_url, "\nExpected URL: %s\n  Actual URL: %s" % (expected_url, actual_url))


def suite():
    return load_tests_from(ExternalURLsTest)

if __name__ == "__main__":
    run_test_suite(suite())
