# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


from fab.dependency.systempackages import SystemPackageDependencyCollection
from fab.environment.linux.packageverifier import LinuxPackageVerifier
from fab.environment.python.installer import PythonInstaller
from fab.environment.python.systempackageinstaller import SystemPythonPackageInstaller
from fab.host.controller import RemoteHostController
from fab.os.linux.packageinspector import UbuntuPackageInspector
from fab.os.permissions import AkvoPermissions
from fab.verifiers.user import DeploymentUserVerifier


class LinuxHost(object):

    def __init__(self, deployment_user_verifier, python_installer, os_package_inspector, os_package_verifier, python_package_installer, feedback):
        self.user_verifier = deployment_user_verifier
        self.python_installer = python_installer
        self.os_package_inspector = os_package_inspector
        self.os_package_verifier = os_package_verifier
        self.python_package_installer = python_package_installer
        self.feedback = feedback

    @staticmethod
    def create():
        host_controller = RemoteHostController()

        return LinuxHost(DeploymentUserVerifier(AkvoPermissions(host_controller)),
                         PythonInstaller.create_instance(host_controller),
                         UbuntuPackageInspector(host_controller),
                         LinuxPackageVerifier.create_instance(host_controller),
                         SystemPythonPackageInstaller.create_instance(host_controller),
                         host_controller.feedback)

    def ensure_user_has_required_deployment_permissions(self, user_id):
        self.user_verifier.verify_sudo_permission_for(user_id)

    def ensure_python_is_installed_with_version(self, python_version):
        self.python_installer.ensure_python_is_installed_with_version(python_version)

    def update_system_package_sources(self):
        self.os_package_verifier.update_package_sources()

    def exit_if_system_package_dependencies_not_met(self, os_package_specifications):
        dependency_collection = SystemPackageDependencyCollection(os_package_specifications, self.os_package_inspector, self.feedback)

        self.os_package_verifier.exit_if_package_dependencies_not_met(dependency_collection)

    def update_system_python_packages(self):
        self.python_package_installer.install_package_tools()
        self.python_package_installer.install_system_packages()
