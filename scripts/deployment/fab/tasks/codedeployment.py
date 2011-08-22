# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


import fabric.api
import fabric.tasks

import fab.config.deployer
import fab.helpers.codebase
import fab.host.controller
import fab.host.deployment


class DeployRSRCode(fabric.tasks.Task):
    """Deploys RSR codebase to a specified location"""

    name = "deploy_rsr_code"

    def __init__(self, deployment_config):
        self.config = deployment_config

    @staticmethod
    def create_task_instance():
        return DeployRSRCode(fab.config.deployer.DeployerConfig(fabric.api.env.hosts, fabric.api.env.user))

    def initialise_codebase_using(self, host_controller_mode):
        host_controller = fab.host.controller.HostController.create_from(host_controller_mode)
        deployment_host = fab.host.deployment.DeploymentHost.create_instance(self.config.rsr_env_path, host_controller)

        self.codebase = fab.helpers.codebase.Codebase(self.config, deployment_host)
        self.feedback = deployment_host.feedback

    def run(self, host_controller_mode):
        self.initialise_codebase_using(host_controller_mode)

        self.feedback.comment("Starting RSR codebase deployment")
        self.codebase.ensure_required_directories_exist()
        self.codebase.clean_deployment_directories()
        self.codebase.download_and_unpack_rsr_archive()


instance = DeployRSRCode.create_task_instance()
