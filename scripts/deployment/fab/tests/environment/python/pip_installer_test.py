#!/usr/bin/env python

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


import fabric.api
import mox, os

from testing.helpers.execution import TestSuiteLoader, TestRunner

from fab.config.values.standard import CIDeploymentHostConfig
from fab.environment.python.pipinstaller import PipInstaller
from fab.environment.python.packageinstallationpaths import SystemPackageInstallationPaths
from fab.helpers.feedback import ExecutionFeedback
from fab.helpers.internet import Internet
from fab.host.controller import RemoteHostController
from fab.os.filesystem import FileSystem


class PipInstallerTest(mox.MoxTestBase):

    def setUp(self):
        super(PipInstallerTest, self).setUp()
        self.deployment_host_config = CIDeploymentHostConfig.for_test()
        self.installation_paths = SystemPackageInstallationPaths(self.deployment_host_config.host_paths)

        self.mock_file_system = self.mox.CreateMock(FileSystem)
        self.mock_internet = self.mox.CreateMock(Internet)
        self.mock_host_controller = self.mox.CreateMock(RemoteHostController)
        self.mock_feedback = self.mox.CreateMock(ExecutionFeedback)

        self.mock_host_controller.feedback = self.mock_feedback

        self.pip_installer = PipInstaller(self.installation_paths, self.mock_file_system, self.mock_internet, self.mock_host_controller)

    def test_can_create_pipinstaller_instance(self):
        """fab.tests.environment.python.pip_installer_test  Can create PipInstaller instance"""

        self.mox.ReplayAll()

        pip_installer = PipInstaller.create_with(self.deployment_host_config, self.mock_host_controller)

        self.assertIsInstance(pip_installer, PipInstaller)
        self.assertIsInstance(pip_installer.feedback, ExecutionFeedback)

    def test_can_install_pip_if_not_already_installed(self):
        """fab.tests.environment.python.pip_installer_test  Can install pip if not already installed"""

        self._search_for_pip_path_and_raise(SystemExit('not found'))
        self._download_and_install_package("distribute", self.installation_paths.distribute_setup_url)
        self._download_and_install_package("pip", self.installation_paths.pip_setup_url)
        self.mox.ReplayAll()

        self.pip_installer.ensure_pip_is_installed()

    def test_can_upgrade_pip_if_pip_is_outdated(self):
        """fab.tests.environment.python.pip_installer_test  Can upgrade pip if pip is outdated"""

        self._search_for_pip_path_and_return("/some/path/to/pip")
        self._query_pip_version_and_return("pip 1.0.some.old.version from /some/path/to/pip")
        self._download_and_install_package("distribute", self.installation_paths.distribute_setup_url)
        self._download_and_install_package("pip", self.installation_paths.pip_setup_url)
        self.mox.ReplayAll()

        self.pip_installer.ensure_pip_is_installed()

    def test_will_acknowledge_up_to_date_pip_version(self):
        """fab.tests.environment.python.pip_installer_test  Will acknowledge up-to-date pip version"""

        up_to_date_pip_version = "pip %s from /some/path/to/pip" % SystemPackageInstallationPaths.PIP_VERSION

        self._search_for_pip_path_and_return("/some/path/to/pip")
        self._query_pip_version_and_return(up_to_date_pip_version)
        self._query_pip_version_and_return(up_to_date_pip_version)
        self.mock_feedback.comment("Found expected pip version: %s" % up_to_date_pip_version)
        self.mox.ReplayAll()

        self.pip_installer.ensure_pip_is_installed()

    def _search_for_pip_path_and_raise(self, expected_exception):
        self.mock_host_controller.hide_command_and_output().AndReturn(fabric.api.hide('running', 'stdout'))
        self.mock_host_controller.run("which pip").AndRaise(expected_exception)

    def _search_for_pip_path_and_return(self, expected_path):
        self._run_command_with_expected_response("which pip", expected_path)

    def _query_pip_version_and_return(self, expected_version):
        self._run_command_with_expected_response("pip --version", expected_version)

    def _run_command_with_expected_response(self, command, expected_response):
        self.mock_host_controller.hide_command_and_output().AndReturn(fabric.api.hide('running', 'stdout'))
        self.mock_host_controller.run(command).AndReturn(expected_response)

    def _download_and_install_package(self, package_name, setup_script_url):
        package_download_dir = self.installation_paths.package_download_dir
        self.mock_feedback.comment("Installing %s package from %s" % (package_name, setup_script_url))
        self.mock_internet.download_file_to_directory(package_download_dir, setup_script_url)
        self.mock_host_controller.cd(package_download_dir).AndReturn(fabric.api.cd(package_download_dir))
        self.mock_host_controller.sudo("python %s" % self._file_from_url(setup_script_url))

    def _file_from_url(self, file_url):
        return file_url.split('/')[-1]


def suite():
    return TestSuiteLoader().load_tests_from(PipInstallerTest)

if __name__ == "__main__":
    from fab.tests.test_settings import TEST_MODE
    TestRunner(TEST_MODE).run_test_suite(suite())
