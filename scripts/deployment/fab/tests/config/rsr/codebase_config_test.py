#!/usr/bin/env python

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


import os, unittest2

from testing.helpers.execution import TestSuiteLoader, TestRunner

from fab.config.rsr.codebase import RSRCodebaseConfig


class RSRCodebaseConfigTest(unittest2.TestCase):

    def setUp(self):
        super(RSRCodebaseConfigTest, self).setUp()

        self.feature_branch = "feature/sms"
        self.codebase_config = RSRCodebaseConfig(self.feature_branch)

    def test_can_create_rsrcodebaseconfig_instance(self):
        """fab.tests.config.rsr.codebase_config_test  Can create RSRCodebaseConfig instance"""

        self.assertIsInstance(RSRCodebaseConfig.create_instance(), RSRCodebaseConfig)

    def test_has_repository_branch(self):
        """fab.tests.config.rsr.codebase_config_test  Has repository branch"""

        self.assertEqual("feature/sms", RSRCodebaseConfig("feature/sms").repo_branch)
        self.assertEqual("develop", RSRCodebaseConfig("develop").repo_branch)

    def test_has_repository_branch_without_branch_type(self):
        """fab.tests.config.rsr.codebase_config_test  Has repository branch without branch type"""

        self.assertEqual("sms", RSRCodebaseConfig("feature/sms").repo_branch_without_type)
        self.assertEqual("develop", RSRCodebaseConfig("develop").repo_branch_without_type)

    def test_has_rsr_code_archive_url(self):
        """fab.tests.config.rsr.codebase_config_test  Has RSR code archive URL"""

        self.assertEqual("http://nodeload.github.com/akvo/akvo-rsr/zipball/feature/sms", self.codebase_config.rsr_archive_url)

    def test_has_unpacked_rsr_archive_directory_mask(self):
        """fab.tests.config.rsr.codebase_config_test  Has unpacked RSR archive directory mask"""

        self.assertEqual("akvo-akvo-rsr-*", RSRCodebaseConfig.UNPACKED_RSR_ARCHIVE_DIR_MASK)

    def test_has_pip_requirements_path(self):
        """fab.tests.config.rsr.codebase_config_test  Has pip requirements path"""

        self.assertEqual("scripts/deployment/pip/requirements", RSRCodebaseConfig.PIP_REQUIREMENTS_PATH)

    def test_has_system_requirements_file_name(self):
        """fab.tests.config.rsr.codebase_config_test  Has system requirements file name"""

        self.assertEqual("0_system.txt", RSRCodebaseConfig.SYSTEM_REQUIREMENTS_FILE)

    def test_has_rsr_requirements_file_name(self):
        """fab.tests.config.rsr.codebase_config_test  Has RSR requirements file name"""

        self.assertEqual("2_rsr.txt", RSRCodebaseConfig.RSR_REQUIREMENTS_FILE)

    def test_has_testing_requirements_file_name(self):
        """fab.tests.config.rsr.codebase_config_test  Has testing requirements file name"""

        self.assertEqual("3_testing.txt", RSRCodebaseConfig.TESTING_REQUIREMENTS_FILE)

    def test_has_manage_script_path(self):
        """fab.tests.config.rsr.codebase_config_test  Has manage.py script path"""

        self.assertEqual("akvo/manage.py", RSRCodebaseConfig.MANAGE_SCRIPT_PATH)

    def test_has_db_dump_script_path(self):
        """fab.tests.config.rsr.codebase_config_test  Has db_dump.py script path"""

        self.assertEqual("akvo/db_dump.py", RSRCodebaseConfig.DB_DUMP_SCRIPT_PATH)

    def test_has_system_requirements_file_url(self):
        """fab.tests.config.rsr.codebase_config_test  Has system requirements file URL"""

        pip_requirements_base_url = os.path.join("https://raw.github.com/akvo/akvo-rsr", self.feature_branch, RSRCodebaseConfig.PIP_REQUIREMENTS_PATH)
        expected_system_requirements_file_url = os.path.join(pip_requirements_base_url, RSRCodebaseConfig.SYSTEM_REQUIREMENTS_FILE)

        self.assertEqual(expected_system_requirements_file_url, self.codebase_config.system_requirements_file_url)

    def test_has_rsr_requirements_file_path_in_deployed_codebase(self):
        """fab.tests.config.rsr.codebase_config_test  Has RSR requirements file path in the deployed codebase"""

        self.assertEqual(self._expected_requirements_file_path(RSRCodebaseConfig.RSR_REQUIREMENTS_FILE),
                         self.codebase_config.rsr_requirements_file_path)

    def test_has_testing_requirements_file_path_within_deployed_codebase(self):
        """fab.tests.config.rsr.codebase_config_test  Has testing requirements file path within the deployed codebase"""

        self.assertEqual(self._expected_requirements_file_path(RSRCodebaseConfig.TESTING_REQUIREMENTS_FILE),
                         self.codebase_config.testing_requirements_file_path)

    def _expected_requirements_file_path(self, requirements_file):
        return os.path.join(RSRCodebaseConfig.PIP_REQUIREMENTS_PATH, requirements_file)


def suite():
    return TestSuiteLoader().load_tests_from(RSRCodebaseConfigTest)

if __name__ == "__main__":
    from fab.tests.test_settings import TEST_MODE
    TestRunner(TEST_MODE).run_test_suite(suite())
