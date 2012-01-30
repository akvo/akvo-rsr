# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


import fab.app.deployer
import fab.config.loader
import fab.config.rsr.deployment
import fab.host.controller
import fab.host.deployment
import fab.tasks.base


class DeployRSRApp(fab.tasks.base.BaseDeploymentTask):
    """Deploys RSR app to a specified location"""

    name = 'deploy_rsr_app'

    def run(self, host_controller_mode, host_config_specification):
        host_config = self.config_loader.parse(host_config_specification)
        app_deployer = self._configure_app_deployer_using(host_controller_mode, host_config)

        self.feedback.comment('Starting RSR app deployment')
        app_deployer.ensure_user_has_required_deployment_permissions()
        app_deployer.ensure_required_directories_exist()
        app_deployer.clean_deployment_directories()
        app_deployer.download_and_unpack_rsr_archive()
        app_deployer.ensure_app_symlinks_exist()

    def _configure_app_deployer_using(self, host_controller_mode, host_config):
        host_controller = fab.host.controller.HostController.create_from(host_controller_mode)
        deployment_host = fab.host.deployment.DeploymentHost.create_with(host_controller)
        deployment_config = fab.config.rsr.deployment.RSRDeploymentConfig.create_with(host_config, self.deployment_user)

        self.feedback = deployment_host.feedback
        return fab.app.deployer.RSRAppDeployer(deployment_config, deployment_host)


instance = DeployRSRApp()
