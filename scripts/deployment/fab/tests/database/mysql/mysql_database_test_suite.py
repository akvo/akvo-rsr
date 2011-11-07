#!/usr/bin/env python

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


from testing.helpers.execution import TestSuiteLoader, TestRunner

from fab.tests.database.mysql.database_admin_test import DatabaseAdminTest
from fab.tests.database.mysql.database_copier_test import DatabaseCopierTest
from fab.tests.database.mysql.sql_statement_executor_test import SQLStatementExecutorTest


def mysql_database_suite():
    return TestSuiteLoader().create_suite_from_classes([SQLStatementExecutorTest, DatabaseCopierTest, DatabaseAdminTest])

if __name__ == "__main__":
    from fab.tests.test_settings import TEST_MODE
    TestRunner(TEST_MODE).run_test_suite(mysql_database_suite())
