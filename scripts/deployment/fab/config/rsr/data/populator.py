# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


import os

from fab.config.rsr.codebase import RSRCodebaseConfig
from fab.config.rsr.deployment import RSRDeploymentConfig
from fab.config.values import DeploymentHostConfigValues


class RSRDataPopulatorConfig(object):

    def __init__(self, deployment_config, deployment_host_config_values, codebase_config):
        self.data_archives_home     = deployment_host_config_values.data_archives_home
        self.rsr_deployment_home    = deployment_config.rsr_deployment_home

        rsr_env_name        = "rsr_%s" % codebase_config.repo_branch_without_type
        self.rsr_env_path   = os.path.join(deployment_host_config_values.virtualenvs_home, rsr_env_name)

    @staticmethod
    def create_instance():
        return RSRDataPopulatorConfig(RSRDeploymentConfig.create_instance(), DeploymentHostConfigValues(),
                                      RSRCodebaseConfig.create_instance())
