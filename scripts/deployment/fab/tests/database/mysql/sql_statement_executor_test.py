#!/usr/bin/env python

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


import mox

from MySQLdb.cursors import Cursor

from testing.helpers.execution import TestSuiteLoader, TestRunner

from fab.database.mysql.connection import DatabaseConnection
from fab.database.mysql.statement import SQLStatementExecutor


class SQLStatementExecutorTest(mox.MoxTestBase):

    def setUp(self):
        super(SQLStatementExecutorTest, self).setUp()
        self.mock_database_connection = self.mox.CreateMock(DatabaseConnection)
        self.mock_cursor = self.mox.CreateMock(Cursor)

        self.statement_executor = SQLStatementExecutor(self.mock_database_connection)

    def test_can_create_statement_executor_for_given_database(self):
        """fab.tests.database.mysql.sql_statement_executor_test  Can create a statement executor for a given database"""

        self._set_expectations_to_execute_statement("USE project_db")

        SQLStatementExecutor.for_database("project_db", self.mock_database_connection)

    def test_can_use_specified_database(self):
        """fab.tests.database.mysql.sql_statement_executor_test  Can use a specified database"""

        self._set_expectations_to_execute_statement("USE project_db")

        self.statement_executor.use_database("project_db")

    def test_can_execute_given_statement(self):
        """fab.tests.database.mysql.sql_statement_executor_test  Can execute a given statement"""

        drop_table_statement = "DROP TABLE foo"

        self._set_expectations_to_execute_statement(drop_table_statement)

        self.statement_executor.execute_statement(drop_table_statement)

    def _set_expectations_to_execute_statement(self, statement_text):
        self.mock_database_connection.create_cursor().AndReturn(self.mock_cursor)
        self.mock_cursor.execute(statement_text)
        self.mox.ReplayAll()

    def test_can_execute_given_query_and_return_resulting_rows(self):
        """fab.tests.database.mysql.sql_statement_executor_test  Can execute a given query and return the resulting rows"""

        all_teams_query = "SELECT * FROM team"
        expected_team_rows = (('A', 'Sales',), ('B', 'Support',), ('C', 'Testing',),)

        self._set_expectations_for_query(all_teams_query, expected_team_rows)

        self.assertEqual(expected_team_rows, self.statement_executor.query(all_teams_query))

    def test_can_execute_given_scalar_query_and_return_resulting_value(self):
        """fab.tests.database.mysql.sql_statement_executor_test  Can execute a given scalar query and return the resulting value"""

        team_count_query = "SELECT COUNT(*) FROM team"
        expected_team_count_rows = ((3L,),)

        self._set_expectations_for_query(team_count_query, expected_team_count_rows)

        self.assertEqual(3L, self.statement_executor.scalar_query(team_count_query))

    def _set_expectations_for_query(self, query_text, expected_rows):
        self.mock_database_connection.create_cursor().AndReturn(self.mock_cursor)
        self.mock_cursor.execute(query_text)
        self.mock_cursor.fetchall().AndReturn(expected_rows)
        self.mox.ReplayAll()


def suite():
    return TestSuiteLoader().load_tests_from(SQLStatementExecutorTest)

if __name__ == "__main__":
    from fab.tests.test_settings import TEST_MODE
    TestRunner(TEST_MODE).run_test_suite(suite())
