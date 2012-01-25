# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


import fab.config.rsr.virtualenv
import fab.host.virtualenv
import fab.tasks.base


class RebuildRSREnv(fab.tasks.base.BaseDeploymentTask):
    """Rebuilds an RSR virtualenv with the specified pip requirements"""

    name = 'rebuild_rsr_env'

    def run(self, host_controller_mode, config_type, host_alias=None, repository_branch=None, database_name=None, custom_config_module_path=None):
        host_config = self.config_loader.host_config_for(config_type, host_alias, repository_branch, database_name, custom_config_module_path)
        virtualenv_installer_config = fab.config.rsr.virtualenv.RSRVirtualEnvInstallerConfig.create_with(host_config, self.deployment_user)
        virtualenv_deployment_host = self._configure_host_using(virtualenv_installer_config, host_controller_mode)

        virtualenv_deployment_host.ensure_user_has_required_deployment_permissions()
        virtualenv_deployment_host.ensure_virtualenv_exists()
        virtualenv_deployment_host.remove_previously_downloaded_package_sources()
        virtualenv_deployment_host.set_web_group_permissions_and_ownership_on_deployed_virtualenv()
        virtualenv_deployment_host.install_virtualenv_packages(virtualenv_installer_config.rsr_requirements_path)
        virtualenv_deployment_host.install_virtualenv_packages(virtualenv_installer_config.testing_requirements_path)
        virtualenv_deployment_host.set_web_group_permissions_and_ownership_on_deployed_virtualenv()
        virtualenv_deployment_host.ensure_virtualenv_symlinks_exist()

    def _configure_host_using(self, virtualenv_installer_config, host_controller_mode):
        host_controller = fab.host.controller.HostController.create_from(host_controller_mode)
        return fab.host.virtualenv.VirtualEnvDeploymentHost.create_with(virtualenv_installer_config, host_controller)


instance = RebuildRSREnv()
