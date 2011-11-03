#!/usr/bin/env python

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


import mox, os

from testing.helpers.execution import TestSuiteLoader, TestRunner

from fab.config.rsr.database import RSRDatabaseConfig
from fab.database.scriptrunner import DatabaseAdminScriptRunner
from fab.host.controller import RemoteHostController


class DatabaseAdminScriptRunnerTest(mox.MoxTestBase):

    def setUp(self):
        super(DatabaseAdminScriptRunnerTest, self).setUp()
        config_values_template_path = os.path.realpath(os.path.join(os.path.dirname(__file__), '../../config/values.py.template'))
        self.database_config = RSRDatabaseConfig.from_config_values_file(config_values_template_path)
        self.mock_host_controller = self.mox.CreateMock(RemoteHostController)

        self.admin_script_runner = DatabaseAdminScriptRunner(self.database_config, self.mock_host_controller)

    def test_can_create_instance(self):
        """fab.tests.database.admin_script_runner_test  Can create instance"""

        self.assertIsInstance(DatabaseAdminScriptRunner.create_instance(self.mock_host_controller), DatabaseAdminScriptRunner)

    def test_can_run_database_admin_script(self):
        """fab.tests.database.admin_script_runner_test  Can run database admin script"""

        self.mock_host_controller.run("python %s %s" % (self._expected_admin_script_path("some_admin_script.py"),
                                                        self.database_config.remote_config_values_file))
        self.mox.ReplayAll()

        self.admin_script_runner.run("some_admin_script.py")

    def _expected_admin_script_path(self, script_name):
        return os.path.join(self.database_config.admin_scripts_path, script_name)


def suite():
    return TestSuiteLoader().load_tests_from(DatabaseAdminScriptRunnerTest)

if __name__ == "__main__":
    from fab.tests.test_settings import TEST_MODE
    TestRunner(TEST_MODE).run_test_suite(suite())
