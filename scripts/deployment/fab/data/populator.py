# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


import os

from fab.app.admin import DjangoAdmin
from fab.config.rsr.codebase import RSRCodebaseConfig
from fab.config.rsr.data.populator import RSRDataPopulatorConfig
from fab.environment.python.virtualenv import VirtualEnv
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
        virtualenv = VirtualEnv(data_populator_config.rsr_env_path, host_controller)

        return RSRDataPopulator(data_populator_config,
                                FileSystem(host_controller),
                                LocalFileSystem(),
                                DjangoAdmin(virtualenv),
                                host_controller.feedback)

    def initialise_database(self):
        self.data_host_file_system.ensure_directory_exists(self.config.rsr_deployment_home)
        with self.data_host_file_system.cd(self.config.rsr_deployment_home):
            self.feedback.comment("Initialising database")
            self.django_admin.initialise_database_without_superusers()

    def populate_database(self):
        self._ensure_expected_paths_exist()
        latest_data_archive_name = self._upload_latest_data_archive()
        self._populate_rsr_database(self._data_archive_path(latest_data_archive_name))

    def _ensure_expected_paths_exist(self):
        self.local_file_system.exit_if_directory_does_not_exist(self.config.data_archives_home)
        self.data_host_file_system.ensure_directory_exists(self.config.data_archives_home)
        self.data_host_file_system.ensure_directory_exists(self.config.rsr_deployment_home)

    def _upload_latest_data_archive(self):
        # we use the same data archive path both locally and on the data host
        latest_data_archive_name = self.local_file_system.most_recent_file_in_directory(self.config.data_archives_home)

        if len(latest_data_archive_name) > 0:
            self._upload_data_archive(latest_data_archive_name)
        else:
            self.feedback.abort("No data archives available on local host in: %s" % self.config.data_archives_home)

        return latest_data_archive_name

    def _upload_data_archive(self, latest_data_archive_name):
        data_archive_file_path = self._data_archive_path(latest_data_archive_name)

        if self.data_host_file_system.file_exists(data_archive_file_path):
            self.feedback.comment("Found latest data archive at: %s" % data_archive_file_path)
        else:
            self.feedback.comment("Uploading latest data archive: %s" % latest_data_archive_name)
            self.data_host_file_system.upload_file(data_archive_file_path, self.config.data_archives_home)

    def _data_archive_path(self, latest_data_archive_name):
        return os.path.join(self.config.data_archives_home, latest_data_archive_name)

    def _populate_rsr_database(self, data_archive_file_path):
        with self.data_host_file_system.cd(self.config.rsr_deployment_home):
            self._synchronise_data_models()
            self.feedback.comment("Loading RSR data")
            self.django_admin.load_data_fixture(data_archive_file_path)

    def _synchronise_data_models(self):
        self.feedback.comment("Synchronising data models")
        self.django_admin.synchronise_data_models()

    def skip_migrations_to(self, rsr_migration_number):
        self._skip_migrations_for_django_apps()
        self.feedback.comment("Skipping RSR migrations to %s" % rsr_migration_number)
        self.django_admin.skip_migrations_to(rsr_migration_number, self.config.rsr_app_name)

    def run_all_migrations(self):
        with self.data_host_file_system.cd(self.config.rsr_deployment_home):
            self.feedback.comment("Running all migrations")
            self._skip_migrations_for_django_apps()
            self.django_admin.run_all_migrations_for(self.config.rsr_app_name)

    def _skip_migrations_for_django_apps(self):
        self.feedback.comment("Skipping migrations for Django apps")
        for app_name in self.config.django_apps_to_migrate:
            self.django_admin.skip_all_migrations_for(app_name)
