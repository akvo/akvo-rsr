# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


from fab.environment.python.virtualenv import VirtualEnvInstaller
from fab.helpers.internet import Internet
from fab.host.deployment import DeploymentHost
from fab.os.filesystem import FileSystem
from fab.os.permissions import AkvoPermissions
from fab.verifiers.user import DeploymentUserVerifier


class VirtualEnvDeploymentHost(DeploymentHost):
    """VirtualEnvDeploymentHost extends DeploymentHost and encapsulates virtualenv installation actions on a given host"""

    def __init__(self, virtualenv_installer_config, file_system, deployment_user_verifier, permissions, internet_helper, virtualenv_installer, feedback):
        super(VirtualEnvDeploymentHost, self).__init__(file_system, deployment_user_verifier, permissions, internet_helper, feedback)
        self.config = virtualenv_installer_config
        self.virtualenv_installer = virtualenv_installer

    @staticmethod
    def create_with(virtualenv_installer_config, host_controller):
        file_system = FileSystem(host_controller)
        permissions = AkvoPermissions(host_controller)

        return VirtualEnvDeploymentHost(virtualenv_installer_config,
                                        file_system,
                                        DeploymentUserVerifier(permissions),
                                        permissions,
                                        Internet(host_controller),
                                        VirtualEnvInstaller.create_with(virtualenv_installer_config, host_controller, file_system),
                                        host_controller.feedback)

    def ensure_user_has_required_deployment_permissions(self):
        self.user_verifier.verify_sudo_and_web_admin_permissions_for(self.config.deployment_user)

    def create_empty_virtualenv(self):
        self._ensure_virtualenvs_home_exists()
        self.virtualenv_installer.create_empty_virtualenv()

    def ensure_virtualenv_exists(self):
        self._ensure_virtualenvs_home_exists()
        self.virtualenv_installer.ensure_virtualenv_exists()

    def _ensure_virtualenvs_home_exists(self):
        self.ensure_directory_exists_with_web_group_permissions(self.config.virtualenvs_home)

    def remove_previously_downloaded_package_sources(self):
        self.virtualenv_installer.remove_previously_downloaded_package_sources()

    def install_virtualenv_packages(self, pip_requirements_url):
        self.virtualenv_installer.install_packages(pip_requirements_url)

    def ensure_virtualenv_symlinks_exist(self):
        self.virtualenv_installer.ensure_virtualenv_symlinks_exist()

    def set_web_group_permissions_and_ownership_on_deployed_virtualenv(self):
        self.feedback.comment("Setting web group permissions and ownership on %s" % self.config.rsr_env_path)
        self.permissions.set_web_group_permissions_on_directory(self.config.rsr_env_path)
