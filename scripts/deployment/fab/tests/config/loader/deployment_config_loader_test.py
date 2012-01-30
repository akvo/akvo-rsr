#!/usr/bin/env python

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


import imp, mox, os

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

    def test_will_exit_if_host_config_cannot_be_parsed_from_given_task_parameters(self):
        """fab.tests.config.loader.deployment_config_loader_test  Will exit if host configuration cannot be parsed from given task parameters"""

        invalid_config_format_message = 'Invalid host configuration specification: task_parameters_without_colon -- expected config_type:some;config;values'

        self._exit_with_error_message_when_parsing('task_parameters_without_colon', invalid_config_format_message)

    def test_can_parse_preconfigured_test_host_config_from_given_task_parameters(self):
        """fab.tests.config.loader.deployment_config_loader_test  Can parse preconfigured test host configuration from given task parameters"""

        self.mox.ReplayAll()

        self.assertEqual(CIDeploymentHostConfig.for_test(), self.config_loader.parse(self._preconfigured_config_spec_for(HostAlias.TEST)))

    def test_can_parse_preconfigured_test2_host_config_from_given_task_parameters(self):
        """fab.tests.config.loader.deployment_config_loader_test  Can parse preconfigured test2 host configuration from given task parameters"""

        self.mox.ReplayAll()

        self.assertEqual(CIDeploymentHostConfig.for_test2(), self.config_loader.parse(self._preconfigured_config_spec_for(HostAlias.TEST2)))

    def test_will_exit_if_preconfigured_host_configs_do_not_match_specified_host_alias(self):
        """fab.tests.config.loader.deployment_config_loader_test  Will exit if preconfigured host configurations don't match a specified host alias"""

        self._exit_with_error_message_when_parsing(self._preconfigured_config_spec_for('non_existent_host'),
                                                   'No preconfigured values for host alias: non_existent_host')

    def _exit_with_error_message_when_parsing(self, invalid_host_config, invalid_host_config_message):
        self.mock_feedback.abort(invalid_host_config_message).AndRaise(SystemExit(invalid_host_config_message))
        self.mox.ReplayAll()

        with self.assertRaises(SystemExit) as raised:
            self.config_loader.parse(invalid_host_config)

        self.assertEqual(invalid_host_config_message, raised.exception.message)

    def _preconfigured_config_spec_for(self, host_alias):
        return '%s:%s' % (ConfigType.PRECONFIGURED, host_alias)

    def test_can_parse_standard_configuration_from_given_task_parameters(self):
        """fab.tests.config.loader.deployment_config_loader_test  Can parse a standard configuration from given task parameters"""

        expected_config = DeploymentHostConfig.create_with(HostAlias.UAT, RepositoryBranch.DEVELOP, 'some_rsrdb')
        standard_config_spec = '%s:%s;%s;%s' % (ConfigType.STANDARD, HostAlias.UAT, RepositoryBranch.DEVELOP, 'some_rsrdb')

        self.mox.ReplayAll()

        self.assertEqual(expected_config, self.config_loader.parse(standard_config_spec))

    def test_can_parse_custom_configuration_from_given_task_parameters(self):
        """fab.tests.config.loader.deployment_config_loader_test  Can parse a custom configuration from given task parameters"""

        custom_config_module_path = os.path.realpath(os.path.join(os.path.dirname(__file__), '../../../config/custom.py.template'))
        custom_config_spec = '%s:%s' % (ConfigType.CUSTOM, custom_config_module_path)

        self.mox.ReplayAll()

        self.assertEqual(self._custom_config_from(custom_config_module_path), self.config_loader.parse(custom_config_spec))

    def _custom_config_from(self, custom_config_module_path):
        imp.load_source('custom_config', custom_config_module_path)
        from custom_config import CustomDeploymentHostConfig

        return CustomDeploymentHostConfig.create()


def suite():
    return TestSuiteLoader().load_tests_from(DeploymentConfigLoaderTest)

if __name__ == "__main__":
    from fab.tests.test_settings import TEST_MODE
    TestRunner(TEST_MODE).run_test_suite(suite())
