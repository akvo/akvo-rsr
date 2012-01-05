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

    def test_can_get_stat_command_query_format_for_linux(self):
        """fab.tests.os.command.stat_test  Can get stat command query type for Linux"""

        self.assertEqual("-c %F", StatCommand.query_format_for(SystemType.LINUX))

    def test_can_get_stat_command_query_format_for_mac_osx(self):
        """fab.tests.os.command.stat_test  Can get stat command query type for Mac OS X"""

        self.assertEqual("-f %HT", StatCommand.query_format_for(SystemType.MAC_OSX))


def suite():
    return TestSuiteLoader().load_tests_from(StatCommandTest)

if __name__ == "__main__":
    from fab.tests.test_settings import TEST_MODE
    TestRunner(TEST_MODE).run_test_suite(suite())
