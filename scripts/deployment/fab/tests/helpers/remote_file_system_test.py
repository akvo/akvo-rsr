#!/usr/bin/env python

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


import mox, os

from testing.helpers.execution import TestSuiteLoader, TestRunner

from fab.helpers.feedback import ExecutionFeedback
from fab.helpers.filesystem import RemoteFileSystem
from fab.host.controller import RemoteHostController


class RemoteFileSystemTest(mox.MoxTestBase):

    def setUp(self):
        super(RemoteFileSystemTest, self).setUp()
        self.mock_host_controller = self.mox.CreateMock(RemoteHostController)
        self.mock_feedback = self.mox.CreateMock(ExecutionFeedback)

        self.mock_host_controller.feedback = self.mock_feedback
        self.file_system = RemoteFileSystem(self.mock_host_controller)

    def test_can_download_file(self):
        """fab.tests.helpers.remote_file_system_test  Can download a file"""

        remote_file_path = "/var/some/dir/file.zip"
        local_directory = "/var/tmp/archives"
        self.mock_host_controller.get(remote_file_path, local_directory)
        self.mox.ReplayAll()

        self.file_system.download_file(remote_file_path, local_directory)

    def test_can_compress_directory(self):
        """fab.tests.helpers.remote_file_system_test  Can compress a specified directory"""

        dir_to_compress = "/var/some/archive_dir"
        self._set_expected_compression_path_and_compressed_file_name(dir_to_compress, "archive_dir")

        self.file_system.compress_directory(dir_to_compress)

    def test_can_compress_directory_with_trailing_path_separator(self):
        """fab.tests.helpers.remote_file_system_test  Can compress a specified directory even with a trailing path separator"""

        dir_to_compress = "/var/some/archive_dir/"
        self._set_expected_compression_path_and_compressed_file_name(dir_to_compress.rstrip("/"), "archive_dir")

        self.file_system.compress_directory(dir_to_compress)

    def _set_expected_compression_path_and_compressed_file_name(self, dir_to_compress, compressed_file_name):
        self.mock_feedback.comment("Compressing %s" % dir_to_compress)
        self.mock_host_controller.run("tar -cjf %s.tar.bz2 %s" % (compressed_file_name, compressed_file_name))
        self.mox.ReplayAll()

    def test_can_decompress_code_archive(self):
        """fab.tests.helpers.remote_file_system_test  Can decompress a code archive"""

        archive_file = "rsr_v1.0.10.zip"
        destination_dir = "/var/tmp/unpack"
        self.mock_host_controller.run("unzip -q %s -d %s -x %s" % (archive_file, destination_dir, RemoteFileSystem.CODE_ARCHIVE_EXCLUSIONS))
        self.mox.ReplayAll()

        self.file_system.decompress_code_archive(archive_file, destination_dir)


def suite():
    return TestSuiteLoader().load_tests_from(RemoteFileSystemTest)

if __name__ == "__main__":
    from fab.tests.test_settings import TEST_MODE
    TestRunner(TEST_MODE).run_test_suite(suite())
