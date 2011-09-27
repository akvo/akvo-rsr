#!/usr/bin/env python

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


import mox, os

from testing.helpers.execution import TestSuiteLoader, TestRunner

from fab.config.rsr.dataretriever import RSRDataRetrieverConfig
from fab.data.retriever import RSRDataRetriever
from fab.environment.python.virtualenv import VirtualEnv
from fab.helpers.feedback import ExecutionFeedback
from fab.host.controller import LocalHostController, RemoteHostController
from fab.os.filesystem import FileSystem


class RSRDataRetrieverTest(mox.MoxTestBase):

    def setUp(self):
        super(RSRDataRetrieverTest, self).setUp()
        self.mock_data_retriever_config = self.mox.CreateMock(RSRDataRetrieverConfig)
        self.mock_file_system = self.mox.CreateMock(FileSystem)
        self.mock_virtualenv = self.mox.CreateMock(VirtualEnv)
        self.mock_feedback = self.mox.CreateMock(ExecutionFeedback)

        self.data_retriever = RSRDataRetriever(self.mock_data_retriever_config, self.mock_file_system,
                                            self.mock_virtualenv, self.mock_feedback)

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

        data_dumps_home = "/var/tmp/data_dumps"
        rsr_env_path = "/var/virtualenvs/rsr_1.0.9"
        rsr_app_path = "/var/django_apps/rsr_1.0.9/akvo"
        db_dump_script_path = os.path.join(rsr_app_path, "db_dump.py")
        rsr_data_dump_path = os.path.join(data_dumps_home, "rsr_1.0.9_utc_timestamp")
        rsr_log_file_path = os.path.join(rsr_app_path, "akvo.log")

        self.mock_data_retriever_config.data_dumps_home = data_dumps_home
        self.mock_data_retriever_config.rsr_env_path = rsr_env_path
        self.mock_data_retriever_config.rsr_app_path = rsr_app_path
        self.mock_data_retriever_config.db_dump_script_path = db_dump_script_path
        self.mock_data_retriever_config.rsr_log_file_path = rsr_log_file_path

        self.mock_file_system.ensure_directory_exists_with_sudo(data_dumps_home)
        self.mock_file_system.exit_if_directory_does_not_exist(rsr_env_path)
        self.mock_file_system.exit_if_file_does_not_exist(db_dump_script_path)
        self.mock_feedback.comment("Ensuring RSR log file is writable")
        self.mock_file_system.make_file_writable_for_all_users(rsr_log_file_path)
        self.mock_data_retriever_config.time_stamped_rsr_data_dump_path().AndReturn(rsr_data_dump_path)
        self.mock_feedback.comment(mox.StrContains("Fetching data from database"))
        self.mock_virtualenv.run_within_virtualenv("python %s -d %s dump" % (db_dump_script_path, rsr_data_dump_path))
        self.mock_file_system.compress_directory(rsr_data_dump_path)
        self.mock_file_system.delete_directory(rsr_data_dump_path)
        self.mock_file_system.download_file("%s.*" % rsr_data_dump_path, data_dumps_home)
        self.mox.ReplayAll()

        self.data_retriever.fetch_data_from_database()


def suite():
    return TestSuiteLoader().load_tests_from(RSRDataRetrieverTest)

if __name__ == "__main__":
    from fab.tests.test_settings import TEST_MODE
    TestRunner(TEST_MODE).run_test_suite(suite())
