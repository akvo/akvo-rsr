#!/usr/bin/env python

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


import unittest

from testing.helpers.execution import TestRunner, TestSuiteLoader

from fab.helpers.feedback import ExecutionFeedback
from fab.host.controller import LocalHostController


class LocalHostControllerTest(unittest.TestCase):

    def test_can_create_instance_with_feedback_member(self):
        """fab.tests.host.local_host_controller_test  Can create a LocalHostController instance with an ExecutionFeedback member"""

        host_controller = LocalHostController()

        self.assertIsInstance(host_controller, LocalHostController)
        self.assertIsInstance(host_controller.feedback, ExecutionFeedback)


def suite():
    return TestSuiteLoader().load_tests_from(LocalHostControllerTest)

if __name__ == '__main__':
    TestRunner().run_test_suite(suite())
