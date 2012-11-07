#!/usr/bin/env python

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


import mox, unittest

from testing.helpers.execution import TestRunner, TestSuiteLoader

from fab.database.mysql.commandexecution import MySQLResponseData


class MySQLResponseDataTest(unittest.TestCase):

    def setUp(self):
        super(MySQLResponseDataTest, self).setUp()


    def test_can_check_whether_mysql_command_response_contains_given_text(self):
        """fab.tests.database.mysql.mysql_response_data_test  Can check whether the mysql command response contains some given text"""

        response_data = MySQLResponseData("+----------+\n" + \
                                          "| Database |\n" + \
                                          "+----------+\n" + \
                                          "| foodev   |\n" + \
                                          "+----------+")

        self.assertTrue(response_data.contains("foo"), "Expected text to be found")
        self.assertFalse(response_data.contains("bar"), "Expected text not to be found")


def suite():
    return TestSuiteLoader().load_tests_from(MySQLResponseDataTest)

if __name__ == '__main__':
    TestRunner().run_test_suite(suite())
