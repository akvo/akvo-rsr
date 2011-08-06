#!/usr/bin/env python

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


import mox

from testing.helpers.execution import TestSuiteLoader, TestRunner

from fab.helpers.filesystem import FileSystem
from fab.helpers.hosts import NeutralHost


class NeutralHostTest(mox.MoxTestBase):

    def setUp(self):
        super(NeutralHostTest, self).setUp()
        self.mock_file_system = self.mox.CreateMock(FileSystem)

        self.neutral_host = NeutralHost(self.mock_file_system)

    def test_can_create_neutralhost_instance(self):
        """fab.tests.helpers.hosts.neutral_host_test  Can create a NeutralHost instance"""

        self.assertTrue(isinstance(NeutralHost.create_instance(), NeutralHost))

    def test_can_check_whether_file_exists(self):
        """fab.tests.helpers.hosts.neutral_host_test  Can check whether file exists"""

        existing_file = "/usr/bin/man"
        self.mock_file_system.file_exists(existing_file).AndReturn(True)
        self.mox.ReplayAll()

        self.assertTrue(self.neutral_host.file_exists(existing_file), "Expected file to exist")

    def test_can_check_whether_directory_exists(self):
        """fab.tests.helpers.hosts.neutral_host_test  Can check whether directory exists"""

        existing_dir = "/usr/bin"
        self.mock_file_system.directory_exists(existing_dir).AndReturn(True)
        self.mox.ReplayAll()

        self.assertTrue(self.neutral_host.directory_exists(existing_dir), "Expected directory to exist")

    def test_will_exit_if_file_does_not_exist(self):
        """fab.tests.helpers.hosts.neutral_host_test  Will exit if file does not exist"""

        nonexistent_file = "/path/to/nonexistent_file.txt"
        self.mock_file_system.exit_if_file_does_not_exist(nonexistent_file)
        self.mox.ReplayAll()

        self.neutral_host.exit_if_file_does_not_exist(nonexistent_file)

    def test_will_exit_if_directory_does_not_exist(self):
        """fab.tests.helpers.hosts.neutral_host_test  Will exit if directory does not exist"""

        nonexistent_dir = "/path/to/nonexistent/dir"
        self.mock_file_system.exit_if_directory_does_not_exist(nonexistent_dir)
        self.mox.ReplayAll()

        self.neutral_host.exit_if_directory_does_not_exist(nonexistent_dir)


def suite():
    return TestSuiteLoader().load_tests_from(NeutralHostTest)

if __name__ == "__main__":
    from fab.tests.test_settings import TEST_MODE
    TestRunner(TEST_MODE).run_test_suite(suite())
