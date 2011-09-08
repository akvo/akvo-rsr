# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


from fab.dependency.systempackages import SystemPackageDependencyCollection
from fab.dependency.verifier.packageverifier import SystemPackageVerifier
from fab.host.controller import RemoteHostController
from fab.os.linux.packageinspector import UbuntuPackageInspector


class LinuxHost(object):

    def __init__(self, package_inspector, system_package_verifier, feedback):
        self.package_inspector = package_inspector
        self.system_package_verifier = system_package_verifier
        self.feedback = feedback

    @staticmethod
    def create_instance():
        host_controller = RemoteHostController.create_instance()
        system_package_verifier = SystemPackageVerifier.create_instance(host_controller.feedback)

        return LinuxHost(UbuntuPackageInspector(host_controller), system_package_verifier, host_controller.feedback)

    def exit_if_system_package_dependencies_not_met(self, package_specifications):
        dependency_collection = SystemPackageDependencyCollection(package_specifications, self.package_inspector, self.feedback)

        self.system_package_verifier.exit_if_package_dependencies_not_met(dependency_collection)
