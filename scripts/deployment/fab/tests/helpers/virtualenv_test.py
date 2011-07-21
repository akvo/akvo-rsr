#!/usr/bin/env python

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


import mox

from testing.helpers.execution import TestSuiteLoader, TestRunner

from fab.helpers.feedback import ExecutionFeedback
from fab.helpers.filesystem import FileSystem
from fab.helpers.hosts import RemoteHost
from fab.helpers.virtualenv import VirtualEnv


class VirtualEnvTest(mox.MoxTestBase):

    def setUp(self):
        super(VirtualEnvTest, self).setUp()
        self.expected_virtualenv_path = "/some/env/path"
        self.mock_deployment_host = self.mox.CreateMock(RemoteHost)
        self.mock_file_system = self.mox.CreateMock(FileSystem)
        self.mock_feedback = self.mox.CreateMock(ExecutionFeedback)

        self.virtualenv = VirtualEnv(self.expected_virtualenv_path, self.mock_deployment_host,
                                     self.mock_file_system, self.mock_feedback)

    def test_can_call_command_within_virtualenv(self):
        """fab.tests.helpers.virtualenv_test  Can call command from within virtualenv"""

        virtualenv_command = "command text"

        self.mock_deployment_host.run(self.expected_call_within_virtualenv(virtualenv_command))
        self.mox.ReplayAll()

        self.virtualenv.with_virtualenv(virtualenv_command)

    def test_can_list_installed_virtualenv_packages(self):
        """fab.tests.helpers.virtualenv_test  Can list installed virtualenv packages"""

        self.mock_deployment_host.run(self.expected_pip_freeze_call())
        self.mox.ReplayAll()

        self.virtualenv.list_installed_virtualenv_packages()

    def test_can_create_empty_virtualenv(self):
        """fab.tests.helpers.virtualenv_test  Can create empty virtualenv"""

        pip_log_file = "/some/log/path/pip.log"
        expected_virtualenv_creation_command = "virtualenv --no-site-packages --distribute %s" % self.expected_virtualenv_path

        self.mock_feedback.comment(mox.StrContains("Deleting previous virtualenv directory and pip install log file"))
        self.mock_file_system.delete_directory_with_sudo(self.expected_virtualenv_path)
        self.mock_file_system.delete_file_with_sudo(pip_log_file)
        self.mock_feedback.comment(mox.StrContains("Creating new virtualenv at %s" % self.expected_virtualenv_path))
        self.mock_deployment_host.run(expected_virtualenv_creation_command)
        self.mock_deployment_host.run(self.expected_pip_freeze_call())
        self.mox.ReplayAll()

        self.virtualenv.create_empty_virtualenv(pip_log_file)

    def test_can_install_packages_from_given_pip_requirements(self):
        """fab.tests.helpers.virtualenv_test  Can install packages from given pip requirements"""

        pip_requirements_file = "/some/path/to/pip_requirements.txt"
        pip_log_file = "/some/log/path/pip.log"
        expected_pip_install_command = "pip install -M -E %s -r %s --log=%s" % (self.expected_virtualenv_path,
                                                                                   pip_requirements_file,
                                                                                   pip_log_file)

        self.mock_feedback.comment(mox.StrContains("Installing packages in virtualenv at %s" % self.expected_virtualenv_path))
        self.mock_deployment_host.run(self.expected_call_within_virtualenv(expected_pip_install_command))
        self.mock_deployment_host.run(self.expected_pip_freeze_call())
        self.mox.ReplayAll()

        self.virtualenv.install_packages(pip_requirements_file, pip_log_file)

    def expected_pip_freeze_call(self):
        return "pip freeze -E %s" % self.expected_virtualenv_path

    def expected_call_within_virtualenv(self, command):
        return "source %s/bin/activate && %s" % (self.expected_virtualenv_path, command)


def suite():
    return TestSuiteLoader().load_tests_from(VirtualEnvTest)

if __name__ == "__main__":
    from fab.tests.test_settings import TEST_MODE
    TestRunner(TEST_MODE).run_test_suite(suite())
