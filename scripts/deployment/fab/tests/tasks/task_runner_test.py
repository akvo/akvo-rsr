#!/usr/bin/env python

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


import mox, os

from testing.helpers.execution import TestRunner, TestSuiteLoader

from fab.config.loader import ConfigType, DeploymentConfigLoader
from fab.config.rsr.credentials.user import UserCredentials
from fab.config.rsr.host import CIDeploymentHostConfig
from fab.config.values.host import HostAlias
from fab.tasks.database.backup import BackupRSRDatabase
from fab.tasks.environment.python.systempackages import UpdateSystemPythonPackages
from fab.tasks.runner import TaskParameters, TaskRunner
from fab.verifiers.config import ConfigFileVerifier


class StubbedTaskRunner(TaskRunner):

    fake_exit_code = 0

    def _execute(self, command_with_parameters):
        self.executed_command_with_parameters = command_with_parameters
        return self.fake_exit_code


class TaskRunnerTest(mox.MoxTestBase):

    def setUp(self):
        super(TaskRunnerTest, self).setUp()
        self.mock_config_loader = self.mox.CreateMock(DeploymentConfigLoader)

        self.user_credentials = UserCredentials.default()
        self.deployment_host_config = CIDeploymentHostConfig.for_test()

        self.task_runner = StubbedTaskRunner(self.user_credentials, self.mock_config_loader)

    def test_can_create_taskrunner_instance(self):
        """fab.tests.tasks.task_runner_test  Can create a TaskRunner instance"""

        mock_config_file_verifier = self.mox.CreateMock(ConfigFileVerifier)

        mock_config_file_verifier.exit_if_custom_user_credentials_not_found()
        mock_config_file_verifier.exit_if_database_credentials_not_found()
        self.mox.ReplayAll()

        self.assertIsInstance(TaskRunner.create(mock_config_file_verifier, self.mock_config_loader), TaskRunner)

    def test_has_expected_fabfile_path(self):
        """fab.tests.tasks.task_runner_test  Has expected fabfile.py path"""

        expected_fabfile_path = os.path.realpath(os.path.join(os.path.dirname(__file__), '../../fabfile.py'))

        self.assertEqual(expected_fabfile_path, TaskRunner.FABFILE_PATH)

    def test_can_run_deployment_task(self):
        """fab.tests.tasks.task_runner_test  Can run deployment task"""

        self._set_expected_host_config()

        expected_parameter_list = TaskParameters(ConfigType.PRECONFIGURED).compose_parameter_list(TaskParameters.NONE, HostAlias.TEST)

        self.task_runner.fake_exit_code = 0
        self.task_runner.run_deployment_task(UpdateSystemPythonPackages, ConfigType.PRECONFIGURED, HostAlias.TEST)

        self.assertEqual(self._expected_fabric_call_with(UpdateSystemPythonPackages, expected_parameter_list),
                         self.task_runner.executed_command_with_parameters)

    def test_can_run_remote_deployment_task(self):
        """fab.tests.tasks.task_runner_test  Can run remote deployment task"""

        self._set_expected_host_config()

        expected_parameter_list = TaskParameters(ConfigType.PRECONFIGURED).compose_parameter_list(TaskParameters.REMOTE_HOST_CONTROLLER_MODE,
                                                                                                  HostAlias.TEST)

        self.task_runner.fake_exit_code = 0
        self.task_runner.run_remote_deployment_task(BackupRSRDatabase, ConfigType.PRECONFIGURED, HostAlias.TEST)

        self.assertEqual(self._expected_fabric_call_with(BackupRSRDatabase, expected_parameter_list),
                         self.task_runner.executed_command_with_parameters)

    def _expected_fabric_call_with(self, task_class, expected_parameter_list):
        return ['fab', '-f', TaskRunner.FABFILE_PATH,
                self._expected_task_with_parameters(task_class, expected_parameter_list),
                '-H', self.deployment_host_config.ssh_connection,
                '-i', self.user_credentials.ssh_id_file_path,
                '-p', self.user_credentials.sudo_password]

    def _set_expected_host_config(self):
        self.mock_config_loader.host_config_for(ConfigType.PRECONFIGURED, HostAlias.TEST, None, None, None).AndReturn(self.deployment_host_config)
        self.mox.ReplayAll()

    def _expected_task_with_parameters(self, task_class, expected_parameter_list):
        return '%s:%s' % (self._fully_qualified_task_name(task_class), expected_parameter_list)

    def _fully_qualified_task_name(self, task_class):
        return '%s.%s' % (task_class.__module__, task_class.name)

    def test_will_raise_systemexit_if_task_execution_fails(self):
        """fab.tests.tasks.task_runner_test  Will raise a SystemExit exception if task execution fails"""

        self._set_expected_host_config()

        self.task_runner.fake_exit_code = 2

        with self.assertRaises(SystemExit) as raised:
            self.task_runner._run_task(BackupRSRDatabase, ConfigType.PRECONFIGURED, HostAlias.TEST, None, None, None, TaskParameters.NONE)

        self.assertTrue(raised.exception.message.find('Deployment failed due to errors above') > 0)


def suite():
    return TestSuiteLoader().load_tests_from(TaskRunnerTest)

if __name__ == '__main__':
    from fab.tests.test_settings import TEST_MODE
    TestRunner(TEST_MODE).run_test_suite(suite())
