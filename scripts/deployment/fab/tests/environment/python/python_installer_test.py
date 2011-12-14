#!/usr/bin/env python

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


import fabric.api
import mox

from testing.helpers.execution import TestSuiteLoader, TestRunner

from fab.environment.python.brew import PythonBrew
from fab.environment.python.installer import PythonInstaller


class PythonInstallerTest(mox.MoxTestBase):

    def setUp(self):
        super(PythonInstallerTest, self).setUp()
        self.mock_pythonbrew = self.mox.CreateMock(PythonBrew)

        self.python_installer = PythonInstaller(self.mock_pythonbrew)

    def test_can_ensure_specified_python_version_is_installed(self):
        """fab.tests.environment.python.python_installer_test  Can ensure specified Python version is installed"""

        self.mock_pythonbrew.ensure_pythonbrew_is_installed()
        self.mock_pythonbrew.install_python("2.7.2")
        self.mock_pythonbrew.enable_python_version_for_all_users("2.7.2")
        self.mox.ReplayAll()

        self.python_installer.ensure_python_is_installed_with_version("2.7.2")


def suite():
    return TestSuiteLoader().load_tests_from(PythonInstallerTest)

if __name__ == "__main__":
    from fab.tests.test_settings import TEST_MODE
    TestRunner(TEST_MODE).run_test_suite(suite())
