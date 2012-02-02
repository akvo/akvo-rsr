#!/usr/bin/env python

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


import mox, os

from testing.helpers.execution import TestSuiteLoader, TestRunner

from fab.config.rsr.codebase import RSRCodebaseConfig
from fab.config.rsr.host import CIDeploymentHostConfig
from fab.config.rsr.virtualenv import RSRVirtualEnvInstallerConfig


class RSRVirtualEnvInstallerConfigTest(mox.MoxTestBase):

    def setUp(self):
        super(RSRVirtualEnvInstallerConfigTest, self).setUp()

        self.deployment_user = "rupaul"
        self.deployment_host_config = CIDeploymentHostConfig.for_test()
        self.codebase_config = RSRCodebaseConfig(self.deployment_host_config.repository_branch)

        self.expected_virtualenvs_home = self.deployment_host_config.host_paths.virtualenvs_home
        self.expected_rsr_env_name = "rsr_%s" % self.codebase_config.repo_branch_without_type

        self.virtualenv_installer_config = RSRVirtualEnvInstallerConfig(self.deployment_host_config.host_paths,
                                                                        self.codebase_config,
                                                                        self.deployment_user)

    def test_can_create_instance(self):
        """fab.tests.config.rsr.virtualenv_installer_config_test  Can create RSRVirtualEnvInstallerConfig instance"""

        self.assertIsInstance(RSRVirtualEnvInstallerConfig.create_with(self.deployment_host_config, self.deployment_user),
                              RSRVirtualEnvInstallerConfig)

    def test_has_deployment_user_name(self):
        """fab.tests.config.rsr.virtualenv_installer_config_test  Has deployment user name"""

        self.assertEqual(self.deployment_user, self.virtualenv_installer_config.deployment_user)

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

    def test_has_package_download_directory(self):
        """fab.tests.config.rsr.virtualenv_installer_config_test  Has python package download directory"""

        expected_package_download_dir = os.path.join(self.deployment_host_config.host_paths.deployment_processing_home, 'python_packages')

        self.assertEqual(expected_package_download_dir, self.virtualenv_installer_config.package_download_dir)

    def test_has_rsr_requirements_url(self):
        """fab.tests.config.rsr.virtualenv_installer_config_test  Has RSR requirements URL"""

        self.assertEqual(self.codebase_config.rsr_requirements_file_url, self.virtualenv_installer_config.rsr_requirements_url)

    def test_has_testing_requirements_url(self):
        """fab.tests.config.rsr.virtualenv_installer_config_test  Has testing requirements URL"""

        self.assertEqual(self.codebase_config.testing_requirements_file_url, self.virtualenv_installer_config.testing_requirements_url)


def suite():
    return TestSuiteLoader().load_tests_from(RSRVirtualEnvInstallerConfigTest)

if __name__ == "__main__":
    from fab.tests.test_settings import TEST_MODE
    TestRunner(TEST_MODE).run_test_suite(suite())
