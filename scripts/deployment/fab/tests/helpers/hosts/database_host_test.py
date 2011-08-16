#!/usr/bin/env python

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


import mox

from testing.helpers.execution import TestSuiteLoader, TestRunner

from fab.helpers.filesystem import FileSystem
from fab.helpers.hosts import DatabaseHost
from fab.helpers.hosts import RemoteHost
from fab.helpers.virtualenv import VirtualEnv


class DatabaseHostTest(mox.MoxTestBase):

    def setUp(self):
        super(DatabaseHostTest, self).setUp()
        self.mock_remote_host = self.mox.CreateMock(RemoteHost)
        self.mock_file_system = self.mox.CreateMock(FileSystem)
        self.mock_virtualenv = self.mox.CreateMock(VirtualEnv)

        self.mock_remote_host.feedback = None # not actually used for the purposes of this test
        self.database_host = DatabaseHost(self.mock_remote_host, self.mock_file_system, self.mock_virtualenv)

    def test_can_create_databasehost_instance(self):
        """fab.tests.helpers.hosts.database_host_test  Can create a DatabaseHost instance"""

        self.assertTrue(isinstance(DatabaseHost.create_instance("/some/virtualenv/path"), DatabaseHost))

    def test_can_ensure_directory_exists(self):
        """fab.tests.helpers.hosts.database_host_test  Can ensure a directory exists"""

        new_dir = "/var/new/dir"

        self.mock_file_system.ensure_directory_exists(new_dir)
        self.mox.ReplayAll()

        self.database_host.ensure_directory_exists(new_dir)

    def test_can_ensure_directory_exists_with_sudo(self):
        """fab.tests.helpers.hosts.database_host_test  Can ensure a directory exists with sudo"""

        new_dir = "/var/new/dir"

        self.mock_file_system.ensure_directory_exists_with_sudo(new_dir)
        self.mox.ReplayAll()

        self.database_host.ensure_directory_exists_with_sudo(new_dir)

    def test_can_make_file_writable_for_all_users(self):
        """fab.tests.helpers.hosts.database_host_test  Can make a file writable for all users"""

        expected_file_path = "/some/dir/file.txt"

        self.mock_file_system.make_file_writable_for_all_users(expected_file_path)
        self.mox.ReplayAll()

        self.database_host.make_file_writable_for_all_users(expected_file_path)

    def test_can_delete_directory(self):
        """fab.tests.helpers.hosts.database_host_test  Can delete a directory"""

        expected_dir_to_delete = "/some/dir/to/delete"

        self.mock_file_system.delete_directory(expected_dir_to_delete)
        self.mox.ReplayAll()

        self.database_host.delete_directory(expected_dir_to_delete)

    def test_can_compress_directory(self):
        """fab.tests.helpers.hosts.database_host_test  Can compress a directory"""

        expected_dir_to_compress = "/some/dir/to/compress"

        self.mock_file_system.compress_directory(expected_dir_to_compress)
        self.mox.ReplayAll()

        self.database_host.compress_directory(expected_dir_to_compress)

    def test_can_run_command_within_virtualenv(self):
        """fab.tests.helpers.hosts.database_host_test  Can run command within virtualenv"""

        self.mock_virtualenv.run_within_virtualenv("some command")
        self.mox.ReplayAll()

        self.database_host.run_within_virtualenv("some command")


def suite():
    return TestSuiteLoader().load_tests_from(DatabaseHostTest)

if __name__ == "__main__":
    from fab.tests.test_settings import TEST_MODE
    TestRunner(TEST_MODE).run_test_suite(suite())
