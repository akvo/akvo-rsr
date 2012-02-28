#!/usr/bin/env python

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


import mox

from testing.helpers.execution import TestRunner, TestSuiteLoader

from fab.config.environment.linux.systempackages import SystemPackageSpecifications
from fab.config.rsr.host import CIDeploymentHostConfig
from fab.dependency.systempackages import SystemPackageDependencyCollection
from fab.environment.linux.packageverifier import LinuxPackageVerifier
from fab.environment.python.installer import PythonInstaller
from fab.environment.python.systempackageinstaller import SystemPythonPackageInstaller
from fab.helpers.feedback import ExecutionFeedback
from fab.host.linux import LinuxHost
from fab.os.linux.packageinspector import UbuntuPackageInspector
from fab.verifiers.user import DeploymentUserVerifier


class LinuxHostTest(mox.MoxTestBase):

    def setUp(self):
        super(LinuxHostTest, self).setUp()
        self.mock_user_verifier = self.mox.CreateMock(DeploymentUserVerifier)
        self.mock_python_installer = self.mox.CreateMock(PythonInstaller)
        self.mock_os_package_inspector = self.mox.CreateMock(UbuntuPackageInspector)
        self.mock_os_package_verifier = self.mox.CreateMock(LinuxPackageVerifier)
        self.mock_python_package_installer = self.mox.CreateMock(SystemPythonPackageInstaller)
        self.mock_feedback = self.mox.CreateMock(ExecutionFeedback)

        self.linux_host = LinuxHost(self.mock_user_verifier, self.mock_python_installer, self.mock_os_package_inspector,
                                    self.mock_os_package_verifier, self.mock_python_package_installer,
                                    self.mock_feedback)

    def test_can_create_a_linuxhost_instance(self):
        """fab.tests.host.linux_host_test  Can create a LinuxHost instance"""

        self.assertIsInstance(LinuxHost.create_with(CIDeploymentHostConfig.for_test()), LinuxHost)

    def test_can_ensure_user_has_required_deployment_permissions(self):
        """fab.tests.host.linux_host_test  Can ensure user has required deployment permissions"""

        self.mock_user_verifier.verify_sudo_permission_for("jane")
        self.mox.ReplayAll()

        self.linux_host.ensure_user_has_required_deployment_permissions("jane")

    def test_can_ensure_specified_python_version_is_installed(self):
        """fab.tests.host.linux_host_test  Can ensure specified Python version is installed"""

        self.mock_python_installer.ensure_python_is_installed_with_version("2.7.2")
        self.mox.ReplayAll()

        self.linux_host.ensure_python_is_installed_with_version("2.7.2")

    def test_can_update_system_package_sources(self):
        """fab.tests.host.linux_host_test  Can update system package sources"""

        self.mock_os_package_verifier.update_package_sources()
        self.mox.ReplayAll()

        self.linux_host.update_system_package_sources()

    def test_will_exit_if_system_package_dependencies_have_not_been_met(self):
        """fab.tests.host.linux_host_test  Will exit if system package dependencies have not been met"""

        self.mock_os_package_verifier.exit_if_package_dependencies_not_met(mox.IsA(SystemPackageDependencyCollection))
        self.mox.ReplayAll()

        self.linux_host.exit_if_system_package_dependencies_not_met(SystemPackageSpecifications.COMPILATION)

    def test_can_update_system_python_packages(self):
        """fab.tests.host.linux_host_test  Can update system Python packages"""

        self.mock_python_package_installer.install_package_tools()
        self.mock_python_package_installer.install_system_packages()
        self.mox.ReplayAll()

        self.linux_host.update_system_python_packages()


def suite():
    return TestSuiteLoader().load_tests_from(LinuxHostTest)

if __name__ == '__main__':
    TestRunner().run_test_suite(suite())
