# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


import os

from fab.config.rsr.codebase import RSRCodebaseConfig
from fab.config.rsr.deployment import RSRDeploymentConfig
from fab.config.values import DeploymentHostConfigValues
from fab.format.timestamp import TimeStampFormatter


class RSRVirtualEnvInstallerConfig(object):

    def __init__(self, deployment_host_config_values, codebase_config, deployment_config, time_stamp_formatter):
        self.deployment_user = deployment_config.deployment_user

        self.virtualenvs_home   = deployment_host_config_values.virtualenvs_home
        self.rsr_env_name       = "rsr_%s" % codebase_config.repo_branch_without_type
        self.rsr_env_path       = os.path.join(self.virtualenvs_home, self.rsr_env_name)

        self.rsr_requirements_path      = os.path.join(deployment_config.rsr_deployment_home, codebase_config.rsr_requirements_file_path)
        self.testing_requirements_path  = os.path.join(deployment_config.rsr_deployment_home, codebase_config.testing_requirements_file_path)

        self.time_stamp_formatter = time_stamp_formatter

    @staticmethod
    def create_instance(deployment_user):
        deployment_host_config_values = DeploymentHostConfigValues()
        codebase_config = RSRCodebaseConfig.create_instance()
        deployment_config = RSRDeploymentConfig(deployment_user, deployment_host_config_values, codebase_config)

        return RSRVirtualEnvInstallerConfig(deployment_host_config_values, codebase_config, deployment_config, TimeStampFormatter())

    def time_stamped_pip_install_log_file_path(self):
        pip_log_file_name = "pip_install_%s_%s.log" % (self.rsr_env_name, self.time_stamp_formatter.file_timestamp())
        return os.path.join(self.virtualenvs_home, pip_log_file_name)
