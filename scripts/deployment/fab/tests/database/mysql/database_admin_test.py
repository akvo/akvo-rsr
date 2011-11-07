#!/usr/bin/env python

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


import mox

from testing.helpers.execution import TestSuiteLoader, TestRunner

from fab.config.rsr.database import RSRDatabaseConfig
from fab.database.mysql.admin import DatabaseAdmin
from fab.database.mysql.command import DatabaseCopier, MySQLResponseData, SQLStatementExecutor
from fab.format.timestamp import TimeStampFormatter
from fab.helpers.feedback import ExecutionFeedback
from fab.host.controller import RemoteHostController


class DatabaseAdminTest(mox.MoxTestBase):

    def setUp(self):
        super(DatabaseAdminTest, self).setUp()
        self.mock_statement_executor = self.mox.CreateMock(SQLStatementExecutor)
        self.mock_database_copier = self.mox.CreateMock(DatabaseCopier)
        self.mock_time_stamp_formatter = self.mox.CreateMock(TimeStampFormatter)
        self.mock_feedback = self.mox.CreateMock(ExecutionFeedback)

        self.database_admin = DatabaseAdmin(self.mock_statement_executor, self.mock_database_copier,
                                            self.mock_time_stamp_formatter, self.mock_feedback)

    def test_can_create_instance(self):
        """fab.tests.database.mysql.database_admin_test  Can create a DatabaseAdmin instance"""

        database_config = RSRDatabaseConfig.create_instance()
        mock_host_controller = self.mox.CreateMock(RemoteHostController)
        mock_host_controller.feedback = self.mock_feedback

        self.mox.ReplayAll()

        self.assertIsInstance(DatabaseAdmin.create_instance(database_config, mock_host_controller), DatabaseAdmin)

    def test_can_check_database_existence(self):
        """fab.tests.database.mysql.database_admin_test  Can check database existence"""

        existing_db_response_data = MySQLResponseData("+--\n|existing_db|\n--+")
        nonexistent_db_response_data = MySQLResponseData("")

        self.mock_statement_executor.execute(["SHOW DATABASES LIKE 'existing_db'"]).AndReturn(existing_db_response_data)
        self.mock_statement_executor.execute(["SHOW DATABASES LIKE 'non_existent_db'"]).AndReturn(nonexistent_db_response_data)
        self.mox.ReplayAll()

        self.assertTrue(self.database_admin.database_exists("existing_db"), "Should recognise an existing database")
        self.assertFalse(self.database_admin.database_exists("non_existent_db"), "Should recognise a non-existent database")

    def test_can_create_empty_database(self):
        """fab.tests.database.mysql.database_admin_test  Can create empty database"""

        self.mock_statement_executor.execute(["CREATE DATABASE foo DEFAULT CHARACTER SET UTF8"])
        self.mox.ReplayAll()

        self.database_admin.create_empty_database("foo")

    def test_can_grant_all_database_permissions_for_specified_user(self):
        """fab.tests.database.mysql.database_admin_test  Can grant all database permissions for a specified user"""

        self.mock_statement_executor.execute(["GRANT ALL ON foo.* TO rupaul@localhost"])
        self.mox.ReplayAll()

        self.database_admin.grant_all_database_permissions_for_user("rupaul", "foo")

    def test_can_create_timestamped_backup_of_existing_database(self):
        """fab.tests.database.mysql.database_admin_test  Can create time-stamped backup of an existing database"""

        expected_duplicate_database_name = "projects_db_20111014"
        show_databases_response_data = MySQLResponseData("+--\n|projects_db|\n--+")

        self.mock_statement_executor.execute(["SHOW DATABASES LIKE 'projects_db'"]).AndReturn(show_databases_response_data)
        self.mock_time_stamp_formatter.append_timestamp("projects_db").AndReturn(expected_duplicate_database_name)
        self.mock_statement_executor.execute(["CREATE DATABASE projects_db_20111014 DEFAULT CHARACTER SET UTF8"])
        self.mock_database_copier.create_duplicate("projects_db", expected_duplicate_database_name)
        self.mox.ReplayAll()

        self.database_admin.create_timestamped_backup_database("projects_db")

    def test_does_not_attempt_to_create_backup_of_nonexistent_database(self):
        """fab.tests.database.mysql.database_admin_test  Does not attempt to create a backup of a non-existent database"""

        self.mock_statement_executor.execute(["SHOW DATABASES LIKE 'nonexistent_db'"]).AndReturn(MySQLResponseData(""))
        self.mock_feedback.comment("Database [nonexistent_db] does not exist -- backup not created")
        self.mox.ReplayAll()

        self.database_admin.create_timestamped_backup_database("nonexistent_db")


def suite():
    return TestSuiteLoader().load_tests_from(DatabaseAdminTest)

if __name__ == "__main__":
    from fab.tests.test_settings import TEST_MODE
    TestRunner(TEST_MODE).run_test_suite(suite())
