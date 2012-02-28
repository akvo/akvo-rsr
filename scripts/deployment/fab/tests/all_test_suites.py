#!/usr/bin/env python

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


import imp, os, sys

DEPLOYMENT_SCRIPTS_HOME = os.path.realpath(os.path.join(os.path.dirname(__file__), '../..'))
imp.load_source('syspath_verification', os.path.join(DEPLOYMENT_SCRIPTS_HOME, 'verifiers/ensure_syspath_contains_testing_path_dependencies.py'))

from testing.helpers.execution import TestMode, TestRunner, TestSuiteLoader

from fab.tests.fabfile_test import suite as fabfile_suite
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
from fab.tests.security.security_test_suite import security_suite
from fab.tests.tasks.tasks_test_suite import tasks_suite
from fab.tests.verifiers.verifiers_test_suite import verifiers_suite


def unit_test_suites():
    return TestSuiteLoader().create_suite_from_list([fabfile_suite(), app_suite(), config_suite(), data_suite(), database_suite(),
                                                     dependency_suite(), environment_suite(), formatting_suite(), helpers_suite(),
                                                     host_suite(), os_suite(), security_suite(), tasks_suite(), verifiers_suite()])

if __name__ == '__main__':
    test_runner = TestRunner()

    if len(sys.argv) > 1:
        test_mode = sys.argv[1]
        if test_mode == TestMode.CONTINUOUS_INTEGRATION:
            test_runner = TestRunner(test_mode)
        else:
            raise SystemExit('## Unrecognised test mode: %s\n' % test_mode)

    print 'Test suite root: %s\n' % os.path.realpath(os.path.dirname(__file__))
    test_runner.run_test_suite(unit_test_suites())
