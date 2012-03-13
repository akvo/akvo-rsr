#!/usr/bin/env python

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


from testing.helpers.execution import TestRunner, TestSuiteLoader

from fab.tests.database.mysql.mysql_database_test_suite import mysql_database_suite


def database_suite():
    return TestSuiteLoader().create_suite_from_list([mysql_database_suite()])

if __name__ == '__main__':
    TestRunner().run_test_suite(database_suite())
