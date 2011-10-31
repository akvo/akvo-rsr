#!/usr/bin/env python

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


import mox

from testing.helpers.execution import TestSuiteLoader, TestRunner

from fab.database.mysql.admin import DatabaseAdmin
from fab.database.mysql.schema import SchemaInformation
from fab.database.mysql.statement import SQLStatementExecutor


class StubbedDatabaseAdmin(DatabaseAdmin):

    def __init__(self, schema_information, statement_executor):
        self.schema_information = schema_information
        self.statement_executor = statement_executor

    def _create_schema_information(self):
        return self.schema_information

    def _create_statement_executor(self):
        return self.statement_executor


class DatabaseAdminTest(mox.MoxTestBase):

    def setUp(self):
        super(DatabaseAdminTest, self).setUp()
        self.mock_schema_information = self.mox.CreateMock(SchemaInformation)
        self.mock_statement_executor = self.mox.CreateMock(SQLStatementExecutor)

        self.database_admin = StubbedDatabaseAdmin(self.mock_schema_information, self.mock_statement_executor)

    def test_can_verify_database_existence(self):
        """fab.tests.database.mysql.database_admin_test  Can verify database existence"""

        self.mock_schema_information.database_exists("mysql").AndReturn(True)
        self.mox.ReplayAll()

        self.assertTrue(self.database_admin.database_exists("mysql"), "Expected known database to be recognised")

    def test_can_create_empty_database(self):
        """fab.tests.database.mysql.database_admin_test  Can create empty database"""

        self.mock_statement_executor.execute_statement("CREATE DATABASE foo DEFAULT CHARACTER SET UTF8")
        self.mox.ReplayAll()

        self.database_admin.create_empty_database("foo")

    def test_can_grant_all_database_permissions_for_specified_user(self):
        """fab.tests.database.mysql.database_admin_test  Can grant all database permissions for a specified user"""

        self.mock_statement_executor.execute_statement("GRANT ALL ON foo.* TO rupaul@localhost")
        self.mox.ReplayAll()

        self.database_admin.grant_all_database_permissions_for_user("rupaul", "foo")


def suite():
    return TestSuiteLoader().load_tests_from(DatabaseAdminTest)

if __name__ == "__main__":
    from fab.tests.test_settings import TEST_MODE
    TestRunner(TEST_MODE).run_test_suite(suite())
