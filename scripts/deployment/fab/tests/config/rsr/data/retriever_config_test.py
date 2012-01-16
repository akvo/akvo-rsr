#!/usr/bin/env python

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


import imp, os, unittest2

from testing.helpers.execution import TestSuiteLoader, TestRunner

from fab.config.rsr.data.retriever import RSRDataRetrieverConfig
from fab.config.values.host import DataHostPaths


class RSRDataRetrieverConfigTest(unittest2.TestCase):

    def setUp(self):
        super(RSRDataRetrieverConfigTest, self).setUp()
        self.data_host_paths = DataHostPaths()

        self.data_retriever_config = RSRDataRetrieverConfig(self.data_host_paths)

    def test_has_data_archives_home(self):
        """fab.tests.config.rsr.data.retriever_config_test  Has data archives home"""

        expected_data_archives_home = os.path.join(self.data_host_paths.deployment_processing_home, 'data_archives')

        self.assertEqual(expected_data_archives_home, self.data_retriever_config.data_archives_home)

    def test_has_rsr_virtualenv_path(self):
        """fab.tests.config.rsr.data.retriever_config_test  Has RSR virtualenv path"""

        expected_rsr_env_path = os.path.join(self.data_host_paths.virtualenvs_home, 'current')

        self.assertEqual(expected_rsr_env_path, self.data_retriever_config.rsr_env_path)

    def test_has_rsr_app_path(self):
        """fab.tests.config.rsr.data.retriever_config_test  Has RSR app path"""

        expected_rsr_app_path = os.path.join(self.data_host_paths.django_apps_home, 'current')

        self.assertEqual(expected_rsr_app_path, self.data_retriever_config.rsr_app_path)

    def test_has_rsr_log_file_path(self):
        """fab.tests.config.rsr.data.retriever_config_test  Has RSR log file path"""

        expected_log_file_path = os.path.join(self.data_host_paths.logging_home, "akvo.log")

        self.assertEqual(expected_log_file_path, self.data_retriever_config.rsr_log_file_path)


def suite():
    return TestSuiteLoader().load_tests_from(RSRDataRetrieverConfigTest)

if __name__ == "__main__":
    from fab.tests.test_settings import TEST_MODE
    TestRunner(TEST_MODE).run_test_suite(suite())
