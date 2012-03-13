#!/usr/bin/env python

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


from testing.helpers.execution import TestRunner, TestSuiteLoader

from fab.tests.config.environment.environment_config_test_suite import environment_config_suite
from fab.tests.config.loader.config_loader_test_suite import config_loader_suite
from fab.tests.config.rsr.rsr_config_test_suite import rsr_config_suite
from fab.tests.config.spec.config_spec_test_suite import config_spec_suite
from fab.tests.config.values.config_values_test_suite import config_values_suite


def config_suite():
    return TestSuiteLoader().create_suite_from_list([environment_config_suite(), config_loader_suite(),
                                                     rsr_config_suite(), config_spec_suite(), config_values_suite()])

if __name__ == '__main__':
    TestRunner().run_test_suite(config_suite())
