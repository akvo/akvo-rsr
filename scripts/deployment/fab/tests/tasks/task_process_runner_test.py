#!/usr/bin/env python

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


import mox

from testing.helpers.execution import TestRunner, TestSuiteLoader

from fab.tasks.runner import ProcessRunner


class TaskProcessRunnerTest(mox.MoxTestBase):

    def setUp(self):
        super(TaskProcessRunnerTest, self).setUp()

        self.process_runner = ProcessRunner()

    def test_command_execution_errors_will_cause_system_exit(self):
        """fab.tests.tasks.task_process_runner_test  Command execution errors will cause a system exit"""

        with self.assertRaises(SystemExit) as raised:
            self.process_runner.execute('non_existent_command')

        self.assertTrue(raised.exception.code != 0)


def suite():
    return TestSuiteLoader().load_tests_from(TaskProcessRunnerTest)

if __name__ == '__main__':
    TestRunner().run_test_suite(suite())
