#!/usr/bin/env python

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


import mox

from testing.helpers.execution import TestSuiteLoader, TestRunner

from fab.dependency.systempackages import SystemPackageDependency
from fab.helpers.feedback import ExecutionFeedback
from fab.os.linux.packageinfo import UbuntuPackageInfo
from fab.os.linux.packageinspector import UbuntuPackageInspector


class SystemPackageDependencyTest(mox.MoxTestBase):

    def setUp(self):
        super(SystemPackageDependencyTest, self).setUp()
        self.mock_feedback = self.mox.CreateMock(ExecutionFeedback)
        self.mock_package_inspector = self.mox.CreateMock(UbuntuPackageInspector)
        self.mock_package_info = self.mox.CreateMock(UbuntuPackageInfo)

        self.minimum_package_version = "1:1.2"

        self.system_package_dependency = SystemPackageDependency("package1", self.minimum_package_version)

    def test_can_determine_equality_between_package_dependencies(self):
        """fab.tests.dependency.system_package_dependency_test  Can determine equality between package dependencies"""

        package_dependency1a = SystemPackageDependency('package1', '1:1.1')
        package_dependency1b = SystemPackageDependency('package1', '1:1.1')

        self.assertEqual(package_dependency1a, package_dependency1a, "Same instance should be equal to itself")
        self.assertNotEqual(SystemPackageDependency('package1', '1.1'), SystemPackageDependency('package1', '1.2'),
                            "Package dependencies should be unequal when package versions differ")
        self.assertNotEqual(SystemPackageDependency('package1', '1.1'), SystemPackageDependency('package2', '1.1'),
                            "Package dependencies should be unequal when package names differ")
        self.assertNotEqual(SystemPackageDependency('package1', '1.1'), SystemPackageDependency('package2', '2.2'),
                            "Package dependencies should be unequal when both package names and versions differ")
        self.assertEqual(package_dependency1a, package_dependency1b, "Different instances with same package name and version should be equal")

    def test_can_create_package_dependency_from_given_package_specification(self):
        """fab.tests.dependency.system_package_dependency_test  Can create a package dependency from a given package specification"""

        package_specification = {'name': 'libc6', 'version': '2.7-10ubuntu8'}
        expected_package_dependency = SystemPackageDependency('libc6', '2.7-10ubuntu8')

        self.assertEqual(expected_package_dependency, SystemPackageDependency.from_specification(package_specification))

    def test_dependency_is_met_if_installed_package_is_more_recent_version(self):
        """fab.tests.dependency.system_package_dependency_test  Dependency is met if the installed package is a more recent version"""

        self._set_installed_package_expectations("1:1.3")

        self.assertTrue(self.system_package_dependency.is_met(self.mock_package_inspector, self.mock_feedback),
                        "System package dependency should be met if installed package is greater than minimum version")

    def test_dependency_is_met_if_installed_package_is_same_version(self):
        """fab.tests.dependency.system_package_dependency_test  Dependency is met if the installed package is the same version"""

        self._set_installed_package_expectations("1:1.2")

        self.assertTrue(self.system_package_dependency.is_met(self.mock_package_inspector, self.mock_feedback),
                        "System package dependency should be met if installed package is same as minimum version")

    def test_dependency_is_not_met_if_installed_package_is_less_than_minimum_version(self):
        """fab.tests.dependency.system_package_dependency_test  Dependency is not met if the installed package is less than the minimum version"""

        self._set_outdated_package_expectations("1:1.0")

        self.assertFalse(self.system_package_dependency.is_met(self.mock_package_inspector, self.mock_feedback),
                         "System package dependency should not be met if installed package is less than minimum version")

    def _set_installed_package_expectations(self, installed_version):
        self._set_installed_package_info(installed_version)
        self.mock_feedback.comment("Found package: package1 (%s)" % installed_version)
        self.mox.ReplayAll()

    def _set_outdated_package_expectations(self, installed_version):
        self._set_installed_package_info(installed_version)
        self.mock_feedback.warn("Found [package1] package but version is outdated: %s (expected minimum 1:1.2)" % installed_version)
        self.mox.ReplayAll()

    def _set_installed_package_info(self, installed_version):
        package_name_and_installed_version = "package1 (%s)" % installed_version
        self.mock_package_info.name = "package1"
        self.mock_package_info.version = installed_version
        self.mock_package_info.name_and_installed_version = package_name_and_installed_version

        self.mock_package_inspector.info_for("package1").AndReturn(self.mock_package_info)
        self.mock_package_info.is_installed().AndReturn(True)

    def test_dependency_is_not_met_if_package_is_not_installed(self):
        """fab.tests.dependency.system_package_dependency_test  Dependency is not met if the package is not installed"""

        self.mock_package_info.name = "package1"

        self.mock_package_inspector.info_for("package1").AndReturn(self.mock_package_info)
        self.mock_package_info.is_installed().AndReturn(False)
        self.mock_feedback.warn("Missing package: package1")
        self.mox.ReplayAll()

        self.assertFalse(self.system_package_dependency.is_met(self.mock_package_inspector, self.mock_feedback),
                         "System package dependency should not be met if package is not installed")


def suite():
    return TestSuiteLoader().load_tests_from(SystemPackageDependencyTest)

if __name__ == "__main__":
    from fab.tests.test_settings import TEST_MODE
    TestRunner(TEST_MODE).run_test_suite(suite())
