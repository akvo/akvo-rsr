#!/usr/bin/env python

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


import mox

from testing.helpers.execution import TestSuiteLoader, TestRunner

import fab.tests.templates.database_credentials_template
from credentials import DatabaseCredentials

from fab.config.rsr.database import RSRDatabaseConfig
from fab.config.values.standard import CIDeploymentHostConfig
from fab.data.populator import RSRDataPopulator
from fab.database.mysql.admin import DatabaseAdmin
from fab.database.mysql.admincommand import DatabaseAdminCommand
from fab.database.mysql.commandexecution import DatabaseCopier
from fab.format.timestamp import TimeStampFormatter
from fab.helpers.feedback import ExecutionFeedback
from fab.host.controller import RemoteHostController


class DatabaseAdminTest(mox.MoxTestBase):

    def setUp(self):
        super(DatabaseAdminTest, self).setUp()
        self.mock_admin_command = self.mox.CreateMock(DatabaseAdminCommand)
        self.mock_database_copier = self.mox.CreateMock(DatabaseCopier)
        self.mock_data_populator = self.mox.CreateMock(RSRDataPopulator)
        self.mock_time_stamp_formatter = self.mox.CreateMock(TimeStampFormatter)
        self.mock_feedback = self.mox.CreateMock(ExecutionFeedback)

        self.database_admin = DatabaseAdmin(self.mock_admin_command, self.mock_database_copier, self.mock_data_populator,
                                            self.mock_time_stamp_formatter, self.mock_feedback)

    def test_can_create_instance(self):
        """fab.tests.database.mysql.database_admin_test  Can create a DatabaseAdmin instance"""

        deployment_host_config = CIDeploymentHostConfig.for_test()
        database_config = RSRDatabaseConfig(DatabaseCredentials(), deployment_host_config)
        mock_host_controller = self.mox.CreateMock(RemoteHostController)
        mock_host_controller.feedback = self.mock_feedback

        self.mox.ReplayAll()

        self.assertIsInstance(DatabaseAdmin.create_with(database_config, deployment_host_config, mock_host_controller), DatabaseAdmin)

    def test_can_create_timestamped_backup_of_existing_database(self):
        """fab.tests.database.mysql.database_admin_test  Can create time-stamped backup of an existing database"""

        expected_duplicate_database_name = "projects_db_20111014"

        self.mock_admin_command.database_exists("projects_db").AndReturn(True)
        self.mock_time_stamp_formatter.append_timestamp("projects_db").AndReturn(expected_duplicate_database_name)
        self.mock_admin_command.create_empty_database(expected_duplicate_database_name)
        self.mock_database_copier.create_duplicate("projects_db", expected_duplicate_database_name)
        self.mox.ReplayAll()

        self.database_admin.create_timestamped_backup_database("projects_db")

    def test_does_not_attempt_to_create_backup_of_nonexistent_database(self):
        """fab.tests.database.mysql.database_admin_test  Does not attempt to create a backup of a non-existent database"""

        self.mock_admin_command.database_exists("non_existent_db").AndReturn(False)
        self.mock_feedback.comment("No backup required for database: non_existent_db")
        self.mox.ReplayAll()

        self.database_admin.create_timestamped_backup_database("non_existent_db")

    def test_can_rebuild_existing_database_with_existing_user(self):
        """fab.tests.database.mysql.database_admin_test  Can rebuild an existing database with an existing user"""

        self._create_empty_database("projects_db", database_exists=True)
        self._grant_database_permissions_for_user("projects_db", "joe", "secret_pw", user_exists=True)
        self._initialise_and_populate_database()
        self.mox.ReplayAll()

        self.database_admin.rebuild_database("projects_db", "joe", "secret_pw")

    def test_can_rebuild_new_database_with_existing_user(self):
        """fab.tests.database.mysql.database_admin_test  Can rebuild a new database with an existing user"""

        self._create_empty_database("projects_db", database_exists=False)
        self._grant_database_permissions_for_user("projects_db", "joe", "secret_pw", user_exists=True)
        self._initialise_and_populate_database()
        self.mox.ReplayAll()

        self.database_admin.rebuild_database("projects_db", "joe", "secret_pw")

    def test_can_rebuild_existing_database_with_new_user(self):
        """fab.tests.database.mysql.database_admin_test  Can rebuild an existing database with a new user"""

        self._create_empty_database("projects_db", database_exists=True)
        self._grant_database_permissions_for_user("projects_db", "joe", "secret_pw", user_exists=False)
        self._initialise_and_populate_database()
        self.mox.ReplayAll()

        self.database_admin.rebuild_database("projects_db", "joe", "secret_pw")

    def test_can_rebuild_new_database_with_new_user(self):
        """fab.tests.database.mysql.database_admin_test  Can rebuild a new database with a new user"""

        self._create_empty_database("projects_db", database_exists=False)
        self._grant_database_permissions_for_user("projects_db", "joe", "secret_pw", user_exists=False)
        self._initialise_and_populate_database()
        self.mox.ReplayAll()

        self.database_admin.rebuild_database("projects_db", "joe", "secret_pw")

    def _create_empty_database(self, database_name, database_exists):
        self.mock_feedback.comment("Creating empty database '%s'" % database_name)
        self.mock_admin_command.database_exists(database_name).AndReturn(database_exists)
        if database_exists:
            self.mock_admin_command.drop_database(database_name)

        self.mock_admin_command.create_empty_database(database_name)

    def _grant_database_permissions_for_user(self, database_name, user_name, password, user_exists):
        self.mock_feedback.comment("Granting all database permissions to user '%s'" % user_name)
        self.mock_admin_command.user_exists(user_name).AndReturn(user_exists)
        if not user_exists:
            self.mock_admin_command.create_user_account(user_name, password)

        self.mock_admin_command.grant_all_database_permissions_for_user(user_name, database_name)

    def _initialise_and_populate_database(self):
        self.mock_data_populator.initialise_database()
        self.mock_data_populator.populate_database()

    def test_can_convert_database_for_migrations(self):
        """fab.tests.database.mysql.database_admin_test  Can convert database for migrations"""

        self.mock_data_populator.convert_database_for_migrations()
        self.mox.ReplayAll()

        self.database_admin.convert_database_for_migrations()

    def test_can_run_all_database_migrations(self):
        """fab.tests.database.mysql.database_admin_test  Can run all database migrations"""

        self.mock_data_populator.run_all_migrations()
        self.mox.ReplayAll()

        self.database_admin.run_all_migrations()


def suite():
    return TestSuiteLoader().load_tests_from(DatabaseAdminTest)

if __name__ == "__main__":
    from fab.tests.test_settings import TEST_MODE
    TestRunner(TEST_MODE).run_test_suite(suite())
