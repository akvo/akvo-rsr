# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


import os, subprocess, sys

from fab.verifiers.config import ConfigFileVerifier


class TaskParameters(object):

    REMOTE_HOST_CONTROLLER_MODE = ':host_controller_mode=remote'
    NONE = ''


class TaskRunner(object):

    FABFILE_PATH = os.path.realpath(os.path.join(os.path.dirname(__file__), '../fabfile.py'))

    def __init__(self, user_credentials, deployment_host_config):
        self.ssh_id_file_path = user_credentials.ssh_id_file_path
        self.ssh_connection = deployment_host_config.ssh_connection

    @staticmethod
    def create(config_file_verifier=ConfigFileVerifier()):
        config_file_verifier.exit_if_config_loaders_not_found()

        from fab.config.loaders import DeploymentConfigLoader, UserCredentialsLoader
        return TaskRunner(UserCredentialsLoader.load(), DeploymentConfigLoader.load())

    def run_remote_deployment_task(self, fully_qualified_task):
        self._run_task(fully_qualified_task, TaskParameters.REMOTE_HOST_CONTROLLER_MODE)

    def run_deployment_task(self, fully_qualified_task):
        self._run_task(fully_qualified_task)

    def run_data_retrieval_task(self, fully_qualified_task):
        self._run_task(fully_qualified_task)

    def _run_task(self, fully_qualified_task_name, parameters=TaskParameters.NONE):
        exit_code = self._execute(['fab', '-f', self.FABFILE_PATH,
                                   fully_qualified_task_name + parameters,
                                   '-H', self.ssh_connection,
                                   '-i', self.ssh_id_file_path])

        if exit_code != 0:
            raise SystemExit('\n>> Deployment failed due to errors above.\n')

    def _execute(self, command_with_parameters):
        return subprocess.call(command_with_parameters)
