#!/usr/bin/env python

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


import mox

from testing.helpers.execution import TestSuiteLoader, TestRunner

from fab.helpers.filesystem import FileSystem
from fab.helpers.hosts import DeploymentHost


class HostsTest(mox.MoxTestBase):

    def setUp(self):
        super(HostsTest, self).setUp()
        self.mock_file_system = self.mox.CreateMock(FileSystem)

        self.deployment_host = DeploymentHost(self.mock_file_system)

    def test_can_create_a_deploymenthost_instance(self):
        """fab.tests.helpers.hosts_test  Can create a DeploymentHost instance"""

        DeploymentHost.create_instance()

    def test_can_compress_directory_on_remote_host(self):
        """fab.tests.helpers.hosts_test  Can compress directory on remote host"""

        expected_dir_to_compress = "/some/dir/to/compress"

        self.mock_file_system.compress_directory(expected_dir_to_compress)
        self.mox.ReplayAll()

        self.deployment_host.compress_directory(expected_dir_to_compress)

    def test_can_delete_file_on_remote_host(self):
        """fab.tests.helpers.hosts_test  Can delete file on remote host"""

        expected_file_path = "/some/dir/file_to_delete.txt"

        self.mock_file_system.delete_file(expected_file_path)
        self.mox.ReplayAll()

        self.deployment_host.delete_file(expected_file_path)

    def test_can_delete_file_with_sudo_on_remote_host(self):
        """fab.tests.helpers.hosts_test  Can delete file with sudo on remote host"""

        expected_file_path = "/some/dir/file_to_delete.txt"

        self.mock_file_system.delete_file_with_sudo(expected_file_path)
        self.mox.ReplayAll()

        self.deployment_host.delete_file_with_sudo(expected_file_path)

    def test_can_delete_directory_on_remote_host(self):
        """fab.tests.helpers.hosts_test  Can delete directory on remote host"""

        expected_dir_to_delete = "/some/dir/to/delete"

        self.mock_file_system.delete_directory(expected_dir_to_delete)
        self.mox.ReplayAll()

        self.deployment_host.delete_directory(expected_dir_to_delete)

    def test_can_delete_directory_with_sudo_on_remote_host(self):
        """fab.tests.helpers.hosts_test  Can delete directory with sudo on remote host"""

        expected_dir_to_delete = "/some/dir/to/delete"

        self.mock_file_system.delete_directory_with_sudo(expected_dir_to_delete)
        self.mox.ReplayAll()

        self.deployment_host.delete_directory_with_sudo(expected_dir_to_delete)


def suite():
    return TestSuiteLoader().load_tests_from(HostsTest)

if __name__ == "__main__":
    from fab.tests.test_settings import TEST_MODE
    TestRunner(TEST_MODE).run_test_suite(suite())
