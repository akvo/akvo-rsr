# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


import os

from fab.app.admin import DjangoAdmin
from fab.config.rsr.codebase import RSRCodebaseConfig
from fab.config.rsr.data.populator import RSRDataPopulatorConfig
from fab.os.filesystem import FileSystem, LocalFileSystem


class RSRDataPopulator(object):

    def __init__(self, data_populator_config, data_host_file_system, local_file_system, django_admin, feedback):
        self.config = data_populator_config
        self.data_host_file_system = data_host_file_system
        self.local_file_system = local_file_system
        self.django_admin = django_admin
        self.feedback = feedback

    @staticmethod
    def create_with(deployment_host_config, host_controller):
        data_populator_config = RSRDataPopulatorConfig.create_with(deployment_host_config)
        django_admin = DjangoAdmin.create_with(data_populator_config.rsr_env_path, data_populator_config.rsr_deployment_home, host_controller)

        return RSRDataPopulator(data_populator_config,
                                FileSystem(host_controller),
                                LocalFileSystem(),
                                django_admin,
                                host_controller.feedback)

    def initialise_database(self):
        self.data_host_file_system.ensure_directory_exists(self.config.rsr_deployment_home)
        with self.data_host_file_system.cd(self.config.rsr_deployment_home):
            self.feedback.comment('Initialising database')
            self.django_admin.initialise_database_without_superusers()

    def populate_database(self):
        self._ensure_expected_paths_exist()

        data_archive_file_path = os.path.join(self.config.data_archives_home, self._find_latest_data_archive())
        data_fixture_file_path = data_archive_file_path.rstrip('.zip')

        self._upload_and_unpack_data_archive(data_archive_file_path, data_fixture_file_path)
        self._populate_rsr_database(data_fixture_file_path)

    def _ensure_expected_paths_exist(self):
        self.local_file_system.exit_if_directory_does_not_exist(self.config.data_archives_home)
        self.data_host_file_system.ensure_directory_exists(self.config.data_archives_home)
        self.data_host_file_system.ensure_directory_exists(self.config.rsr_deployment_home)

    def _find_latest_data_archive(self):
        # we use the same data archive path both locally and on the data host
        latest_data_archive_name = self.local_file_system.most_recent_file_in_directory(self.config.data_archives_home)

        if len(latest_data_archive_name) > 0:
            return latest_data_archive_name
        else:
            self.feedback.abort('No local data archives available for uploading from: %s' % self.config.data_archives_home)

    def _upload_and_unpack_data_archive(self, data_archive_file_path, data_fixture_file_path):
        if self.data_host_file_system.file_exists(data_fixture_file_path):
            self.feedback.comment('Found latest data fixture at: %s' % data_fixture_file_path)
        else:
            self.feedback.comment('Uploading and unpacking latest data archive:')
            self.data_host_file_system.upload_file(data_archive_file_path, self.config.data_archives_home)
            self.data_host_file_system.decompress_data_archive(data_archive_file_path, self.config.data_archives_home)
            self.data_host_file_system.delete_file(data_archive_file_path)

    def _populate_rsr_database(self, data_fixture_file_path):
        # NB: this sequence only works when running against the corresponding codebase to the
        #     last applied migration set, which is usually code from the master branch
        with self.data_host_file_system.cd(self.config.rsr_deployment_home):
            self._run_all_migrations_for_django_apps()
            self._run_rsr_migrations_to_last_applied()
            self.feedback.comment('Loading RSR data')
            self.django_admin.load_data_fixture(data_fixture_file_path)
            self.django_admin.configure_sites()

    def _data_archive_path(self, latest_data_archive_name):
        return os.path.join(self.config.data_archives_home, latest_data_archive_name)

    def _run_all_migrations_for_django_apps(self):
        self.feedback.comment('Running all migrations for Django apps')
        for app_name in self.config.django_apps_to_migrate:
            self.django_admin.run_all_migrations_for(app_name)

    def _run_rsr_migrations_to_last_applied(self):
        with self.local_file_system.cd(self.config.data_archives_home):
            last_migration_file = self._open_last_migration_file()
            last_applied_migration = last_migration_file.readline().strip()
            last_migration_file.close()

            with self.data_host_file_system.cd(self.config.rsr_deployment_home):
                self.feedback.comment('Running RSR migrations to number %s' % last_applied_migration)
                self.django_admin.migrate_app_to(last_applied_migration, self.config.rsr_app_name)

    def _read_last_applied_migration(self):
        with self.local_file_system.cd(self.config.data_archives_home):
            with self._open_last_migration_file() as last_migration_file:
                return last_migration_file.readline().strip()

    def _open_last_migration_file(self):
        return self._open_file_for_reading(os.path.join(self.config.data_archives_home, 'last_migration.txt'))

    def _open_file_for_reading(self, file_path):
        return open(file_path, 'r')

    def run_new_rsr_migrations(self):
        with self.data_host_file_system.cd(self.config.rsr_deployment_home):
            self.feedback.comment('Running new RSR migrations')
            self.django_admin.run_all_migrations_for(self.config.rsr_app_name)
