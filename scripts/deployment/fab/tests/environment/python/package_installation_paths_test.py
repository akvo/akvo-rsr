#!/usr/bin/env python

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


import imp, os, unittest2

from testing.helpers.execution import TestSuiteLoader, TestRunner

CONFIG_VALUES_TEMPLATE_PATH = os.path.realpath(os.path.join(os.path.dirname(__file__), '../../../config/values.py.template'))
imp.load_source('config_values', CONFIG_VALUES_TEMPLATE_PATH)

from config_values import DeploymentHostConfigValues, SharedConfigValues

from fab.config.rsr.codebase import RSRCodebaseConfig
from fab.environment.python.systempackageinstaller import PackageInstallationPaths


class PackageInstallationPathsTest(unittest2.TestCase):

    def setUp(self):
        super(PackageInstallationPathsTest, self).setUp()

        self.deployment_host_config_values = DeploymentHostConfigValues()
        self.codebase_config = RSRCodebaseConfig(SharedConfigValues().repository_branch)

        self.installation_paths = PackageInstallationPaths(self.deployment_host_config_values, self.codebase_config)

    def test_can_create_packageinstallationpaths_instance(self):
        """fab.tests.environment.python.package_installation_paths_test  Can create PackageInstallationPaths instance"""

        self.assertIsInstance(PackageInstallationPaths.create_instance(), PackageInstallationPaths)

    def test_has_package_download_dir(self):
        """fab.tests.environment.python.package_installation_paths_test  Has package download directory"""

        expected_package_download_dir = os.path.join(self.deployment_host_config_values.deployment_processing_home, 'python_packages')

        self.assertEqual(expected_package_download_dir, self.installation_paths.package_download_dir)

    def test_has_distribute_setup_url(self):
        """fab.tests.environment.python.package_installation_paths_test  Has distribute package setup URL"""

        self.assertEqual("http://python-distribute.org/distribute_setup.py", self.installation_paths.distribute_setup_url)

    def test_has_explicit_pip_version(self):
        """fab.tests.environment.python.package_installation_paths_test  Has explicit pip version"""

        self.assertEqual("1.0.2", PackageInstallationPaths.PIP_VERSION)

    def test_has_pip_setup_url(self):
        """fab.tests.environment.python.package_installation_paths_test  Has pip setup URL"""

        self.assertEqual("https://raw.github.com/pypa/pip/1.0.2/contrib/get-pip.py", self.installation_paths.pip_setup_url)

    def test_has_system_requirements_file_url(self):
        """fab.tests.environment.python.package_installation_paths_test  Has system requirements file URL"""

        self.assertEqual(self.codebase_config.system_requirements_file_url, self.installation_paths.system_requirements_file_url)


def suite():
    return TestSuiteLoader().load_tests_from(PackageInstallationPathsTest)

if __name__ == "__main__":
    from fab.tests.test_settings import TEST_MODE
    TestRunner(TEST_MODE).run_test_suite(suite())
