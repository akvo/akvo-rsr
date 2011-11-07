#!/usr/bin/env python

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


import mox

from testing.helpers.execution import TestSuiteLoader, TestRunner

from fab.host.controller import HostControllerMode
from fab.host.database import DatabaseHost
from fab.tasks.database.backup import BackupRSRDatabase


class StubbedBackupRSRDatabase(BackupRSRDatabase):

    def __init__(self, database_host):
        self.database_host = database_host

    def _create_database_host_with(self, host_controller_mode):
        return self.database_host


class BackupRSRDatabaseTest(mox.MoxTestBase):

    def setUp(self):
        super(BackupRSRDatabaseTest, self).setUp()
        self.mock_database_host = self.mox.CreateMock(DatabaseHost)

        self.create_rsr_database_task = StubbedBackupRSRDatabase(self.mock_database_host)

    def test_has_expected_task_name(self):
        """fab.tests.tasks.database.backup_database_test  Has expected task name"""

        self.assertEqual("duplicate_rsr_database", BackupRSRDatabase.name)

    def test_can_duplicate_existing_rsr_database(self):
        """fab.tests.tasks.database.backup_database_test  Can duplicate an existing RSR database"""

        self.mock_database_host.backup_existing_database()
        self.mox.ReplayAll()

        self.create_rsr_database_task.run(HostControllerMode.REMOTE)


def suite():
    return TestSuiteLoader().load_tests_from(BackupRSRDatabaseTest)

if __name__ == "__main__":
    from fab.tests.test_settings import TEST_MODE
    TestRunner(TEST_MODE).run_test_suite(suite())
