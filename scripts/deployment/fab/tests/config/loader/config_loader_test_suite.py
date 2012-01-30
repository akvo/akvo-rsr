#!/usr/bin/env python

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


from testing.helpers.execution import TestRunner, TestSuiteLoader

from fab.tests.config.loader.config_type_test import ConfigTypeTest
from fab.tests.config.loader.deployment_config_loader_test import DeploymentConfigLoaderTest


def config_loader_suite():
    return TestSuiteLoader().create_suite_from_classes([ConfigTypeTest, DeploymentConfigLoaderTest])

if __name__ == "__main__":
    from fab.tests.test_settings import TEST_MODE
    TestRunner(TEST_MODE).run_test_suite(config_loader_suite())
