#!/usr/bin/env python

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


import unittest2

from testing.helpers.execution import TestSuiteLoader, TestRunner

import fab.tests.templates.database_credentials_template
from credentials import DatabaseCredentials

from fab.config.values.standard import CIDeploymentHostConfig
from fab.host.controller import HostControllerMode
from fab.host.database import DatabaseHost
from fab.tasks.database.basetask import RSRDatabaseTask


class RSRDatabaseTaskTest(unittest2.TestCase):

    def test_can_initialise_task_with_deployment_host_config_and_database_credentials(self):
        """fab.tests.tasks.database.rsr_database_task_test  Can initialise task with deployment host config and database credentials"""

        self.assertIsInstance(RSRDatabaseTask(CIDeploymentHostConfig.for_test(), DatabaseCredentials()), RSRDatabaseTask)

    def test_can_initialise_task_with_deployment_host_config_only(self):
        """fab.tests.tasks.database.rsr_database_task_test  Can initialise task with deployment host config only"""

        self.assertIsInstance(RSRDatabaseTask(CIDeploymentHostConfig.for_test()), RSRDatabaseTask)

    def test_can_create_database_host_when_task_is_executed(self):
        """fab.tests.tasks.database.rsr_database_task_test  Can create the database host when the task is executed"""

        database_task = RSRDatabaseTask(CIDeploymentHostConfig.for_test())

        database_task.run(HostControllerMode.REMOTE)

        self.assertIsInstance(database_task.database_host, DatabaseHost)


def suite():
    return TestSuiteLoader().load_tests_from(RSRDatabaseTaskTest)

if __name__ == "__main__":
    from fab.tests.test_settings import TEST_MODE
    TestRunner(TEST_MODE).run_test_suite(suite())
