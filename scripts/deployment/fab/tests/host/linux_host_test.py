#!/usr/bin/env python

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


import mox

from testing.helpers.execution import TestSuiteLoader, TestRunner

from fab.config.linux.systempackages import SystemPackageSpecifications
from fab.dependency.systempackages import SystemPackageDependencyCollection
from fab.dependency.verifier.packageverifier import SystemPackageVerifier
from fab.helpers.feedback import ExecutionFeedback
from fab.host.linux import LinuxHost
from fab.os.linux.packageinspector import UbuntuPackageInspector


class LinuxHostTest(mox.MoxTestBase):

    def setUp(self):
        super(LinuxHostTest, self).setUp()

    def test_can_create_a_linuxhost_instance(self):
        """fab.tests.host.linux_host_test  Can create a LinuxHost instance"""

        self.assertIsInstance(LinuxHost.create_instance(), LinuxHost)

    def test_will_exit_if_system_package_dependencies_have_not_been_met(self):
        """fab.tests.host.linux_host_test  Will exit if system package dependencies have not been met"""

        mock_package_inspector = self.mox.CreateMock(UbuntuPackageInspector)
        mock_system_package_verifier = self.mox.CreateMock(SystemPackageVerifier)
        mock_feedback = self.mox.CreateMock(ExecutionFeedback)

        linux_host = LinuxHost(mock_package_inspector, mock_system_package_verifier, mock_feedback)

        mock_system_package_verifier.exit_if_package_dependencies_not_met(mox.IsA(SystemPackageDependencyCollection))
        self.mox.ReplayAll()

        linux_host.exit_if_system_package_dependencies_not_met(SystemPackageSpecifications.COMPILATION)


def suite():
    return TestSuiteLoader().load_tests_from(LinuxHostTest)

if __name__ == "__main__":
    from fab.tests.test_settings import TEST_MODE
    TestRunner(TEST_MODE).run_test_suite(suite())
