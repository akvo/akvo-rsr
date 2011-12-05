#!/usr/bin/env python

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


import imp, os, unittest2

from testing.helpers.execution import TestSuiteLoader, TestRunner

CONFIG_VALUES_TEMPLATE_PATH = os.path.realpath(os.path.join(os.path.dirname(__file__), '../../config/values.py.template'))
imp.load_source('config_values', CONFIG_VALUES_TEMPLATE_PATH)

from config_values import SharedConfigValues, DataHostConfigValues, DeploymentHostConfigValues, DatabaseAdminConfigValues, RSRDatabaseConfigValues


class ConfigValuesTest(unittest2.TestCase):

    def setUp(self):
        super(ConfigValuesTest, self).setUp()
        
        self.data_host_config_values = DataHostConfigValues()
        self.deployment_config_values = DeploymentHostConfigValues()
        self.database_admin_config_values = DatabaseAdminConfigValues()
        self.rsr_database_config_values = RSRDatabaseConfigValues()

    def test_sharedconfigvalues_has_repository_branch(self):
        """fab.tests.config.config_values_test  SharedConfigValues has repository branch"""

        self._verify_expected_config_value(SharedConfigValues().repository_branch, "repository branch")

    def test_datahostconfigvalues_has_django_apps_home(self):
        """fab.tests.config.config_values_test  DataHostConfigValues has Django apps home"""

        self._verify_expected_config_value(self.data_host_config_values.django_apps_home, "Django apps home")

    def test_datahostconfigvalues_has_virtualenvs_home(self):
        """fab.tests.config.config_values_test  DataHostConfigValues has virtualenvs home"""

        self._verify_expected_config_value(self.data_host_config_values.virtualenvs_home, "virtualenvs home")

    def test_deploymenthostconfigvalues_has_configuration_home(self):
        """fab.tests.config.config_values_test  DeploymentHostConfigValues has configuration home"""

        self._verify_expected_config_value(self.deployment_config_values.config_home, "configuration home")

    def test_deploymenthostconfigvalues_has_repository_checkout_home(self):
        """fab.tests.config.config_values_test  DeploymentHostConfigValues has repository checkout home"""

        self._verify_expected_config_value(self.deployment_config_values.repo_checkout_home, "repository checkout home")

    def test_deploymenthostconfigvalues_has_virtualenvs_home(self):
        """fab.tests.config.config_values_test  DeploymentHostConfigValues has virtualenvs home"""

        self._verify_expected_config_value(self.deployment_config_values.virtualenvs_home, "virtualenvs home")

    def test_deploymenthostconfigvalues_has_logging_home(self):
        """fab.tests.config.config_values_test  DeploymentHostConfigValues has logging home"""

        self._verify_expected_config_value(self.deployment_config_values.logging_home, "logging home")

    def test_deploymenthostconfigvalues_has_deployment_processing_home(self):
        """fab.tests.config.config_values_test  DeploymentHostConfigValues has deployment processing home"""

        self._verify_expected_config_value(self.deployment_config_values.deployment_processing_home, "deployment processing home")

    def test_databaseadminconfigvalues_has_admin_user(self):
        """fab.tests.config.config_values_test  DatabaseAdminConfigValues has admin user"""

        self._verify_expected_config_value(self.database_admin_config_values.admin_user, "admin user")

    def test_databaseadminconfigvalues_has_admin_password(self):
        """fab.tests.config.config_values_test  DatabaseAdminConfigValues has admin password"""

        self._verify_expected_config_value(self.database_admin_config_values.admin_password, "admin password")

    def test_rsrdatabaseconfigvalues_has_database_name(self):
        """fab.tests.config.config_values_test  RSRDatabaseConfigValues has RSR database name"""

        self._verify_expected_config_value(self.rsr_database_config_values.rsr_database_name, "RSR database name")

    def test_rsrdatabaseconfigvalues_has_database_user(self):
        """fab.tests.config.config_values_test  RSRDatabaseConfigValues has RSR database user"""

        self._verify_expected_config_value(self.rsr_database_config_values.rsr_database_user, "RSR database user")

    def test_rsrdatabaseconfigvalues_has_database_password(self):
        """fab.tests.config.config_values_test  RSRDatabaseConfigValues has RSR database password"""

        self._verify_expected_config_value(self.rsr_database_config_values.rsr_database_password, "RSR database password")

    def _verify_expected_config_value(self, config_value, config_value_description):
        self.assertTrue(len(config_value) > 0, "Expected %s config value" % config_value_description)


def suite():
    return TestSuiteLoader().load_tests_from(ConfigValuesTest)

if __name__ == "__main__":
    from fab.tests.test_settings import TEST_MODE
    TestRunner(TEST_MODE).run_test_suite(suite())
