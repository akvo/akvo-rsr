#!/usr/bin/env python

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


import fabric.api
import mox, os

from testing.helpers.execution import TestRunner, TestSuiteLoader

from fab.app.admin import DjangoAdmin
from fab.config.rsr.codebase import RSRCodebaseConfig
from fab.config.rsr.data.populator import RSRDataPopulatorConfig
from fab.config.rsr.host import CIDeploymentHostConfig
from fab.data.populator import RSRDataPopulator
from fab.database.mysql.commandexecution import DataHandler
from fab.helpers.feedback import ExecutionFeedback
from fab.host.controller import LocalHostController, RemoteHostController
from fab.os.filesystem import FileSystem
from fab.tests.template.loader import TemplateLoader


class StubbedRSRDataPopulator(RSRDataPopulator):

    def __init__(self, data_populator_config, data_host_file_system, local_file_system,
                 django_admin, data_handler, feedback, fake_last_migration_file):
        super(StubbedRSRDataPopulator, self).__init__(data_populator_config, data_host_file_system, local_file_system,
                                                      django_admin, data_handler, feedback)
        self.fake_last_migration_file = fake_last_migration_file

    def _open_file_for_reading(self, file_path):
        return self.fake_last_migration_file


class RSRDataPopulatorTest(mox.MoxTestBase):

    def setUp(self):
        super(RSRDataPopulatorTest, self).setUp()
        self.deployment_host_config = CIDeploymentHostConfig.for_test()
        self.data_populator_config = RSRDataPopulatorConfig.create_with(self.deployment_host_config)
        self.mock_data_host_file_system = self.mox.CreateMock(FileSystem)
        self.mock_local_file_system = self.mox.CreateMock(FileSystem)
        self.mock_django_admin = self.mox.CreateMock(DjangoAdmin)
        self.mock_data_handler = self.mox.CreateMock(DataHandler)
        self.mock_feedback = self.mox.CreateMock(ExecutionFeedback)
        self.mock_last_migration_file = self.mox.CreateMock(file)

        self.latest_data_archive_name = 'rsr_data_20111112.sql.zip'
        self.expected_data_archive_file_path = os.path.join(self.data_populator_config.data_archives_home, self.latest_data_archive_name)
        self.expected_data_extract_file_path = self.expected_data_archive_file_path.rstrip('.zip')

        self.data_populator = StubbedRSRDataPopulator(self.data_populator_config, self.mock_data_host_file_system,
                                                      self.mock_local_file_system, self.mock_django_admin,
                                                      self.mock_data_handler, self.mock_feedback,
                                                      self.mock_last_migration_file)

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

        data_populator = RSRDataPopulator.create_with(TemplateLoader.load_database_credentials(), self.deployment_host_config, mock_host_controller)

        self.assertIsInstance(data_populator, RSRDataPopulator)

    def test_can_initialise_database(self):
        """fab.tests.data.rsr_data_populator_test  Can initialise a database"""

        self.mock_data_host_file_system.ensure_directory_exists(self.data_populator_config.rsr_deployment_home)
        self._change_remote_dir_to(self.data_populator_config.rsr_deployment_home)
        self.mock_feedback.comment('Initialising database')
        self.mock_django_admin.initialise_database_without_superusers()
        self.mox.ReplayAll()

        self.data_populator.initialise_database()

    def test_can_upload_data_archive_and_populate_rsr_database(self):
        """fab.tests.data.rsr_data_populator_test  Can upload data archive and populate RSR database"""

        self._ensure_expected_paths_exist()
        self._find_latest_data_archive(self.latest_data_archive_name)
        self._upload_data_archive(self.expected_data_archive_file_path, self.expected_data_extract_file_path)
        self._unpack_data_archive(self.expected_data_archive_file_path)
        self._populate_rsr_database_with(self.expected_data_extract_file_path, 'some_rsrdb')
        self.mox.ReplayAll()

        self.data_populator.populate_database('some_rsrdb')

    def test_can_populate_rsr_database_from_existing_data_archive(self):
        """fab.tests.data.rsr_data_populator_test  Can populate RSR database from an existing data archive"""

        self._ensure_expected_paths_exist()
        self._find_latest_data_archive(self.latest_data_archive_name)
        self._use_existing_data_extract(self.expected_data_extract_file_path)
        self._populate_rsr_database_with(self.expected_data_extract_file_path, 'some_rsrdb')
        self.mox.ReplayAll()

        self.data_populator.populate_database('some_rsrdb')

    def test_will_exit_if_no_data_archives_are_available_to_upload(self):
        """fab.tests.data.rsr_data_populator_test  Will exit if no data archives are available to upload"""

        self._ensure_expected_paths_exist()
        self._exit_when_no_data_archives_exist_on_local_host()
        self.mox.ReplayAll()

        with self.assertRaises(SystemExit):
            self.data_populator.populate_database('some_rsrdb')

    def _ensure_expected_paths_exist(self):
        self.mock_local_file_system.exit_if_directory_does_not_exist(self.data_populator_config.data_archives_home)
        self.mock_data_host_file_system.ensure_directory_exists(self.data_populator_config.data_archives_home)
        self.mock_data_host_file_system.ensure_directory_exists(self.data_populator_config.rsr_deployment_home)

    def _find_latest_data_archive(self, latest_data_archive_name):
        self.mock_local_file_system.most_recent_file_in_directory(self.data_populator_config.data_archives_home).AndReturn(latest_data_archive_name)

    def _upload_data_archive(self, expected_data_archive_file_path, expected_data_extract_file_path):
        self.mock_data_host_file_system.file_exists(expected_data_extract_file_path).AndReturn(False)
        self.mock_feedback.comment('Uploading and unpacking latest data archive:')
        self.mock_data_host_file_system.upload_file(expected_data_archive_file_path, self.data_populator_config.data_archives_home)

    def _unpack_data_archive(self, expected_data_archive_file_path):
        self.mock_data_host_file_system.decompress_data_archive(expected_data_archive_file_path, self.data_populator_config.data_archives_home)
        self.mock_data_host_file_system.delete_file(expected_data_archive_file_path)

    def _use_existing_data_extract(self, expected_data_extract_file_path):
        self.mock_data_host_file_system.file_exists(expected_data_extract_file_path).AndReturn(True)
        self.mock_feedback.comment('Found latest data extract at: %s' % expected_data_extract_file_path)

    def _exit_when_no_data_archives_exist_on_local_host(self):
        self.mock_local_file_system.most_recent_file_in_directory(self.data_populator_config.data_archives_home).AndReturn('')
        no_data_archives_available = 'No local data archives available for uploading from: %s' % self.data_populator_config.data_archives_home
        self.mock_feedback.abort(no_data_archives_available).AndRaise(SystemExit(no_data_archives_available))

    def _populate_rsr_database_with(self, data_extract_file_path, database_name):
        self._change_remote_dir_to(self.data_populator_config.rsr_deployment_home)
        self.mock_feedback.comment('Loading RSR data')
        self.mock_data_handler.load_data_from(data_extract_file_path, database_name)

    def test_can_run_new_rsr_migrations(self):
        """fab.tests.data.rsr_data_populator_test  Can run new RSR migrations"""

        self._change_remote_dir_to(self.data_populator_config.rsr_deployment_home)
        self.mock_feedback.comment('Running new RSR migrations and deleting any stale content types')
        self.mock_django_admin.run_all_migrations_and_delete_stale_content_types_for(self.data_populator_config.rsr_app_name)
        self.mox.ReplayAll()

        self.data_populator.run_new_rsr_migrations()

    def _change_remote_dir_to(self, expected_directory):
        self.mock_data_host_file_system.cd(expected_directory).AndReturn(fabric.api.cd(expected_directory))

    def _change_local_dir_to(self, expected_directory):
        self.mock_local_file_system.cd(expected_directory).AndReturn(fabric.api.cd(expected_directory))


def suite():
    return TestSuiteLoader().load_tests_from(RSRDataPopulatorTest)

if __name__ == '__main__':
    TestRunner().run_test_suite(suite())
