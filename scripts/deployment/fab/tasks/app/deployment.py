# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


import fabric.api
import fabric.tasks

import fab.app.deployer
import fab.config.rsr.deployment
import fab.host.controller
import fab.host.deployment


class DeployRSRApp(fabric.tasks.Task):
    """Deploys RSR app to a specified location"""

    name = "deploy_rsr_app"

    def __init__(self, deployment_config):
        self.deployment_config = deployment_config

    @staticmethod
    def create_task_instance(deployment_user):
        return DeployRSRApp(fab.config.rsr.deployment.RSRDeploymentConfig.create_instance(deployment_user))

    def run(self, host_controller_mode):
        self._initialise_app_deployer_using(host_controller_mode)

        self.feedback.comment("Starting RSR app deployment")
        self.app_deployer.ensure_user_has_required_deployment_permissions()
        self.app_deployer.ensure_required_directories_exist()
        self.app_deployer.clean_deployment_directories()
        self.app_deployer.download_and_unpack_rsr_archive()
        self.app_deployer.ensure_app_symlinks_exist()

    def _initialise_app_deployer_using(self, host_controller_mode):
        host_controller = fab.host.controller.HostController.create_from(host_controller_mode)
        deployment_host = fab.host.deployment.DeploymentHost.create_instance(host_controller)

        self.app_deployer = fab.app.deployer.RSRAppDeployer(self.deployment_config, deployment_host)
        self.feedback = deployment_host.feedback


instance = DeployRSRApp.create_task_instance(fabric.api.env.user)
