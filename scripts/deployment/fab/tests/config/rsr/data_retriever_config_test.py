#!/usr/bin/env python

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


import imp, os, unittest2

from testing.helpers.execution import TestSuiteLoader, TestRunner

from fab.config.rsr.dataretriever import RSRDataRetrieverConfig

CONFIG_VALUES_TEMPLATE_PATH = os.path.realpath(os.path.join(os.path.dirname(__file__), '../../../config/values.py.template'))
imp.load_source('config_values', CONFIG_VALUES_TEMPLATE_PATH)

from config_values import DataHostConfigValues, DeploymentHostConfigValues


class RSRDataRetrieverConfigTest(unittest2.TestCase):

    def setUp(self):
        super(RSRDataRetrieverConfigTest, self).setUp()
        self.deployment_host_config_values = DeploymentHostConfigValues()
        self.data_host_config_values = DataHostConfigValues()

        self.expected_data_dumps_home = os.path.join(self.deployment_host_config_values.deployment_processing_home, 'data_dumps')

        self.data_retriever_config = RSRDataRetrieverConfig(self.deployment_host_config_values, self.data_host_config_values)

    def test_can_create_instance(self):
        """fab.tests.config.rsr.data_retriever_config_test  Can create RSRDataRetrieverConfig instance"""

        self.assertIsInstance(RSRDataRetrieverConfig.create_instance(), RSRDataRetrieverConfig)

    def test_has_data_dumps_home(self):
        """fab.tests.config.rsr.data_retriever_config_test  Has data dumps home"""

        self.assertEqual(self.expected_data_dumps_home, self.data_retriever_config.data_dumps_home)

    def test_has_rsr_virtualenv_path(self):
        """fab.tests.config.rsr.data_retriever_config_test  Has RSR virtualenv path"""

        expected_rsr_env_path = os.path.join(self.data_host_config_values.virtualenvs_home, 'current')

        self.assertEqual(expected_rsr_env_path, self.data_retriever_config.rsr_env_path)

    def test_has_rsr_app_path(self):
        """fab.tests.config.rsr.data_retriever_config_test  Has RSR app path"""

        expected_rsr_app_path = os.path.join(self.data_host_config_values.django_apps_home, 'current')

        self.assertEqual(expected_rsr_app_path, self.data_retriever_config.rsr_app_path)

    def test_has_rsr_log_file_path(self):
        """fab.tests.config.rsr.data_retriever_config_test  Has RSR log file path"""

        expected_log_file_path = os.path.join(self.deployment_host_config_values.logging_home, "akvo.log")

        self.assertEqual(expected_log_file_path, self.data_retriever_config.rsr_log_file_path)


def suite():
    return TestSuiteLoader().load_tests_from(RSRDataRetrieverConfigTest)

if __name__ == "__main__":
    from fab.tests.test_settings import TEST_MODE
    TestRunner(TEST_MODE).run_test_suite(suite())
