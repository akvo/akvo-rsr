#!/usr/bin/env python

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


from testing.helpers.execution import TestRunner, TestSuiteLoader

from fab.tests.database.mysql.data_handler_test import DataHandlerTest
from fab.tests.database.mysql.database_admin_command_test import DatabaseAdminCommandTest
from fab.tests.database.mysql.database_admin_test import DatabaseAdminTest
from fab.tests.database.mysql.database_copier_test import DatabaseCopierTest
from fab.tests.database.mysql.mysql_response_data_test import MySQLResponseDataTest
from fab.tests.database.mysql.sql_statement_executor_test import SQLStatementExecutorTest


def mysql_database_suite():
    return TestSuiteLoader().create_suite_from_classes([DataHandlerTest, DatabaseAdminCommandTest, DatabaseAdminTest,
                                                        DatabaseCopierTest, MySQLResponseDataTest, SQLStatementExecutorTest])

if __name__ == '__main__':
    TestRunner().run_test_suite(mysql_database_suite())
