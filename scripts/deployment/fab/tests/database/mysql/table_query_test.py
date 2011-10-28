#!/usr/bin/env python

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


import mox

from testing.helpers.execution import TestSuiteLoader, TestRunner

from fab.database.mysql.statement import SQLStatementExecutor
from fab.database.mysql.table import TableQuery


class TableQueryTest(mox.MoxTestBase):

    def setUp(self):
        super(TableQueryTest, self).setUp()
        self.mock_statement_executor = self.mox.CreateMock(SQLStatementExecutor)

        self.project_table_name = "project"

        self.table_query = TableQuery(self.mock_statement_executor, self.project_table_name)

    def test_can_count_rows_that_match_given_condition(self):
        """fab.tests.database.mysql.table_query_test  Can count rows that match a given condition"""

        country_is_ghana_condition = "country = 'Ghana'"
        expected_query = "SELECT COUNT(*) FROM %s WHERE %s" % (self.project_table_name, country_is_ghana_condition)
        expected_project_count = 4

        self.mock_statement_executor.scalar_query(expected_query).AndReturn(expected_project_count)
        self.mox.ReplayAll()

        self.assertEqual(4, self.table_query.row_count_where(country_is_ghana_condition))


def suite():
    return TestSuiteLoader().load_tests_from(TableQueryTest)

if __name__ == "__main__":
    from fab.tests.test_settings import TEST_MODE
    TestRunner(TEST_MODE).run_test_suite(suite())
