#!/usr/bin/env python

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


import mox, os

from testing.helpers.execution import TestRunner, TestSuiteLoader

from fab.config.loader import ConfigType, DeploymentConfigLoader
from fab.config.rsr.host import DeploymentHostConfig, RepositoryBranch
from fab.config.values.host import HostAlias
from fab.helpers.feedback import ExecutionFeedback
from fab.tasks.base import DeploymentTaskBase


class DeploymentTaskBaseTest(mox.MoxTestBase):

    def setUp(self):
        super(DeploymentTaskBaseTest, self).setUp()
        self.mock_feedback = self.mox.CreateMock(ExecutionFeedback)
        self.mock_config_loader = self.mox.CreateMock(DeploymentConfigLoader)
        self.mock_host_config = self.mox.CreateMock(DeploymentHostConfig)

        self.deployment_task_base = DeploymentTaskBase(self.mock_feedback, self.mock_config_loader)

    def test_can_instantiate_with_default_config_loader(self):
        """fab.tests.tasks.deployment_task_base_test  Can instantiate with default configuration loader"""

        self.assertIsInstance(DeploymentTaskBase(self.mock_feedback).config_loader, DeploymentConfigLoader)

    def test_can_run_deployment_task_with_standard_configuration_set(self):
        """fab.tests.tasks.deployment_task_base_test  Can run deployment task with standard configuration set"""

        self.mock_config_loader.load(HostAlias.UAT, RepositoryBranch.DEVELOP, 'some_rsrdb').AndReturn(self.mock_host_config)
        self.mox.ReplayAll()

        self.deployment_task_base.run(ConfigType.STANDARD,
                                      host_alias=HostAlias.UAT,
                                      repository_branch=RepositoryBranch.DEVELOP,
                                      database_name='some_rsrdb')

        self.assertIs(self.mock_host_config, self.deployment_task_base.host_config)

    def test_can_run_deployment_task_with_preconfigured_configuration_set(self):
        """fab.tests.tasks.deployment_task_base_test  Can run deployment task with preconfigured configuration set"""

        self.mock_config_loader.load_preconfigured_for(HostAlias.TEST2).AndReturn(self.mock_host_config)
        self.mox.ReplayAll()

        self.deployment_task_base.run(ConfigType.PRECONFIGURED, host_alias=HostAlias.TEST2)

        self.assertIs(self.mock_host_config, self.deployment_task_base.host_config)

    def test_can_run_deployment_task_with_custom_configuration_set(self):
        """fab.tests.tasks.deployment_task_base_test  Can run deployment task with custom configuration set"""

        custom_config_module = os.path.realpath(os.path.join(os.path.dirname(__file__), '../../config/custom.py.template'))

        self.mock_config_loader.load_custom_from(custom_config_module).AndReturn(self.mock_host_config)
        self.mox.ReplayAll()

        self.deployment_task_base.run(ConfigType.CUSTOM, custom_config_module_path=custom_config_module)

        self.assertIs(self.mock_host_config, self.deployment_task_base.host_config)

    def test_can_run_deployment_task_with_preconfigured_configuration_set(self):
        """fab.tests.tasks.deployment_task_base_test  Can run deployment task with preconfigured configuration set"""

        unknown_config_type_message = 'Unknown configuration type: non-existent'

        self.mock_feedback.abort(unknown_config_type_message).AndRaise(SystemExit(unknown_config_type_message))
        self.mox.ReplayAll()

        with self.assertRaises(SystemExit) as raised:
            self.deployment_task_base.run('non-existent', host_alias=HostAlias.UAT)

        self.assertEqual(unknown_config_type_message, raised.exception.message)


def suite():
    return TestSuiteLoader().load_tests_from(DeploymentTaskBaseTest)

if __name__ == "__main__":
    from fab.tests.test_settings import TEST_MODE
    TestRunner(TEST_MODE).run_test_suite(suite())
