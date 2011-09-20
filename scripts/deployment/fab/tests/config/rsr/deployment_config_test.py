#!/usr/bin/env python

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


import imp, os, unittest2

from testing.helpers.execution import TestSuiteLoader, TestRunner

from fab.config.rsr.codebase import RSRCodebaseConfig
from fab.config.rsr.deployment import RSRDeploymentConfig

CONFIG_VALUES_TEMPLATE_PATH = os.path.realpath(os.path.join(os.path.dirname(__file__), '../../../config/values.py.template'))
imp.load_source('config_values', CONFIG_VALUES_TEMPLATE_PATH)

from config_values import DeploymentHostConfigValues


class RSRDeploymentConfigTest(unittest2.TestCase):

    def setUp(self):
        super(RSRDeploymentConfigTest, self).setUp()

        self.deployment_user = "rupaul"
        self.feature_branch = "feature/sms"

        self.deployment_host_config_values = DeploymentHostConfigValues()
        self.codebase_config = RSRCodebaseConfig(self.feature_branch)

        self.expected_rsr_dir_name = "rsr_%s" % self.codebase_config.repo_branch_without_type

        self.deployment_config = RSRDeploymentConfig(self.deployment_user, self.deployment_host_config_values, self.codebase_config)

    def test_can_create_rsrdeploymentconfig_instance(self):
        """fab.tests.config.rsr.deployment_config_test  Can create RSRDeploymentConfig instance"""

        self.assertIsInstance(RSRDeploymentConfig.create_instance(self.deployment_user), RSRDeploymentConfig)

    def test_has_deployment_user_name(self):
        """fab.tests.config.rsr.deployment_config_test  Has deployment user name"""

        self.assertEqual(self.deployment_user, self.deployment_config.deployment_user)

    def test_has_repository_checkout_home(self):
        """fab.tests.config.rsr.deployment_config_test  Has repository checkout home"""

        self.assertEqual(self.deployment_host_config_values.repo_checkout_home, self.deployment_config.repo_checkout_home)

    def test_has_repository_archives_directory(self):
        """fab.tests.config.rsr.deployment_config_test  Has repository archives directory"""

        expected_repo_archives_dir = os.path.join(self.deployment_host_config_values.repo_checkout_home, "archives")

        self.assertEqual(expected_repo_archives_dir, self.deployment_config.repo_archives_dir)

    def test_has_rsr_code_archive_url(self):
        """fab.tests.config.rsr.deployment_config_test  Has RSR code archive URL"""

        self.assertEqual(self.codebase_config.rsr_archive_url, self.deployment_config.rsr_archive_url)

    def test_has_rsr_deployment_directory_name(self):
        """fab.tests.config.rsr.deployment_config_test  Has RSR deployment directory name"""

        self.assertEqual(self.expected_rsr_dir_name, self.deployment_config.rsr_deployment_dir_name)

    def test_has_rsr_deployment_home(self):
        """fab.tests.config.rsr.deployment_config_test  Has RSR deployment home"""

        expected_rsr_deployment_home = os.path.join(self.deployment_host_config_values.repo_checkout_home, self.expected_rsr_dir_name)

        self.assertEqual(expected_rsr_deployment_home, self.deployment_config.rsr_deployment_home)

    def test_has_virtualenvs_home(self):
        """fab.tests.config.rsr.deployment_config_test  Has virtualenvs home"""

        self.assertEqual(self.deployment_host_config_values.virtualenvs_home, self.deployment_config.virtualenvs_home)

    def test_has_rsr_virtualenv_name(self):
        """fab.tests.config.rsr.deployment_config_test  Has RSR virtualenv name"""

        self.assertEqual(self.expected_rsr_dir_name, self.deployment_config.rsr_env_name)

    def test_has_rsr_virtualenv_path(self):
        """fab.tests.config.rsr.deployment_config_test  Has RSR virtualenv path"""

        expected_rsr_env_path = os.path.join(self.deployment_host_config_values.virtualenvs_home, self.expected_rsr_dir_name)

        self.assertEqual(expected_rsr_env_path, self.deployment_config.rsr_env_path)


def suite():
    return TestSuiteLoader().load_tests_from(RSRDeploymentConfigTest)

if __name__ == "__main__":
    from fab.tests.test_settings import TEST_MODE
    TestRunner(TEST_MODE).run_test_suite(suite())
