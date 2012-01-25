#!/usr/bin/env python

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


import imp, mox, os, unittest2

from testing.helpers.execution import TestRunner, TestSuiteLoader

from fab.config.loader import ConfigType, DeploymentConfigLoader
from fab.config.rsr.host import CIDeploymentHostConfig, DeploymentHostConfig, RepositoryBranch
from fab.config.values.host import HostAlias
from fab.helpers.feedback import ExecutionFeedback


class DeploymentConfigLoaderTest(mox.MoxTestBase):

    def setUp(self):
        super(DeploymentConfigLoaderTest, self).setUp()
        self.mock_feedback = self.mox.CreateMock(ExecutionFeedback)

        self.config_loader = DeploymentConfigLoader(self.mock_feedback)

    def test_initialiser_has_default_execution_feedback(self):
        """fab.tests.config.loader.deployment_config_loader_test  Initialiser has default ExecutionFeedback"""

        self.assertIsInstance(DeploymentConfigLoader().feedback, ExecutionFeedback)

    def test_can_load_preconfigured_configuration_for_test_host(self):
        """fab.tests.config.loader.deployment_config_loader_test  Can load preconfigured configuration for test host"""

        self.mox.ReplayAll()

        self.assertEqual(CIDeploymentHostConfig.for_test(), self.config_loader.host_config_for(ConfigType.PRECONFIGURED, HostAlias.TEST))

    def test_can_load_preconfigured_configuration_for_test2_host(self):
        """fab.tests.config.loader.deployment_config_loader_test  Can load preconfigured configuration for test2 host"""

        self.mox.ReplayAll()

        self.assertEqual(CIDeploymentHostConfig.for_test2(), self.config_loader.host_config_for(ConfigType.PRECONFIGURED, HostAlias.TEST2))

    def test_can_load_standard_configuration(self):
        """fab.tests.config.loader.deployment_config_loader_test  Can load a standard configuration"""

        self.mox.ReplayAll()

        expected_config = DeploymentHostConfig.create_with(HostAlias.UAT, RepositoryBranch.DEVELOP, 'some_rsrdb')

        self.assertEqual(expected_config, self.config_loader.host_config_for(ConfigType.STANDARD, HostAlias.UAT,
                                                                             RepositoryBranch.DEVELOP, 'some_rsrdb'))

    def test_can_load_custom_configuration(self):
        """fab.tests.config.loader.deployment_config_loader_test  Can load a custom configuration"""

        custom_config_module = os.path.realpath(os.path.join(os.path.dirname(__file__), '../../../config/custom.py.template'))

        imp.load_source('custom_config', custom_config_module)
        from custom_config import CustomDeploymentHostConfig

        actual_host_config = self.config_loader.host_config_for(ConfigType.CUSTOM, custom_config_module_path=custom_config_module)

        self.assertEqual(CustomDeploymentHostConfig.create(), actual_host_config)

    def test_will_exit_if_configuration_type_is_unrecognised(self):
        """fab.tests.config.loader.deployment_config_loader_test  Will exit if configuration type is unrecognised"""

        unknown_config_type_message = 'Unknown configuration type: non-existent'

        self.mock_feedback.abort(unknown_config_type_message).AndRaise(SystemExit(unknown_config_type_message))
        self.mox.ReplayAll()

        with self.assertRaises(SystemExit) as raised:
            self.config_loader.host_config_for('non-existent', host_alias=HostAlias.UAT)

        self.assertEqual(unknown_config_type_message, raised.exception.message)


def suite():
    return TestSuiteLoader().load_tests_from(DeploymentConfigLoaderTest)

if __name__ == "__main__":
    from fab.tests.test_settings import TEST_MODE
    TestRunner(TEST_MODE).run_test_suite(suite())
