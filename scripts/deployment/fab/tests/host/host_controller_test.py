#!/usr/bin/env python

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


import unittest

from testing.helpers.execution import TestRunner, TestSuiteLoader

from fab.host.controller import HostController, HostControllerMode, LocalHostController, RemoteHostController


class HostControllerTest(unittest.TestCase):

    def test_can_create_local_host_controller_given_controller_mode(self):
        """fab.tests.host.host_controller_test  Can create local host controller instance given controller mode"""

        self.assertIsInstance(HostController.create_from(HostControllerMode.LOCAL), LocalHostController)

    def test_can_create_remote_host_controller_given_controller_mode(self):
        """fab.tests.host.host_controller_test  Can create remote host controller instance given controller mode"""

        self.assertIsInstance(HostController.create_from(HostControllerMode.REMOTE), RemoteHostController)


def suite():
    return TestSuiteLoader().load_tests_from(HostControllerTest)

if __name__ == '__main__':
    TestRunner().run_test_suite(suite())
