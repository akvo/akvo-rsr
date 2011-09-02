#!/usr/bin/env python

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


import mox

from testing.helpers.execution import TestSuiteLoader, TestRunner

from fab.config.linux.systempackages import SystemPackageSpecifications
from fab.dependency.systempackages import SystemPackageDependency, SystemPackageDependencyCollection
from fab.helpers.feedback import ExecutionFeedback
from fab.os.linux.packageinspector import UbuntuPackageInspector


class SystemPackageDependencyCollectionTest(mox.MoxTestBase):

    def setUp(self):
        super(SystemPackageDependencyCollectionTest, self).setUp()
        self.mock_package_inspector = self.mox.CreateMock(UbuntuPackageInspector)
        self.mock_feedback = self.mox.CreateMock(ExecutionFeedback)

    def test_initialiser_unpacks_package_specifications_and_adds_package_dependencies(self):
        """fab.tests.dependency.system_package_dependency_collection_test  Initialiser unpacks package specifications and adds package dependencies"""

        dependency_collection = SystemPackageDependencyCollection(SystemPackageSpecifications.COMPILATION, None, None)

        self.assertEqual(len(SystemPackageSpecifications.COMPILATION), len(dependency_collection))

        for current_index in range(len(SystemPackageSpecifications.COMPILATION)):
            package_spec = SystemPackageSpecifications.COMPILATION[current_index]
            expected_dependency = SystemPackageDependency.from_specification(package_spec)
            actual_dependency = dependency_collection.dependencies[current_index]
            self.assertEqual(expected_dependency, actual_dependency)

    def test_can_report_collection_length(self):
        """fab.tests.dependency.system_package_dependency_collection_test  Can report collection length"""

        dependency_collection = SystemPackageDependencyCollection(SystemPackageSpecifications.COMPILATION, None, None)

        expected_collection_length = len(SystemPackageSpecifications.COMPILATION)

        self.assertEqual(expected_collection_length, len(dependency_collection.dependencies))
        self.assertEqual(expected_collection_length, len(dependency_collection))

    def test_can_add_individual_dependencies_to_collection(self):
        """fab.tests.dependency.system_package_dependency_collection_test  Can add individual dependencies to the collection"""

        dependency_collection = SystemPackageDependencyCollection([], None, None)

        self.assertEqual(0, len(dependency_collection))

        for count in range(4):
            dependency_collection.add(self.mox.CreateMock(SystemPackageDependency))

        self.assertEqual(4, len(dependency_collection))

    def test_can_find_unmet_dependencies(self):
        """fab.tests.dependency.system_package_dependency_collection_test  Can find unmet dependencies"""

        dependency_collection = SystemPackageDependencyCollection([], self.mock_package_inspector, self.mock_feedback)

        dependency_collection.add(self._create_unmet_package_dependency("package1"))
        dependency_collection.add(self._create_met_package_dependency("package2"))
        dependency_collection.add(self._create_unmet_package_dependency("package3"))
        dependency_collection.add(self._create_met_package_dependency("package4"))
        dependency_collection.add(self._create_met_package_dependency("package5"))

        self.mox.ReplayAll()

        unmet_dependencies = []
        dependency_collection.find_unmet_dependencies(unmet_dependencies)

        self.assertEqual(["package1", "package3"], unmet_dependencies)

    def _create_met_package_dependency(self, package_name):
        return self._create_package_dependency(package_name, True)

    def _create_unmet_package_dependency(self, package_name):
        return self._create_package_dependency(package_name, False)

    def _create_package_dependency(self, package_name, is_met):
        mock_package_dependency = self.mox.CreateMock(SystemPackageDependency)
        mock_package_dependency.package_name = package_name
        mock_package_dependency.is_met(self.mock_package_inspector, self.mock_feedback).AndReturn(is_met)

        return mock_package_dependency


def suite():
    return TestSuiteLoader().load_tests_from(SystemPackageDependencyCollectionTest)

if __name__ == "__main__":
    from fab.tests.test_settings import TEST_MODE
    TestRunner(TEST_MODE).run_test_suite(suite())
