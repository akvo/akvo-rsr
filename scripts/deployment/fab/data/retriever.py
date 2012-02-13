# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


import os

from fab.app.admin import DjangoAdmin
from fab.app.settings import DjangoSettingsReader
from fab.config.rsr.data.retriever import RSRDataRetrieverConfig
from fab.config.values.host import DataHostPaths
from fab.database.mysql.commandexecution import DataHandler
from fab.format.timestamp import TimeStampFormatter
from fab.os.filesystem import FileSystem, LocalFileSystem


class RSRDataRetriever(object):

    def __init__(self, data_retriever_config, data_host_file_system, local_file_system, django_admin,
                 settings_reader, data_handler, feedback, time_stamp_formatter):
        self.config = data_retriever_config
        self.data_host_file_system = data_host_file_system
        self.local_file_system = local_file_system
        self.django_admin = django_admin
        self.settings_reader = settings_reader
        self.data_handler = data_handler
        self.feedback = feedback
        self.time_stamp_formatter = time_stamp_formatter

    @staticmethod
    def create_with(database_credentials, host_controller):
        data_retriever_config = RSRDataRetrieverConfig(DataHostPaths())
        host_file_system = FileSystem(host_controller)
        django_admin = DjangoAdmin.create_with(data_retriever_config.rsr_env_path, data_retriever_config.rsr_app_path, host_controller)

        return RSRDataRetriever(data_retriever_config,
                                host_file_system,
                                LocalFileSystem(),
                                django_admin,
                                DjangoSettingsReader(django_admin),
                                DataHandler(database_credentials, host_controller),
                                host_controller.feedback,
                                TimeStampFormatter())

    def _create_last_migration_file(self, last_migration_file_path):
        return open(last_migration_file_path, 'w')

    def fetch_data_from_database(self):
        self._ensure_data_archives_can_be_stored()
        self._exit_if_rsr_env_paths_not_found()
        self._ensure_rsr_log_file_is_writable()
        self._record_last_applied_migration()

        data_export_file_name = '%s.sql' % self.time_stamp_formatter.append_timestamp('rsrdb')
        rsr_data_export_path = os.path.join(self.config.data_archives_home, data_export_file_name)

        self._extract_data_to(rsr_data_export_path)
        self._compress_and_download_data_extract(rsr_data_export_path)

    def _ensure_data_archives_can_be_stored(self):
        self.local_file_system.ensure_directory_exists(self.config.data_archives_home)
        self.data_host_file_system.ensure_directory_exists_with_sudo(self.config.data_archives_home)

    def _exit_if_rsr_env_paths_not_found(self):
        self.data_host_file_system.exit_if_directory_does_not_exist(self.config.rsr_env_path)
        self.data_host_file_system.exit_if_file_does_not_exist(self.config.rsr_app_path)
        self.data_host_file_system.exit_if_file_does_not_exist(self.config.rsr_log_file_path)

    def _ensure_rsr_log_file_is_writable(self):
        self.feedback.comment('Ensuring RSR log file is writable')
        self.data_host_file_system.make_file_writable_for_all_users(self.config.rsr_log_file_path)

    def _record_last_applied_migration(self):
        self.feedback.comment('Recording last applied RSR database migration')
        with self.data_host_file_system.cd(self.config.rsr_app_path):
            last_migration_file = self._create_last_migration_file(os.path.join(self.config.data_archives_home, 'last_migration.txt'))
            last_migration_file.write(self.django_admin.last_applied_migration_for(self.config.rsr_app_name) + '\n')
            last_migration_file.close()

    def _extract_data_to(self, data_export_file_path):
        self.data_handler.extract_data_to(data_export_file_path, self.settings_reader.rsr_database_name())

    def _compress_and_download_data_extract(self, data_export_file_path):
        self.data_host_file_system.compress_file(data_export_file_path)
        self.data_host_file_system.delete_file(data_export_file_path)
        self.data_host_file_system.download_file('%s.zip' % data_export_file_path, self.config.data_archives_home)
