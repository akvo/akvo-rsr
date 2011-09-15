#!/usr/bin/env python

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


import os, unittest2

from testing.helpers.execution import TestSuiteLoader, TestRunner

from fab.config.environment.python.packagetools import PackageInstallationToolsConfig
from fab.config.rsr.codebase import RSRCodebaseConfig
from fab.config.values import PythonConfigValues, SharedConfigValues
from fab.environment.python.systempackageinstaller import PackageInstallationPaths


class PackageInstallationPathsTest(unittest2.TestCase):

    def test_can_create_packageinstallationpaths_instance(self):
        """fab.tests.environment.python.package_installation_paths_test  Can create PackageInstallationPaths instance"""

        self.assertIsInstance(PackageInstallationPaths.create_instance(), PackageInstallationPaths)

    def test_initialiser_sets_package_installation_paths(self):
        """fab.tests.environment.python.package_installation_paths_test  Initialiser sets package installation paths"""

        python_config_values = PythonConfigValues()
        package_tools_config = PackageInstallationToolsConfig(python_config_values.pip_version)
        codebase_config = RSRCodebaseConfig(SharedConfigValues().repository_branch)

        installation_paths = PackageInstallationPaths.create_instance()

        self.assertEqual(installation_paths.package_download_dir, python_config_values.python_package_download_dir)
        self.assertEqual(installation_paths.distribute_setup_url, package_tools_config.distribute_setup_url)
        self.assertEqual(installation_paths.pip_setup_url, package_tools_config.pip_setup_url)
        self.assertEqual(installation_paths.system_requirements_url, codebase_config.system_requirements_file_url)


def suite():
    return TestSuiteLoader().load_tests_from(PackageInstallationPathsTest)

if __name__ == "__main__":
    from fab.tests.test_settings import TEST_MODE
    TestRunner(TEST_MODE).run_test_suite(suite())
