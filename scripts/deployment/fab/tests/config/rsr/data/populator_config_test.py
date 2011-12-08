#!/usr/bin/env python

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


import imp, os, unittest2

from testing.helpers.execution import TestSuiteLoader, TestRunner

from fab.config.rsr.codebase import RSRCodebaseConfig
from fab.config.rsr.data.populator import RSRDataPopulatorConfig
from fab.config.rsr.deployment import RSRDeploymentConfig

CONFIG_VALUES_TEMPLATE_PATH = os.path.realpath(os.path.join(os.path.dirname(__file__), '../../../../config/values.py.template'))
imp.load_source('config_values', CONFIG_VALUES_TEMPLATE_PATH)

from config_values import DeploymentHostConfigValues


class RSRDataPopulatorConfigTest(unittest2.TestCase):

    def setUp(self):
        super(RSRDataPopulatorConfigTest, self).setUp()
        self.deployment_config = RSRDeploymentConfig.create_instance()
        self.deployment_host_config_values = DeploymentHostConfigValues()
        self.codebase_config = RSRCodebaseConfig.create_instance()

        self.expected_rsr_deployment_home = self.deployment_config.rsr_deployment_home

        self.data_populator_config = RSRDataPopulatorConfig(self.deployment_config, self.deployment_host_config_values, self.codebase_config)

    def test_can_create_rsrdatapopulatorconfig_instance(self):
        """fab.tests.config.rsr.data.populator_config_test  Can create RSRDataPopulatorConfig instance"""

        self.assertIsInstance(RSRDataPopulatorConfig.create_instance(), RSRDataPopulatorConfig)

    def test_has_data_archives_home(self):
        """fab.tests.config.rsr.data.populator_config_test  Has data archives home"""

        expected_data_archives_home = os.path.join(self.deployment_host_config_values.deployment_processing_home, 'data_archives')

        self.assertEqual(expected_data_archives_home, self.data_populator_config.data_archives_home)

    def test_has_rsr_deployment_home(self):
        """fab.tests.config.rsr.data.populator_config_test  Has RSR deployment home"""

        self.assertEqual(self.expected_rsr_deployment_home, self.data_populator_config.rsr_deployment_home)

    def test_has_rsr_virtualenv_path(self):
        """fab.tests.config.rsr.data.populator_config_test  Has RSR virtualenv path"""

        rsr_env_name = "rsr_%s" % self.codebase_config.repo_branch_without_type
        expected_rsr_env_path = os.path.join(self.deployment_host_config_values.virtualenvs_home, rsr_env_name)

        self.assertEqual(expected_rsr_env_path, self.data_populator_config.rsr_env_path)


def suite():
    return TestSuiteLoader().load_tests_from(RSRDataPopulatorConfigTest)

if __name__ == "__main__":
    from fab.tests.test_settings import TEST_MODE
    TestRunner(TEST_MODE).run_test_suite(suite())
