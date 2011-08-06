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
        self.mock_remote_host = self.mox.CreateMock(RemoteHost)
        self.mock_feedback = self.mox.CreateMock(ExecutionFeedback)

        self.mock_remote_host.feedback = self.mock_feedback
        self.file_system = FileSystem(self.mock_remote_host)

    def test_can_verify_file_existence(self):
        """fab.tests.helpers.file_system_test  Can verify file existence"""

        expected_file_path = "/path/to/file.txt"
        self.mock_remote_host.path_exists(expected_file_path).AndReturn(True)
        self.mox.ReplayAll()

        self.assertTrue(self.file_system.file_exists(expected_file_path), "Expected file to exist")

    def test_can_verify_directory_existence(self):
        """fab.tests.helpers.file_system_test  Can verify directory existence"""

        expected_dir_path = "/path/to/dir"
        self.mock_remote_host.path_exists(expected_dir_path).AndReturn(True)
        self.mox.ReplayAll()

        self.assertTrue(self.file_system.directory_exists(expected_dir_path), "Expected directory to exist")

    def test_will_exit_if_file_does_not_exist(self):
        """fab.tests.helpers.file_system_test  Will exit if file does not exist"""

        nonexistent_file = "/nonexistent/file.txt"
        self.mock_remote_host.path_exists(nonexistent_file).AndReturn(False)
        expected_missing_file_message = "Expected file does not exist: %s" % nonexistent_file
        self.mock_feedback.abort(expected_missing_file_message).AndRaise(SystemExit(expected_missing_file_message))
        self.mox.ReplayAll()

        try:
            self.file_system.exit_if_file_does_not_exist(nonexistent_file)
            self.fail("Should have raised a SystemExit exception for a nonexistent file")
        except SystemExit:
            pass # expected

    def test_will_confirm_file_existence_and_not_exit_if_file_exists(self):
        """fab.tests.helpers.file_system_test  Will confirm file existence and not exit if file exists"""

        common_system_file = "/usr/bin/man"
        self.mock_remote_host.path_exists(common_system_file).AndReturn(True)
        self.mock_feedback.comment("Found expected file: %s" % common_system_file)
        self.mox.ReplayAll()

        self.file_system.exit_if_file_does_not_exist(common_system_file)

    def test_will_exit_if_directory_does_not_exist(self):
        """fab.tests.helpers.file_system_test  Will exit if directory does not exist"""

        nonexistent_dir = "/nonexistent/path"
        self.mock_remote_host.path_exists(nonexistent_dir).AndReturn(False)
        expected_missing_dir_message = "Expected directory does not exist: %s" % nonexistent_dir
        self.mock_feedback.abort(expected_missing_dir_message).AndRaise(SystemExit(expected_missing_dir_message))
        self.mox.ReplayAll()

        try:
            self.file_system.exit_if_directory_does_not_exist(nonexistent_dir)
            self.fail("Should have raised a SystemExit exception for a nonexistent directory")
        except SystemExit:
            pass # expected

    def test_will_confirm_directory_existence_and_not_exit_if_directory_exists(self):
        """fab.tests.helpers.file_system_test  Will confirm directory existence and not exit if directory exists"""

        common_system_dir = "/usr/bin"
        self.mock_remote_host.path_exists(common_system_dir).AndReturn(True)
        self.mock_feedback.comment("Found expected directory: %s" % common_system_dir)
        self.mox.ReplayAll()

        self.file_system.exit_if_directory_does_not_exist(common_system_dir)

    def test_can_create_directory(self):
        """fab.tests.helpers.file_system_test  Can create directory"""

        new_dir = "/var/tmp/packages"
        self.mock_feedback.comment("Creating directory: %s" % new_dir)
        self.mock_remote_host.run("mkdir %s" % new_dir)
        self.mock_remote_host.run("chmod 755 %s" % new_dir)
        self.mox.ReplayAll()

        self.file_system.create_directory(new_dir)

    def test_can_create_directory_with_sudo(self):
        """fab.tests.helpers.file_system_test  Can create directory with sudo"""

        new_dir = "/var/tmp/packages"
        self.mock_feedback.comment("Creating directory: %s" % new_dir)
        self.mock_remote_host.sudo("mkdir %s" % new_dir)
        self.mock_remote_host.sudo("chmod 755 %s" % new_dir)
        self.mox.ReplayAll()

        self.file_system.create_directory_with_sudo(new_dir)

    def test_will_confirm_existing_directory_when_ensuring_directory_exists(self):
        """fab.tests.helpers.file_system_test  Will confirm existing directory when ensuring directory exists"""

        existing_dir = "/var/tmp"
        self.mock_remote_host.path_exists(existing_dir).AndReturn(True)
        self.mock_feedback.comment("Found expected directory: %s" % existing_dir)
        self.mox.ReplayAll()

        self.file_system.ensure_directory_exists(existing_dir)

    def test_can_ensure_missing_directory_is_created(self):
        """fab.tests.helpers.file_system_test  Can ensure missing directory is created"""

        new_dir = "/var/tmp/packages"
        self.mock_remote_host.path_exists(new_dir).AndReturn(False)
        self.mock_feedback.comment("Creating directory: %s" % new_dir)
        self.mock_remote_host.run("mkdir %s" % new_dir)
        self.mock_remote_host.run("chmod 755 %s" % new_dir)
        self.mox.ReplayAll()

        self.file_system.ensure_directory_exists(new_dir)

    def test_will_confirm_existing_directory_when_ensuring_directory_exists_with_sudo(self):
        """fab.tests.helpers.file_system_test  Will confirm existing directory when ensuring directory exists with sudo"""

        existing_dir = "/var/tmp"
        self.mock_remote_host.path_exists(existing_dir).AndReturn(True)
        self.mock_feedback.comment("Found expected directory: %s" % existing_dir)
        self.mox.ReplayAll()

        self.file_system.ensure_directory_exists_with_sudo(existing_dir)

    def test_can_ensure_missing_directory_is_created_with_sudo(self):
        """fab.tests.helpers.file_system_test  Can ensure missing directory is created with sudo"""

        new_dir = "/var/tmp/packages"
        self.mock_remote_host.path_exists(new_dir).AndReturn(False)
        self.mock_feedback.comment("Creating directory: %s" % new_dir)
        self.mock_remote_host.sudo("mkdir %s" % new_dir)
        self.mock_remote_host.sudo("chmod 755 %s" % new_dir)
        self.mox.ReplayAll()

        self.file_system.ensure_directory_exists_with_sudo(new_dir)

    def test_can_delete_an_existing_file(self):
        """fab.tests.helpers.file_system_test  Can delete an existing file"""

        unwanted_file = "/var/tmp/unwanted_file.txt"
        self._set_expectations_for_deleting("file", unwanted_file, self.mock_remote_host.run)

        self.file_system.delete_file(unwanted_file)

    def test_can_delete_an_existing_file_with_sudo(self):
        """fab.tests.helpers.file_system_test  Can delete an existing file with sudo"""

        unwanted_file = "/var/tmp/unwanted_file.txt"
        self._set_expectations_for_deleting("file", unwanted_file, self.mock_remote_host.sudo)

        self.file_system.delete_file_with_sudo(unwanted_file)

    def test_do_nothing_on_attempt_to_delete_a_nonexistent_file(self):
        """fab.tests.helpers.file_system_test  Do nothing on attempt to delete a nonexistent file"""

        nonexistent_file = "/var/tmp/wibble.txt"
        self.mock_remote_host.path_exists(nonexistent_file).AndReturn(False)
        self.mox.ReplayAll()

        self.file_system.delete_file(nonexistent_file)

    def test_do_nothing_on_attempt_to_delete_a_nonexistent_file_with_sudo(self):
        """fab.tests.helpers.file_system_test  Do nothing on attempt to delete a nonexistent file with sudo"""

        nonexistent_file = "/var/tmp/wibble.txt"
        self.mock_remote_host.path_exists(nonexistent_file).AndReturn(False)
        self.mox.ReplayAll()

        self.file_system.delete_file_with_sudo(nonexistent_file)

    def test_can_delete_an_existing_directory(self):
        """fab.tests.helpers.file_system_test  Can delete an existing directory"""

        unwanted_dir = "/var/tmp/unwanted_dir"
        self._set_expectations_for_deleting("directory", unwanted_dir, self.mock_remote_host.run)

        self.file_system.delete_directory(unwanted_dir)

    def test_can_delete_an_existing_directory_with_sudo(self):
        """fab.tests.helpers.file_system_test  Can delete an existing directory with sudo"""

        unwanted_dir = "/var/tmp/unwanted_dir"
        self._set_expectations_for_deleting("directory", unwanted_dir, self.mock_remote_host.sudo)

        self.file_system.delete_directory_with_sudo(unwanted_dir)

    def test_do_nothing_on_attempt_to_delete_a_nonexistent_directory(self):
        """fab.tests.helpers.file_system_test  Do nothing on attempt to delete a nonexistent directory"""

        nonexistent_dir = "/var/tmp/wibble_dir"
        self.mock_remote_host.path_exists(nonexistent_dir).AndReturn(False)
        self.mox.ReplayAll()

        self.file_system.delete_directory(nonexistent_dir)

    def test_do_nothing_on_attempt_to_delete_a_nonexistent_directory_with_sudo(self):
        """fab.tests.helpers.file_system_test  Do nothing on attempt to delete a nonexistent directory with sudo"""

        nonexistent_dir = "/var/tmp/wibble_dir"
        self.mock_remote_host.path_exists(nonexistent_dir).AndReturn(False)
        self.mox.ReplayAll()

        self.file_system.delete_directory_with_sudo(nonexistent_dir)

    def _set_expectations_for_deleting(self, file_or_dir, unwanted_file_or_dir_path, expected_run_command):
        self.mock_remote_host.path_exists(unwanted_file_or_dir_path).AndReturn(True)
        self.mock_feedback.comment(mox.StrContains("Deleting %s: %s" % (file_or_dir, unwanted_file_or_dir_path)))
        expected_run_command("rm -r %s" % unwanted_file_or_dir_path)
        self.mox.ReplayAll()

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
        self.mock_remote_host.run("tar -cjf %s.tar.bz2 %s" % (compressed_file_name, compressed_file_name))
        self.mox.ReplayAll()


def suite():
    return TestSuiteLoader().load_tests_from(FileSystemTest)

if __name__ == "__main__":
    from fab.tests.test_settings import TEST_MODE
    TestRunner(TEST_MODE).run_test_suite(suite())
