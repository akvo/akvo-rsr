#!/usr/bin/env python

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


import imp, os, unittest2

from testing.helpers.execution import TestSuiteLoader, TestRunner

CONFIG_VALUES_TEMPLATE_PATH = os.path.realpath(os.path.join(os.path.dirname(__file__), '../../config/values.py.template'))
imp.load_source('config_values', CONFIG_VALUES_TEMPLATE_PATH)

from config_values import SharedConfigValues, PythonConfigValues, DataHostConfigValues
from config_values import DeploymentHostConfigValues, DatabaseAdminConfigValues, RSRDatabaseConfigValues


class ConfigValuesTest(unittest2.TestCase):

    def setUp(self):
        super(ConfigValuesTest, self).setUp()
        
        self.python_config_values = PythonConfigValues()
        self.data_host_config_values = DataHostConfigValues()
        self.deployment_config_values = DeploymentHostConfigValues()
        self.database_admin_config_values = DatabaseAdminConfigValues()
        self.rsr_database_config_values = RSRDatabaseConfigValues()

    def test_sharedconfigvalues_has_repository_branch(self):
        """fab.tests.config.config_values_test  SharedConfigValues has repository branch"""

        self._verify_expected_config_value(SharedConfigValues().repository_branch, "repository branch")

    def test_pythonconfigvalues_has_pip_version(self):
        """fab.tests.config.config_values_test  PythonConfigValues has pip version"""

        self._verify_expected_config_value(self.python_config_values.pip_version, "pip version")

    def test_pythonconfigvalues_has_python_package_download_directory(self):
        """fab.tests.config.config_values_test  PythonConfigValues has Python package download directory"""

        self._verify_expected_config_value(self.python_config_values.python_package_download_dir, "Python package download directory")

    def test_datahostconfigvalues_has_deployed_rsr_version(self):
        """fab.tests.config.config_values_test  DataHostConfigValues has deployed RSR version"""

        self._verify_expected_config_value(self.data_host_config_values.deployed_rsr_version, "deployed RSR version")

    def test_datahostconfigvalues_has_deployed_rsr_dir_name(self):
        """fab.tests.config.config_values_test  DataHostConfigValues has deployed RSR directory name"""

        self._verify_expected_config_value(self.data_host_config_values.deployed_rsr_dir_name, "deployed RSR directory name")

    def test_datahostconfigvalues_has_django_apps_home(self):
        """fab.tests.config.config_values_test  DataHostConfigValues has Django apps home"""

        self._verify_expected_config_value(self.data_host_config_values.django_apps_home, "Django apps home")

    def test_datahostconfigvalues_has_virtualenvs_home(self):
        """fab.tests.config.config_values_test  DataHostConfigValues has virtualenvs home"""

        self._verify_expected_config_value(self.data_host_config_values.virtualenvs_home, "virtualenvs home")

    def test_datahostconfigvalues_has_rsr_logs_home(self):
        """fab.tests.config.config_values_test  DataHostConfigValues has RSR logs home"""

        self._verify_expected_config_value(self.data_host_config_values.rsr_logs_home, "RSR logs home")

    def test_datahostconfigvalues_has_data_dumps_home(self):
        """fab.tests.config.config_values_test  DataHostConfigValues has data dumps home"""

        self._verify_expected_config_value(self.data_host_config_values.data_dumps_home, "data dumps home")

    def test_deploymenthostconfigvalues_has_repository_checkout_home(self):
        """fab.tests.config.config_values_test  DeploymentHostConfigValues has repository checkout home"""

        self._verify_expected_config_value(self.deployment_config_values.repo_checkout_home, "repository checkout home")

    def test_deploymenthostconfigvalues_has_virtualenvs_home(self):
        """fab.tests.config.config_values_test  DeploymentHostConfigValues has virtualenvs home"""

        self._verify_expected_config_value(self.deployment_config_values.virtualenvs_home, "virtualenvs home")

    def test_deploymenthostconfigvalues_has_data_archives_home(self):
        """fab.tests.config.config_values_test  DeploymentHostConfigValues has data archives home"""

        self._verify_expected_config_value(self.deployment_config_values.data_archives_home, "data archives home")

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
