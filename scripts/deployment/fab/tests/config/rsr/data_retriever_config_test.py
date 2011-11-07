#!/usr/bin/env python

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


import imp, mox, os

from testing.helpers.execution import TestSuiteLoader, TestRunner

from fab.config.rsr.dataretriever import RSRDataRetrieverConfig
from fab.format.timestamp import TimeStampFormatter

CONFIG_VALUES_TEMPLATE_PATH = os.path.realpath(os.path.join(os.path.dirname(__file__), '../../../config/values.py.template'))
imp.load_source('config_values', CONFIG_VALUES_TEMPLATE_PATH)

from config_values import DataHostConfigValues


class RSRDataRetrieverConfigTest(mox.MoxTestBase):

    def setUp(self):
        super(RSRDataRetrieverConfigTest, self).setUp()
        self.data_host_config_values = DataHostConfigValues()
        self.mock_time_stamp_formatter = self.mox.CreateMock(TimeStampFormatter)

        self.expected_virtualenvs_home = self.data_host_config_values.virtualenvs_home
        self.expected_rsr_env_name = "rsr_%s" % self.data_host_config_values.deployed_rsr_version
        self.expected_rsr_app_path = os.path.join(self.data_host_config_values.django_apps_home,
                                                  self.data_host_config_values.deployed_rsr_dir_name, 'akvo')

        self.data_retriever_config = RSRDataRetrieverConfig(self.data_host_config_values, self.mock_time_stamp_formatter)

    def test_can_create_instance(self):
        """fab.tests.config.rsr.data_retriever_config_test  Can create RSRDataRetrieverConfig instance"""

        self.assertIsInstance(RSRDataRetrieverConfig.create_instance(), RSRDataRetrieverConfig)

    def test_has_virtualenvs_home(self):
        """fab.tests.config.rsr.data_retriever_config_test  Has virtualenvs home"""

        self.assertEqual(self.expected_virtualenvs_home, self.data_retriever_config.virtualenvs_home)

    def test_has_data_dumps_home(self):
        """fab.tests.config.rsr.data_retriever_config_test  Has data dumps home"""

        self.assertEqual(self.data_host_config_values.data_dumps_home, self.data_retriever_config.data_dumps_home)

    def test_has_rsr_virtualenv_name(self):
        """fab.tests.config.rsr.data_retriever_config_test  Has RSR virtualenv name"""

        self.assertEqual(self.expected_rsr_env_name, self.data_retriever_config.rsr_env_name)

    def test_has_rsr_virtualenv_path(self):
        """fab.tests.config.rsr.data_retriever_config_test  Has RSR virtualenv path"""

        expected_rsr_env_path = os.path.join(self.expected_virtualenvs_home, self.expected_rsr_env_name)

        self.assertEqual(expected_rsr_env_path, self.data_retriever_config.rsr_env_path)

    def test_has_rsr_app_path(self):
        """fab.tests.config.rsr.data_retriever_config_test  Has RSR app path"""

        self.assertEqual(self.expected_rsr_app_path, self.data_retriever_config.rsr_app_path)

    def test_has_db_dump_script_path(self):
        """fab.tests.config.rsr.data_retriever_config_test  Has db_dump script path"""

        expected_db_dump_script_path = os.path.join(self.expected_rsr_app_path, "db_dump.py")

        self.assertEqual(expected_db_dump_script_path, self.data_retriever_config.db_dump_script_path)

    def test_has_rsr_log_file_path(self):
        """fab.tests.config.rsr.data_retriever_config_test  Has RSR log file path"""

        expected_log_file_path = os.path.join(self.expected_rsr_app_path, "akvo.log")

        self.assertEqual(expected_log_file_path, self.data_retriever_config.rsr_log_file_path)

    def test_can_get_time_stamped_rsr_data_dump_path(self):
        """fab.tests.config.rsr.data_retriever_config_test  Has RSR log file path"""

        data_dump_file_time_stamp = "20110923_153244"
        rsr_data_dir_name = "%s_%s" % (self.expected_rsr_env_name, data_dump_file_time_stamp)
        expected_data_dump_file_path = os.path.join(self.data_host_config_values.data_dumps_home, rsr_data_dir_name)

        self.mock_time_stamp_formatter.append_timestamp(self.expected_rsr_env_name).AndReturn(rsr_data_dir_name)
        self.mox.ReplayAll()

        self.assertEqual(expected_data_dump_file_path, self.data_retriever_config.time_stamped_rsr_data_dump_path())


def suite():
    return TestSuiteLoader().load_tests_from(RSRDataRetrieverConfigTest)

if __name__ == "__main__":
    from fab.tests.test_settings import TEST_MODE
    TestRunner(TEST_MODE).run_test_suite(suite())
