#!/usr/bin/env python

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


import os, unittest2

from testing.helpers.execution import TestSuiteLoader, TestRunner

from fab.config.environment.python.packagetools import PackageInstallationToolsConfig


class PackageInstallationToolsConfigTest(unittest2.TestCase):

    def setUp(self):
        super(PackageInstallationToolsConfigTest, self).setUp()

        self.pip_version = "some_version"
        self.package_tools_config = PackageInstallationToolsConfig(self.pip_version)

    def test_has_distribute_setup_file_name(self):
        """fab.tests.config.environment.python.package_installation_tools_config_test  Has distribute setup file name"""

        self.assertEqual("distribute_setup.py", self.package_tools_config.distribute_setup_file)

    def test_has_distribute_setup_file_url(self):
        """fab.tests.config.environment.python.package_installation_tools_config_test  Has distribute setup file URL"""

        self.assertEqual("http://python-distribute.org/distribute_setup.py", self.package_tools_config.distribute_setup_url)

    def test_has_pip_setup_file_name(self):
        """fab.tests.config.environment.python.package_installation_tools_config_test  Has pip setup file name"""

        self.assertEqual("get-pip.py", self.package_tools_config.pip_setup_file)

    def test_has_pip_setup_file_url(self):
        """fab.tests.config.environment.python.package_installation_tools_config_test  Has pip setup file URL"""

        expected_pip_setup_url = os.path.join("https://raw.github.com/pypa/pip", self.pip_version, "contrib/get-pip.py")
        self.assertEqual(expected_pip_setup_url, self.package_tools_config.pip_setup_url)


def suite():
    return TestSuiteLoader().load_tests_from(PackageInstallationToolsConfigTest)

if __name__ == "__main__":
    from fab.tests.test_settings import TEST_MODE
    TestRunner(TEST_MODE).run_test_suite(suite())
