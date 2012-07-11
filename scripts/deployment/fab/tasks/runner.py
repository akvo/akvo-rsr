# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


import os, subprocess, sys

from fab.config.loader import ConfigType, DeploymentConfigLoader
from fab.config.values.host import SSHConnection
from fab.tasks.parameters import TaskParameters
from fab.verifiers.config import ConfigFileVerifier


class ProcessRunner(object):

    def execute(self, command_with_parameters):
        try:
            return subprocess.check_call(command_with_parameters)
        except subprocess.CalledProcessError as processError:
            self._exit_if_command_fails(processError.returncode)
        except Exception as raised:
            if hasattr(raised, 'errno'):
                self._exit_if_command_fails(raised.errno)

    def _exit_if_command_fails(self, command_return_code):
        if command_return_code != os.EX_OK:
            raise SystemExit(command_return_code)


class TaskRunner(object):

    FABFILE_PATH = os.path.realpath(os.path.join(os.path.dirname(__file__), '../fabfile.py'))

    def __init__(self, user_credentials, config_loader, process_runner):
        self.user_credentials = user_credentials
        self.config_loader = config_loader
        self.process_runner = process_runner

    @staticmethod
    def create(config_file_verifier=ConfigFileVerifier(), config_loader=DeploymentConfigLoader(), process_runner=ProcessRunner()):
        config_file_verifier.exit_if_custom_user_credentials_not_found()

        from fab.config.rsr.credentials.custom import CustomUserCredentials

        return TaskRunner(CustomUserCredentials.create(), config_loader, process_runner)

    def run_deployment_task(self, task_class, host_config_specification, additional_task_parameters=[]):
        task_parameters = TaskParameters().compose_from(host_config_specification, additional_task_parameters)
        self._run_task(task_class, task_parameters, self.config_loader.parse(host_config_specification).ssh_connection)

    def run_remote_deployment_task(self, task_class, host_config_specification, additional_task_parameters=[]):
        additional_parameters = [TaskParameters.REMOTE_HOST_CONTROLLER_MODE]
        additional_parameters.extend(additional_task_parameters)

        self.run_deployment_task(task_class, host_config_specification, additional_parameters)

    def run_data_retrieval_task(self, task_class, host_alias):
        self._run_task(task_class, None, SSHConnection.for_host(host_alias))

    def _run_task(self, task_class, task_parameters, ssh_connection):
        self._run_fabric_script(self._task_with_parameters(task_class, task_parameters), ssh_connection)

    def _run_fabric_script(self, task_with_parameters, ssh_connection):
        self.process_runner.execute(['fab', '-f', self.FABFILE_PATH,
                                     task_with_parameters,
                                     '-H', ssh_connection,
                                     '-i', self.user_credentials.ssh_id_file_path,
                                     '-u', self.user_credentials.deployment_user,
                                     '-p', self.user_credentials.sudo_password])

    def _task_with_parameters(self, task_class, task_parameters):
        if task_parameters:
            return '%s:%s' % (self._fully_qualified_task_name(task_class), task_parameters)
        else:
            return self._fully_qualified_task_name(task_class)

    def _fully_qualified_task_name(self, task_class):
        return '%s.%s' % (task_class.__module__, task_class.name)
