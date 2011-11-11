#!/usr/bin/env python

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


import imp, os, unittest2

from testing.helpers.execution import TestSuiteLoader, TestRunner

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

        self.expected_rsr_app_path = os.path.join(self.deployment_config.rsr_deployment_home, 'akvo')

        self.data_populator_config = RSRDataPopulatorConfig(self.deployment_config, self.deployment_host_config_values)

    def test_can_create_rsrdatapopulatorconfig_instance(self):
        """fab.tests.config.rsr.data.populator_config_test  Can create RSRDataPopulatorConfig instance"""

        self.assertIsInstance(RSRDataPopulatorConfig.create_instance(), RSRDataPopulatorConfig)

    def test_has_data_archives_home(self):
        """fab.tests.config.rsr.data.populator_config_test  Has data archives home"""

        self.assertEqual(self.deployment_host_config_values.data_archives_home, self.data_populator_config.data_archives_home)

    def test_has_db_dump_script_path(self):
        """fab.tests.config.rsr.data.populator_config_test  Has the db_dump script path"""

        expected_db_dump_script_path = os.path.join(self.expected_rsr_app_path, 'db_dump.py')

        self.assertEqual(expected_db_dump_script_path, self.data_populator_config.db_dump_script_path)


def suite():
    return TestSuiteLoader().load_tests_from(RSRDataPopulatorConfigTest)

if __name__ == "__main__":
    from fab.tests.test_settings import TEST_MODE
    TestRunner(TEST_MODE).run_test_suite(suite())
