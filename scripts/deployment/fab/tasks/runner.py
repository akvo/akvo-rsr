# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


import os, subprocess, sys

from fab.config.loader import ConfigType, DeploymentConfigLoader
from fab.tasks.parameters import TaskParameters
from fab.verifiers.config import ConfigFileVerifier


class TaskRunner(object):

    FABFILE_PATH = os.path.realpath(os.path.join(os.path.dirname(__file__), '../fabfile.py'))

    def __init__(self, user_credentials, config_loader):
        self.user_credentials = user_credentials
        self.config_loader = config_loader

    @staticmethod
    def create(config_file_verifier=ConfigFileVerifier(), config_loader=DeploymentConfigLoader()):
        config_file_verifier.exit_if_custom_user_credentials_not_found()
        config_file_verifier.exit_if_database_credentials_not_found()

        from fab.config.rsr.credentials.custom import CustomUserCredentials

        return TaskRunner(CustomUserCredentials.create(), config_loader)

    def run_remote_deployment_task(self, task_class,
                                         config_type,
                                         host_alias=None,
                                         repository_branch=None,
                                         database_name=None,
                                         custom_config_module_path=None):
        self._run_task(task_class,
                       config_type,
                       host_alias,
                       repository_branch,
                       database_name,
                       custom_config_module_path,
                       TaskParameters.REMOTE_HOST_CONTROLLER_MODE)

    def run_deployment_task(self, task_class,
                                  config_type,
                                  host_alias=None,
                                  repository_branch=None,
                                  database_name=None,
                                  custom_config_module_path=None):
        self._run_task(task_class,
                       config_type,
                       host_alias,
                       repository_branch,
                       database_name,
                       custom_config_module_path,
                       TaskParameters.NONE)

    def run_data_retrieval_task(self, task_class):
        self._run_task(task_class)

    def _run_task(self, task_class,
                        config_type,
                        host_alias,
                        repository_branch,
                        database_name,
                        custom_config_module_path,
                        additional_task_parameters):
        host_config = self.config_loader.host_config_for(config_type, host_alias, repository_branch, database_name, custom_config_module_path)
        task_parameters = TaskParameters(config_type).compose_parameter_list(additional_task_parameters, host_alias, repository_branch,
                                                                             database_name, custom_config_module_path)

        exit_code = self._execute(['fab', '-f', self.FABFILE_PATH,
                                   self._task_with_parameters(task_class, task_parameters),
                                   '-H', host_config.ssh_connection,
                                   '-i', self.user_credentials.ssh_id_file_path,
                                   '-p', self.user_credentials.sudo_password])

        if exit_code != 0:
            raise SystemExit('\n>> Deployment failed due to errors above.\n')

    def _task_with_parameters(self, task_class, task_parameters):
        return '%s:%s' % (self._fully_qualified_task_name(task_class), task_parameters)

    def _fully_qualified_task_name(self, task_class):
        return '%s.%s' % (task_class.__module__, task_class.name)

    def _execute(self, command_with_parameters):
        return subprocess.call(command_with_parameters)
