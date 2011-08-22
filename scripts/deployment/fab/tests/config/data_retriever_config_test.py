#!/usr/bin/env python

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


import datetime, imp, os, unittest

from testing.helpers.execution import TestSuiteLoader, TestRunner

CONFIG_TEMPLATE_PATH = os.path.realpath(os.path.join(os.path.dirname(__file__), '..', '..', 'config', 'dataretriever.py.template'))
imp.load_source('data_retriever_config', CONFIG_TEMPLATE_PATH)

from data_retriever_config import DataRetrieverConfig


class StubbedDataRetrieverConfig(DataRetrieverConfig):

    def __init__(self, database_host, utc_datetime_now):
        # we set the stubbed datetime before calling the parent class's initialiser otherwise
        # the stubbed value won't be available in the overridden _utc_datetime_now() method
        self.stubbed_utc_datetime_now = utc_datetime_now
        super(StubbedDataRetrieverConfig, self).__init__(database_host)

    def _utc_datetime_now(self):
        # the utcnow() generation is stubbed to ensure we get repeatable test results
        return self.stubbed_utc_datetime_now


class DataRetrieverConfigTest(unittest.TestCase):

    def setUp(self):
        super(DataRetrieverConfigTest, self).setUp()
        self.expected_database_host = "database.host.org:port1"
        self.expected_utc_datetime_now = datetime.datetime.utcnow()
        self.expected_akvo_rsr_app_path = "/var/lib/django/1.0.9_gitclone/akvo"
        self.expected_data_dumps_home = "/var/tmp/data_dumps"

        self.config = StubbedDataRetrieverConfig(self.expected_database_host, self.expected_utc_datetime_now)

    def test_database_host_is_set_on_initialisation(self):
        """fab.tests.config.data_retriever_config_test  Database host is set on initialisation"""

        self.assertEqual(self.expected_database_host, self.config.database_host)

    def test_has_expected_akvo_rsr_app_path(self):
        """fab.tests.config.data_retriever_config_test  Has expected Akvo RSR app path"""

        self.assertEqual(self.expected_akvo_rsr_app_path, self.config.akvo_rsr_app_path)

    def test_has_expected_db_dump_script_path(self):
        """fab.tests.config.data_retriever_config_test  Has expected db_dump.py script path"""

        self.assertEqual(os.path.join(self.expected_akvo_rsr_app_path, "db_dump.py"), self.config.db_dump_script_path)

    def test_has_expected_rsr_log_file_path(self):
        """fab.tests.config.data_retriever_config_test  Has expected RSR log file path"""

        self.assertEqual(os.path.join(self.expected_akvo_rsr_app_path, "akvo.log"), self.config.rsr_log_file_path)

    def test_has_expected_rsr_virtualenv_path(self):
        """fab.tests.config.data_retriever_config_test  Has expected RSR virtualenv path"""

        self.assertEqual("/var/virtualenvs/rsr_1.0.9", self.config.rsr_virtualenv_path)

    def test_has_expected_data_dumps_home(self):
        """fab.tests.config.data_retriever_config_test  Has expected data dumps home"""

        self.assertEqual(self.expected_data_dumps_home, self.config.data_dumps_home)

    def test_has_expected_rsr_data_dump_path_with_utc_timestamp(self):
        """fab.tests.config.data_retriever_config_test  Has expected RSR data dump path with UTC timestamp"""

        formatted_utc_now = self.expected_utc_datetime_now.strftime('%Y%m%d_%H%M%S') # e.g. 20110723_143806
        expected_rsr_data_dump_dir = "rsr_1.0.9_%s" % formatted_utc_now
        expected_rsr_data_dump_path = os.path.join(self.expected_data_dumps_home, expected_rsr_data_dump_dir)
        self.assertEqual(expected_rsr_data_dump_path, self.config.rsr_data_dump_path)


def suite():
    return TestSuiteLoader().load_tests_from(DataRetrieverConfigTest)

if __name__ == "__main__":
    from fab.tests.test_settings import TEST_MODE
    TestRunner(TEST_MODE).run_test_suite(suite())
