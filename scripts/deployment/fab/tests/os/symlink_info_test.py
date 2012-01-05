#!/usr/bin/env python

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


import mox

from testing.helpers.execution import TestSuiteLoader, TestRunner

from fab.host.controller import RemoteHostController
from fab.os.symlink import SymlinkInfo


class SymlinkInfoTest(mox.MoxTestBase):

    def setUp(self):
        super(SymlinkInfoTest, self).setUp()
        self.mock_host_controller = self.mox.CreateMock(RemoteHostController)

        self.symlink_path = "/path/to/symlink"

        self.symlink = SymlinkInfo(self.symlink_path, self.mock_host_controller)

    def test_can_verify_symlink_existence(self):
        """fab.tests.os.symlink_info_test  Can verify symlink existence"""

        self.mock_host_controller.path_exists(self.symlink_path).AndReturn(True)
        self.mox.ReplayAll()

        self.assertTrue(self.symlink.exists(), "Expected symlink to be found")

    def test_can_verify_linked_path_existence(self):
        """fab.tests.os.symlink_info_test  Can verify linked path existence"""

        real_path = "/some/real/path"

        self.mock_host_controller.run("readlink %s" % self.symlink_path).AndReturn(real_path)
        self.mock_host_controller.path_exists(real_path).AndReturn(True)
        self.mox.ReplayAll()

        self.assertTrue(self.symlink.linked_path_exists(), "Expected linked path to be found")

    def test_can_recognise_unbroken_symlink(self):
        """fab.tests.os.symlink_info_test  Can recognise an unbroken symlink"""

        unbroken_path = "/some/existing/path"

        self.mock_host_controller.run("readlink %s" % self.symlink_path).AndReturn(unbroken_path)
        self.mock_host_controller.path_exists(unbroken_path).AndReturn(True)
        self.mox.ReplayAll()

        self.assertTrue(self.symlink.is_unbroken(), "Expected symlink to be unbroken")

    def test_can_recognise_broken_symlink(self):
        """fab.tests.os.symlink_info_test  Can recognise a broken symlink"""

        broken_path = "/some/nonexistent/path"

        self.mock_host_controller.run("readlink %s" % self.symlink_path).AndReturn(broken_path)
        self.mock_host_controller.path_exists(broken_path).AndReturn(False)
        self.mox.ReplayAll()

        self.assertTrue(self.symlink.is_broken(), "Expected symlink to be broken")

    def test_can_recognise_matching_linked_path(self):
        """fab.tests.os.symlink_info_test  Can recognise a matching linked path"""

        self.mock_host_controller.run("readlink %s" % self.symlink_path).AndReturn("/matched/path")
        self.mox.ReplayAll()

        self.assertTrue(self.symlink.is_linked_to("/matched/path"), "Expected linked path to match")

    def test_can_recognise_non_matching_linked_path(self):
        """fab.tests.os.symlink_info_test  Can recognise a non-matching linked path"""

        self.mock_host_controller.run("readlink %s" % self.symlink_path).AndReturn("/some/path")
        self.mox.ReplayAll()

        self.assertFalse(self.symlink.is_linked_to("/another/path"), "Expected linked path not to match")


def suite():
    return TestSuiteLoader().load_tests_from(SymlinkInfoTest)

if __name__ == "__main__":
    from fab.tests.test_settings import TEST_MODE
    TestRunner(TEST_MODE).run_test_suite(suite())
