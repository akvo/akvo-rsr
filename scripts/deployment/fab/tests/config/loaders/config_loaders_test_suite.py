#!/usr/bin/env python

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


from testing.helpers.execution import TestSuiteLoader, TestRunner

from fab.tests.config.loaders.deployment_config_loader_test import DeploymentConfigLoaderTest
from fab.tests.config.loaders.user_credentials_loader_test import UserCredentialsLoaderTest


def config_loaders_suite():
    return TestSuiteLoader().create_suite_from_classes([DeploymentConfigLoaderTest, UserCredentialsLoaderTest])

if __name__ == "__main__":
    from fab.tests.test_settings import TEST_MODE
    TestRunner(TEST_MODE).run_test_suite(config_loaders_suite())
