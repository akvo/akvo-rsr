#!/usr/bin/env python

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


import mox, os

from testing.helpers.execution import TestRunner, TestSuiteLoader

from fab.config.loader import DeploymentConfigLoader
from fab.config.rsr.credentials.user import UserCredentials
from fab.config.rsr.host import CIDeploymentHostConfig, DataHostConfig
from fab.config.spec import HostConfigSpecification
from fab.config.values.host import HostAlias
from fab.tasks.data.retrieval import FetchRSRData
from fab.tasks.database.backup import BackupRSRDatabase
from fab.tasks.environment.python.systempackages import UpdateSystemPythonPackages
from fab.tasks.runner import ProcessRunner, TaskParameters, TaskRunner
from fab.verifiers.config import ConfigFileVerifier


class TaskRunnerTest(mox.MoxTestBase):

    def setUp(self):
        super(TaskRunnerTest, self).setUp()
        self.mock_config_loader = self.mox.CreateMock(DeploymentConfigLoader)
        self.mock_process_runner = self.mox.CreateMock(ProcessRunner)

        self.user_credentials = UserCredentials.default()
        self.deployment_host_config = CIDeploymentHostConfig.for_test()

        self.task_runner = TaskRunner(self.user_credentials, self.mock_config_loader, self.mock_process_runner)

    def test_can_create_taskrunner_instance(self):
        """fab.tests.tasks.task_runner_test  Can create a TaskRunner instance"""

        mock_config_file_verifier = self.mox.CreateMock(ConfigFileVerifier)

        mock_config_file_verifier.exit_if_custom_user_credentials_not_found()
        mock_config_file_verifier.exit_if_database_credentials_not_found()
        self.mox.ReplayAll()

        self.assertIsInstance(TaskRunner.create(mock_config_file_verifier, self.mock_config_loader, self.mock_process_runner), TaskRunner)

    def test_has_expected_fabfile_path(self):
        """fab.tests.tasks.task_runner_test  Has expected fabfile.py path"""

        expected_fabfile_path = os.path.realpath(os.path.join(os.path.dirname(__file__), '../../fabfile.py'))

        self.assertEqual(expected_fabfile_path, TaskRunner.FABFILE_PATH)

    def test_can_run_deployment_task(self):
        """fab.tests.tasks.task_runner_test  Can run deployment task"""

        host_config_spec = HostConfigSpecification().create_preconfigured_with(HostAlias.TEST)
        expected_parameter_list = TaskParameters().compose_from(host_config_spec)

        self._load_host_config_from(host_config_spec)
        self.mock_process_runner.execute(self._expected_fabric_call_with(UpdateSystemPythonPackages,
                                                                         expected_parameter_list,
                                                                         self.deployment_host_config.ssh_connection))
        self.mox.ReplayAll()

        self.task_runner.run_deployment_task(UpdateSystemPythonPackages, host_config_spec)

    def test_can_run_remote_deployment_task(self):
        """fab.tests.tasks.task_runner_test  Can run remote deployment task"""

        host_config_spec = HostConfigSpecification().create_preconfigured_with(HostAlias.TEST)
        expected_parameter_list = TaskParameters().compose_from(host_config_spec, TaskParameters.REMOTE_HOST_CONTROLLER_MODE)

        self._load_host_config_from(host_config_spec)
        self.mock_process_runner.execute(self._expected_fabric_call_with(BackupRSRDatabase,
                                                                         expected_parameter_list,
                                                                         self.deployment_host_config.ssh_connection))
        self.mox.ReplayAll()

        self.task_runner.run_remote_deployment_task(BackupRSRDatabase, host_config_spec)

    def test_can_run_data_retrieval_task(self):
        """fab.tests.tasks.task_runner_test  Can run data retrieval task"""

        data_host_config_spec = HostConfigSpecification().create_preconfigured_with(HostAlias.DATA)
        data_host_config = DataHostConfig()

        self.mock_config_loader.parse(data_host_config_spec).AndReturn(data_host_config)
        self.mock_process_runner.execute(self._expected_fabric_call_with(FetchRSRData, None, data_host_config.ssh_connection))
        self.mox.ReplayAll()

        self.task_runner.run_data_retrieval_task(FetchRSRData, data_host_config_spec)

    def test_will_raise_systemexit_if_task_execution_fails(self):
        """fab.tests.tasks.task_runner_test  Will raise a SystemExit exception if task execution fails"""

        self._should_exit_when_deployment_fails_with(Exception('Some deployment problem'))

    def test_will_raise_systemexit_if_task_execution_fails_due_to_io_errors(self):
        """fab.tests.tasks.task_runner_test  Will raise a SystemExit exception if task execution fails due to an IOError"""

        self._should_exit_when_deployment_fails_with(IOError('Some IO problem'))

    def _should_exit_when_deployment_fails_with(self, deployment_failure):
        host_config_spec = HostConfigSpecification().create_preconfigured_with(HostAlias.TEST)

        self._load_host_config_from(host_config_spec)
        self.mock_process_runner.execute(mox.IgnoreArg()).AndRaise(deployment_failure)
        self.mox.ReplayAll()

        with self.assertRaises(SystemExit) as raised:
            self.task_runner.run_remote_deployment_task(BackupRSRDatabase, host_config_spec)

        self.assertIn('Deployment failed due to errors above', raised.exception.message)

    def _load_host_config_from(self, expected_host_config_spec):
        self.mock_config_loader.parse(expected_host_config_spec).AndReturn(self.deployment_host_config)

    def _expected_fabric_call_with(self, task_class, expected_parameter_list, expected_ssh_connection):
        return ['fab', '-f', TaskRunner.FABFILE_PATH,
                self._expected_task_with_parameters(task_class, expected_parameter_list),
                '-H', expected_ssh_connection,
                '-i', self.user_credentials.ssh_id_file_path,
                '-p', self.user_credentials.sudo_password]

    def _expected_task_with_parameters(self, task_class, expected_parameter_list):
        if expected_parameter_list:
            return '%s:%s' % (self._fully_qualified_task_name(task_class), expected_parameter_list)
        else:
            return self._fully_qualified_task_name(task_class)

    def _fully_qualified_task_name(self, task_class):
        return '%s.%s' % (task_class.__module__, task_class.name)


def suite():
    return TestSuiteLoader().load_tests_from(TaskRunnerTest)

if __name__ == '__main__':
    from fab.tests.test_settings import TEST_MODE
    TestRunner(TEST_MODE).run_test_suite(suite())
