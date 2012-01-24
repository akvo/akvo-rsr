#!/usr/bin/env python

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


import imp, os, unittest2

from testing.helpers.execution import TestRunner, TestSuiteLoader

from fab.config.loader import DeploymentConfigLoader
from fab.config.rsr.host import CIDeploymentHostConfig, DeploymentHostConfig, RepositoryBranch
from fab.config.values.host import HostAlias


class DeploymentConfigLoaderTest(unittest2.TestCase):

    def setUp(self):
        super(DeploymentConfigLoaderTest, self).setUp()

        self.config_loader = DeploymentConfigLoader()

    def test_can_load_preconfigured_configurations(self):
        """fab.tests.config.loader.deployment_config_loader_test  Can load preconfigured configurations"""

        self.assertEqual(CIDeploymentHostConfig.for_test(), self.config_loader.load_preconfigured_for(HostAlias.TEST))
        self.assertEqual(CIDeploymentHostConfig.for_test2(), self.config_loader.load_preconfigured_for(HostAlias.TEST2))

    def test_can_load_standard_configuration(self):
        """fab.tests.config.loader.deployment_config_loader_test  Can load a standard configuration"""

        expected_config = DeploymentHostConfig.create_with(HostAlias.UAT, RepositoryBranch.DEVELOP, 'some_rsrdb')

        self.assertEqual(expected_config, self.config_loader.load(HostAlias.UAT, RepositoryBranch.DEVELOP, 'some_rsrdb'))

    def test_can_load_custom_configuration(self):
        """fab.tests.config.loader.deployment_config_loader_test  Can load a custom configuration"""

        custom_config_module = os.path.realpath(os.path.join(os.path.dirname(__file__), '../../../config/custom.py.template'))

        imp.load_source('custom_config', custom_config_module)
        from custom_config import CustomDeploymentHostConfig

        self.assertEqual(CustomDeploymentHostConfig.create(), self.config_loader.load_custom_from(custom_config_module))


def suite():
    return TestSuiteLoader().load_tests_from(DeploymentConfigLoaderTest)

if __name__ == "__main__":
    from fab.tests.test_settings import TEST_MODE
    TestRunner(TEST_MODE).run_test_suite(suite())
