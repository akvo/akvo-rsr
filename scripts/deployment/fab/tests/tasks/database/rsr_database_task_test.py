#!/usr/bin/env python

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


import mox

from testing.helpers.execution import TestRunner, TestSuiteLoader

from fab.config.loader import ConfigType
from fab.config.values.host import HostAlias
from fab.host.controller import HostControllerMode
from fab.host.database import DatabaseHost
from fab.tasks.database.basetask import RSRDatabaseTask
from fab.verifiers.config import ConfigFileVerifier


class RSRDatabaseTaskTest(mox.MoxTestBase):

    def setUp(self):
        super(RSRDatabaseTaskTest, self).setUp()
        self.mock_config_verifier = self.mox.CreateMock(ConfigFileVerifier)

    def test_can_configure_database_host_when_task_is_executed(self):
        """fab.tests.tasks.database.rsr_database_task_test  Can configure database host when the task is executed"""

        self.mock_config_verifier.exit_if_database_credentials_not_found()
        self.mox.ReplayAll()

        database_task = RSRDatabaseTask(self.mock_config_verifier)

        database_task.run(HostControllerMode.REMOTE, ConfigType.PRECONFIGURED, HostAlias.TEST)

        self.assertIsInstance(database_task.database_host, DatabaseHost)


def suite():
    return TestSuiteLoader().load_tests_from(RSRDatabaseTaskTest)

if __name__ == '__main__':
    from fab.tests.test_settings import TEST_MODE
    TestRunner(TEST_MODE).run_test_suite(suite())
