# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


import os, subprocess, sys

from fab.verifiers.config import ConfigFileVerifier


class TaskParameters(object):

    REMOTE_HOST_CONTROLLER_MODE = 'host_controller_mode=remote'
    NONE = ''


class TaskRunner(object):

    FABFILE_PATH = os.path.realpath(os.path.join(os.path.dirname(__file__), '../fabfile.py'))

    def __init__(self, user_credentials, deployment_host_config):
        self.ssh_id_file_path = user_credentials.ssh_id_file_path
        self.sudo_password = user_credentials.sudo_password
        self.ssh_connection = deployment_host_config.ssh_connection

    @staticmethod
    def create(config_file_verifier=ConfigFileVerifier()):
        config_file_verifier.exit_if_config_loaders_not_found()
        config_file_verifier.exit_if_database_credentials_not_found()

        from fab.config.loaders import DeploymentConfigLoader, UserCredentialsLoader
        return TaskRunner(UserCredentialsLoader.load(), DeploymentConfigLoader.load())

    def run_remote_deployment_task(self, task_class):
        self._run_task(task_class, TaskParameters.REMOTE_HOST_CONTROLLER_MODE)

    def run_deployment_task(self, task_class):
        self._run_task(task_class)

    def run_data_retrieval_task(self, task_class):
        self._run_task(task_class)

    def _run_task(self, task_class, task_parameters=TaskParameters.NONE):
        exit_code = self._execute(['fab', '-f', self.FABFILE_PATH,
                                   self._task_with_parameters(task_class, task_parameters),
                                   '-H', self.ssh_connection,
                                   '-i', self.ssh_id_file_path,
                                   '-p', self.sudo_password])

        if exit_code != 0:
            raise SystemExit('\n>> Deployment failed due to errors above.\n')

    def _task_with_parameters(self, task_class, task_parameters):
        task_name = self._fully_qualified_task_name(task_class)

        if task_parameters == TaskParameters.NONE:
            return task_name
        else:
            return '%s:%s' % (task_name, task_parameters)

    def _fully_qualified_task_name(self, task_class):
        return '%s.%s' % (task_class.__module__, task_class.name)

    def _execute(self, command_with_parameters):
        return subprocess.call(command_with_parameters)
