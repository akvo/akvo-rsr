#!/usr/bin/env python

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


import imp, mox, os

from testing.helpers.execution import TestSuiteLoader, TestRunner

from fab.config.rsr.codebase import RSRCodebaseConfig
from fab.config.rsr.deployment import RSRDeploymentConfig
from fab.config.rsr.virtualenv import RSRVirtualEnvInstallerConfig
from fab.format.timestamp import TimeStampFormatter

CONFIG_VALUES_TEMPLATE_PATH = os.path.realpath(os.path.join(os.path.dirname(__file__), '../../../config/values.py.template'))
imp.load_source('config_values', CONFIG_VALUES_TEMPLATE_PATH)

from config_values import DeploymentHostConfigValues


class RSRVirtualEnvInstallerConfigTest(mox.MoxTestBase):

    def setUp(self):
        super(RSRVirtualEnvInstallerConfigTest, self).setUp()

        feature_branch = "feature/sms"

        self.deployment_host_config_values = DeploymentHostConfigValues()
        self.codebase_config = RSRCodebaseConfig(feature_branch)
        self.deployment_config = RSRDeploymentConfig(None, self.deployment_host_config_values, self.codebase_config)
        self.mock_time_stamp_formatter = self.mox.CreateMock(TimeStampFormatter)

        self.expected_virtualenvs_home = self.deployment_host_config_values.virtualenvs_home
        self.expected_rsr_env_name = "rsr_%s" % self.codebase_config.repo_branch_without_type

        self.virtualenv_installer_config = RSRVirtualEnvInstallerConfig(self.deployment_host_config_values, self.codebase_config,
                                                                        self.deployment_config, self.mock_time_stamp_formatter)

    def test_can_create_instance(self):
        """fab.tests.config.rsr.virtualenv_installer_config_test  Can create RSRVirtualEnvInstallerConfig instance"""

        self.assertIsInstance(RSRVirtualEnvInstallerConfig.create_instance(), RSRVirtualEnvInstallerConfig)

    def test_has_virtualenvs_home(self):
        """fab.tests.config.rsr.virtualenv_installer_config_test  Has virtualenvs home"""

        self.assertEqual(self.expected_virtualenvs_home, self.virtualenv_installer_config.virtualenvs_home)

    def test_has_rsr_virtualenv_name(self):
        """fab.tests.config.rsr.virtualenv_installer_config_test  Has RSR virtualenv name"""

        self.assertEqual(self.expected_rsr_env_name, self.virtualenv_installer_config.rsr_env_name)

    def test_has_rsr_virtualenv_path(self):
        """fab.tests.config.rsr.virtualenv_installer_config_test  Has RSR virtualenv path"""

        expected_rsr_env_path = os.path.join(self.expected_virtualenvs_home, self.expected_rsr_env_name)

        self.assertEqual(expected_rsr_env_path, self.virtualenv_installer_config.rsr_env_path)

    def test_has_rsr_requirements_file_path(self):
        """fab.tests.config.rsr.virtualenv_installer_config_test  Has RSR requirements file path"""

        expected_rsr_requirements_file_path = os.path.join(self.deployment_config.rsr_deployment_home,
                                                           self.codebase_config.rsr_requirements_file_path)

        self.assertEqual(expected_rsr_requirements_file_path, self.virtualenv_installer_config.rsr_requirements_path)

    def test_can_get_time_stamped_pip_install_log_file_path(self):
        """fab.tests.config.rsr.virtualenv_installer_config_test  Can get time stamped pip install log file path"""

        expected_file_timestamp = "20110923_153244"
        expected_pip_log_file_name = "pip_install_%s_%s.log" % (self.expected_rsr_env_name, expected_file_timestamp)
        expected_pip_install_log_file_path = os.path.join(self.expected_virtualenvs_home, expected_pip_log_file_name)

        self.mock_time_stamp_formatter.file_timestamp().AndReturn(expected_file_timestamp)
        self.mox.ReplayAll()

        self.assertEqual(expected_pip_install_log_file_path, self.virtualenv_installer_config.time_stamped_pip_install_log_file_path())


def suite():
    return TestSuiteLoader().load_tests_from(RSRVirtualEnvInstallerConfigTest)

if __name__ == "__main__":
    from fab.tests.test_settings import TEST_MODE
    TestRunner(TEST_MODE).run_test_suite(suite())
