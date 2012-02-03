#!/usr/bin/env python

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


import unittest2

from testing.helpers.execution import TestSuiteLoader, TestRunner

from fab.helpers.feedback import ExecutionFeedback
from fab.host.controller import RemoteHostController


class RemoteHostControllerTest(unittest2.TestCase):

    def test_can_create_instance_with_feedback_member(self):
        """fab.tests.host.remote_host_controller_test  Can create a RemoteHostController instance with an ExecutionFeedback member"""

        host_controller = RemoteHostController()

        self.assertIsInstance(host_controller, RemoteHostController)
        self.assertIsInstance(host_controller.feedback, ExecutionFeedback)


def suite():
    return TestSuiteLoader().load_tests_from(RemoteHostControllerTest)

if __name__ == "__main__":
    from fab.tests.test_settings import TEST_MODE
    TestRunner(TEST_MODE).run_test_suite(suite())
