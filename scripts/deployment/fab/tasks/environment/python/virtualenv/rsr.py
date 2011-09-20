# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


import os

import fabric.api
import fabric.tasks

import fab.config.deployer
import fab.host.deployment


class RebuildRSREnv(fabric.tasks.Task):
    """Rebuilds an RSR virtualenv with the specified pip requirements"""

    name = "rebuild_rsr_env"

    RSR_REQUIREMENTS_FILE = "2_rsr.txt"

    def __init__(self, deployment_config):
        self.config = deployment_config

    @staticmethod
    def create_task_instance():
        return RebuildRSREnv(fab.config.deployer.DeployerConfig(fabric.api.env.hosts, fabric.api.env.user))

    def configure_deployment_host_using(self, host_controller_mode):
        host_controller = fab.host.controller.HostController.create_from(host_controller_mode)
        self.deployment_host = fab.host.deployment.DeploymentHost.create_instance(self.config.rsr_env_path, host_controller)

    def run(self, host_controller_mode):
        self.configure_deployment_host_using(host_controller_mode)

        rsr_requirements_path = os.path.join(self.config.pip_requirements_home, self.RSR_REQUIREMENTS_FILE)

        self.deployment_host.ensure_virtualenv_exists(self.config.pip_install_log_file)
        self.deployment_host.install_virtualenv_packages(rsr_requirements_path, self.config.pip_install_log_file)


instance = RebuildRSREnv.create_task_instance()
