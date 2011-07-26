#!/usr/bin/env python

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


import unittest

from testing.helpers.execution import TestSuiteLoader, TestRunner

from fab.helpers.feedback import ExecutionFeedback


class StubbedExecutionFeedback(ExecutionFeedback):
    """Stubbed implementation of the ExecutionFeedback class so that we don't invoke Fabric calls against a live host for the test to run"""

    def _puts(self, formatted_message, display_host_prefix, line_ending, flush_output):
        self.actual_formatted_message = formatted_message
        self.actual_display_host_prefix = display_host_prefix
        self.actual_line_ending = line_ending
        self.actual_flush_output = flush_output

    def _abort(self, formatted_message):
        self.actual_formatted_message = formatted_message

    def _warn(self, formatted_message):
        self.actual_formatted_message = formatted_message


class ExecutionFeedbackTest(unittest.TestCase):

    def setUp(self):
        super(ExecutionFeedbackTest, self).setUp()

        self.feedback = StubbedExecutionFeedback()

    def test_comment_method_displays_formatted_message_with_host_prefix_and_specified_line_ending(self):
        """fab.tests.helpers.execution_feedback_test  Comment method displays formatted message with host prefix and specified line ending"""

        self.feedback.comment("Deployment started")

        self.assertEqual(">> Deployment started", self.feedback.actual_formatted_message)
        self.assertTrue(self.feedback.actual_display_host_prefix, "Expected host prefix displaying to be enabled")
        self.assertEqual('\n', self.feedback.actual_line_ending)
        self.assertFalse(self.feedback.actual_flush_output, "Expected output not to be flushed")

    def test_abort_method_displays_formatted_message(self):
        """fab.tests.helpers.execution_feedback_test  Abort method displays formatted message"""

        self.feedback.abort("Deployment failed!")

        self.assertEqual("## Deployment failed!", self.feedback.actual_formatted_message)

    def test_warn_method_displays_formatted_message(self):
        """fab.tests.helpers.execution_feedback_test  Warn method displays formatted message"""

        self.feedback.warn("Slight problem occurred")

        self.assertEqual("## Slight problem occurred", self.feedback.actual_formatted_message)


def suite():
    return TestSuiteLoader().load_tests_from(ExecutionFeedbackTest)

if __name__ == "__main__":
    from fab.tests.test_settings import TEST_MODE
    TestRunner(TEST_MODE).run_test_suite(suite())
