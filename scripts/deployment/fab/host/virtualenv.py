# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


from fab.environment.python.virtualenv import VirtualEnvInstaller
from fab.helpers.internet import Internet
from fab.helpers.permissions import AkvoPermissions
from fab.host.deployment import DeploymentHost
from fab.os.filesystem import FileSystem


class VirtualEnvDeploymentHost(DeploymentHost):
    """VirtualEnvDeploymentHost extends DeploymentHost and encapsulates virtualenv installation actions on a given host"""

    def __init__(self, virtualenvs_home, file_system, permissions, internet_helper, virtualenv_installer, feedback):
        super(VirtualEnvDeploymentHost, self).__init__(file_system, permissions, internet_helper, feedback)
        self.virtualenvs_home = virtualenvs_home
        self.virtualenv_installer = virtualenv_installer

    @staticmethod
    def create_instance(virtualenv_installer_config, host_controller):
        file_system = FileSystem(host_controller)

        return VirtualEnvDeploymentHost(virtualenv_installer_config.virtualenvs_home,
                                        file_system,
                                        AkvoPermissions(host_controller),
                                        Internet(host_controller),
                                        VirtualEnvInstaller.create_instance(virtualenv_installer_config, host_controller, file_system),
                                        host_controller.feedback)

    def create_empty_virtualenv(self):
        self._ensure_virtualenvs_home_exists()
        self.virtualenv_installer.create_empty_virtualenv()

    def ensure_virtualenv_exists(self):
        self._ensure_virtualenvs_home_exists()
        self.virtualenv_installer.ensure_virtualenv_exists()

    def _ensure_virtualenvs_home_exists(self):
        self.ensure_directory_exists_with_web_group_permissions(self.virtualenvs_home)

    def install_virtualenv_packages(self, pip_requirements_file):
        self.virtualenv_installer.install_packages(pip_requirements_file)
