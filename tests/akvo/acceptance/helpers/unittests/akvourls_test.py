#!/usr/bin/env python

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

from unittest import TestCase

from helpers.akvopaths import *
from helpers.akvourls import *
from helpers.testexecution import *


class AkvoURLsTest(TestCase):

    def test_ensure_akvourls_module_has_url_function_for_each_akvo_page_path(self):
        """helpers.unittests.AkvoURLsTest  Ensure helpers.akvourls module has a URL function for each Akvo page path"""

        expected_url_function_names = self.expected_akvo_url_function_names()
        actual_url_function_names = self.actual_akvo_url_function_names()

        self.assertEqual(len(expected_url_function_names), len(actual_url_function_names),
                         "\nExpected number of URL function names: %i\n  Actual number of URL function names: %i" %
                                (len(expected_url_function_names), len(actual_url_function_names)))

        for expected_function_name in expected_url_function_names:
            self.assertTrue(expected_function_name in actual_url_function_names,
                         "\nExpected URL function name '%s' in:\n%s" %
                                (expected_function_name, actual_url_function_names))

    def test_can_get_akvo_url_from_given_page_function_name(self):
        """helpers.unittests.AkvoURLsTest  Can get Akvo URL from given page function name"""

        self.verify_url(self.full_url(home_page()), home_url())
        self.verify_url(self.full_url(projects_page()), projects_url()) # verifies an RSR URL
        self.verify_url(self.full_url(about_page()), about_url()) # verifies a CMS URL
        self.verify_url(self.full_url(blog_page()), blog_url()) # verifies a blog URL

    def expected_akvo_url_function_names(self):
        import helpers.akvopaths
        expected_page_paths = filter(lambda name: name.endswith('_page'), dir(helpers.akvopaths))
        return map(lambda page_path: page_path.replace('_page', '_url'), expected_page_paths)

    def actual_akvo_url_function_names(self):
        import helpers.akvourls
        return filter(lambda name: name.endswith('_url'), dir(helpers.akvourls))

    def full_url(self, path):
        return "%s%s" % (SITE_UNDER_TEST, path)

    def verify_url(self, expected_url, actual_url):
        self.assertEqual(expected_url, actual_url, "\nExpected URL: %s\n  Actual URL: %s" % (expected_url, actual_url))


def suite():
    return load_tests_from(AkvoURLsTest)

if __name__ == "__main__":
    run_test_suite(suite())
