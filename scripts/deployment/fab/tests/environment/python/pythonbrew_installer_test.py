#!/usr/bin/env python

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


import imp, os

DEPLOYMENT_SCRIPTS_HOME = os.path.realpath(os.path.join(os.path.dirname(__file__), '../../../..'))

imp.load_source("syspath_verification", os.path.join(DEPLOYMENT_SCRIPTS_HOME, 'verifiers/ensure_syspath_contains_testing_path_dependencies.py'))

import fabric.api
import mox

from testing.helpers.execution import TestSuiteLoader, TestRunner

from fab.environment.python.brewinstaller import PythonBrewInstaller
from fab.helpers.feedback import ExecutionFeedback
from fab.host.controller import RemoteHostController


class PythonBrewInstallerTest(mox.MoxTestBase):

    def setUp(self):
        super(PythonBrewInstallerTest, self).setUp()
        self.mock_host_controller = self.mox.CreateMock(RemoteHostController)
        self.mock_feedback = self.mox.CreateMock(ExecutionFeedback)

        self.mock_host_controller.feedback = self.mock_feedback

        self.pythonbrew_installer = PythonBrewInstaller(self.mock_host_controller)

    def test_can_install_pythonbrew_if_not_already_installed(self):
        """fab.tests.environment.python.pythonbrew_installer_test  Can install pythonbrew if not already installed"""

        self._search_for_pythonbrew_path_and_return("")
        self._install_pythonbrew()
        self.mox.ReplayAll()

        self.pythonbrew_installer.ensure_pythonbrew_is_installed()

    def _search_for_pythonbrew_path_and_return(self, expected_path):
        self.mock_host_controller.hide_command_and_output().AndReturn(fabric.api.hide('running', 'stdout'))
        self.mock_host_controller.run("which pythonbrew").AndReturn(expected_path)

    def _install_pythonbrew(self):
        self.mock_feedback.comment("Installing pythonbrew")
        self.mock_host_controller.sudo("curl -kL http://xrl.us/pythonbrewinstall | bash")


def suite():
    return TestSuiteLoader().load_tests_from(PythonBrewInstallerTest)

if __name__ == "__main__":
    from fab.tests.test_settings import TEST_MODE
    TestRunner(TEST_MODE).run_test_suite(suite())
