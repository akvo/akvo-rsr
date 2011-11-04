#!/usr/bin/env python

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


import imp, mox, os

from testing.helpers.execution import TestSuiteLoader, TestRunner

from fab.config.rsr.database import RSRDatabaseConfig
from fab.config.rsr.deployment import RSRDeploymentConfig
from fab.format.timestamp import TimeStampFormatter

CONFIG_VALUES_TEMPLATE_PATH = os.path.realpath(os.path.join(os.path.dirname(__file__), '../../../config/values.py.template'))
imp.load_source('config_values', CONFIG_VALUES_TEMPLATE_PATH)

from config_values import DatabaseAdminConfigValues, RSRDatabaseConfigValues


class RSRDatabaseConfigTest(mox.MoxTestBase):

    def setUp(self):
        super(RSRDatabaseConfigTest, self).setUp()
        self.database_admin_config_values = DatabaseAdminConfigValues()
        self.database_config_values = RSRDatabaseConfigValues()
        self.deployment_config = RSRDeploymentConfig.create_instance(None)
        self.mock_time_stamp_formatter = self.mox.CreateMock(TimeStampFormatter)

        self.database_config = RSRDatabaseConfig(self.database_admin_config_values, self.database_config_values,
                                                 self.deployment_config, self.mock_time_stamp_formatter)

    def test_can_create_config_from_config_values_file(self):
        """fab.tests.config.rsr.database_config_test  Can create RSRDatabaseConfig from a given config values file"""

        self.assertIsInstance(RSRDatabaseConfig.from_config_values_file(CONFIG_VALUES_TEMPLATE_PATH), RSRDatabaseConfig)

    def test_can_create_config_from_local_config_values(self):
        """fab.tests.config.rsr.database_config_test  Can create RSRDatabaseConfig from local config values"""

        self.assertIsInstance(RSRDatabaseConfig.from_local_config_values(), RSRDatabaseConfig)

    def test_has_admin_login_user_name(self):
        """fab.tests.config.rsr.database_config_test  Has admin login user name"""

        self.assertEqual(self.database_admin_config_values.admin_user, self.database_config.admin_user)

    def test_has_admin_login_password(self):
        """fab.tests.config.rsr.database_config_test  Has admin login password"""

        self.assertEqual(self.database_admin_config_values.admin_password, self.database_config.admin_password)

    def test_has_rsr_database_name(self):
        """fab.tests.config.rsr.database_config_test  Has RSR database name"""

        self.assertEqual(self.database_config_values.rsr_database_name, self.database_config.rsr_database_name)

    def test_has_rsr_database_user(self):
        """fab.tests.config.rsr.database_config_test  Has RSR database user"""

        self.assertEqual(self.database_config_values.rsr_database_user, self.database_config.rsr_database_user)

    def test_has_local_config_values_file_path(self):
        """fab.tests.config.rsr.database_config_test  Has local config values file path"""

        expected_config_values_file_path = os.path.realpath(os.path.join(os.path.dirname(__file__), '../../../config',
                                                                         RSRDatabaseConfig.CONFIG_VALUES_FILE_NAME))

        self.assertEqual(expected_config_values_file_path, RSRDatabaseConfig.LOCAL_CONFIG_VALUES_FILE)
        self.assertEqual(expected_config_values_file_path, self.database_config.local_config_values_file)

    def test_has_remote_config_values_home(self):
        """fab.tests.config.rsr.database_config_test  Has remote config values home"""

        self.assertEqual(self.database_admin_config_values.remote_config_values_home, self.database_config.remote_config_values_home)

    def test_has_remote_config_values_file_path(self):
        """fab.tests.config.rsr.database_config_test  Has remote config values file path"""

        expected_config_values_file_path = os.path.join(self.database_admin_config_values.remote_config_values_home,
                                                        RSRDatabaseConfig.CONFIG_VALUES_FILE_NAME)

        self.assertEqual(expected_config_values_file_path, self.database_config.remote_config_values_file)

    def test_has_database_admin_scripts_path(self):
        """fab.tests.config.rsr.database_config_test  Has database admin scripts path"""

        expected_admin_scripts_path = os.path.join(self.deployment_config.rsr_deployment_home, RSRDatabaseConfig.DATABASE_ADMIN_SCRIPTS_HOME)

        self.assertEqual(expected_admin_scripts_path, self.database_config.admin_scripts_path)

    def test_can_get_time_stamped_database_name(self):
        """fab.tests.config.rsr.database_config_test  Can get time-stamped database name"""

        original_database_name = self.database_config_values.rsr_database_name
        time_stamped_database_name = "%s_%s" % (original_database_name, "timestamp")

        self.mock_time_stamp_formatter.append_timestamp(original_database_name).AndReturn(time_stamped_database_name)
        self.mox.ReplayAll()

        self.assertEqual(time_stamped_database_name, self.database_config.time_stamped_database_name())


def suite():
    return TestSuiteLoader().load_tests_from(RSRDatabaseConfigTest)

if __name__ == "__main__":
    from fab.tests.test_settings import TEST_MODE
    TestRunner(TEST_MODE).run_test_suite(suite())
