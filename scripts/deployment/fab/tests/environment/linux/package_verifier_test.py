#!/usr/bin/env python

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


import mox

from testing.helpers.execution import TestSuiteLoader, TestRunner

from fab.dependency.systempackages import SystemPackageDependencyCollection
from fab.dependency.verifier.collectionverifier import DependencyCollectionVerifier
from fab.environment.linux.packageverifier import LinuxPackageVerifier
from fab.helpers.feedback import ExecutionFeedback
from fab.host.controller import RemoteHostController


class LinuxPackageVerifierTest(mox.MoxTestBase):

    def setUp(self):
        super(LinuxPackageVerifierTest, self).setUp()
        self.mock_dependency_verifier = self.mox.CreateMock(DependencyCollectionVerifier)
        self.mock_feedback = self.mox.CreateMock(ExecutionFeedback)
        self.mock_host_controller = self.mox.CreateMock(RemoteHostController)
        self.mock_dependency_collection = self.mox.CreateMock(SystemPackageDependencyCollection)

        self.mock_host_controller.feedback = self.mock_feedback

        self.system_package_verifier = LinuxPackageVerifier(self.mock_dependency_verifier, self.mock_host_controller)

    def test_can_create_linuxpackageverifier_instance(self):
        """fab.tests.environment.linux.package_verifier_test  Can create a LinuxPackageVerifier instance"""

        self.assertIsInstance(LinuxPackageVerifier.create_instance(self.mock_host_controller), LinuxPackageVerifier)

    def test_can_update_package_sources(self):
        """fab.tests.environment.linux.package_verifier_test  Can update package sources"""

        self.mock_feedback.comment("Updating system package sources")
        self.mock_host_controller.sudo("aptitude update")
        self.mox.ReplayAll()

        self.system_package_verifier.update_package_sources()

    def test_will_exit_if_package_dependencies_have_not_been_met(self):
        """fab.tests.environment.linux.package_verifier_test  Will exit if package dependencies have not been met"""

        self.mock_feedback.comment("Verifying expected system packages")
        self.mock_dependency_verifier.verify(self.mock_dependency_collection)
        self.mock_dependency_verifier.not_all_dependencies_met().AndReturn(True)
        self.mock_dependency_verifier.unmet_dependency_names().AndReturn("package1 package4")
        self.mock_feedback.abort("Missing system packages or packages with incorrect versions: package1 package4")
        self.mox.ReplayAll()

        self.system_package_verifier.exit_if_package_dependencies_not_met(self.mock_dependency_collection)

    def test_will_not_exit_if_package_dependencies_have_been_met(self):
        """fab.tests.environment.linux.package_verifier_test  Will not exit if package dependencies have been met"""

        self.mock_feedback.comment("Verifying expected system packages")
        self.mock_dependency_verifier.verify(self.mock_dependency_collection)
        self.mock_dependency_verifier.not_all_dependencies_met().AndReturn(False)
        self.mox.ReplayAll()

        self.system_package_verifier.exit_if_package_dependencies_not_met(self.mock_dependency_collection)


def suite():
    return TestSuiteLoader().load_tests_from(LinuxPackageVerifierTest)

if __name__ == "__main__":
    from fab.tests.test_settings import TEST_MODE
    TestRunner(TEST_MODE).run_test_suite(suite())
