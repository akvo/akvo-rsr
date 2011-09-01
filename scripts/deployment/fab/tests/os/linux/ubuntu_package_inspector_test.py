#!/usr/bin/env python

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


import fabric.api
import mox

from testing.helpers.execution import TestSuiteLoader, TestRunner

from fab.host.controller import RemoteHostController
from fab.os.linux.packageinspector import UbuntuPackageInspector


class UbuntuPackageInspectorTest(mox.MoxTestBase):

    def setUp(self):
        super(UbuntuPackageInspectorTest, self).setUp()
        self.mock_host_controller = self.mox.CreateMock(RemoteHostController)

        self.package_inspector = UbuntuPackageInspector(self.mock_host_controller)

    def test_can_get_package_info_for_specified_package(self):
        """fab.tests.os.linux.ubuntu_package_inspector_test  Can get package info for a specified package"""

        expected_package_info = "some\r\nlibc6\r\npackage info"
        self.mock_host_controller.hide('stdout').AndReturn(fabric.api.hide('stdout'))
        self.mock_host_controller.run("aptitude show libc6").AndReturn(expected_package_info)
        self.mox.ReplayAll()

        self.assertEqual(expected_package_info, self.package_inspector.info_for("libc6"))


def suite():
    return TestSuiteLoader().load_tests_from(UbuntuPackageInspectorTest)

if __name__ == "__main__":
    from fab.tests.test_settings import TEST_MODE
    TestRunner(TEST_MODE).run_test_suite(suite())
