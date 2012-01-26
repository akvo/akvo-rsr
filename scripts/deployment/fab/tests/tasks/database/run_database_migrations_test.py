#!/usr/bin/env python

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


import mox

from testing.helpers.execution import TestSuiteLoader, TestRunner

from fab.config.loader import ConfigType
from fab.config.values.host import HostAlias
from fab.host.controller import HostControllerMode
from fab.host.database import DatabaseHost
from fab.tasks.database.migrate import RunDatabaseMigrations
from fab.verifiers.config import ConfigFileVerifier


class StubbedRunDatabaseMigrations(RunDatabaseMigrations):

    def __init__(self, config_verifier, configured_database_host):
        super(StubbedRunDatabaseMigrations, self).__init__(config_verifier)
        self.configured_database_host = configured_database_host

    def _configure_database_host_with(self, host_controller_mode, host_config):
        return self.configured_database_host


class RunDatabaseMigrationsTest(mox.MoxTestBase):

    def setUp(self):
        super(RunDatabaseMigrationsTest, self).setUp()
        self.mock_config_verifier = self.mox.CreateMock(ConfigFileVerifier)
        self.mock_database_host = self.mox.CreateMock(DatabaseHost)

        self.run_database_migrations_task = StubbedRunDatabaseMigrations(self.mock_config_verifier, self.mock_database_host)

    def test_has_expected_task_name(self):
        """fab.tests.tasks.database.run_database_migrations_test  Has expected task name"""

        self.assertEqual('run_database_migrations', RunDatabaseMigrations.name)

    def test_can_run_database_migrations(self):
        """fab.tests.tasks.database.run_database_migrations_test  Can run database migrations"""

        self.mock_database_host.run_all_migrations()
        self.mox.ReplayAll()

        self.run_database_migrations_task.run(HostControllerMode.REMOTE, ConfigType.PRECONFIGURED, HostAlias.TEST)


def suite():
    return TestSuiteLoader().load_tests_from(RunDatabaseMigrationsTest)

if __name__ == '__main__':
    from fab.tests.test_settings import TEST_MODE
    TestRunner(TEST_MODE).run_test_suite(suite())
