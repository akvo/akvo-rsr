#!/usr/bin/env python

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


from testing.helpers.execution import TestSuiteLoader, TestRunner

from fab.tests.config.rsr.codebase_config_test import RSRCodebaseConfigTest
from fab.tests.config.rsr.data.data_config_test_suite import data_config_suite
from fab.tests.config.rsr.data_retriever_config_test import RSRDataRetrieverConfigTest
from fab.tests.config.rsr.database_config_test import RSRDatabaseConfigTest
from fab.tests.config.rsr.deployment_config_test import RSRDeploymentConfigTest
from fab.tests.config.rsr.virtualenv_installer_config_test import RSRVirtualEnvInstallerConfigTest


def rsr_config_suite():
    config_suite = TestSuiteLoader().create_suite_from_classes([RSRCodebaseConfigTest, RSRDataRetrieverConfigTest,
                                                                RSRDatabaseConfigTest, RSRDeploymentConfigTest,
                                                                RSRVirtualEnvInstallerConfigTest])

    return TestSuiteLoader().create_suite_from_list([data_config_suite(), config_suite])

if __name__ == "__main__":
    from fab.tests.test_settings import TEST_MODE
    TestRunner(TEST_MODE).run_test_suite(rsr_config_suite())
