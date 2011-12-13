#!/usr/bin/env python

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


import fabric.api
import mox

from testing.helpers.execution import TestSuiteLoader, TestRunner

from fab.environment.python.installer import PythonInstaller
from fab.helpers.feedback import ExecutionFeedback
from fab.host.controller import RemoteHostController


class PythonInstallerTest(mox.MoxTestBase):

    def setUp(self):
        super(PythonInstallerTest, self).setUp()
        self.mock_host_controller = self.mox.CreateMock(RemoteHostController)
        self.mock_feedback = self.mox.CreateMock(ExecutionFeedback)

        self.mock_host_controller.feedback = self.mock_feedback

        self.python_installer = PythonInstaller(self.mock_host_controller)

    def test_can_install_pythonbrew_if_not_already_installed(self):
        """fab.tests.environment.python.python_installer_test  Can install pythonbrew if not already installed"""

        self._search_for_pythonbrew_path_and_raise(SystemExit('not found'))
        self._install_pythonbrew()
        self.mox.ReplayAll()

        self.python_installer.ensure_pythonbrew_is_installed()

    def test_will_acknowledge_version_and_path_for_an_installed_pythonbrew(self):
        """fab.tests.environment.python.python_installer_test  Will acknowledge version and path for an installed pythonbrew"""

        self._search_for_pythonbrew_path_and_return("/some/path/to/pythonbrew")
        self._query_pythonbrew_version_and_return("some.version")
        self._search_for_pythonbrew_path_and_return("/some/path/to/pythonbrew")
        self.mock_feedback.comment("Found pythonbrew version some.version at: /some/path/to/pythonbrew")
        self.mox.ReplayAll()

        self.python_installer.ensure_pythonbrew_is_installed()

    def _search_for_pythonbrew_path_and_raise(self, expected_exception):
        self.mock_host_controller.hide_command_and_output().AndReturn(fabric.api.hide('running', 'stdout'))
        self.mock_host_controller.run("which pythonbrew").AndRaise(expected_exception)

    def _search_for_pythonbrew_path_and_return(self, expected_path):
        self._run_hidden_command_and_return("which pythonbrew", expected_path)

    def _query_pythonbrew_version_and_return(self, expected_version):
        self._run_hidden_command_and_return("pythonbrew version", expected_version)

    def _run_hidden_command_and_return(self, command, expected_response):
        self.mock_host_controller.hide_command_and_output().AndReturn(fabric.api.hide('running', 'stdout'))
        self.mock_host_controller.run(command).AndReturn(expected_response)

    def _install_pythonbrew(self):
        self.mock_feedback.comment("Installing pythonbrew")
        self.mock_host_controller.sudo("curl -kL http://xrl.us/pythonbrewinstall | bash")


def suite():
    return TestSuiteLoader().load_tests_from(PythonInstallerTest)

if __name__ == "__main__":
    from fab.tests.test_settings import TEST_MODE
    TestRunner(TEST_MODE).run_test_suite(suite())
