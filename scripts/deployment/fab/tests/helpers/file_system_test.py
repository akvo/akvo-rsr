#!/usr/bin/env python

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


import mox, os

from testing.helpers.execution import TestSuiteLoader, TestRunner

from fab.helpers.feedback import ExecutionFeedback
from fab.helpers.filesystem import FileSystem
from fab.helpers.hosts import RemoteHost


class FileSystemTest(mox.MoxTestBase):

    def setUp(self):
        super(FileSystemTest, self).setUp()
        self.mock_deployment_host = self.mox.CreateMock(RemoteHost)
        self.mock_feedback = self.mox.CreateMock(ExecutionFeedback)

        self.file_system = FileSystem(self.mock_deployment_host, self.mock_feedback)

    def test_can_compress_directory(self):
        """fab.tests.helpers.file_system_test  Can compress a specified directory"""

        dir_to_compress = "/var/some/archive_dir"
        self._set_expected_compression_path_and_compressed_file_name(dir_to_compress, "archive_dir")

        self.file_system.compress_directory(dir_to_compress)

    def test_can_compress_directory_with_trailing_path_separator(self):
        """fab.tests.helpers.file_system_test  Can compress a specified directory even with a trailing path separator"""

        dir_to_compress = "/var/some/archive_dir/"
        self._set_expected_compression_path_and_compressed_file_name(dir_to_compress.rstrip("/"), "archive_dir")

        self.file_system.compress_directory(dir_to_compress)

    def _set_expected_compression_path_and_compressed_file_name(self, dir_to_compress, compressed_file_name):
        self.mock_feedback.comment(mox.StrContains("Compressing %s" % dir_to_compress))
        self.mock_deployment_host.run("tar -cjf %s.tar.bz2 %s" % (compressed_file_name, compressed_file_name))
        self.mox.ReplayAll()

    def test_can_delete_an_existing_file(self):
        """fab.tests.helpers.file_system_test  Can delete an existing file"""

        unwanted_file = "/var/tmp/unwanted_file.txt"
        self._set_expectations_for_deleting("file", unwanted_file, self.mock_deployment_host.run)

        self.file_system.delete_file(unwanted_file)

    def test_can_delete_an_existing_file_with_sudo(self):
        """fab.tests.helpers.file_system_test  Can delete an existing file with sudo"""

        unwanted_file = "/var/tmp/unwanted_file.txt"
        self._set_expectations_for_deleting("file", unwanted_file, self.mock_deployment_host.sudo)

        self.file_system.delete_file_with_sudo(unwanted_file)

    def test_do_nothing_on_attempt_to_delete_a_nonexistent_file(self):
        """fab.tests.helpers.file_system_test  Do nothing on attempt to delete a nonexistent file"""

        nonexistent_file = "/var/tmp/wibble.txt"
        self.mock_deployment_host.path_exists(nonexistent_file).AndReturn(False)
        self.mox.ReplayAll()

        self.file_system.delete_file(nonexistent_file)

    def test_do_nothing_on_attempt_to_delete_a_nonexistent_file_with_sudo(self):
        """fab.tests.helpers.file_system_test  Do nothing on attempt to delete a nonexistent file with sudo"""

        nonexistent_file = "/var/tmp/wibble.txt"
        self.mock_deployment_host.path_exists(nonexistent_file).AndReturn(False)
        self.mox.ReplayAll()

        self.file_system.delete_file_with_sudo(nonexistent_file)

    def test_can_delete_an_existing_directory(self):
        """fab.tests.helpers.file_system_test  Can delete an existing directory"""

        unwanted_dir = "/var/tmp/unwanted_dir"
        self._set_expectations_for_deleting("directory", unwanted_dir, self.mock_deployment_host.run)

        self.file_system.delete_directory(unwanted_dir)

    def test_can_delete_an_existing_directory_with_sudo(self):
        """fab.tests.helpers.file_system_test  Can delete an existing directory with sudo"""

        unwanted_dir = "/var/tmp/unwanted_dir"
        self._set_expectations_for_deleting("directory", unwanted_dir, self.mock_deployment_host.sudo)

        self.file_system.delete_directory_with_sudo(unwanted_dir)

    def test_do_nothing_on_attempt_to_delete_a_nonexistent_directory(self):
        """fab.tests.helpers.file_system_test  Do nothing on attempt to delete a nonexistent directory"""

        nonexistent_dir = "/var/tmp/wibble_dir"
        self.mock_deployment_host.path_exists(nonexistent_dir).AndReturn(False)
        self.mox.ReplayAll()

        self.file_system.delete_directory(nonexistent_dir)

    def test_do_nothing_on_attempt_to_delete_a_nonexistent_directory_with_sudo(self):
        """fab.tests.helpers.file_system_test  Do nothing on attempt to delete a nonexistent directory with sudo"""

        nonexistent_dir = "/var/tmp/wibble_dir"
        self.mock_deployment_host.path_exists(nonexistent_dir).AndReturn(False)
        self.mox.ReplayAll()

        self.file_system.delete_directory_with_sudo(nonexistent_dir)

    def _set_expectations_for_deleting(self, file_or_dir, unwanted_file_or_dir_path, expected_run_command):
        self.mock_deployment_host.path_exists(unwanted_file_or_dir_path).AndReturn(True)
        self.mock_feedback.comment(mox.StrContains("Deleting %s: %s" % (file_or_dir, unwanted_file_or_dir_path)))
        expected_run_command("rm -r %s" % unwanted_file_or_dir_path)
        self.mox.ReplayAll()


def suite():
    return TestSuiteLoader().load_tests_from(FileSystemTest)

if __name__ == "__main__":
    from fab.tests.test_settings import TEST_MODE
    TestRunner(TEST_MODE).run_test_suite(suite())
