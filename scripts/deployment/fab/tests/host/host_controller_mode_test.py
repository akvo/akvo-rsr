#!/usr/bin/env python

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


import unittest2

from testing.helpers.execution import TestRunner, TestSuiteLoader

from fab.host.controller import HostControllerMode


class HostControllerModeTest(unittest2.TestCase):

    def test_has_local_and_remote_host_controller_modes(self):
        """fab.tests.host.host_controller_mode_test  Has local and remote host controller modes"""

        self.assertEqual(['local', 'remote'], HostControllerMode.allowed_modes)

    def test_can_parse_local_host_controller_mode(self):
        """fab.tests.host.host_controller_mode_test  Can parse local host controller mode"""

        self.assertEqual(HostControllerMode.LOCAL, HostControllerMode.parse(HostControllerMode.LOCAL))

    def test_can_parse_remote_host_controller_mode(self):
        """fab.tests.host.host_controller_mode_test  Can parse remote host controller mode"""

        self.assertEqual(HostControllerMode.REMOTE, HostControllerMode.parse(HostControllerMode.REMOTE))

    def test_will_raise_an_exception_when_parsing_unknown_host_controller_modes(self):
        """fab.tests.host.host_controller_mode_test  Will raise an exception when parsing unknown host controller modes"""

        with self.assertRaises(Exception) as raised:
            HostControllerMode.parse("nonexistent")

        self.assertEqual("Unknown host controller mode: nonexistent", raised.exception.message)


def suite():
    return TestSuiteLoader().load_tests_from(HostControllerModeTest)

if __name__ == '__main__':
    TestRunner().run_test_suite(suite())
