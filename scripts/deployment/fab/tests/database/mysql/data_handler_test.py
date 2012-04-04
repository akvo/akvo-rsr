#!/usr/bin/env python

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


import fabric.api
import mox

from testing.helpers.execution import TestRunner, TestSuiteLoader

import fab.tests.templates.database_credentials_template
from database_credentials import DatabaseCredentials

from fab.database.mysql.commandexecution import DataHandler
from fab.helpers.feedback import ExecutionFeedback
from fab.host.controller import RemoteHostController


class DataHandlerTest(mox.MoxTestBase):

    def setUp(self):
        super(DataHandlerTest, self).setUp()
        database_credentials = DatabaseCredentials()
        self.expected_admin_credentials = "--user='%s' --password='%s'" % (database_credentials.admin_user, database_credentials.admin_password)

        self.mock_feedback = self.mox.CreateMock(ExecutionFeedback)
        self.mock_host_controller = self.mox.CreateMock(RemoteHostController)
        self.mock_host_controller.feedback = self.mock_feedback

        self.data_handler = DataHandler(database_credentials, self.mock_host_controller)

    def test_can_extract_data_to_specified_data_extract_file(self):
        """fab.tests.database.mysql.data_handler_test  Can extract data to a specified data extract file"""

        expected_data_extraction_command = 'mysqldump %s some_database > /path/to/data_extract_file.sql' % self.expected_admin_credentials

        self.mock_feedback.comment("Extracting data from 'some_database' to /path/to/data_extract_file.sql")
        self._hide_command_execution()
        self.mock_host_controller.run(expected_data_extraction_command)
        self.mox.ReplayAll()

        self.data_handler.extract_data_to('/path/to/data_extract_file.sql', 'some_database')

    def test_can_load_data_from_specified_data_extract_file(self):
        """fab.tests.database.mysql.data_handler_test  Can load data from a specified data extract file"""

        expected_data_import_command = 'mysql %s some_database < /path/to/data_extract_file.sql' % self.expected_admin_credentials

        self.mock_feedback.comment("Importing data from /path/to/data_extract_file.sql into 'some_database'")
        self._hide_command_execution()
        self.mock_host_controller.run(expected_data_import_command)
        self.mox.ReplayAll()

        self.data_handler.load_data_from('/path/to/data_extract_file.sql', 'some_database')

    def _hide_command_execution(self):
        self.mock_host_controller.hide_command().AndReturn(fabric.api.hide('running'))


def suite():
    return TestSuiteLoader().load_tests_from(DataHandlerTest)

if __name__ == '__main__':
    TestRunner().run_test_suite(suite())
