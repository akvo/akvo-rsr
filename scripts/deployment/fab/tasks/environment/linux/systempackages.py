# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


import fabric.api
import fabric.tasks

import fab.config.environment.linux.systempackages
import fab.config.loader
import fab.host.linux


class VerifySystemPackages(fabric.tasks.Task):
    """Verifies that the expected Linux system packages exist"""

    name = "verify_system_packages"

    def __init__(self, deployment_user):
        self.deployment_user = deployment_user
        self.config_loader = fab.config.loader.DeploymentConfigLoader()

    def run(self, config_type, host_alias=None, repository_branch=None, database_name=None, custom_config_module_path=None):
        host_config = self.config_loader.host_config_for(config_type, host_alias, repository_branch, database_name, custom_config_module_path)
        linux_host = self._configure_linux_host_with(host_config)

        linux_host.ensure_user_has_required_deployment_permissions(self.deployment_user)
        linux_host.update_system_package_sources()

        for package_specifications in fab.config.environment.linux.systempackages.SystemPackageSpecifications.ALL_PACKAGES:
            linux_host.exit_if_system_package_dependencies_not_met(package_specifications)

    def _configure_linux_host_with(self, host_config):
        return fab.host.linux.LinuxHost.create_with(host_config)


instance = VerifySystemPackages(fabric.api.env.user)
