#!/usr/bin/env python

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


import os, sys

def real_path_for(relative_path):
    return os.path.realpath(os.path.join(os.path.dirname(__file__), relative_path))

def ensure_syspath_has(expected_path):
    if expected_path not in sys.path:
        sys.path.insert(0, expected_path)

DEPLOYMENT_SCRIPTS_HOME = real_path_for('../..')
TESTING_HELPERS_HOME = real_path_for('../../../../tests/shared')

ensure_syspath_has(DEPLOYMENT_SCRIPTS_HOME)
ensure_syspath_has(TESTING_HELPERS_HOME)


from testing.helpers.execution import TestSuiteLoader, TestRunner

from fab.tests.app.app_test_suite import app_suite
from fab.tests.config.config_test_suite import config_suite
from fab.tests.data.data_test_suite import data_suite
from fab.tests.database.database_test_suite import database_suite
from fab.tests.dependency.dependency_test_suite import dependency_suite
from fab.tests.environment.environment_test_suite import environment_suite
from fab.tests.format.formatting_test_suite import formatting_suite
from fab.tests.helpers.helpers_test_suite import helpers_suite
from fab.tests.host.host_test_suite import host_suite
from fab.tests.os.os_test_suite import os_suite
from fab.tests.tasks.tasks_test_suite import tasks_suite


def unit_test_suites():
    return TestSuiteLoader().create_suite_from_list([formatting_suite(), config_suite(), dependency_suite(),
                                                     environment_suite(), helpers_suite(), os_suite(),
                                                     data_suite(), database_suite(), host_suite(),
                                                     app_suite(), tasks_suite()])

if __name__ == "__main__":
    print "Test suite root: %s\n" % os.path.realpath(os.path.dirname(__file__))
    from fab.tests.test_settings import TEST_MODE
    TestRunner(TEST_MODE).run_test_suite(unit_test_suites())
