#!/usr/bin/env python

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


import mox

from testing.helpers.execution import TestSuiteLoader, TestRunner

from fab.dependency.systempackages import SystemPackageDependencyCollection
from fab.dependency.verifier.collectionverifier import DependencyCollectionVerifier


class DependencyCollectionVerifierTest(mox.MoxTestBase):

    def setUp(self):
        super(DependencyCollectionVerifierTest, self).setUp()
        self.mock_dependency_collection = self.mox.CreateMock(SystemPackageDependencyCollection)

        self.dependency_collection_verifier = DependencyCollectionVerifier()

    def test_unmet_dependencies_list_is_empty_on_initialisation(self):
        """fab.tests.dependency.verifier.dependency_collection_verifier_test  Unmet dependencies list is empty on initialisation"""

        self.assertEqual(0, len(self.dependency_collection_verifier.unmet_dependencies))

    def test_can_verify_given_dependency_collection(self):
        """fab.tests.dependency.verifier.dependency_collection_verifier_test  Can verify a given dependency collection"""

        expected_unmet_dependencies = ['package1', 'package4']

        self.mock_dependency_collection.find_unmet_dependencies().AndReturn(expected_unmet_dependencies)
        self.mox.ReplayAll()

        self.dependency_collection_verifier.verify(self.mock_dependency_collection)

        self.assertEqual(expected_unmet_dependencies, self.dependency_collection_verifier.unmet_dependencies)

    def test_can_report_when_not_all_dependencies_were_met(self):
        """fab.tests.dependency.verifier.dependency_collection_verifier_test  Can report when not all dependencies were met"""

        self.dependency_collection_verifier.unmet_dependencies = []
        self.assertFalse(self.dependency_collection_verifier.not_all_dependencies_met(), "Expected all dependencies to be met")

        self.dependency_collection_verifier.unmet_dependencies = ['package1', 'package4']
        self.assertTrue(self.dependency_collection_verifier.not_all_dependencies_met(), "Expected not all dependencies to be met")

    def test_can_list_unmet_dependency_names(self):
        """fab.tests.dependency.verifier.dependency_collection_verifier_test  Can list unmet dependency names"""

        self.dependency_collection_verifier.unmet_dependencies = ['package1', 'package4']

        self.assertEqual("package1, package4", self.dependency_collection_verifier.unmet_dependency_names())


def suite():
    return TestSuiteLoader().load_tests_from(DependencyCollectionVerifierTest)

if __name__ == "__main__":
    from fab.tests.test_settings import TEST_MODE
    TestRunner(TEST_MODE).run_test_suite(suite())
