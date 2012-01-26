#!/usr/bin/env python

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


import unittest2

from testing.helpers.execution import TestRunner, TestSuiteLoader

from fab.tests.templates.database_credentials_template import CREDENTIALS_TEMPLATE_PATH

from fab.config.loader import ConfigType
from fab.config.values.host import HostAlias
from fab.host.controller import HostControllerMode
from fab.host.database import DatabaseHost
from fab.tasks.database.basetask import RSRDatabaseTask


class RSRDatabaseTaskTest(unittest2.TestCase):

    def test_can_configure_database_host_when_task_is_executed(self):
        """fab.tests.tasks.database.rsr_database_task_test  Can configure database host when the task is executed"""

        database_task = RSRDatabaseTask(CREDENTIALS_TEMPLATE_PATH)

        database_task.run(HostControllerMode.REMOTE, ConfigType.PRECONFIGURED, HostAlias.TEST)

        self.assertIsInstance(database_task.database_host, DatabaseHost)


def suite():
    return TestSuiteLoader().load_tests_from(RSRDatabaseTaskTest)

if __name__ == '__main__':
    from fab.tests.test_settings import TEST_MODE
    TestRunner(TEST_MODE).run_test_suite(suite())
