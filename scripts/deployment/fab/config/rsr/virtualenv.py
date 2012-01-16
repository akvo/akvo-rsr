# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


import os

from fab.config.rsr.codebase import RSRCodebaseConfig
from fab.config.rsr.deployment import RSRDeploymentConfig


class RSRVirtualEnvInstallerConfig(object):

    def __init__(self, deployment_host_paths, codebase_config, deployment_config):
        self.deployment_user = deployment_config.deployment_user

        self.virtualenvs_home   = deployment_host_paths.virtualenvs_home
        self.rsr_env_name       = "rsr_%s" % codebase_config.repo_branch_without_type
        self.rsr_env_path       = os.path.join(self.virtualenvs_home, self.rsr_env_name)

        self.rsr_requirements_path      = os.path.join(deployment_config.rsr_deployment_home, codebase_config.rsr_requirements_file_path)
        self.testing_requirements_path  = os.path.join(deployment_config.rsr_deployment_home, codebase_config.testing_requirements_file_path)

    @staticmethod
    def create_with(deployment_host_config, deployment_user):
        codebase_config = RSRCodebaseConfig(deployment_host_config.repository_branch)
        deployment_config = RSRDeploymentConfig(deployment_host_config.host_paths, deployment_user, codebase_config)

        return RSRVirtualEnvInstallerConfig(deployment_host_config.host_paths, codebase_config, deployment_config)
