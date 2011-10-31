#!/usr/bin/env python

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


import mox

from MySQLdb.cursors import Cursor

from testing.helpers.execution import TestSuiteLoader, TestRunner

from fab.database.mysql.connection import DatabaseConnection
from fab.database.mysql.schema import SchemaInformation
from fab.database.mysql.statement import SQLStatementExecutor
from fab.database.mysql.table import TableQuery


class StubbedSchemaInformation(SchemaInformation):

    def __init__(self, statement_executor):
        self.statement_executor = statement_executor


class SchemaInformationTest(mox.MoxTestBase):

    def setUp(self):
        super(SchemaInformationTest, self).setUp()
        self.mock_statement_executor = self.mox.CreateMock(SQLStatementExecutor)

        self.schema_information = StubbedSchemaInformation(self.mock_statement_executor)

    def test_initialiser_uses_information_schema_database(self):
        """fab.tests.database.mysql.schema_information_test  Initialiser uses information schema database"""

        mock_database_connection = self.mox.CreateMock(DatabaseConnection)
        mock_cursor = self.mox.CreateMock(Cursor)

        mock_database_connection.create_cursor().AndReturn(mock_cursor)
        mock_cursor.execute("USE information_schema")
        self.mox.ReplayAll()

        self.assertIsInstance(SchemaInformation(mock_database_connection), SchemaInformation)

    def test_can_recognise_existing_database(self):
        """fab.tests.database.mysql.schema_information_test  Can recognise an existing database"""

        expected_database_count_query = "SELECT COUNT(*) FROM schemata WHERE schema_name = 'mysql'"

        self.mock_statement_executor.scalar_query(expected_database_count_query).AndReturn(1L)
        self.mox.ReplayAll()

        self.assertTrue(self.schema_information.database_exists("mysql"), "Existing database should be recognised")

    def test_can_recognise_nonexistent_database(self):
        """fab.tests.database.mysql.schema_information_test  Can recognise a nonexistent database"""

        expected_database_count_query = "SELECT COUNT(*) FROM schemata WHERE schema_name = 'foo'"

        self.mock_statement_executor.scalar_query(expected_database_count_query).AndReturn(0L)
        self.mox.ReplayAll()

        self.assertFalse(self.schema_information.database_exists("foo"), "Nonexistent database should be recognised")


def suite():
    return TestSuiteLoader().load_tests_from(SchemaInformationTest)

if __name__ == "__main__":
    from fab.tests.test_settings import TEST_MODE
    TestRunner(TEST_MODE).run_test_suite(suite())
