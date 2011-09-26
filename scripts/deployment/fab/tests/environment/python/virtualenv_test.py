#!/usr/bin/env python

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


import mox

from testing.helpers.execution import TestSuiteLoader, TestRunner

from fab.environment.python.virtualenv import VirtualEnv
from fab.helpers.feedback import ExecutionFeedback
from fab.host.controller import RemoteHostController


class VirtualEnvTest(mox.MoxTestBase):

    def setUp(self):
        super(VirtualEnvTest, self).setUp()
        self.mock_host_controller = self.mox.CreateMock(RemoteHostController)
        self.mock_feedback = self.mox.CreateMock(ExecutionFeedback)

        self.expected_virtualenv_path = "/some/env/path"

        self.mock_host_controller.feedback = self.mock_feedback

        self.virtualenv = VirtualEnv(self.expected_virtualenv_path, self.mock_host_controller)

    def test_can_list_installed_virtualenv_packages(self):
        """fab.tests.environment.python.virtualenv_test  Can list installed virtualenv packages"""

        self.mock_feedback.comment("Installed packages:")
        self.mock_host_controller.run(self._expected_call_within_virtualenv("pip freeze"))
        self.mox.ReplayAll()

        self.virtualenv.list_installed_virtualenv_packages()

    def test_can_run_command_within_virtualenv(self):
        """fab.tests.environment.python.virtualenv_test  Can run command from within the virtualenv"""

        virtualenv_command = "command text"

        self.mock_host_controller.run(self._expected_call_within_virtualenv(virtualenv_command))
        self.mox.ReplayAll()

        self.virtualenv.run_within_virtualenv(virtualenv_command)

    def _expected_call_within_virtualenv(self, command):
        return "source %s/bin/activate && %s" % (self.expected_virtualenv_path, command)


def suite():
    return TestSuiteLoader().load_tests_from(VirtualEnvTest)

if __name__ == "__main__":
    from fab.tests.test_settings import TEST_MODE
    TestRunner(TEST_MODE).run_test_suite(suite())
