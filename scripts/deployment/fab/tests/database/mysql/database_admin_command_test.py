#!/usr/bin/env python

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


import mox

from testing.helpers.execution import TestSuiteLoader, TestRunner

from fab.config.rsr.database import RSRDatabaseConfig
from fab.database.mysql.admincommand import DatabaseAdminCommand
from fab.database.mysql.command import MySQLResponseData, SQLStatementExecutor
from fab.helpers.feedback import ExecutionFeedback
from fab.host.controller import RemoteHostController


class DatabaseAdminCommandTest(mox.MoxTestBase):

    def setUp(self):
        super(DatabaseAdminCommandTest, self).setUp()
        self.mock_statement_executor = self.mox.CreateMock(SQLStatementExecutor)
        self.mock_feedback = self.mox.CreateMock(ExecutionFeedback)

        self.database_admin_command = DatabaseAdminCommand(self.mock_statement_executor, self.mock_feedback)

    def test_can_create_instance(self):
        """fab.tests.database.mysql.database_admin_command_test  Can create a DatabaseAdminCommand instance"""

        database_config = RSRDatabaseConfig.create_instance()
        mock_host_controller = self.mox.CreateMock(RemoteHostController)
        mock_host_controller.feedback = self.mock_feedback

        self.mox.ReplayAll()

        self.assertIsInstance(DatabaseAdminCommand.create_instance(database_config, mock_host_controller), DatabaseAdminCommand)

    def test_can_check_for_existing_database(self):
        """fab.tests.database.mysql.database_admin_command_test  Can check for an existing database"""

        database_search_response = MySQLResponseData("+--\n|existing_db|\n--+")

        self.mock_statement_executor.execute_without_output(["SHOW DATABASES LIKE 'existing_db'"]).AndReturn(database_search_response)
        self.mock_feedback.comment("Found database 'existing_db'")
        self.mox.ReplayAll()

        self.assertTrue(self.database_admin_command.database_exists("existing_db"), "Should recognise an existing database")

    def test_can_check_for_nonexistent_database(self):
        """fab.tests.database.mysql.database_admin_command_test  Can check for a non-existent database"""

        database_search_response = MySQLResponseData("")

        self.mock_statement_executor.execute_without_output(["SHOW DATABASES LIKE 'non_existent_db'"]).AndReturn(database_search_response)
        self.mock_feedback.comment("Database 'non_existent_db' does not exist")
        self.mox.ReplayAll()

        self.assertFalse(self.database_admin_command.database_exists("non_existent_db"), "Should recognise a non-existent database")

    def test_can_check_for_existing_database_user(self):
        """fab.tests.database.mysql.database_admin_command_test  Can check for an existing database user"""

        user_search_response = MySQLResponseData("+--\n|joe|\n--+")
        sql_for_user_search = ["USE mysql", "SELECT User FROM user WHERE User = 'joe'"]

        self.mock_statement_executor.execute_without_output(sql_for_user_search).AndReturn(user_search_response)
        self.mock_feedback.comment("Found user 'joe'")
        self.mox.ReplayAll()

        self.assertTrue(self.database_admin_command.database_user_exists("joe"), "Should recognise an existing user")

    def test_can_check_for_nonexistent_database_user(self):
        """fab.tests.database.mysql.database_admin_command_test  Can check for a non-existent database user"""

        user_search_response = MySQLResponseData("")
        sql_for_user_search = ["USE mysql", "SELECT User FROM user WHERE User = 'kenny'"]

        self.mock_statement_executor.execute_without_output(sql_for_user_search).AndReturn(user_search_response)
        self.mock_feedback.comment("User 'kenny' does not exist")
        self.mox.ReplayAll()

        self.assertFalse(self.database_admin_command.database_user_exists("kenny"), "Should recognise a non-existent database user")

    def test_can_drop_database(self):
        """fab.tests.database.mysql.database_admin_command_test  Can drop database"""

        self.mock_statement_executor.execute(["DROP DATABASE unused_db"])
        self.mox.ReplayAll()

        self.database_admin_command.drop_database("unused_db")

    def test_can_create_empty_database(self):
        """fab.tests.database.mysql.database_admin_command_test  Can create empty database"""

        self.mock_statement_executor.execute(["CREATE DATABASE projects_db DEFAULT CHARACTER SET UTF8"])
        self.mox.ReplayAll()

        self.database_admin_command.create_empty_database("projects_db")

    def test_can_create_database_user(self):
        """fab.tests.database.mysql.database_admin_command_test  Can create database user"""

        self.mock_statement_executor.execute_without_output(["CREATE USER joe IDENTIFIED BY 'secret'"])
        self.mox.ReplayAll()

        self.database_admin_command.create_database_user("joe", "secret")

    def test_can_grant_all_database_permissions_for_specified_user(self):
        """fab.tests.database.mysql.database_admin_command_test  Can grant all database permissions for a specified user"""

        self.mock_statement_executor.execute(["GRANT ALL ON foo.* TO rupaul@localhost"])
        self.mox.ReplayAll()

        self.database_admin_command.grant_all_database_permissions_for_user("rupaul", "foo")


def suite():
    return TestSuiteLoader().load_tests_from(DatabaseAdminCommandTest)

if __name__ == "__main__":
    from fab.tests.test_settings import TEST_MODE
    TestRunner(TEST_MODE).run_test_suite(suite())
