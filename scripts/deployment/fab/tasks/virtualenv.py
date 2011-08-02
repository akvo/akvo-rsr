# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


import os

import fabric.api
import fabric.tasks

import fab.config.deployer
import fab.helpers.hosts


class RebuildRSRVirtualEnv(fabric.tasks.Task):
    """Rebuilds an RSR virtualenv with the specified pip requirements"""

    name = "rebuild_rsr_virtualenv"

    RSR_REQUIREMENTS_FILE = "2_rsr.txt"

    def __init__(self, deployer_config, deployment_host):
        self.config = deployer_config
        self.deployment_host = deployment_host

    def run(self):
        self.deployment_host.create_empty_virtualenv(self.config.pip_install_log_file)
        rsr_requirements_path = os.path.join(self.config.pip_requirements_home, RebuildRSRVirtualEnv.RSR_REQUIREMENTS_FILE)
        self.deployment_host.install_virtualenv_packages(rsr_requirements_path, self.config.pip_install_log_file)


def create_task_instance():
    config = fab.config.deployer.DeployerConfig(fabric.api.env.hosts, fabric.api.env.user)
    deployment_host = fab.helpers.hosts.DeploymentHost.create_instance(config.rsr_env_path)

    return RebuildRSRVirtualEnv(config, deployment_host)


instance = create_task_instance()
