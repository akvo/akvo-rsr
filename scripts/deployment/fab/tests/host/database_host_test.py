#!/usr/bin/env python

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


import mox

from testing.helpers.execution import TestSuiteLoader, TestRunner

from fab.config.rsr.database import RSRDatabaseConfig
from fab.database.scriptrunner import DatabaseAdminScriptRunner
from fab.helpers.feedback import ExecutionFeedback
from fab.host.controller import LocalHostController, RemoteHostController
from fab.host.database import DatabaseHost
from fab.os.filesystem import FileSystem


class DatabaseHostTest(mox.MoxTestBase):

    def setUp(self):
        super(DatabaseHostTest, self).setUp()
        self.database_config = RSRDatabaseConfig.from_local_config_values()
        self.mock_admin_script_runner = self.mox.CreateMock(DatabaseAdminScriptRunner)
        self.mock_file_system = self.mox.CreateMock(FileSystem)

        self.database_host = DatabaseHost(self.database_config, self.mock_admin_script_runner,
                                          self.mock_file_system, None)

    def test_can_create_remote_database_host_instance(self):
        """fab.tests.host.database_host_test  Can create a remote DatabaseHost instance"""

        self.assertIsInstance(self._create_database_host_instance_with(RemoteHostController), DatabaseHost)

    def test_can_create_local_database_host_instance(self):
        """fab.tests.host.database_host_test  Can create a local DatabaseHost instance"""

        self.assertIsInstance(self._create_database_host_instance_with(LocalHostController), DatabaseHost)

    def _create_database_host_instance_with(self, host_controller_class):
        mock_host_controller = self.mox.CreateMock(host_controller_class)
        mock_host_controller.feedback = self.mox.CreateMock(ExecutionFeedback)

        self.mox.ReplayAll()

        return DatabaseHost.create_instance(mock_host_controller)

    def test_can_upload_database_config(self):
        """fab.tests.host.database_host_test  Can upload database configuration"""

        self.mock_file_system.ensure_directory_exists(self.database_config.remote_config_values_home)
        self.mock_file_system.upload_file(self.database_config.local_config_values_file, self.database_config.remote_config_values_home)
        self.mox.ReplayAll()

        self.database_host.upload_database_configuration()

    def test_can_rename_existing_database(self):
        """fab.tests.host.database_host_test  Can rename existing database"""

        self.mock_admin_script_runner.run("rename_existing_rsr_database.py")
        self.mox.ReplayAll()

        self.database_host.rename_existing_database()

    def test_can_create_empty_database(self):
        """fab.tests.host.database_host_test  Can create empty database"""

        self.mock_admin_script_runner.run("create_empty_rsr_database.py")
        self.mox.ReplayAll()

        self.database_host.create_empty_database()


def suite():
    return TestSuiteLoader().load_tests_from(DatabaseHostTest)

if __name__ == "__main__":
    from fab.tests.test_settings import TEST_MODE
    TestRunner(TEST_MODE).run_test_suite(suite())
