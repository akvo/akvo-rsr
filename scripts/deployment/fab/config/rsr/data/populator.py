# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


import os

from fab.config.rsr.codebase import RSRCodebaseConfig
from fab.config.rsr.deployment import RSRDeploymentConfig
from fab.config.values import DeploymentHostConfigValues


class RSRDataPopulatorConfig(object):

    def __init__(self, deployment_config, deployment_host_config_values):
        self.data_archives_home = deployment_host_config_values.data_archives_home

        rsr_app_path = os.path.join(deployment_config.rsr_deployment_home, 'akvo')
        self.db_dump_script_path = os.path.join(rsr_app_path, 'db_dump.py')

    @staticmethod
    def create_instance():
        return RSRDataPopulatorConfig(RSRDeploymentConfig.create_instance(), DeploymentHostConfigValues())
