#!/usr/bin/env python

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


import fabric.api
import mox, os

from testing.helpers.execution import TestSuiteLoader, TestRunner

from fab.app.admin import DBDump, DjangoAdmin
from fab.config.rsr.codebase import RSRCodebaseConfig
from fab.config.rsr.data.populator import RSRDataPopulatorConfig
from fab.config.rsr.host import CIDeploymentHostConfig
from fab.data.populator import RSRDataPopulator
from fab.helpers.feedback import ExecutionFeedback
from fab.host.controller import LocalHostController, RemoteHostController
from fab.os.filesystem import FileSystem


class RSRDataPopulatorTest(mox.MoxTestBase):

    def setUp(self):
        super(RSRDataPopulatorTest, self).setUp()
        self.deployment_host_config = CIDeploymentHostConfig.for_test()
        self.data_populator_config = RSRDataPopulatorConfig.create_with(self.deployment_host_config)
        self.mock_data_host_file_system = self.mox.CreateMock(FileSystem)
        self.mock_local_file_system = self.mox.CreateMock(FileSystem)
        self.mock_django_admin = self.mox.CreateMock(DjangoAdmin)
        self.mock_db_dump = self.mox.CreateMock(DBDump)
        self.mock_feedback = self.mox.CreateMock(ExecutionFeedback)

        self.data_populator = RSRDataPopulator(self.data_populator_config, self.mock_data_host_file_system,
                                               self.mock_local_file_system, self.mock_django_admin,
                                               self.mock_db_dump, self.mock_feedback)

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

        self.assertIsInstance(RSRDataPopulator.create_with(self.deployment_host_config, mock_host_controller), RSRDataPopulator)

    def test_can_initialise_database(self):
        """fab.tests.data.rsr_data_populator_test  Can initialise a database"""

        self.mock_data_host_file_system.ensure_directory_exists(self.data_populator_config.rsr_deployment_home)
        self._change_dir_to(self.data_populator_config.rsr_deployment_home)
        self.mock_feedback.comment("Initialising database")
        self.mock_django_admin.initialise_database_without_superusers()
        self.mox.ReplayAll()

        self.data_populator.initialise_database()

    def test_can_upload_data_archive_and_populate_rsr_database(self):
        """fab.tests.data.rsr_data_populator_test  Can upload data archive and populate RSR database"""

        latest_data_archive_name = "latest_rsr_archive_20111112.zip"
        expected_data_archive_file_path = os.path.join(self.data_populator_config.data_archives_home, latest_data_archive_name)

        self._ensure_expected_paths_exist()
        self._upload_data_archive(latest_data_archive_name, expected_data_archive_file_path)
        self._unpack_data_archive(expected_data_archive_file_path)
        self._populate_rsr_database_with(expected_data_archive_file_path)
        self.mox.ReplayAll()

        self.data_populator.populate_database()

    def test_can_populate_rsr_database_from_existing_data_archive(self):
        """fab.tests.data.rsr_data_populator_test  Can populate RSR database from an existing data archive"""

        latest_data_archive_name = "latest_rsr_archive_20111112.zip"
        expected_data_archive_file_path = os.path.join(self.data_populator_config.data_archives_home, latest_data_archive_name)

        self._ensure_expected_paths_exist()
        self._use_existing_data_archive(latest_data_archive_name, expected_data_archive_file_path)
        self._unpack_data_archive(expected_data_archive_file_path)
        self._populate_rsr_database_with(expected_data_archive_file_path)
        self.mox.ReplayAll()

        self.data_populator.populate_database()

    def test_will_exit_if_no_data_archives_are_available_to_upload(self):
        """fab.tests.data.rsr_data_populator_test  Will exit if no data archives are available to upload"""

        self._ensure_expected_paths_exist()
        self._exit_when_no_data_archives_exist_on_local_host()
        self.mox.ReplayAll()

        with self.assertRaises(SystemExit):
            self.data_populator.populate_database()

    def _ensure_expected_paths_exist(self):
        self.mock_local_file_system.exit_if_directory_does_not_exist(self.data_populator_config.data_archives_home)
        self.mock_data_host_file_system.ensure_directory_exists(self.data_populator_config.data_archives_home)
        self.mock_data_host_file_system.ensure_directory_exists(self.data_populator_config.rsr_deployment_home)

    def _upload_data_archive(self, latest_data_archive_name, expected_data_archive_file_path):
        self.mock_local_file_system.most_recent_file_in_directory(self.data_populator_config.data_archives_home).AndReturn(latest_data_archive_name)
        self.mock_data_host_file_system.file_exists(expected_data_archive_file_path).AndReturn(False)
        self.mock_feedback.comment("Uploading latest data archive: %s" % latest_data_archive_name)
        self.mock_data_host_file_system.upload_file(expected_data_archive_file_path, self.data_populator_config.data_archives_home)

    def _use_existing_data_archive(self, latest_data_archive_name, expected_data_archive_file_path):
        self.mock_local_file_system.most_recent_file_in_directory(self.data_populator_config.data_archives_home).AndReturn(latest_data_archive_name)
        self.mock_data_host_file_system.file_exists(expected_data_archive_file_path).AndReturn(True)
        self.mock_feedback.comment("Found latest data archive at: %s" % expected_data_archive_file_path)

    def _exit_when_no_data_archives_exist_on_local_host(self):
        self.mock_local_file_system.most_recent_file_in_directory(self.data_populator_config.data_archives_home).AndReturn("")
        no_data_archives_available = "No data archives available on local host in: %s" % self.data_populator_config.data_archives_home
        self.mock_feedback.abort(no_data_archives_available).AndRaise(SystemExit(no_data_archives_available))

    def _unpack_data_archive(self, expected_data_archive_file_path):
        self.mock_data_host_file_system.decompress_data_archive(expected_data_archive_file_path, self.data_populator_config.data_archives_home)
        self.mock_data_host_file_system.delete_file(expected_data_archive_file_path)

    def _populate_rsr_database_with(self, data_archive_path):
        self._change_dir_to(self.data_populator_config.rsr_deployment_home)
        self._synchronise_data_models()
        self.mock_feedback.comment("Loading RSR data")
        self.mock_db_dump.load_data_from(data_archive_path.rstrip(".zip"))

    def test_can_convert_database_for_migrations(self):
        """fab.tests.data.rsr_data_populator_test  Can convert RSR database for migrations"""

        self._change_dir_to(self.data_populator_config.rsr_deployment_home)
        self._synchronise_data_models()
        self._skip_migrations_to("0001")
        self.mox.ReplayAll()

        self.data_populator.convert_database_for_migrations()

    def test_can_skip_migrations_to_specified_rsr_migration_number(self):
        """fab.tests.data.rsr_data_populator_test  Can skip migrations to a specified RSR migration number"""

        self._skip_migrations_to("0034")
        self.mox.ReplayAll()

        self.data_populator.skip_migrations_to("0034")

    def test_can_run_all_migrations(self):
        """fab.tests.data.rsr_data_populator_test  Can run all migrations"""

        self._change_dir_to(self.data_populator_config.rsr_deployment_home)
        self.mock_feedback.comment("Running all migrations")
        self._skip_migrations_for_django_apps()
        self.mock_django_admin.run_all_migrations_for(self.data_populator_config.rsr_app_name)
        self.mox.ReplayAll()

        self.data_populator.run_all_migrations()

    def _synchronise_data_models(self):
        self.mock_feedback.comment("Synchronising data models")
        self.mock_django_admin.synchronise_data_models()

    def _skip_migrations_to(self, rsr_migration_number):
        self._skip_migrations_for_django_apps()
        self.mock_feedback.comment("Skipping RSR migrations to %s" % rsr_migration_number)
        self.mock_django_admin.skip_migrations_to(rsr_migration_number, self.data_populator_config.rsr_app_name)

    def _skip_migrations_for_django_apps(self):
        self.mock_feedback.comment("Skipping migrations for Django apps")
        for app_name in self.data_populator_config.django_apps_to_migrate:
            self.mock_django_admin.skip_all_migrations_for(app_name)

    def _change_dir_to(self, expected_directory):
        self.mock_data_host_file_system.cd(expected_directory).AndReturn(fabric.api.cd(expected_directory))

def suite():
    return TestSuiteLoader().load_tests_from(RSRDataPopulatorTest)

if __name__ == "__main__":
    from fab.tests.test_settings import TEST_MODE
    TestRunner(TEST_MODE).run_test_suite(suite())
