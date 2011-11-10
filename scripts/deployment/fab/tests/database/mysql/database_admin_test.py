#!/usr/bin/env python

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


import mox

from testing.helpers.execution import TestSuiteLoader, TestRunner

from fab.config.rsr.database import RSRDatabaseConfig
from fab.database.mysql.admin import DatabaseAdmin
from fab.database.mysql.admincommand import DatabaseAdminCommand
from fab.database.mysql.command import DatabaseCopier
from fab.format.timestamp import TimeStampFormatter
from fab.helpers.feedback import ExecutionFeedback
from fab.host.controller import RemoteHostController


class DatabaseAdminTest(mox.MoxTestBase):

    def setUp(self):
        super(DatabaseAdminTest, self).setUp()
        self.mock_admin_command = self.mox.CreateMock(DatabaseAdminCommand)
        self.mock_database_copier = self.mox.CreateMock(DatabaseCopier)
        self.mock_time_stamp_formatter = self.mox.CreateMock(TimeStampFormatter)
        self.mock_feedback = self.mox.CreateMock(ExecutionFeedback)

        self.database_admin = DatabaseAdmin(self.mock_admin_command, self.mock_database_copier,
                                            self.mock_time_stamp_formatter, self.mock_feedback)

    def test_can_create_instance(self):
        """fab.tests.database.mysql.database_admin_test  Can create a DatabaseAdmin instance"""

        database_config = RSRDatabaseConfig.create_instance()
        mock_host_controller = self.mox.CreateMock(RemoteHostController)
        mock_host_controller.feedback = self.mock_feedback

        self.mox.ReplayAll()

        self.assertIsInstance(DatabaseAdmin.create_instance(database_config, mock_host_controller), DatabaseAdmin)

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

        self._set_expectations_for_rebuilding_database_where(database_exists=True, user_exists=True)

        self.database_admin.rebuild_database("projects_db", "joe", "secret_pw")

    def test_can_rebuild_new_database_with_existing_user(self):
        """fab.tests.database.mysql.database_admin_test  Can rebuild a new database with an existing user"""

        self._set_expectations_for_rebuilding_database_where(database_exists=False, user_exists=True)

        self.database_admin.rebuild_database("projects_db", "joe", "secret_pw")

    def test_can_rebuild_existing_database_with_new_user(self):
        """fab.tests.database.mysql.database_admin_test  Can rebuild an existing database with a new user"""

        self._set_expectations_for_rebuilding_database_where(database_exists=True, user_exists=False)

        self.database_admin.rebuild_database("projects_db", "joe", "secret_pw")

    def test_can_rebuild_new_database_with_new_user(self):
        """fab.tests.database.mysql.database_admin_test  Can rebuild a new database with a new user"""

        self._set_expectations_for_rebuilding_database_where(database_exists=False, user_exists=False)

        self.database_admin.rebuild_database("projects_db", "joe", "secret_pw")

    def _set_expectations_for_rebuilding_database_where(self, database_exists, user_exists):
        self.mock_feedback.comment("Rebuild database 'projects_db' and granting all permissions to user 'joe'")
        self.mock_admin_command.database_exists("projects_db").AndReturn(database_exists)
        if database_exists:
            self.mock_admin_command.drop_database("projects_db")
        self.mock_admin_command.create_empty_database("projects_db")
        self.mock_admin_command.user_exists("joe").AndReturn(user_exists)
        if not user_exists:
            self.mock_admin_command.create_user_account("joe", "secret_pw")
        self.mock_admin_command.grant_all_database_permissions_for_user("joe", "projects_db")
        self.mox.ReplayAll()


def suite():
    return TestSuiteLoader().load_tests_from(DatabaseAdminTest)

if __name__ == "__main__":
    from fab.tests.test_settings import TEST_MODE
    TestRunner(TEST_MODE).run_test_suite(suite())
