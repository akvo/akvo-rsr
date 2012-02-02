#!/usr/bin/env python

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


import fabric.api
import mox

from testing.helpers.execution import TestSuiteLoader, TestRunner

from fab.config.rsr.codebase import RSRCodebaseConfig
from fab.config.rsr.host import CIDeploymentHostConfig
from fab.environment.python.pipinstaller import PipInstaller
from fab.environment.python.packageinstallationpaths import SystemPackageInstallationPaths
from fab.environment.python.systempackageinstaller import SystemPythonPackageInstaller
from fab.helpers.feedback import ExecutionFeedback
from fab.helpers.internet import Internet
from fab.host.controller import RemoteHostController
from fab.os.filesystem import FileSystem
from fab.os.permissions import AkvoPermissions


class SystemPythonPackageInstallerTest(mox.MoxTestBase):

    def setUp(self):
        super(SystemPythonPackageInstallerTest, self).setUp()
        self.deployment_host_config = CIDeploymentHostConfig.for_test()
        self.codebase_config = RSRCodebaseConfig(self.deployment_host_config.repository_branch)
        self.installation_paths = SystemPackageInstallationPaths(self.deployment_host_config.host_paths)

        self.mock_pip_installer = self.mox.CreateMock(PipInstaller)
        self.mock_file_system = self.mox.CreateMock(FileSystem)
        self.mock_permissions = self.mox.CreateMock(AkvoPermissions)
        self.mock_internet = self.mox.CreateMock(Internet)
        self.mock_host_controller = self.mox.CreateMock(RemoteHostController)
        self.mock_feedback = self.mox.CreateMock(ExecutionFeedback)

        self.mock_host_controller.feedback = self.mock_feedback

        self.package_installer = SystemPythonPackageInstaller(self.deployment_host_config.host_paths, self.codebase_config,
                                                              self.installation_paths, self.mock_pip_installer,
                                                              self.mock_file_system, self.mock_permissions,
                                                              self.mock_internet, self.mock_host_controller)

    def test_can_create_systempythonpackageinstaller_instance(self):
        """fab.tests.environment.python.system_package_installer_test  Can create SystemPythonPackageInstaller instance"""

        self.mox.ReplayAll()

        package_installer = SystemPythonPackageInstaller.create_with(self.deployment_host_config, self.mock_host_controller)

        self.assertIsInstance(package_installer, SystemPythonPackageInstaller)
        self.assertIsInstance(package_installer.feedback, ExecutionFeedback)

    def test_can_install_package_tools(self):
        """fab.tests.environment.python.system_package_installer_test  Can install package tools"""

        self._clear_package_download_directory()
        self.mock_pip_installer.ensure_pip_is_installed()
        self.mox.ReplayAll()

        self.package_installer.install_package_tools()

    def _clear_package_download_directory(self):
        self.mock_file_system.delete_directory_with_sudo(self.installation_paths.package_download_dir)
        self._ensure_directory_exists_with_web_group_permissions(self.deployment_host_config.host_paths.deployment_processing_home)
        self._ensure_directory_exists_with_web_group_permissions(self.installation_paths.package_download_dir)

    def _ensure_directory_exists_with_web_group_permissions(self, dir_path):
        self.mock_file_system.ensure_directory_exists_with_sudo(dir_path)
        self.mock_permissions.set_web_group_permissions_on_directory(dir_path)

    def test_can_install_system_packages(self):
        """fab.tests.environment.python.system_package_installer_test  Can install system packages"""

        self._set_expectations_to_install_python_packages(quietly=False)

        self.package_installer.install_system_packages()

    def test_can_install_system_packages_quietly(self):
        """fab.tests.environment.python.system_package_installer_test  Can install system packages quietly"""

        self._set_expectations_to_install_python_packages(quietly=True)

        self.package_installer.install_system_packages_quietly()

    def _set_expectations_to_install_python_packages(self, quietly):
        self._set_expectations_to_list_installed_python_packages()
        self.mock_feedback.comment("Updating system Python packages:")
        self._set_expectations_to_install_packages_with_pip(self.codebase_config.system_requirements_file_url, quietly)
        self._set_expectations_to_list_installed_python_packages()
        self.mox.ReplayAll()

    def _set_expectations_to_list_installed_python_packages(self):
        self.mock_feedback.comment("Installed system packages:")
        self.mock_host_controller.run("pip freeze")

    def _set_expectations_to_install_packages_with_pip(self, requirements_file_url, quietly):
        package_download_dir = self.installation_paths.package_download_dir
        self.mock_internet.download_file_to_directory(package_download_dir, requirements_file_url)
        self.mock_host_controller.cd(package_download_dir).AndReturn(fabric.api.cd(package_download_dir))
        quiet_mode_switch = "-q " if quietly else ""
        self.mock_host_controller.sudo("pip install %s-M -r %s --log=pip_install.log" % (quiet_mode_switch,
                                                                                         self._file_from_url(requirements_file_url)))

    def _file_from_url(self, file_url):
        return file_url.split('/')[-1]


def suite():
    return TestSuiteLoader().load_tests_from(SystemPythonPackageInstallerTest)

if __name__ == "__main__":
    from fab.tests.test_settings import TEST_MODE
    TestRunner(TEST_MODE).run_test_suite(suite())
