#!/usr/bin/env python

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


import fabric.api
import mox, os

from testing.helpers.execution import TestSuiteLoader, TestRunner

from fab.app.command import DBDumpCommand
from fab.config.rsr.dataretriever import RSRDataRetrieverConfig
from fab.data.retriever import RSRDataRetriever
from fab.environment.python.virtualenv import VirtualEnv
from fab.format.timestamp import TimeStampFormatter
from fab.helpers.feedback import ExecutionFeedback
from fab.host.controller import LocalHostController, RemoteHostController
from fab.os.filesystem import FileSystem


class RSRDataRetrieverTest(mox.MoxTestBase):

    def setUp(self):
        super(RSRDataRetrieverTest, self).setUp()
        self.data_retriever_config = RSRDataRetrieverConfig.create_instance()
        self.mock_file_system = self.mox.CreateMock(FileSystem)
        self.mock_virtualenv = self.mox.CreateMock(VirtualEnv)
        self.mock_feedback = self.mox.CreateMock(ExecutionFeedback)
        self.mock_time_stamp_formatter = self.mox.CreateMock(TimeStampFormatter)

        self.data_retriever = RSRDataRetriever(self.data_retriever_config, self.mock_file_system, self.mock_virtualenv,
                                               self.mock_feedback, self.mock_time_stamp_formatter)

    def test_can_create_instance_for_local_host(self):
        """fab.tests.data.rsr_data_retriever_test  Can create an RSRDataRetriever instance for a local host"""

        self._verify_instance_creation_for(LocalHostController)

    def test_can_create_instance_for_remote_host(self):
        """fab.tests.data.rsr_data_retriever_test  Can create an RSRDataRetriever instance for a remote host"""

        self._verify_instance_creation_for(RemoteHostController)

    def _verify_instance_creation_for(self, host_controller_class):
        mock_host_controller = self.mox.CreateMock(host_controller_class)
        mock_host_controller.feedback = self.mock_feedback
        self.mox.ReplayAll()

        self.assertIsInstance(RSRDataRetriever.create_instance(mock_host_controller), RSRDataRetriever)

    def test_can_fetch_data_from_database(self):
        """fab.tests.data.rsr_data_retriever_test  Can fetch data from database"""

        rsr_data_dump_path = os.path.join(self.data_retriever_config.data_dumps_home, "rsrdb_utc_timestamp")

        self._ensure_required_paths_exist()
        self._ensure_rsr_log_file_is_writable()
        self._extract_latest_data(rsr_data_dump_path)
        self._remove_extraneous_database_files(rsr_data_dump_path)
        self._compress_and_download_data_archive(rsr_data_dump_path)
        self.mox.ReplayAll()

        self.data_retriever.fetch_data_from_database()

    def _ensure_required_paths_exist(self):
        self.mock_file_system.ensure_directory_exists_with_sudo(self.data_retriever_config.data_dumps_home)
        self.mock_file_system.exit_if_directory_does_not_exist(self.data_retriever_config.rsr_env_path)
        self.mock_file_system.exit_if_file_does_not_exist(self.data_retriever_config.rsr_app_path)
        self.mock_file_system.exit_if_file_does_not_exist(self.data_retriever_config.rsr_log_file_path)

    def _ensure_rsr_log_file_is_writable(self):
        self.mock_feedback.comment("Ensuring RSR log file is writable")
        self.mock_file_system.make_file_writable_for_all_users(self.data_retriever_config.rsr_log_file_path)

    def _extract_latest_data(self, rsr_data_dump_path):
        self.mock_time_stamp_formatter.append_timestamp("rsrdb").AndReturn(rsr_data_dump_path)
        self.mock_feedback.comment("Extracting latest data from database at %s" % self.data_retriever_config.rsr_app_path)
        self.mock_file_system.cd(self.data_retriever_config.rsr_app_path).AndReturn(fabric.api.cd("/some/path"))
        self.mock_virtualenv.run_within_virtualenv(DBDumpCommand.dump_to(rsr_data_dump_path))

    def _remove_extraneous_database_files(self, rsr_data_dump_path):
        self.mock_file_system.delete_file(os.path.join(rsr_data_dump_path, "workflows_workflowpermissionrelation.py"))

    def _compress_and_download_data_archive(self, rsr_data_dump_path):
        self.mock_file_system.compress_directory(rsr_data_dump_path)
        self.mock_file_system.delete_directory(rsr_data_dump_path)
        self.mock_file_system.download_file("%s.*" % rsr_data_dump_path, self.data_retriever_config.data_dumps_home)


def suite():
    return TestSuiteLoader().load_tests_from(RSRDataRetrieverTest)

if __name__ == "__main__":
    from fab.tests.test_settings import TEST_MODE
    TestRunner(TEST_MODE).run_test_suite(suite())
