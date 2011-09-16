#!/usr/bin/env python

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


import mox

from testing.helpers.execution import TestSuiteLoader, TestRunner

from fab.helpers.feedback import ExecutionFeedback
from fab.helpers.filesystem import FileSystem
from fab.helpers.virtualenv import VirtualEnv
from fab.host.controller import RemoteHostController


class VirtualEnvTest(mox.MoxTestBase):

    def setUp(self):
        super(VirtualEnvTest, self).setUp()
        self.expected_virtualenv_path = "/some/env/path"
        self.mock_host_controller = self.mox.CreateMock(RemoteHostController)
        self.mock_file_system = self.mox.CreateMock(FileSystem)
        self.mock_feedback = self.mox.CreateMock(ExecutionFeedback)

        self.mock_host_controller.feedback = self.mock_feedback
        self.virtualenv = VirtualEnv(self.expected_virtualenv_path, self.mock_host_controller, self.mock_file_system)

    def test_can_run_command_within_virtualenv(self):
        """fab.tests.helpers.virtualenv_test  Can run command from within virtualenv"""

        virtualenv_command = "command text"

        self.mock_host_controller.run(self._expected_call_within_virtualenv(virtualenv_command))
        self.mox.ReplayAll()

        self.virtualenv.run_within_virtualenv(virtualenv_command)

    def test_can_list_installed_virtualenv_packages(self):
        """fab.tests.helpers.virtualenv_test  Can list installed virtualenv packages"""

        self._set_expectations_to_list_pip_packages()
        self.mox.ReplayAll()

        self.virtualenv.list_installed_virtualenv_packages()

    def test_can_create_empty_virtualenv(self):
        """fab.tests.helpers.virtualenv_test  Can create empty virtualenv"""

        pip_log_file = "/some/log/path/pip.log"
        expected_virtualenv_creation_command = "virtualenv --no-site-packages --distribute %s" % self.expected_virtualenv_path

        self.mock_feedback.comment("Deleting previous virtualenv directory and pip install log file")
        self.mock_file_system.delete_directory_with_sudo(self.expected_virtualenv_path)
        self.mock_file_system.delete_file_with_sudo(pip_log_file)
        self.mock_feedback.comment("Creating new virtualenv at %s" % self.expected_virtualenv_path)
        self.mock_host_controller.run(expected_virtualenv_creation_command)
        self._set_expectations_to_list_pip_packages()
        self.mox.ReplayAll()

        self.virtualenv.create_empty_virtualenv(pip_log_file)

    def test_can_install_packages_from_given_pip_requirements(self):
        """fab.tests.helpers.virtualenv_test  Can install packages from given pip requirements"""

        pip_requirements_file = "/some/path/to/pip_requirements.txt"
        pip_log_file = "/some/log/path/pip.log"
        expected_pip_install_command = "pip install -M -E %s -r %s --log=%s" % (self.expected_virtualenv_path,
                                                                                   pip_requirements_file,
                                                                                   pip_log_file)

        self.mock_feedback.comment("Installing packages in virtualenv at %s" % self.expected_virtualenv_path)
        self.mock_host_controller.run(self._expected_call_within_virtualenv(expected_pip_install_command))
        self._set_expectations_to_list_pip_packages()
        self.mox.ReplayAll()

        self.virtualenv.install_packages(pip_requirements_file, pip_log_file)

    def _set_expectations_to_list_pip_packages(self):
        self.mock_feedback.comment("Installed packages:")
        self.mock_host_controller.run(self._expected_call_within_virtualenv("pip freeze"))

    def _expected_call_within_virtualenv(self, command):
        return "source %s/bin/activate && %s" % (self.expected_virtualenv_path, command)


def suite():
    return TestSuiteLoader().load_tests_from(VirtualEnvTest)

if __name__ == "__main__":
    from fab.tests.test_settings import TEST_MODE
    TestRunner(TEST_MODE).run_test_suite(suite())
