#!/usr/bin/env python

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


from testing.helpers.execution import TestSuiteLoader, TestRunner

from fab.tests.tasks.deployment_task_base_test import suite as deployment_task_base_suite
from fab.tests.tasks.task_runner_test import suite as task_runner_suite
from fab.tests.tasks.app.app_tasks_test_suite import app_tasks_suite
from fab.tests.tasks.data.data_tasks_test_suite import data_tasks_suite
from fab.tests.tasks.database.database_tasks_test_suite import database_tasks_suite
from fab.tests.tasks.environment.environment_tasks_test_suite import environment_tasks_suite


def tasks_suite():
    return TestSuiteLoader().create_suite_from_list([deployment_task_base_suite(), task_runner_suite(),
                                                     app_tasks_suite(), data_tasks_suite(),
                                                     database_tasks_suite(), environment_tasks_suite()])

if __name__ == "__main__":
    from fab.tests.test_settings import TEST_MODE
    TestRunner(TEST_MODE).run_test_suite(tasks_suite())
