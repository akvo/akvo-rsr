#!/usr/bin/env python

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


import mox

from testing.helpers.execution import TestSuiteLoader, TestRunner

from fab.config.rsr.virtualenv import RSRVirtualEnvInstallerConfig
from fab.environment.python.virtualenv import VirtualEnvInstaller
from fab.helpers.feedback import ExecutionFeedback
from fab.host.controller import RemoteHostController
from fab.os.filesystem import FileSystem


class VirtualEnvInstallerTest(mox.MoxTestBase):

    def setUp(self):
        super(VirtualEnvInstallerTest, self).setUp()
        self.mock_virtualenv_installer_config = self.mox.CreateMock(RSRVirtualEnvInstallerConfig)
        self.mock_host_controller = self.mox.CreateMock(RemoteHostController)
        self.mock_file_system = self.mox.CreateMock(FileSystem)
        self.mock_feedback = self.mox.CreateMock(ExecutionFeedback)

        self.expected_virtualenv_path = "/some/env/path"
        self.pip_requirements_file = "/some/path/to/pip_requirements.txt"

        self.mock_host_controller.feedback = self.mock_feedback
        self.mock_virtualenv_installer_config.rsr_env_path = self.expected_virtualenv_path

        self.virtualenv_installer = VirtualEnvInstaller(self.mock_virtualenv_installer_config, self.mock_host_controller, self.mock_file_system)

    def test_can_check_for_virtualenv_existence(self):
        """fab.tests.environment.python.virtualenv_installer_test  Can check for virtualenv existence"""

        self.mock_file_system.directory_exists(self.expected_virtualenv_path).AndReturn(True)
        self.mox.ReplayAll()

        self.assertTrue(self.virtualenv_installer.virtualenv_exists(), "Virtualenv should exist")

    def test_can_delete_existing_virtualenv(self):
        """fab.tests.environment.python.virtualenv_installer_test  Can delete existing virtualenv"""

        self.mock_file_system.directory_exists(self.expected_virtualenv_path).AndReturn(True)
        self._set_expectations_to_delete_virtualenv()
        self.mox.ReplayAll()

        self.virtualenv_installer.delete_existing_virtualenv()

    def test_does_nothing_when_attempting_to_delete_nonexistent_virtualenv(self):
        """fab.tests.environment.python.virtualenv_installer_test  Does nothing when attempting to delete a nonexistent virtualenv"""

        self.mock_file_system.directory_exists(self.expected_virtualenv_path).AndReturn(False)
        self.mox.ReplayAll()

        self.virtualenv_installer.delete_existing_virtualenv()

    def test_can_run_command_within_virtualenv(self):
        """fab.tests.environment.python.virtualenv_installer_test  Can run command from within virtualenv"""

        virtualenv_command = "command text"

        self.mock_host_controller.run(self._expected_call_within_virtualenv(virtualenv_command))
        self.mox.ReplayAll()

        self.virtualenv_installer.run_within_virtualenv(virtualenv_command)

    def test_can_list_installed_virtualenv_packages(self):
        """fab.tests.environment.python.virtualenv_installer_test  Can list installed virtualenv packages"""

        self._set_expectations_to_list_pip_packages()
        self.mox.ReplayAll()

        self.virtualenv_installer.list_installed_virtualenv_packages()

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

    def test_can_ensure_virtualenv_exists_and_confirm_an_existing_virtualenv(self):
        """fab.tests.environment.python.virtualenv_installer_test  Can ensure virtualenv exists and confirm an existing virtualenv"""

        self.mock_file_system.directory_exists(self.expected_virtualenv_path).AndReturn(True)
        self.mock_feedback.comment("Found existing virtualenv at %s" % self.expected_virtualenv_path)
        self._set_expectations_to_list_pip_packages()
        self.mox.ReplayAll()

        self.virtualenv_installer.ensure_virtualenv_exists()

    def _set_expectations_to_create_empty_virtualenv(self, existing_virtualenv):
        if existing_virtualenv:
            self.mock_file_system.directory_exists(self.expected_virtualenv_path).MultipleTimes().AndReturn(True)
            self._set_expectations_to_delete_virtualenv()
        else:
            self.mock_file_system.directory_exists(self.expected_virtualenv_path).MultipleTimes().AndReturn(False)

        expected_virtualenv_creation_command = "virtualenv --no-site-packages --distribute %s" % self.expected_virtualenv_path

        self.mock_feedback.comment("Creating new virtualenv at %s" % self.expected_virtualenv_path)
        self.mock_host_controller.run(expected_virtualenv_creation_command)
        self._set_expectations_to_list_pip_packages()
        self.mox.ReplayAll()

    def _set_expectations_to_delete_virtualenv(self):
        self.mock_feedback.comment("Deleting existing virtualenv")
        self.mock_file_system.delete_directory_with_sudo(self.expected_virtualenv_path)

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
        expected_pip_log_file_path = "/some/log/path/pip.log"
        expected_pip_install_command = "pip install %s-M -E %s -r %s --log=%s" % (quiet_mode_switch,
                                                                                  self.expected_virtualenv_path,
                                                                                  self.pip_requirements_file,
                                                                                  expected_pip_log_file_path)

        self.mock_feedback.comment("Installing packages in virtualenv at %s" % self.expected_virtualenv_path)
        self.mock_virtualenv_installer_config.time_stamped_pip_install_log_file_path().AndReturn(expected_pip_log_file_path)
        self.mock_host_controller.run(self._expected_call_within_virtualenv(expected_pip_install_command))
        self._set_expectations_to_list_pip_packages()
        self.mox.ReplayAll()

    def _set_expectations_to_list_pip_packages(self):
        self.mock_feedback.comment("Installed packages:")
        self.mock_host_controller.run(self._expected_call_within_virtualenv("pip freeze"))

    def _expected_call_within_virtualenv(self, command):
        return "source %s/bin/activate && %s" % (self.expected_virtualenv_path, command)


def suite():
    return TestSuiteLoader().load_tests_from(VirtualEnvInstallerTest)

if __name__ == "__main__":
    from fab.tests.test_settings import TEST_MODE
    TestRunner(TEST_MODE).run_test_suite(suite())
