#!/usr/bin/env python

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


import mox, os

from testing.helpers.execution import TestSuiteLoader, TestRunner

from fab.config.dataretriever import DataRetrieverConfig
from fab.helpers.dataretriever import DataRetriever
from fab.helpers.feedback import ExecutionFeedback
from fab.helpers.filesystem import FileSystem
from fab.helpers.hosts import RemoteHost
from fab.helpers.path import Path
from fab.helpers.virtualenv import VirtualEnv


class DataRetrieverTest(mox.MoxTestBase):

    def setUp(self):
        super(DataRetrieverTest, self).setUp()
        self.mock_config = self.mox.CreateMock(DataRetrieverConfig)
        self.mock_database_host = self.mox.CreateMock(RemoteHost)
        self.mock_virtualenv = self.mox.CreateMock(VirtualEnv)
        self.mock_path = self.mox.CreateMock(Path)
        self.mock_file_system = self.mox.CreateMock(FileSystem)
        self.mock_feedback = self.mox.CreateMock(ExecutionFeedback)

        self.data_retriever = DataRetriever(self.mock_config, self.mock_database_host, self.mock_virtualenv,
                                            self.mock_path, self.mock_file_system, self.mock_feedback)

    def test_can_fetch_data_from_database(self):
        """fab.tests.helpers.data_retriever_test  Can fetch data from database"""

        data_dumps_home = "/var/tmp/data_dumps"
        rsr_virtualenv_path = "/var/virtualenvs/rsr_1.0.9"
        akvo_rsr_app_path = "/var/django_apps/rsr_1.0.9/akvo"
        db_dump_script_path = os.path.join(akvo_rsr_app_path, "db_dump.py")
        rsr_data_dump_path = os.path.join(data_dumps_home, "rsr_1.0.9_utc_timestamp")
        self.mock_config.data_dumps_home = data_dumps_home
        self.mock_config.rsr_virtualenv_path = rsr_virtualenv_path
        self.mock_config.akvo_rsr_app_path = akvo_rsr_app_path
        self.mock_config.db_dump_script_path = db_dump_script_path
        self.mock_config.rsr_data_dump_path = rsr_data_dump_path

        self.mock_path.ensure_path_exists_with_sudo(data_dumps_home)
        self.mock_path.exit_if_path_does_not_exist(rsr_virtualenv_path)
        self.mock_path.exit_if_file_does_not_exist(db_dump_script_path)
        self.mock_feedback.comment(mox.StrContains("Fetching data from database"))
        self.mock_database_host.run("pwd")
        self.mock_virtualenv.run_within_virtualenv("python db_dump.py -d %s dump" % rsr_data_dump_path)
        self.mock_file_system.compress_directory(rsr_data_dump_path)
        self.mock_file_system.delete_directory(rsr_data_dump_path)
        self.mox.ReplayAll()

        self.data_retriever.fetch_data_from_database()


def suite():
    return TestSuiteLoader().load_tests_from(DataRetrieverTest)

if __name__ == "__main__":
    from fab.tests.test_settings import TEST_MODE
    TestRunner(TEST_MODE).run_test_suite(suite())
