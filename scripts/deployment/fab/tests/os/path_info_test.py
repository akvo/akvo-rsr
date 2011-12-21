#!/usr/bin/env python

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


import mox

from testing.helpers.execution import TestSuiteLoader, TestRunner

from fab.host.controller import RemoteHostController
from fab.os.path import PathInfo, PathType
from fab.os.system import SystemType


class PathInfoTest(mox.MoxTestBase):

    def setUp(self):
        super(PathInfoTest, self).setUp()
        self.mock_host_controller = self.mox.CreateMock(RemoteHostController)

    def test_initialiser_determines_path_type(self):
        """fab.tests.os.path_info_test  Initialiser determines path type"""

        self._set_expected_path_type_for(SystemType.LINUX, "/some/directory/path", PathType.DIRECTORY)
        self.mox.ReplayAll()

        path = PathInfo("/some/directory/path", self.mock_host_controller)

        self.assertEqual(path.path_type, PathType.DIRECTORY, "Expected directory path type")

    def test_can_determine_path_existence(self):
        """fab.tests.os.path_info_test  Can determine path existence"""

        self._set_expected_path_type_for(SystemType.LINUX, "/some/path", PathType.DIRECTORY)
        self.mock_host_controller.path_exists("/some/path").AndReturn(True)
        self.mox.ReplayAll()

        path = PathInfo("/some/path", self.mock_host_controller)

        self.assertTrue(path.exists(), "Expected path to exist")

    def test_can_recognise_linux_directory_path_type(self):
        """fab.tests.os.path_info_test  Can recognise a Linux directory path type"""

        self._set_expected_path_type_for(SystemType.LINUX, "/some/directory/path", "directory")
        self.mox.ReplayAll()

        path = PathInfo("/some/directory/path", self.mock_host_controller)

        self.assertTrue(path.is_directory(), "Expected a Linux directory path to be recognised")

    def test_can_recognise_linux_file_path_type(self):
        """fab.tests.os.path_info_test  Can recognise a Linux file path type"""

        self._set_expected_path_type_for(SystemType.LINUX, "/some/path/to/file.txt", "regular file")
        self.mox.ReplayAll()

        path = PathInfo("/some/path/to/file.txt", self.mock_host_controller)

        self.assertTrue(path.is_file(), "Expected a Linux file path to be recognised")

    def test_can_recognise_linux_symlink_path_type(self):
        """fab.tests.os.path_info_test  Can recognise a Linux symbolic link path type"""

        self._set_expected_path_type_for(SystemType.LINUX, "/some/path/to/symlink", "symbolic link")
        self.mox.ReplayAll()

        path = PathInfo("/some/path/to/symlink", self.mock_host_controller)

        self.assertTrue(path.is_symlink(), "Expected a Linux symbolic link path to be recognised")

    def test_can_recognise_mac_osx_directory_path_type(self):
        """fab.tests.os.path_info_test  Can recognise a Mac OS X directory path type"""

        self._set_expected_path_type_for(SystemType.MAC_OSX, "/some/directory/path", "Directory")
        self.mox.ReplayAll()

        path = PathInfo("/some/directory/path", self.mock_host_controller)

        self.assertTrue(path.is_directory(), "Expected a Mac OS X directory path to be recognised")

    def test_can_recognise_mac_osx_file_path_type(self):
        """fab.tests.os.path_info_test  Can recognise a Mac OS X file path type"""

        self._set_expected_path_type_for(SystemType.MAC_OSX, "/some/path/to/file.txt", "Regular File")
        self.mox.ReplayAll()

        path = PathInfo("/some/path/to/file.txt", self.mock_host_controller)

        self.assertTrue(path.is_file(), "Expected a Mac OS X file path to be recognised")

    def test_can_recognise_mac_osx_symlink_path_type(self):
        """fab.tests.os.path_info_test  Can recognise a Mac OS X symbolic link path type"""

        self._set_expected_path_type_for(SystemType.MAC_OSX, "/some/path/to/symlink", "Symbolic Link")
        self.mox.ReplayAll()

        path = PathInfo("/some/path/to/symlink", self.mock_host_controller)

        self.assertTrue(path.is_symlink(), "Expected a Mac OS X symbolic link path to be recognised")

    def _set_expected_path_type_for(self, system_type, path, expected_path_type_response):
        expected_path_type_query_format = { SystemType.LINUX: "-c %%%F", SystemType.MAC_OSX: "-f %%%HT" }[system_type]

        self.mock_host_controller.run("uname -s").AndReturn(system_type)
        self.mock_host_controller.run("stat %s %s" % (expected_path_type_query_format, path)).AndReturn(expected_path_type_response)


def suite():
    return TestSuiteLoader().load_tests_from(PathInfoTest)

if __name__ == "__main__":
    from fab.tests.test_settings import TEST_MODE
    TestRunner(TEST_MODE).run_test_suite(suite())
