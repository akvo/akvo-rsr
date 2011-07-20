#!/usr/bin/env python

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


import os

from testing.helpers.execution import TestSuiteLoader, TestRunner

from fab.tests.config.config_test_suite import config_suite
from fab.tests.helpers.helpers_test_suite import helpers_suite
from fab.tests.tasks.tasks_test_suite import tasks_suite


def unit_test_suites():
    return TestSuiteLoader().create_suite_from_list([config_suite(), helpers_suite(), tasks_suite()])

if __name__ == "__main__":
    print "Test suite root: %s\n" % os.path.realpath(os.path.dirname(__file__))
    from fab.tests.test_settings import TEST_MODE
    TestRunner(TEST_MODE).run_test_suite(unit_test_suites())
