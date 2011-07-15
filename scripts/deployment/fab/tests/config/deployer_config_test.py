#!/usr/bin/env python

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


import imp, os, unittest

from testing.helpers.execution import TestSuiteLoader, TestRunner

CONFIG_TEMPLATE_PATH = os.path.realpath(os.path.join(os.path.dirname(__file__), '..', '..', 'config', 'deployer.py.template'))
imp.load_source('deployer_config', CONFIG_TEMPLATE_PATH)

from deployer_config import DeployerConfig


class DeployerConfigTest(unittest.TestCase):

    def setUp(self):
        super(DeployerConfigTest, self).setUp()
        self.expected_hosts = "somehost:port1,anotherhost:port2"
        self.deployer_config = DeployerConfig(self.expected_hosts)

    def test_deployment_hosts_are_set_on_initialisation(self):
        """fab.tests.config.DeployerConfigTest  Deployment hosts are set on initialisation"""

        self.assertEqual(self.expected_hosts, self.deployer_config.deployment_hosts)

    def test_has_rsr_branch(self):
        """fab.tests.config.DeployerConfigTest  Has RSR branch setting"""

        self.assertTrue(len(self.deployer_config.rsr_branch) > 0, "Expected some value for rsr_branch setting")

    def test_has_expected_rsr_archive_url(self):
        """fab.tests.config.DeployerConfigTest  Has expected RSR archive URL"""

        archive_url_root = "http://nodeload.github.com/akvo/akvo-rsr/zipball"
        expected_archive_url = os.path.join(archive_url_root, self.deployer_config.rsr_branch)

        self.assertEqual(expected_archive_url, self.deployer_config.rsr_archive_url)

    def test_has_repo_checkout_root(self):
        """fab.tests.config.DeployerConfigTest  Has repository checkout root setting"""

        self.assertTrue(len(self.deployer_config.repo_checkout_root) > 0, "Expected some value for repo_checkout_root setting")

    def test_has_expected_repo_archives_dir(self):
        """fab.tests.config.DeployerConfigTest  Has expected repository archives directory"""

        expected_repo_archives_dir = os.path.join(self.deployer_config.repo_checkout_root, "archives")

        self.assertEqual(expected_repo_archives_dir, self.deployer_config.repo_archives_dir)

    def test_has_expected_unpacked_rsr_archive_match(self):
        """fab.tests.config.DeployerConfigTest  Has expected match for an unpacked RSR archive"""

        unpacked_rsr_archive_mask = "akvo-akvo-rsr-*"
        expected_archive_match = os.path.join(self.deployer_config.repo_checkout_root, unpacked_rsr_archive_mask)

        self.assertEqual(expected_archive_match, self.deployer_config.unpacked_rsr_archive_match)

    def test_has_expected_rsr_deployment_dir_name(self):
        """fab.tests.config.DeployerConfigTest  Has expected RSR deployment directory name"""

        self.assertEqual("akvo-rsr_%s" % self.deployer_config.rsr_branch, self.deployer_config.rsr_deployment_dir_name)

    def test_has_expected_rsr_deployment_root(self):
        """fab.tests.config.DeployerConfigTest  Has expected RSR deployment root"""

        expected_rsr_deployment_root = os.path.join(self.deployer_config.repo_checkout_root, self.deployer_config.rsr_deployment_dir_name)

        self.assertEqual(expected_rsr_deployment_root, self.deployer_config.rsr_deployment_root)

    def test_has_expected_akvo_permissions_group_setting(self):
        """fab.tests.config.DeployerConfigTest  Has expected Akvo permissions group setting"""

        self.assertEqual("www-edit", self.deployer_config.akvo_permissions_group)

    def test_has_virtualenvs_home_setting(self):
        """fab.tests.config.DeployerConfigTest  Has virtualenvs home setting"""

        self.assertTrue(len(self.deployer_config.virtualenvs_home) > 0, "Expected some value for virtualenvs_home setting")

    def test_has_expected_rsr_env_name(self):
        """fab.tests.config.DeployerConfigTest  Has expected RSR virtualenv name"""

        self.assertEqual("rsr_%s" % self.deployer_config.rsr_branch, self.deployer_config.rsr_env_name)

    def test_has_expected_rsr_env_path(self):
        """fab.tests.config.DeployerConfigTest  Has expected RSR virtualenv path"""

        expected_rsr_env_path = os.path.join(self.deployer_config.virtualenvs_home, self.deployer_config.rsr_env_name)

        self.assertEqual(expected_rsr_env_path, self.deployer_config.rsr_env_path)

    def test_has_expected_pip_install_log_file_path(self):
        """fab.tests.config.DeployerConfigTest  Has expected pip install log file path"""

        pip_file_name = "pip_install_%s.log" % self.deployer_config.rsr_env_name
        expected_pip_log_file_path = os.path.join(self.deployer_config.virtualenvs_home, pip_file_name)

        self.assertEqual(expected_pip_log_file_path, self.deployer_config.pip_install_log_file)

    def test_has_expected_pip_requirements_home(self):
        """fab.tests.config.DeployerConfigTest  Has expected pip requirements home"""

        expected_pip_requirements_home = os.path.join(self.deployer_config.rsr_deployment_root, "scripts/deployment/pip/requirements")

        self.assertEqual(expected_pip_requirements_home, self.deployer_config.pip_requirements_home)


def suite():
    return TestSuiteLoader().load_tests_from(DeployerConfigTest)

if __name__ == "__main__":
    from fab.tests.test_settings import TEST_MODE
    TestRunner(TEST_MODE).run_test_suite(suite())
