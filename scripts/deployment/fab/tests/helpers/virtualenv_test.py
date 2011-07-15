#!/usr/bin/env python

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


import mox, unittest

from testing.helpers.execution import TestSuiteLoader, TestRunner

from fab.helpers.runner import FabricRunner
from fab.helpers.feedback import ExecutionFeedback
from fab.helpers.files import FilesHelper
from fab.helpers.virtualenv import VirtualEnv


class VirtualEnvTest(mox.MoxTestBase):

    def setUp(self):
        super(VirtualEnvTest, self).setUp()
        self.expected_virtualenv_path = "/some/env/path"
        self.mock_feedback = self.mox.CreateMock(ExecutionFeedback)
        self.mock_fabric_runner = self.mox.CreateMock(FabricRunner)
        self.mock_files_helper = self.mox.CreateMock(FilesHelper)

        self.virtualenv = VirtualEnv(self.expected_virtualenv_path, self.mock_feedback, self.mock_fabric_runner, self.mock_files_helper)

    def test_can_call_command_within_virtualenv(self):
        """fab.tests.helpers.VirtualEnvTest  Can call command from within virtualenv"""

        virtualenv_command = "command text"

        self.mock_fabric_runner.run(self.expected_call_within_virtualenv(virtualenv_command))
        self.mox.ReplayAll()

        self.virtualenv.with_virtualenv(virtualenv_command)

    def test_can_list_installed_virtualenv_packages(self):
        """fab.tests.helpers.VirtualEnvTest  Can list installed virtualenv packages"""

        self.mock_fabric_runner.run(self.expected_pip_freeze_call())
        self.mox.ReplayAll()

        self.virtualenv.list_installed_virtualenv_packages()

    def test_can_create_empty_virtualenv(self):
        """fab.tests.helpers.VirtualEnvTest  Can create empty virtualenv"""

        pip_log_file = "/some/log/path/pip.log"
        expected_virtualenv_creation_command = "virtualenv --no-site-packages %s" % self.expected_virtualenv_path

        self.mock_feedback.comment(mox.IsA(str)).MultipleTimes()
        self.mock_files_helper.delete_directory_with_sudo(self.expected_virtualenv_path)
        self.mock_files_helper.delete_file_with_sudo(pip_log_file)
        self.mock_fabric_runner.run(expected_virtualenv_creation_command)
        self.mock_fabric_runner.run(self.expected_pip_freeze_call())
        self.mox.ReplayAll()

        self.virtualenv.create_empty_virtualenv(pip_log_file)

    def test_can_install_packages_from_given_pip_requirements(self):
        """fab.tests.helpers.VirtualEnvTest  Can install packages from given pip requirements"""

        pip_requirements_file = "/some/path/to/pip_requirements.txt"
        pip_log_file = "/some/log/path/pip.log"
        expected_pip_install_command = "pip install -q -M -E %s -r %s --log=%s" % (self.expected_virtualenv_path,
                                                                                   pip_requirements_file,
                                                                                   pip_log_file)

        self.mock_feedback.comment(mox.IsA(str))
        self.mock_fabric_runner.run(self.expected_call_within_virtualenv(expected_pip_install_command))
        self.mock_fabric_runner.run(self.expected_pip_freeze_call())
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
