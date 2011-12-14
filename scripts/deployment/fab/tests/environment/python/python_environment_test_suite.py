#!/usr/bin/env python

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


from testing.helpers.execution import TestSuiteLoader, TestRunner

from fab.tests.environment.python.pip_installer_test import PipInstallerTest
from fab.tests.environment.python.pythonbrew_test import PythonBrewTest
from fab.tests.environment.python.python_installer_test import PythonInstallerTest
from fab.tests.environment.python.system_package_installation_paths_test import SystemPackageInstallationPathsTest
from fab.tests.environment.python.system_package_installer_test import SystemPythonPackageInstallerTest
from fab.tests.environment.python.virtualenv_installer_test import VirtualEnvInstallerTest
from fab.tests.environment.python.virtualenv_test import VirtualEnvTest


def python_environment_suite():
    return TestSuiteLoader().create_suite_from_classes([PythonBrewTest, PythonInstallerTest, SystemPackageInstallationPathsTest,
                                                        PipInstallerTest, SystemPythonPackageInstallerTest,
                                                        VirtualEnvTest, VirtualEnvInstallerTest])

if __name__ == "__main__":
    from fab.tests.test_settings import TEST_MODE
    TestRunner(TEST_MODE).run_test_suite(python_environment_suite())
