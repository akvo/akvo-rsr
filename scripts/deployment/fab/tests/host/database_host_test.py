#!/usr/bin/env python

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


import mox

from testing.helpers.execution import TestSuiteLoader, TestRunner

from fab.environment.python.virtualenv import VirtualEnv
from fab.host.database import DatabaseHost
from fab.os.filesystem import FileSystem


class DatabaseHostTest(mox.MoxTestBase):

    def setUp(self):
        super(DatabaseHostTest, self).setUp()
        self.mock_file_system = self.mox.CreateMock(FileSystem)
        self.mock_virtualenv = self.mox.CreateMock(VirtualEnv)

        # the feedback dependency doesn't have any calls in this test so we pass None
        self.database_host = DatabaseHost(self.mock_file_system, self.mock_virtualenv, None)

    def test_can_create_databasehost_instance(self):
        """fab.tests.host.database_host_test  Can create a DatabaseHost instance"""

        self.assertIsInstance(DatabaseHost.create_instance("/some/virtualenv/path"), DatabaseHost)

    def test_can_ensure_directory_exists(self):
        """fab.tests.host.database_host_test  Can ensure a directory exists"""

        new_dir = "/var/new/dir"

        self.mock_file_system.ensure_directory_exists(new_dir)
        self.mox.ReplayAll()

        self.database_host.ensure_directory_exists(new_dir)

    def test_can_ensure_directory_exists_with_sudo(self):
        """fab.tests.host.database_host_test  Can ensure a directory exists with sudo"""

        new_dir = "/var/new/dir"

        self.mock_file_system.ensure_directory_exists_with_sudo(new_dir)
        self.mox.ReplayAll()

        self.database_host.ensure_directory_exists_with_sudo(new_dir)

    def test_can_delete_directory(self):
        """fab.tests.host.database_host_test  Can delete a directory"""

        expected_dir_to_delete = "/some/dir/to/delete"

        self.mock_file_system.delete_directory(expected_dir_to_delete)
        self.mox.ReplayAll()

        self.database_host.delete_directory(expected_dir_to_delete)

    def test_can_compress_directory(self):
        """fab.tests.host.database_host_test  Can compress a directory"""

        expected_dir_to_compress = "/some/dir/to/compress"

        self.mock_file_system.compress_directory(expected_dir_to_compress)
        self.mox.ReplayAll()

        self.database_host.compress_directory(expected_dir_to_compress)

    def test_can_download_file_to_local_directory(self):
        """fab.tests.host.database_host_test  Can download remote file to a local directory"""

        remote_file_path = "/some/dir/file.zip"
        local_dir = "/var/tmp"

        self.mock_file_system.download_file(remote_file_path, local_dir)
        self.mox.ReplayAll()

        self.database_host.download_file_to_local_directory(remote_file_path, local_dir)

    def test_can_run_command_within_virtualenv(self):
        """fab.tests.host.database_host_test  Can run command within virtualenv"""

        self.mock_virtualenv.run_within_virtualenv("some command")
        self.mox.ReplayAll()

        self.database_host.run_within_virtualenv("some command")


def suite():
    return TestSuiteLoader().load_tests_from(DatabaseHostTest)

if __name__ == "__main__":
    from fab.tests.test_settings import TEST_MODE
    TestRunner(TEST_MODE).run_test_suite(suite())
