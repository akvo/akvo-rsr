#!/usr/bin/env python

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


import imp, os, unittest2

from testing.helpers.execution import TestSuiteLoader, TestRunner

CONFIG_VALUES_TEMPLATE_PATH = os.path.realpath(os.path.join(os.path.dirname(__file__), '../../config/values.py.template'))
imp.load_source('config_values', CONFIG_VALUES_TEMPLATE_PATH)

from config_values import SharedConfigValues, PythonConfigValues, DeploymentHostConfigValues


class ConfigValuesTest(unittest2.TestCase):

    def setUp(self):
        super(ConfigValuesTest, self).setUp()
        
        self.python_config_values = PythonConfigValues()
        self.deployment_config_values = DeploymentHostConfigValues()

    def test_sharedconfigvalues_has_repository_branch(self):
        """fab.tests.config.config_values_test  SharedConfigValues has repository branch"""

        self.assertTrue(len(SharedConfigValues().repository_branch) > 0, "Expected repository branch")

    def test_pythonconfigvalues_has_pip_version(self):
        """fab.tests.config.config_values_test  PythonConfigValues has pip version"""

        self.assertTrue(len(self.python_config_values.pip_version) > 0, "Expected pip version")

    def test_pythonconfigvalues_has_python_package_download_directory(self):
        """fab.tests.config.config_values_test  PythonConfigValues has Python package download directory"""

        self.assertTrue(len(self.python_config_values.python_package_download_dir) > 0, "Expected Python package download directory")

    def test_deploymenthostconfigvalues_has_repository_checkout_home(self):
        """fab.tests.config.config_values_test  DeploymentHostConfigValues has repository checkout home"""

        self.assertTrue(len(self.deployment_config_values.repo_checkout_home) > 0, "Expected repository checkout home")

    def test_deploymenthostconfigvalues_has_virtualenvs_home(self):
        """fab.tests.config.config_values_test  DeploymentHostConfigValues has virtualenvs home"""

        self.assertTrue(len(self.deployment_config_values.virtualenvs_home) > 0, "Expected virtualenvs home")


def suite():
    return TestSuiteLoader().load_tests_from(ConfigValuesTest)

if __name__ == "__main__":
    from fab.tests.test_settings import TEST_MODE
    TestRunner(TEST_MODE).run_test_suite(suite())
