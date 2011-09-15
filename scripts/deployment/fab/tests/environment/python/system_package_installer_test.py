#!/usr/bin/env python

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


import fabric.api
import mox

from testing.helpers.execution import TestSuiteLoader, TestRunner

from fab.environment.python.systempackageinstaller import PackageInstallationPaths, SystemPythonPackageInstaller
from fab.helpers.feedback import ExecutionFeedback
from fab.helpers.filesystem import FileSystem
from fab.helpers.internet import Internet
from fab.host.controller import RemoteHostController


class SystemPythonPackageInstallerTest(mox.MoxTestBase):

    def setUp(self):
        super(SystemPythonPackageInstallerTest, self).setUp()
        self.mock_installation_paths = self.mox.CreateMock(PackageInstallationPaths)
        self.mock_file_system = self.mox.CreateMock(FileSystem)
        self.mock_internet = self.mox.CreateMock(Internet)
        self.mock_host_controller = self.mox.CreateMock(RemoteHostController)
        self.mock_feedback = self.mox.CreateMock(ExecutionFeedback)

        self.package_download_dir = "/var/tmp/package/downloads"
        self.mock_installation_paths.package_download_dir = self.package_download_dir
        self.mock_host_controller.feedback = self.mock_feedback

        self.package_installer = SystemPythonPackageInstaller(self.mock_installation_paths, self.mock_file_system,
                                                              self.mock_internet, self.mock_host_controller)

    def test_can_create_systempythonpackageinstaller_instance(self):
        """fab.tests.environment.python.system_package_installer_test  Can create SystemPythonPackageInstaller instance"""

        self.mox.ReplayAll()

        package_installer = SystemPythonPackageInstaller.create_instance(self.mock_host_controller)

        self.assertIsInstance(package_installer, SystemPythonPackageInstaller)
        self.assertIsInstance(package_installer.feedback, ExecutionFeedback)

    def test_can_install_package_tools(self):
        """fab.tests.environment.python.system_package_installer_test  Can install package tools"""

        distribute_setup_url = "http://some.server/distribute_setup_url"
        pip_setup_url = "http://another.server/pip_setup_url"
        self.mock_installation_paths.distribute_setup_url = distribute_setup_url
        self.mock_installation_paths.pip_setup_url = pip_setup_url

        self.mock_file_system.delete_directory_with_sudo(self.package_download_dir)
        self.mock_file_system.ensure_directory_exists(self.package_download_dir)
        self._set_expectations_to_download_and_install_package("distribute", distribute_setup_url)
        self._set_expectations_to_download_and_install_package("pip", pip_setup_url)
        self.mox.ReplayAll()

        self.package_installer.install_package_tools()

    def _set_expectations_to_download_and_install_package(self, package_name, setup_script_url):
        self.mock_feedback.comment("Installing %s package from %s" % (package_name, setup_script_url))
        self.mock_internet.download_file_to_directory(self.package_download_dir, setup_script_url)
        self.mock_host_controller.cd(self.package_download_dir).AndReturn(fabric.api.cd(self.package_download_dir))
        self.mock_host_controller.sudo("python %s" % self._file_from_url(setup_script_url))

    def test_can_install_system_packages(self):
        """fab.tests.environment.python.system_package_installer_test  Can install system packages"""

        system_requirements_file_url = "http://repo.server/system_requirements.txt"
        self.mock_installation_paths.system_requirements_file_url = system_requirements_file_url

        self._set_expectations_to_list_installed_python_packages()
        self.mock_feedback.comment("Updating system Python packages:")
        self._set_expectations_to_install_packages_with_pip(system_requirements_file_url)
        self._set_expectations_to_list_installed_python_packages()
        self.mox.ReplayAll()

        self.package_installer.install_system_packages()

    def _set_expectations_to_list_installed_python_packages(self):
        self.mock_feedback.comment("Installed system packages:")
        self.mock_host_controller.run("pip freeze")

    def _set_expectations_to_install_packages_with_pip(self, requirements_file_url):
        self.mock_internet.download_file_to_directory(self.package_download_dir, requirements_file_url)
        self.mock_host_controller.cd(self.package_download_dir).AndReturn(fabric.api.cd(self.package_download_dir))
        self.mock_host_controller.run("pip install -M -r %s --log=pip_install.log" % self._file_from_url(requirements_file_url))

    def _file_from_url(self, file_url):
        return file_url.split('/')[-1]


def suite():
    return TestSuiteLoader().load_tests_from(SystemPythonPackageInstallerTest)

if __name__ == "__main__":
    from fab.tests.test_settings import TEST_MODE
    TestRunner(TEST_MODE).run_test_suite(suite())
