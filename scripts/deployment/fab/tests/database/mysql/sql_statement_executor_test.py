#!/usr/bin/env python

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


import mox
import fabric.api

from testing.helpers.execution import TestSuiteLoader, TestRunner

import fab.tests.templates.database_credentials_template
from credentials import DatabaseCredentials

from fab.config.rsr.database import RSRDatabaseConfig
from fab.config.values.standard import CIDeploymentHostConfig
from fab.database.mysql.commandexecution import SQLStatementExecutor
from fab.helpers.feedback import ExecutionFeedback
from fab.host.controller import RemoteHostController


class SQLStatementExecutorTest(mox.MoxTestBase):

    def setUp(self):
        super(SQLStatementExecutorTest, self).setUp()
        database_config = RSRDatabaseConfig(DatabaseCredentials(), CIDeploymentHostConfig.for_test())
        self.expected_admin_credentials = "--user='%s' --password='%s'" % (database_config.admin_user, database_config.admin_password)

        self.mock_feedback = self.mox.CreateMock(ExecutionFeedback)
        self.mock_host_controller = self.mox.CreateMock(RemoteHostController)
        self.mock_host_controller.feedback = self.mock_feedback

        self.statement_executor = SQLStatementExecutor(database_config, self.mock_host_controller)

    def test_can_execute_single_statement(self):
        """fab.tests.database.mysql.sql_statement_executor_test  Can execute a single statement"""

        self._set_expectations_for_executing_statements("show databases", hide_output=False)

        self.statement_executor.execute(["show databases"])

    def test_can_execute_single_statement_without_output(self):
        """fab.tests.database.mysql.sql_statement_executor_test  Can execute a single statement without output"""

        self._set_expectations_for_executing_statements("show databases", hide_output=True)

        self.statement_executor.execute_without_output(["show databases"])

    def test_can_execute_multiple_statements(self):
        """fab.tests.database.mysql.sql_statement_executor_test  Can execute multiple statements"""

        statements = ["use dev_db", "show tables", "select * from projects"]
        expected_statement_sequence = "; ".join(statements)

        self._set_expectations_for_executing_statements(expected_statement_sequence, hide_output=False)

        self.statement_executor.execute(statements)

    def test_can_execute_multiple_statements_without_output(self):
        """fab.tests.database.mysql.sql_statement_executor_test  Can execute multiple statements without output"""

        statements = ["use dev_db", "show tables", "select * from projects"]
        expected_statement_sequence = "; ".join(statements)

        self._set_expectations_for_executing_statements(expected_statement_sequence, hide_output=True)

        self.statement_executor.execute_without_output(statements)

    def _set_expectations_for_executing_statements(self, expected_statement_sequence, hide_output):
        if hide_output:
            self.mock_host_controller.hide_command_and_output().AndReturn(fabric.api.hide('running', 'stdout'))
        else:
            self.mock_feedback.comment("Executing SQL: %s" % expected_statement_sequence)
            self.mock_host_controller.hide_command().AndReturn(fabric.api.hide('running'))
        self.mock_host_controller.run('mysql %s -e "%s"' % (self.expected_admin_credentials, expected_statement_sequence))
        self.mox.ReplayAll()


def suite():
    return TestSuiteLoader().load_tests_from(SQLStatementExecutorTest)

if __name__ == "__main__":
    from fab.tests.test_settings import TEST_MODE
    TestRunner(TEST_MODE).run_test_suite(suite())
