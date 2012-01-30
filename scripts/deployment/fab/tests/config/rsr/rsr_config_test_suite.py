#!/usr/bin/env python

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


from testing.helpers.execution import TestSuiteLoader, TestRunner

from fab.tests.config.rsr.ci_deployment_host_config_test import suite as ci_deployment_host_config_suite
from fab.tests.config.rsr.codebase_config_test import suite as codebase_config_suite
from fab.tests.config.rsr.credentials.credentials_test_suite import credentials_suite
from fab.tests.config.rsr.data_host_config_test import suite as data_host_config_suite
from fab.tests.config.rsr.data.data_config_test_suite import data_config_suite
from fab.tests.config.rsr.database_config_test import suite as database_config_suite
from fab.tests.config.rsr.deployment_config_test import suite as deployment_config_suite
from fab.tests.config.rsr.virtualenv_installer_config_test import suite as virtualenv_installer_config_suite


def rsr_config_suite():
    return TestSuiteLoader().create_suite_from_list([ci_deployment_host_config_suite(), codebase_config_suite(),
                                                     credentials_suite(), data_host_config_suite(), data_config_suite(),
                                                     database_config_suite(), deployment_config_suite(),
                                                     virtualenv_installer_config_suite()])

if __name__ == "__main__":
    from fab.tests.test_settings import TEST_MODE
    TestRunner(TEST_MODE).run_test_suite(rsr_config_suite())
