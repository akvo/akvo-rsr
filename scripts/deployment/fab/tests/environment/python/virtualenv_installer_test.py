#!/usr/bin/env python

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


import fabric.api
import mox, os

from testing.helpers.execution import TestSuiteLoader, TestRunner

from fab.config.rsr.host import CIDeploymentHostConfig
from fab.config.rsr.virtualenv import RSRVirtualEnvInstallerConfig
from fab.environment.python.virtualenv import VirtualEnv, VirtualEnvInstaller
from fab.format.timestamp import TimeStampFormatter
from fab.helpers.feedback import ExecutionFeedback
from fab.host.controller import LocalHostController, RemoteHostController
from fab.os.filesystem import FileSystem


class VirtualEnvInstallerTest(mox.MoxTestBase):

    def setUp(self):
        super(VirtualEnvInstallerTest, self).setUp()
        self.mock_host_controller = self.mox.CreateMock(RemoteHostController)
        self.mock_file_system = self.mox.CreateMock(FileSystem)
        self.mock_virtualenv = self.mox.CreateMock(VirtualEnv)
        self.mock_feedback = self.mox.CreateMock(ExecutionFeedback)
        self.mock_time_stamp_formatter = self.mox.CreateMock(TimeStampFormatter)

        self.virtualenv_installer_config = RSRVirtualEnvInstallerConfig.create_with(CIDeploymentHostConfig.for_test(), "deployment_user")

        self.pip_requirements_file = "/some/path/to/pip_requirements.txt"

        self.mock_host_controller.feedback = self.mock_feedback

        self.virtualenv_installer = VirtualEnvInstaller(self.virtualenv_installer_config, self.mock_host_controller,
                                                        self.mock_file_system, self.mock_virtualenv, self.mock_time_stamp_formatter)

    def test_can_create_instance_for_local_host(self):
        """fab.tests.environment.python.virtualenv_installer_test  Can create VirtualEnvInstaller instance for a local host"""

        self._verify_virtualenv_installer_instance_with(LocalHostController)

    def test_can_create_instance_for_remote_host(self):
        """fab.tests.environment.python.virtualenv_installer_test  Can create VirtualEnvInstaller instance for a remote host"""

        self._verify_virtualenv_installer_instance_with(RemoteHostController)

    def _verify_virtualenv_installer_instance_with(self, host_controller_class):
        mock_host_controller = self.mox.CreateMock(host_controller_class)
        mock_host_controller.feedback = self.mock_feedback
        self.mox.ReplayAll()

        virtualenv_installer_instance = VirtualEnvInstaller.create_with(self.virtualenv_installer_config,
                                                                        mock_host_controller,
                                                                        self.mock_file_system)

        self.assertIsInstance(virtualenv_installer_instance, VirtualEnvInstaller)

    def test_can_check_for_virtualenv_existence(self):
        """fab.tests.environment.python.virtualenv_installer_test  Can check for virtualenv existence"""

        self.mock_file_system.directory_exists(self.virtualenv_installer_config.rsr_env_path).AndReturn(True)
        self.mox.ReplayAll()

        self.assertTrue(self.virtualenv_installer.virtualenv_exists(), "Virtualenv should exist")

    def test_can_delete_existing_virtualenv(self):
        """fab.tests.environment.python.virtualenv_installer_test  Can delete existing virtualenv"""

        self.mock_file_system.directory_exists(self.virtualenv_installer_config.rsr_env_path).AndReturn(True)
        self._set_expectations_to_delete_virtualenv()
        self.mox.ReplayAll()

        self.virtualenv_installer.delete_existing_virtualenv()

    def test_does_nothing_when_attempting_to_delete_nonexistent_virtualenv(self):
        """fab.tests.environment.python.virtualenv_installer_test  Does nothing when attempting to delete a nonexistent virtualenv"""

        self.mock_file_system.directory_exists(self.virtualenv_installer_config.rsr_env_path).AndReturn(False)
        self.mox.ReplayAll()

        self.virtualenv_installer.delete_existing_virtualenv()

    def test_can_create_empty_virtualenv(self):
        """fab.tests.environment.python.virtualenv_installer_test  Can create empty virtualenv"""

        self._set_expectations_to_create_empty_virtualenv(existing_virtualenv=False)

        self.virtualenv_installer.create_empty_virtualenv()

    def test_will_delete_existing_virtualenv_when_creating_an_empty_virtualenv(self):
        """fab.tests.environment.python.virtualenv_installer_test  Will delete existing virtualenv when creating an empty virtualenv"""

        self._set_expectations_to_create_empty_virtualenv(existing_virtualenv=True)

        self.virtualenv_installer.create_empty_virtualenv()

    def test_can_ensure_virtualenv_exists_and_create_empty_virtualenv_if_none_exists(self):
        """fab.tests.environment.python.virtualenv_installer_test  Can ensure virtualenv exists and create an empty virtualenv if none exists"""

        self._set_expectations_to_create_empty_virtualenv(existing_virtualenv=False)

        self.virtualenv_installer.ensure_virtualenv_exists()

    def _set_expectations_to_create_empty_virtualenv(self, existing_virtualenv):
        if existing_virtualenv:
            self.mock_file_system.directory_exists(self.virtualenv_installer_config.rsr_env_path).MultipleTimes().AndReturn(True)
            self._set_expectations_to_delete_virtualenv()
        else:
            self.mock_file_system.directory_exists(self.virtualenv_installer_config.rsr_env_path).MultipleTimes().AndReturn(False)

        expected_virtualenv_creation_command = "virtualenv --no-site-packages --distribute %s" % self.virtualenv_installer_config.rsr_env_path

        self.mock_feedback.comment("Creating new virtualenv at %s" % self.virtualenv_installer_config.rsr_env_path)
        self.mock_host_controller.run(expected_virtualenv_creation_command)
        self.mock_virtualenv.list_installed_packages()
        self.mox.ReplayAll()

    def _set_expectations_to_delete_virtualenv(self):
        self.mock_feedback.comment("Deleting existing virtualenv")
        self.mock_file_system.delete_directory_with_sudo(self.virtualenv_installer_config.rsr_env_path)

    def test_can_ensure_virtualenv_exists_and_confirm_an_existing_virtualenv(self):
        """fab.tests.environment.python.virtualenv_installer_test  Can ensure virtualenv exists and confirm an existing virtualenv"""

        self.mock_file_system.directory_exists(self.virtualenv_installer_config.rsr_env_path).AndReturn(True)
        self.mock_feedback.comment("Found existing virtualenv at %s" % self.virtualenv_installer_config.rsr_env_path)
        self.mock_virtualenv.list_installed_packages()
        self.mox.ReplayAll()

        self.virtualenv_installer.ensure_virtualenv_exists()

    def test_can_remove_previously_downloaded_package_sources(self):
        """fab.tests.environment.python.virtualenv_installer_test  Can remove previously downloaded package source files"""

        python_package_sources_directory = os.path.join(self.virtualenv_installer_config.rsr_env_path, "src")
        self.mock_file_system.directory_exists(python_package_sources_directory).AndReturn(True)
        self.mock_feedback.comment("Removing previously downloaded Python package source files")
        self.mock_file_system.delete_directory_with_sudo(python_package_sources_directory)
        self.mox.ReplayAll()

        self.virtualenv_installer.remove_previously_downloaded_package_sources()

    def test_can_install_packages_from_given_pip_requirements(self):
        """fab.tests.environment.python.virtualenv_installer_test  Can install packages from given pip requirements"""

        self._set_expectations_to_install_packages(quietly=False)

        self.virtualenv_installer.install_packages(self.pip_requirements_file)

    def test_can_install_packages_quietly_from_given_pip_requirements(self):
        """fab.tests.environment.python.virtualenv_installer_test  Can install packages quietly from given pip requirements"""

        self._set_expectations_to_install_packages(quietly=True)

        self.virtualenv_installer.install_packages_quietly(self.pip_requirements_file)

    def _set_expectations_to_install_packages(self, quietly):
        quiet_mode_switch = "-q " if quietly else ""
        time_stamped_rsr_env_name = "%s_some_time_stamp" % self.virtualenv_installer_config.rsr_env_name
        pip_log_file_name = "pip_install_%s.log" % time_stamped_rsr_env_name
        expected_pip_log_file_path = os.path.join(self.virtualenv_installer_config.virtualenvs_home, pip_log_file_name)

        expected_pip_install_command = "pip install %s-M -E %s -r %s --log=%s" % (quiet_mode_switch,
                                                                                  self.virtualenv_installer_config.rsr_env_path,
                                                                                  self.pip_requirements_file,
                                                                                  expected_pip_log_file_path)

        self.mock_feedback.comment("Installing packages in virtualenv at %s" % self.virtualenv_installer_config.rsr_env_path)
        self.mock_time_stamp_formatter.append_timestamp(self.virtualenv_installer_config.rsr_env_name).AndReturn(time_stamped_rsr_env_name)
        self.mock_virtualenv.run_within_virtualenv(expected_pip_install_command)
        self.mock_virtualenv.list_installed_packages()
        self.mox.ReplayAll()

    def test_can_ensure_virtualenv_symlinks_exist(self):
        """fab.tests.environment.python.virtualenv_installer_test  Can ensure virtualenv symlinks exist"""

        self._change_dir_to(self.virtualenv_installer_config.virtualenvs_home)
        self.mock_file_system.ensure_symlink_exists("current", self.virtualenv_installer_config.rsr_env_name, with_sudo=True)
        self.mox.ReplayAll()

        self.virtualenv_installer.ensure_virtualenv_symlinks_exist()

    def _change_dir_to(self, expected_dir):
        self.mock_host_controller.cd(expected_dir).AndReturn(fabric.api.cd(expected_dir))


def suite():
    return TestSuiteLoader().load_tests_from(VirtualEnvInstallerTest)

if __name__ == "__main__":
    from fab.tests.test_settings import TEST_MODE
    TestRunner(TEST_MODE).run_test_suite(suite())
