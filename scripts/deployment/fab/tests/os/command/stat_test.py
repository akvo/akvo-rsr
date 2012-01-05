#!/usr/bin/env python

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


import unittest2

from testing.helpers.execution import TestSuiteLoader, TestRunner

from fab.os.command.stat import StatCommand
from fab.os.system import SystemType


class StatCommandTest(unittest2.TestCase):

    def setUp(self):
        super(StatCommandTest, self).setUp()

    def test_can_get_linux_stat_command_for_specified_path(self):
        """fab.tests.os.command.stat_test  Can get Linux stat command for a specified path"""

        self.assertEqual("stat -c %F /some/path", StatCommand(SystemType.LINUX).for_path("/some/path"))

    def test_can_get_mac_osx_stat_command_for_specified_path(self):
        """fab.tests.os.command.stat_test  Can get Mac OS X stat command for a specified path"""

        self.assertEqual("stat -f %HT /some/path", StatCommand(SystemType.MAC_OSX).for_path("/some/path"))


def suite():
    return TestSuiteLoader().load_tests_from(StatCommandTest)

if __name__ == "__main__":
    from fab.tests.test_settings import TEST_MODE
    TestRunner(TEST_MODE).run_test_suite(suite())
