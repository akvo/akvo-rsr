#!/usr/bin/env python

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


from testing.helpers.execution import TestSuiteLoader, TestRunner

from fab.tests.config.values.config_values_test_suite import config_values_suite
from fab.tests.config.environment.environment_config_test_suite import environment_config_suite
from fab.tests.config.rsr.rsr_config_test_suite import rsr_config_suite


def config_suite():
    return TestSuiteLoader().create_suite_from_list([config_values_suite(), environment_config_suite(), rsr_config_suite()])

if __name__ == "__main__":
    from fab.tests.test_settings import TEST_MODE
    TestRunner(TEST_MODE).run_test_suite(config_suite())
