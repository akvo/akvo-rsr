#!/usr/bin/env python

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


import fabric.api
import mox

from testing.helpers.execution import TestSuiteLoader, TestRunner

from fab.host.controller import RemoteHostController
from fab.os.linux.packageinfo import UbuntuPackageInfo
from fab.os.linux.packageinspector import UbuntuPackageInspector


class UbuntuPackageInspectorTest(mox.MoxTestBase):

    def setUp(self):
        super(UbuntuPackageInspectorTest, self).setUp()
        self.mock_host_controller = self.mox.CreateMock(RemoteHostController)

        self.package_inspector = UbuntuPackageInspector(self.mock_host_controller)

    def test_can_get_package_info_for_specified_package(self):
        """fab.tests.os.linux.ubuntu_package_inspector_test  Can get package info for a specified package"""

        package_info_text = "\r\n".join(["Package: linux-libc-dev",
                                         "State: installed",
                                         "Automatically installed: no",
                                         "Version: 2.6.24-29.93",
                                         "Priority: optional",
                                         "Section: devel"])

        self.mock_host_controller.hide_command_and_output().AndReturn(fabric.api.hide('stdout'))
        self.mock_host_controller.run("aptitude show linux-libc-dev").AndReturn(package_info_text)
        self.mox.ReplayAll()

        expected_package_info = UbuntuPackageInfo.from_text(package_info_text)

        self.assertEqual(expected_package_info, self.package_inspector.info_for("linux-libc-dev"))


def suite():
    return TestSuiteLoader().load_tests_from(UbuntuPackageInspectorTest)

if __name__ == "__main__":
    from fab.tests.test_settings import TEST_MODE
    TestRunner(TEST_MODE).run_test_suite(suite())
