#!/usr/bin/env python

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


import os, unittest2

from testing.helpers.execution import TestSuiteLoader, TestRunner

from fab.config.rsr.codebase import RSRCodebaseConfig


class CodebaseConfigTest(unittest2.TestCase):

    def setUp(self):
        super(CodebaseConfigTest, self).setUp()

        self.feature_branch = "feature/sms"
        self.codebase_config = RSRCodebaseConfig(self.feature_branch)

    def test_has_repository_branch(self):
        """fab.tests.config.rsr.codebase_config_test  Has repository branch"""

        self.assertEqual("feature/sms", RSRCodebaseConfig("feature/sms").repo_branch)

    def test_can_set_repository_branch_name_when_branch_includes_branch_type(self):
        """fab.tests.config.rsr.codebase_config_test  Can set repository branch name when branch includes branch type"""

        self.assertEqual("sms", RSRCodebaseConfig("feature/sms").repo_branch_name)

    def test_can_set_repository_branch_name_when_branch_does_not_include_branch_type(self):
        """fab.tests.config.rsr.codebase_config_test  Can set repository branch name when branch does not include branch type"""

        self.assertEqual("develop", RSRCodebaseConfig("develop").repo_branch_name)

    def test_has_pip_requirements_path(self):
        """fab.tests.config.rsr.codebase_config_test  Has pip requirements path"""

        self.assertEqual("scripts/deployment/pip/requirements", RSRCodebaseConfig.PIP_REQUIREMENTS_PATH)

    def test_has_system_requirements_file_name(self):
        """fab.tests.config.rsr.codebase_config_test  Has system requirements file name"""

        self.assertEqual("0_system.txt", RSRCodebaseConfig.SYSTEM_REQUIREMENTS_FILE)

    def test_has_rsr_requirements_file_name(self):
        """fab.tests.config.rsr.codebase_config_test  Has RSR requirements file name"""

        self.assertEqual("2_rsr.txt", RSRCodebaseConfig.RSR_REQUIREMENTS_FILE)

    def test_has_system_requirements_file_url(self):
        """fab.tests.config.rsr.codebase_config_test  Has system requirements file URL"""

        self.assertEqual(self._expected_requirements_file_url(RSRCodebaseConfig.SYSTEM_REQUIREMENTS_FILE), self.codebase_config.system_requirements_file_url)

    def test_has_rsr_requirements_file_url(self):
        """fab.tests.config.rsr.codebase_config_test  Has RSR requirements file URL"""

        self.assertEqual(self._expected_requirements_file_url(RSRCodebaseConfig.RSR_REQUIREMENTS_FILE), self.codebase_config.rsr_requirements_file_url)

    def _expected_requirements_file_url(self, requirements_file):
        return os.path.join("https://raw.github.com/akvo/akvo-rsr", self.feature_branch, RSRCodebaseConfig.PIP_REQUIREMENTS_PATH, requirements_file)


def suite():
    return TestSuiteLoader().load_tests_from(CodebaseConfigTest)

if __name__ == "__main__":
    from fab.tests.test_settings import TEST_MODE
    TestRunner(TEST_MODE).run_test_suite(suite())
