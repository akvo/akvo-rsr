#!/usr/bin/env python

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


import unittest2

from testing.helpers.execution import TestSuiteLoader, TestRunner

from fab.tasks.runner import TaskParameters, TaskRunner


class StubbedTaskRunner(TaskRunner):

    fake_exit_code = 0

    def _execute(self, command_with_parameters):
        self.executed_command_with_parameters = command_with_parameters
        return self.fake_exit_code


class TaskRunnerTest(unittest2.TestCase):

    def setUp(self):
        super(TaskRunnerTest, self).setUp()

        self.host_with_ssh_port = "some_host:2288"
        self.ssh_id_file_path = "/path/to/id_rsa"

        self.task_runner = StubbedTaskRunner(self.host_with_ssh_port, self.ssh_id_file_path)

    def test_can_run_task(self):
        """fab.tests.tasks.task_runner_test  Can run task"""

        self.task_runner.fake_exit_code = 0
        expected_command_with_parameters = ['fab', '-f', TaskRunner.FABFILE_PATH, 'some.deployment.task.name',
                                            '-H', self.host_with_ssh_port, '-i', self.ssh_id_file_path]

        self.task_runner.run_task('some.deployment.task.name')

        self.assertEqual(expected_command_with_parameters, self.task_runner.executed_command_with_parameters)

    def test_will_raise_systemexit_if_task_execution_fails(self):
        """fab.tests.tasks.task_runner_test  Will raise a SystemExit exception if task execution fails"""

        self.task_runner.fake_exit_code = 2

        with self.assertRaises(SystemExit) as raised:
            self.task_runner.run_task('some.deployment.task.name')

        self.assertTrue(raised.exception.message.find('Deployment failed due to errors above') > 0)

    def test_can_run_explicitly_remote_task(self):
        """fab.tests.tasks.task_runner_test  Can run explicitly remote task"""

        self.task_runner.fake_exit_code = 0
        expected_task_with_parameters = 'some.deployment.task.name' + TaskParameters.REMOTE_HOST_CONTROLLER_MODE
        expected_command_with_parameters = ['fab', '-f', TaskRunner.FABFILE_PATH, expected_task_with_parameters,
                                            '-H', self.host_with_ssh_port, '-i', self.ssh_id_file_path]

        self.task_runner.run_remote_task('some.deployment.task.name')

        self.assertEqual(expected_command_with_parameters, self.task_runner.executed_command_with_parameters)


def suite():
    return TestSuiteLoader().load_tests_from(TaskRunnerTest)

if __name__ == "__main__":
    from fab.tests.test_settings import TEST_MODE
    TestRunner(TEST_MODE).run_test_suite(suite())
