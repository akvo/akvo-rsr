#!/usr/bin/env python

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


import mox

from testing.helpers.execution import TestSuiteLoader, TestRunner

from fab.config.rsr.database import RSRDatabaseConfig
from fab.database.mysql.admin import DatabaseAdmin
from fab.database.mysql.command import DatabaseCopier, SQLStatementExecutor
from fab.format.timestamp import TimeStampFormatter
from fab.helpers.feedback import ExecutionFeedback
from fab.host.controller import RemoteHostController


class DatabaseAdminTest(mox.MoxTestBase):

    def setUp(self):
        super(DatabaseAdminTest, self).setUp()
        self.mock_statement_executor = self.mox.CreateMock(SQLStatementExecutor)
        self.mock_database_copier = self.mox.CreateMock(DatabaseCopier)
        self.mock_time_stamp_formatter = self.mox.CreateMock(TimeStampFormatter)

        self.database_admin = DatabaseAdmin(self.mock_statement_executor, self.mock_database_copier,
                                            self.mock_time_stamp_formatter)

    def test_can_create_instance(self):
        """fab.tests.database.mysql.database_admin_test  Can create a DatabaseAdmin instance"""

        database_config = RSRDatabaseConfig.create_instance()
        mock_feedback = self.mox.CreateMock(ExecutionFeedback)
        mock_host_controller = self.mox.CreateMock(RemoteHostController)
        mock_host_controller.feedback = mock_feedback

        self.mox.ReplayAll()

        self.assertIsInstance(DatabaseAdmin.create_instance(database_config, mock_host_controller), DatabaseAdmin)

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

    def test_can_create_timestamped_backup_database(self):
        """fab.tests.database.mysql.database_admin_test  Can create time-stamped backup database"""

        expected_duplicate_database_name = "projects_db_20111014"

        self.mock_time_stamp_formatter.append_timestamp("projects_db").AndReturn(expected_duplicate_database_name)
        self.mock_statement_executor.execute(["CREATE DATABASE projects_db_20111014 DEFAULT CHARACTER SET UTF8"])
        self.mock_database_copier.create_duplicate("projects_db", expected_duplicate_database_name)
        self.mox.ReplayAll()

        self.database_admin.create_timestamped_backup_database("projects_db")


def suite():
    return TestSuiteLoader().load_tests_from(DatabaseAdminTest)

if __name__ == "__main__":
    from fab.tests.test_settings import TEST_MODE
    TestRunner(TEST_MODE).run_test_suite(suite())
