#!/usr/bin/env python

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


import fabric.api
import mox

from testing.helpers.execution import TestSuiteLoader, TestRunner

from fab.helpers.filesystem import FileSystem
from fab.host.neutral import NeutralHost


class NeutralHostTest(mox.MoxTestBase):

    def setUp(self):
        super(NeutralHostTest, self).setUp()
        self.mock_file_system = self.mox.CreateMock(FileSystem)

        # the feedback dependency doesn't have any calls in this test so we pass None
        self.neutral_host = NeutralHost(self.mock_file_system, None)

    def test_can_change_directory(self):
        """fab.tests.host.neutral_host_test  Can change directory"""

        dir_path = "/var/tmp/foo"
        changed_context = fabric.api.cd(dir_path)
        self.mock_file_system.cd(dir_path).AndReturn(changed_context)
        self.mox.ReplayAll()

        self.assertIs(changed_context, self.neutral_host.cd(dir_path))

    def test_can_check_whether_file_exists(self):
        """fab.tests.host.neutral_host_test  Can check whether file exists"""

        existing_file = "/usr/bin/man"
        self.mock_file_system.file_exists(existing_file).AndReturn(True)
        self.mox.ReplayAll()

        self.assertTrue(self.neutral_host.file_exists(existing_file), "Expected file to exist")

    def test_can_check_whether_directory_exists(self):
        """fab.tests.host.neutral_host_test  Can check whether directory exists"""

        existing_dir = "/usr/bin"
        self.mock_file_system.directory_exists(existing_dir).AndReturn(True)
        self.mox.ReplayAll()

        self.assertTrue(self.neutral_host.directory_exists(existing_dir), "Expected directory to exist")

    def test_will_exit_if_file_does_not_exist(self):
        """fab.tests.host.neutral_host_test  Will exit if file does not exist"""

        nonexistent_file = "/path/to/nonexistent_file.txt"
        self.mock_file_system.exit_if_file_does_not_exist(nonexistent_file)
        self.mox.ReplayAll()

        self.neutral_host.exit_if_file_does_not_exist(nonexistent_file)

    def test_will_exit_if_directory_does_not_exist(self):
        """fab.tests.host.neutral_host_test  Will exit if directory does not exist"""

        nonexistent_dir = "/path/to/nonexistent/dir"
        self.mock_file_system.exit_if_directory_does_not_exist(nonexistent_dir)
        self.mox.ReplayAll()

        self.neutral_host.exit_if_directory_does_not_exist(nonexistent_dir)

    def test_can_make_file_writable_for_all_users(self):
        """fab.tests.host.neutral_host_test  Can make a file writable for all users"""

        expected_file_path = "/some/dir/file.txt"

        self.mock_file_system.make_file_writable_for_all_users(expected_file_path)
        self.mox.ReplayAll()

        self.neutral_host.make_file_writable_for_all_users(expected_file_path)


def suite():
    return TestSuiteLoader().load_tests_from(NeutralHostTest)

if __name__ == "__main__":
    from fab.tests.test_settings import TEST_MODE
    TestRunner(TEST_MODE).run_test_suite(suite())
