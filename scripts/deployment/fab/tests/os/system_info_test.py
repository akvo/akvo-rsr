#!/usr/bin/env python

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


import mox

from testing.helpers.execution import TestSuiteLoader, TestRunner

from fab.host.controller import RemoteHostController
from fab.os.system import SystemInfo, SystemType


class SystemInfoTest(mox.MoxTestBase):

    def setUp(self):
        super(SystemInfoTest, self).setUp()
        self.mock_host_controller = self.mox.CreateMock(RemoteHostController)

    def test_initialiser_reads_system_name(self):
        """fab.tests.os.system_info_test  Initialiser reads system name"""

        self.mock_host_controller.run("uname -s").AndReturn(SystemType.LINUX)
        self.mox.ReplayAll()

        system_info = SystemInfo(self.mock_host_controller)

        self.assertEqual(system_info.system_type, SystemType.LINUX, "Expected Linux system to be recognised")

    def test_can_detect_linux_system(self):
        """fab.tests.os.system_info_test  Can detect a Linux system"""

        self.mock_host_controller.run("uname -s").AndReturn(SystemType.LINUX)
        self.mox.ReplayAll()

        self.assertTrue(SystemInfo(self.mock_host_controller).is_linux(), "Expected Linux system to be recognised")

    def test_can_detect_osx_system(self):
        """fab.tests.os.system_info_test  Can detect a Mac OS X system"""

        self.mock_host_controller.run("uname -s").AndReturn(SystemType.MAC_OSX)
        self.mox.ReplayAll()

        self.assertTrue(SystemInfo(self.mock_host_controller).is_osx(), "Expected Mac OS X system to be recognised")


def suite():
    return TestSuiteLoader().load_tests_from(SystemInfoTest)

if __name__ == "__main__":
    from fab.tests.test_settings import TEST_MODE
    TestRunner(TEST_MODE).run_test_suite(suite())
