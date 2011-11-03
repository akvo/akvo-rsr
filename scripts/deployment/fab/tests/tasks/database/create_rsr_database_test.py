#!/usr/bin/env python

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


import mox

from testing.helpers.execution import TestSuiteLoader, TestRunner

from fab.host.controller import HostControllerMode
from fab.host.database import DatabaseHost
from fab.tasks.database.creation import CreateRSRDatabase


class StubbedCreateRSRDatabase(CreateRSRDatabase):

    def __init__(self, database_host):
        self.database_host = database_host

    def _create_database_host_with(self, host_controller_mode):
        return self.database_host


class CreateRSRDatabaseTest(mox.MoxTestBase):

    def setUp(self):
        super(CreateRSRDatabaseTest, self).setUp()
        self.mock_database_host = self.mox.CreateMock(DatabaseHost)

        self.create_rsr_database_task = StubbedCreateRSRDatabase(self.mock_database_host)

    def test_has_expected_task_name(self):
        """fab.tests.tasks.database.create_rsr_database_test  Has expected task name"""

        self.assertEqual("create_empty_rsr_database", CreateRSRDatabase.name)

    def test_can_create_empty_rsr_database(self):
        """fab.tests.tasks.database.create_rsr_database_test  Can create an empty RSR database"""

        self.mock_database_host.upload_database_configuration()
        self.mock_database_host.rename_existing_database()
        self.mock_database_host.create_empty_database()
        self.mox.ReplayAll()

        self.create_rsr_database_task.run(HostControllerMode.REMOTE)


def suite():
    return TestSuiteLoader().load_tests_from(CreateRSRDatabaseTest)

if __name__ == "__main__":
    from fab.tests.test_settings import TEST_MODE
    TestRunner(TEST_MODE).run_test_suite(suite())
