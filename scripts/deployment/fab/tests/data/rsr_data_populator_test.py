#!/usr/bin/env python

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


import fabric.api
import mox, os

from testing.helpers.execution import TestSuiteLoader, TestRunner

from fab.app.command import DBDumpCommand, DjangoManageCommand
from fab.config.rsr.codebase import RSRCodebaseConfig
from fab.config.rsr.data.populator import RSRDataPopulatorConfig
from fab.data.population import RSRDataPopulator
from fab.environment.python.virtualenv import VirtualEnv
from fab.helpers.feedback import ExecutionFeedback
from fab.host.controller import LocalHostController, RemoteHostController
from fab.os.filesystem import FileSystem


class RSRDataPopulatorTest(mox.MoxTestBase):

    def setUp(self):
        super(RSRDataPopulatorTest, self).setUp()
        self.data_populator_config = RSRDataPopulatorConfig.create_instance()
        self.mock_data_host_file_system = self.mox.CreateMock(FileSystem)
        self.mock_local_file_system = self.mox.CreateMock(FileSystem)
        self.mock_virtualenv = self.mox.CreateMock(VirtualEnv)
        self.mock_feedback = self.mox.CreateMock(ExecutionFeedback)
        self.mock_host_controller = self.mox.CreateMock(RemoteHostController)

        self.mock_host_controller.feedback = self.mock_feedback

        self.data_populator = RSRDataPopulator(self.data_populator_config, self.mock_data_host_file_system,
                                               self.mock_local_file_system, self.mock_virtualenv, self.mock_host_controller)

    def test_can_create_instance_for_local_host(self):
        """fab.tests.data.rsr_data_populator_test  Can create an RSRDataPopulator instance for a local host"""

        self._verify_instance_creation_for(LocalHostController)

    def test_can_create_instance_for_remote_host(self):
        """fab.tests.data.rsr_data_populator_test  Can create an RSRDataPopulator instance for a remote host"""

        self._verify_instance_creation_for(RemoteHostController)

    def _verify_instance_creation_for(self, host_controller_class):
        mock_host_controller = self.mox.CreateMock(host_controller_class)
        mock_host_controller.feedback = self.mock_feedback
        self.mox.ReplayAll()

        self.assertIsInstance(RSRDataPopulator.create_instance(mock_host_controller), RSRDataPopulator)

    def test_can_upload_data_archive_and_populate_rsr_database(self):
        """fab.tests.data.rsr_data_populator_test  Can upload data archive and populate RSR database"""

        latest_data_archive_name = "latest_rsr_archive_20111112.tar.bz2"

        self._set_expectations_to_upload_and_unpack_data_archive(latest_data_archive_name, data_archive_exists=False)
        self._set_expectations_to_populate_database(latest_data_archive_name)

        self.data_populator.populate_database("some_rsrdb")

    def _set_expectations_to_upload_and_unpack_data_archive(self, latest_data_archive_name, data_archive_exists):
        data_archives_home = self.data_populator_config.data_archives_home
        expected_data_archive_file_path = os.path.join(data_archives_home, latest_data_archive_name)

        self.mock_local_file_system.exit_if_directory_does_not_exist(data_archives_home)
        self.mock_data_host_file_system.ensure_directory_exists(data_archives_home)
        self.mock_local_file_system.most_recent_file_in_directory(data_archives_home).AndReturn(latest_data_archive_name)
        self.mock_feedback.comment("Unpacking latest data archive: %s" % latest_data_archive_name)
        self.mock_data_host_file_system.file_exists(expected_data_archive_file_path).AndReturn(data_archive_exists)

        if not data_archive_exists:
            self.mock_data_host_file_system.upload_file(expected_data_archive_file_path, data_archives_home)

        self.mock_data_host_file_system.decompress_data_archive(expected_data_archive_file_path, data_archives_home)
        self.mock_data_host_file_system.delete_file(expected_data_archive_file_path)

    def _set_expectations_to_populate_database(self, latest_data_archive_name):
        data_archives_home = self.data_populator_config.data_archives_home
        rsr_deployment_home = self.data_populator_config.rsr_deployment_home

        expected_data_archive_file_path = os.path.join(data_archives_home, latest_data_archive_name)
        expected_data_archive_dir = os.path.join(data_archives_home, latest_data_archive_name).replace(FileSystem.DATA_ARCHIVE_EXTENSION, "")

        self.mock_host_controller.cd(rsr_deployment_home).AndReturn(fabric.api.cd(rsr_deployment_home))
        self.mock_feedback.comment("Creating initial data models")
        self.mock_virtualenv.run_within_virtualenv(DjangoManageCommand.SYNCDB_WITHOUT_CREATING_SUPERUSERS)
        self.mock_feedback.comment("Loading RSR data")
        self.mock_virtualenv.run_within_virtualenv(DBDumpCommand.load_from(expected_data_archive_dir))
        self.mock_feedback.comment("Resyncing data models")
        self.mock_virtualenv.run_within_virtualenv(DjangoManageCommand.SYNCDB_WITH_STALE_CONTENT_TYPE_DELETION)
        self.mock_virtualenv.run_within_virtualenv(DjangoManageCommand.SYNCDB)
        self.mox.ReplayAll()


def suite():
    return TestSuiteLoader().load_tests_from(RSRDataPopulatorTest)

if __name__ == "__main__":
    from fab.tests.test_settings import TEST_MODE
    TestRunner(TEST_MODE).run_test_suite(suite())
