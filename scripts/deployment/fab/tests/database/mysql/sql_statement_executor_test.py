#!/usr/bin/env python

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


import imp, mox

from testing.helpers.execution import TestSuiteLoader, TestRunner

from fab.config.rsr.database import RSRDatabaseConfig
from fab.database.mysql.statement import SQLStatementExecutor
from fab.host.controller import RemoteHostController


class SQLStatementExecutorTest(mox.MoxTestBase):

    def setUp(self):
        super(SQLStatementExecutorTest, self).setUp()
        database_config = RSRDatabaseConfig.create_instance()
        self.expected_admin_credentials = "--user=%s --password=%s" % (database_config.admin_user, database_config.admin_password)

        self.mock_host_controller = self.mox.CreateMock(RemoteHostController)

        self.statement_executor = SQLStatementExecutor(database_config, self.mock_host_controller)

    def test_can_execute_single_statement(self):
        """fab.tests.database.mysql.sql_statement_executor_test  Can execute a single statement"""

        self.mock_host_controller.run('mysql %s -e "show databases"' % self.expected_admin_credentials)
        self.mox.ReplayAll()

        self.statement_executor.execute(["show databases"])

    def test_can_execute_multiple_statements(self):
        """fab.tests.database.mysql.sql_statement_executor_test  Can execute multiple statements"""

        statements = ["use dev_db", "show tables", "select * from projects"]
        expected_statement_sequence = "; ".join(statements)

        self.mock_host_controller.run('mysql %s -e "%s"' % (self.expected_admin_credentials, expected_statement_sequence))
        self.mox.ReplayAll()

        self.statement_executor.execute(statements)


def suite():
    return TestSuiteLoader().load_tests_from(SQLStatementExecutorTest)

if __name__ == "__main__":
    from fab.tests.test_settings import TEST_MODE
    TestRunner(TEST_MODE).run_test_suite(suite())
