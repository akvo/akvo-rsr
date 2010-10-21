#!/usr/bin/env python

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

import os, sys

from helpers.seleniumclient import SeleniumClient
from helpers.testexecution import *

from test_settings import SITE_UNDER_TEST

from internal.internal_unittests_suite import unittests_suite
# from api.xml.xml_api_test_suite import xml_api_suite
from web.web_test_suite import web_suite

def acceptance_test_suites():
    return create_test_suite_from_suites([web_suite()])

if __name__ == "__main__":
    acceptance_test_root_path = os.path.realpath(os.path.dirname(__file__))
    print "Test suite root path: %s\n" % (acceptance_test_root_path)

    print "Running unit tests for acceptance test helpers\n"
    if run_test_suite(unittests_suite()).wasSuccessful():
        print "\nRunning acceptance tests for: %s\n" % (SITE_UNDER_TEST)
        run_test_suite(acceptance_test_suites())
        SeleniumClient().stop()
    else:
        print "\nUnable to run acceptance tests until the unit test errors above have been resolved\n"
        sys.exit(1)
