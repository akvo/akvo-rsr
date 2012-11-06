#!/usr/bin/env python

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


import os, unittest2

from testing.helpers.execution import TestRunner, TestSuiteLoader

from fab.config.rsr.codebase import RSRCodebaseConfig


class RSRCodebaseConfigTest(unittest2.TestCase):

    def setUp(self):
        super(RSRCodebaseConfigTest, self).setUp()

        self.feature_branch = 'feature/sms'

        self.codebase_config = RSRCodebaseConfig(self.feature_branch)

    def test_has_repository_branch(self):
        """fab.tests.config.rsr.codebase_config_test  Has repository branch"""

        self.assertEqual('feature/sms', RSRCodebaseConfig('feature/sms').repo_branch)
        self.assertEqual('develop', RSRCodebaseConfig('develop').repo_branch)

    def test_has_repository_branch_without_branch_type(self):
        """fab.tests.config.rsr.codebase_config_test  Has repository branch without branch type"""

        self.assertEqual('sms', RSRCodebaseConfig('feature/sms').repo_branch_without_type)
        self.assertEqual('develop', RSRCodebaseConfig('develop').repo_branch_without_type)

    def test_has_rsr_code_archive_url(self):
        """fab.tests.config.rsr.codebase_config_test  Has RSR code archive URL"""

        self.assertEqual('https://github.com/akvo/akvo-rsr/archive/feature/sms.zip', self.codebase_config.rsr_archive_url)

    def test_has_unpacked_rsr_archive_directory_mask(self):
        """fab.tests.config.rsr.codebase_config_test  Has unpacked RSR archive directory mask"""

        self.assertEqual('akvo-akvo-rsr-*', RSRCodebaseConfig.UNPACKED_RSR_ARCHIVE_DIR_MASK)

    def test_has_pip_requirements_path(self):
        """fab.tests.config.rsr.codebase_config_test  Has pip requirements path"""

        self.assertEqual('scripts/deployment/pip/requirements', RSRCodebaseConfig.PIP_REQUIREMENTS_PATH)

    def test_has_system_requirements_file_name(self):
        """fab.tests.config.rsr.codebase_config_test  Has system requirements file name"""

        self.assertEqual('0_system.txt', RSRCodebaseConfig.SYSTEM_REQUIREMENTS_FILE)

    def test_has_rsr_requirements_file_name(self):
        """fab.tests.config.rsr.codebase_config_test  Has RSR requirements file name"""

        self.assertEqual('2_rsr.txt', RSRCodebaseConfig.RSR_REQUIREMENTS_FILE)

    def test_has_testing_requirements_file_name(self):
        """fab.tests.config.rsr.codebase_config_test  Has testing requirements file name"""

        self.assertEqual('3_testing.txt', RSRCodebaseConfig.TESTING_REQUIREMENTS_FILE)

    def test_has_rsr_settings_home(self):
        """fab.tests.config.rsr.codebase_config_test  Has RSR settings home"""

        self.assertEqual('akvo/settings', RSRCodebaseConfig.RSR_SETTINGS_HOME)

    def test_has_local_settings_file_name(self):
        """fab.tests.config.rsr.codebase_config_test  Has local settings file name"""

        self.assertEqual('60-local.conf', RSRCodebaseConfig.LOCAL_SETTINGS_FILE)

    def test_has_rsr_log_file_name(self):
        """fab.tests.config.rsr.codebase_config_test  Has RSR log file name"""

        self.assertEqual('akvo.log', RSRCodebaseConfig.LOG_FILE)

    def test_has_rsr_media_root(self):
        """fab.tests.config.rsr.codebase_config_test  Has RSR media root"""

        self.assertEqual('akvo/mediaroot', RSRCodebaseConfig.RSR_MEDIA_ROOT)

    def test_has_manage_script_path(self):
        """fab.tests.config.rsr.codebase_config_test  Has manage.py script path"""

        self.assertEqual('akvo/manage.py', RSRCodebaseConfig.MANAGE_SCRIPT_PATH)

    def test_has_configure_sites_script_path(self):
        """fab.tests.config.rsr.codebase_config_test  Has configure_sites.py script path"""

        self.assertEqual('akvo/configure_sites.py', RSRCodebaseConfig.CONFIGURE_SITES_SCRIPT_PATH)

    def test_has_rsr_app_name(self):
        """fab.tests.config.rsr.codebase_config_test  Has RSR Django app name"""

        self.assertEqual('rsr', RSRCodebaseConfig.RSR_APP_NAME)

    def test_has_system_requirements_file_url(self):
        """fab.tests.config.rsr.codebase_config_test  Has system requirements file URL"""

        self.assertEqual(self._expected_requirements_file_url_for(RSRCodebaseConfig.SYSTEM_REQUIREMENTS_FILE),
                         self.codebase_config.system_requirements_file_url)

    def test_has_rsr_requirements_file_url(self):
        """fab.tests.config.rsr.codebase_config_test  Has RSR requirements file URL"""

        self.assertEqual(self._expected_requirements_file_url_for(RSRCodebaseConfig.RSR_REQUIREMENTS_FILE),
                         self.codebase_config.rsr_requirements_file_url)

    def test_has_testing_requirements_file_path_within_deployed_codebase(self):
        """fab.tests.config.rsr.codebase_config_test  Has testing requirements file path within the deployed codebase"""

        self.assertEqual(self._expected_requirements_file_url_for(RSRCodebaseConfig.TESTING_REQUIREMENTS_FILE),
                         self.codebase_config.testing_requirements_file_url)

    def _expected_requirements_file_url_for(self, requirements_file):
        pip_requirements_base_url = os.path.join('https://raw.github.com/akvo/akvo-rsr', self.feature_branch, RSRCodebaseConfig.PIP_REQUIREMENTS_PATH)
        return os.path.join(pip_requirements_base_url, requirements_file)


def suite():
    return TestSuiteLoader().load_tests_from(RSRCodebaseConfigTest)

if __name__ == '__main__':
    TestRunner().run_test_suite(suite())
