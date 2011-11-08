# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


from fab.dependency.systempackages import SystemPackageDependencyCollection
from fab.environment.linux.packageverifier import LinuxPackageVerifier
from fab.environment.python.systempackageinstaller import SystemPythonPackageInstaller
from fab.host.controller import RemoteHostController
from fab.os.linux.packageinspector import UbuntuPackageInspector


class LinuxHost(object):

    def __init__(self, os_package_inspector, os_package_verifier, python_package_installer, feedback):
        self.os_package_inspector = os_package_inspector
        self.os_package_verifier = os_package_verifier
        self.python_package_installer = python_package_installer
        self.feedback = feedback

    @staticmethod
    def create_instance():
        host_controller = RemoteHostController.create_instance()

        return LinuxHost(UbuntuPackageInspector(host_controller),
                         LinuxPackageVerifier.create_instance(host_controller),
                         SystemPythonPackageInstaller.create_instance(host_controller),
                         host_controller.feedback)

    def update_system_package_sources(self):
        self.os_package_verifier.update_package_sources()

    def exit_if_system_package_dependencies_not_met(self, os_package_specifications):
        dependency_collection = SystemPackageDependencyCollection(os_package_specifications, self.os_package_inspector, self.feedback)

        self.os_package_verifier.exit_if_package_dependencies_not_met(dependency_collection)

    def update_system_python_packages(self):
        self.python_package_installer.install_package_tools()
        self.python_package_installer.install_system_packages()
