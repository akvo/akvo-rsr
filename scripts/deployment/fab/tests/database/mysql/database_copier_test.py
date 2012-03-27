#!/usr/bin/env python

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


import imp, mox
import fabric.api

from testing.helpers.execution import TestRunner, TestSuiteLoader

import fab.tests.templates.database_credentials_template
from database_credentials import DatabaseCredentials

from fab.database.mysql.commandexecution import DatabaseCopier
from fab.helpers.feedback import ExecutionFeedback
from fab.host.controller import RemoteHostController


class DatabaseCopierTest(mox.MoxTestBase):

    def setUp(self):
        super(DatabaseCopierTest, self).setUp()
        database_credentials = DatabaseCredentials()
        self.expected_admin_credentials = "--user='%s' --password='%s'" % (database_credentials.admin_user, database_credentials.admin_password)

        self.mock_feedback = self.mox.CreateMock(ExecutionFeedback)
        self.mock_host_controller = self.mox.CreateMock(RemoteHostController)
        self.mock_host_controller.feedback = self.mock_feedback

        self.database_copier = DatabaseCopier(database_credentials, self.mock_host_controller)

    def test_can_create_duplicate_database(self):
        """fab.tests.database.mysql.database_copier_test  Can create duplicate database"""

        dump_original_database_command = "mysqldump %s projects_db" % self.expected_admin_credentials
        import_into_new_database_command = "mysql %s projects_copy" % self.expected_admin_credentials
        expected_database_copy_command = "%s | %s" % (dump_original_database_command, import_into_new_database_command)

        self.mock_feedback.comment("Copying database 'projects_db' to 'projects_copy'")
        self.mock_host_controller.hide_command().AndReturn(fabric.api.hide('running'))
        self.mock_host_controller.run(expected_database_copy_command)
        self.mox.ReplayAll()

        self.database_copier.create_duplicate("projects_db", "projects_copy")


def suite():
    return TestSuiteLoader().load_tests_from(DatabaseCopierTest)

if __name__ == '__main__':
    TestRunner().run_test_suite(suite())
