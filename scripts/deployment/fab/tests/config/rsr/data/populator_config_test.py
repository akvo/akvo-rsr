#!/usr/bin/env python

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


import os, unittest

from testing.helpers.execution import TestRunner, TestSuiteLoader

from fab.config.rsr.codebase import RSRCodebaseConfig
from fab.config.rsr.data.populator import RSRDataPopulatorConfig
from fab.config.rsr.deployment import RSRDeploymentConfig
from fab.config.rsr.host import CIDeploymentHostConfig


class RSRDataPopulatorConfigTest(unittest.TestCase):

    def setUp(self):
        super(RSRDataPopulatorConfigTest, self).setUp()
        self.deployment_host_config = CIDeploymentHostConfig.for_test()
        self.deployment_config = RSRDeploymentConfig.create_with(self.deployment_host_config)
        self.codebase_config = RSRCodebaseConfig("some_repo_branch")

        self.expected_rsr_deployment_home = self.deployment_config.rsr_deployment_home

        self.data_populator_config = RSRDataPopulatorConfig(self.deployment_config,
                                                            self.deployment_host_config.host_paths,
                                                            self.codebase_config)

    def test_can_create_rsrdatapopulatorconfig_instance_with_given_deployment_host_config(self):
        """fab.tests.config.rsr.data.populator_config_test  Can create RSRDataPopulatorConfig instance with given deployment host config"""

        self.assertIsInstance(RSRDataPopulatorConfig.create_with(self.deployment_host_config), RSRDataPopulatorConfig)

    def test_has_data_archives_home(self):
        """fab.tests.config.rsr.data.populator_config_test  Has data archives home"""

        expected_data_archives_home = os.path.join(self.deployment_host_config.host_paths.deployment_processing_home, 'data_archives')

        self.assertEqual(expected_data_archives_home, self.data_populator_config.data_archives_home)

    def test_has_rsr_deployment_home(self):
        """fab.tests.config.rsr.data.populator_config_test  Has RSR deployment home"""

        self.assertEqual(self.expected_rsr_deployment_home, self.data_populator_config.rsr_deployment_home)

    def test_has_rsr_virtualenv_path(self):
        """fab.tests.config.rsr.data.populator_config_test  Has RSR virtualenv path"""

        rsr_env_name = "rsr_%s" % self.codebase_config.repo_branch_without_type
        expected_rsr_env_path = os.path.join(self.deployment_host_config.host_paths.virtualenvs_home, rsr_env_name)

        self.assertEqual(expected_rsr_env_path, self.data_populator_config.rsr_env_path)

    def test_has_list_of_django_apps_to_migrate(self):
        """fab.tests.config.rsr.data.populator_config_test  Has list of Django apps to migrate"""

        self.assertEqual(["oembed", "ipn"], self.data_populator_config.django_apps_to_migrate)

    def test_has_rsr_app_name(self):
        """fab.tests.config.rsr.data.populator_config_test  Has RSR app name"""

        self.assertEqual(RSRCodebaseConfig.RSR_APP_NAME, self.data_populator_config.rsr_app_name)


def suite():
    return TestSuiteLoader().load_tests_from(RSRDataPopulatorConfigTest)

if __name__ == '__main__':
    TestRunner().run_test_suite(suite())
