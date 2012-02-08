# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


import imp, os

from fab.app.admin import DjangoAdmin
from fab.config.rsr.deployment import RSRDeploymentConfig
from fab.environment.python.virtualenv import VirtualEnv
from fab.os.filesystem import FileSystem, LocalFileSystem


class ConfigFileVerifier(object):

    DEPLOYMENT_SCRIPTS_HOME = os.path.realpath(os.path.join(os.path.dirname(__file__), '../..'))

    def __init__(self, local_file_system=LocalFileSystem()):
        self.local_file_system = local_file_system

    def exit_if_custom_user_credentials_not_found(self):
        self._exit_if_file_is_missing('fab/config/rsr/credentials/custom.py')

    def exit_if_database_credentials_not_found(self):
        self._exit_if_file_is_missing('fab/config/rsr/credentials/database.py')

    def _exit_if_file_is_missing(self, relative_deployment_file_path):
        self.local_file_system.exit_if_file_does_not_exist(os.path.join(self.DEPLOYMENT_SCRIPTS_HOME, relative_deployment_file_path))


class RSRSettingsVerifier(object):

    def __init__(self, deployment_host_config, deployment_config, django_admin, host_file_system, feedback):
        self.deployment_database_name = deployment_host_config.rsr_database_name
        self.deployment_config = deployment_config
        self.django_admin = django_admin
        self.host_file_system = host_file_system
        self.feedback = feedback

    @staticmethod
    def create_with(deployment_host_config, host_controller):
        deployment_config = RSRDeploymentConfig.create_with(deployment_host_config)

        return RSRSettingsVerifier(deployment_host_config,
                                   deployment_config,
                                   DjangoAdmin(VirtualEnv(deployment_config.current_virtualenv_path, host_controller)),
                                   FileSystem(host_controller),
                                   host_controller.feedback)

    def exit_if_local_rsr_settings_not_deployed(self):
        self.host_file_system.exit_if_directory_does_not_exist(self.deployment_config.host_config_home)
        self.host_file_system.exit_if_file_does_not_exist(self.deployment_config.deployed_rsr_settings_file)

    def exit_if_settings_have_mismatched_database_name(self):
        rsr_database_name_from_settings = self.django_admin.read_setting('DATABASES')['default']['NAME']

        if rsr_database_name_from_settings == self.deployment_database_name:
            self.feedback.comment('Deployment database name matches expected RSR database name in settings: %s' % self.deployment_database_name)
        else:
            self.feedback.abort('Cannot deploy to database [%s] when deployed RSR settings use [%s]' % (self.deployment_database_name,
                                                                                                        rsr_database_name_from_settings))
