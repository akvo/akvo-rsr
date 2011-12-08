# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


import os

from fab.app.command import DBDumpCommand, DjangoManageCommand
from fab.config.rsr.codebase import RSRCodebaseConfig
from fab.config.rsr.data.populator import RSRDataPopulatorConfig
from fab.environment.python.virtualenv import VirtualEnv
from fab.os.filesystem import FileSystem, LocalFileSystem


class RSRDataPopulator(object):

    def __init__(self, data_populator_config, data_host_file_system, local_file_system, virtualenv, feedback):
        self.config = data_populator_config
        self.data_host_file_system = data_host_file_system
        self.local_file_system = local_file_system
        self.virtualenv = virtualenv
        self.feedback = feedback

    @staticmethod
    def create_instance(host_controller):
        data_populator_config = RSRDataPopulatorConfig.create_instance()

        return RSRDataPopulator(data_populator_config,
                                FileSystem(host_controller),
                                LocalFileSystem(),
                                VirtualEnv(data_populator_config.rsr_env_path, host_controller),
                                host_controller.feedback)

    def populate_database(self, rsr_database_name):
        self._ensure_expected_paths_exist()

        latest_data_archive_name = self.local_file_system.most_recent_file_in_directory(self.config.data_archives_home)

        self._upload_and_unpack_data_archive(latest_data_archive_name)
        self._populate_rsr_database(latest_data_archive_name)

    def _ensure_expected_paths_exist(self):
        self.local_file_system.exit_if_directory_does_not_exist(self.config.data_archives_home)
        self.data_host_file_system.ensure_directory_exists(self.config.data_archives_home)

    def _upload_and_unpack_data_archive(self, latest_data_archive_name):
        data_archive_file_path = self._data_archive_path(latest_data_archive_name)

        # we use the same data archive path both locally and on the data host
        self.feedback.comment("Unpacking latest data archive: %s" % latest_data_archive_name)
        if not self.data_host_file_system.file_exists(data_archive_file_path):
            self.data_host_file_system.upload_file(data_archive_file_path, self.config.data_archives_home)
        self.data_host_file_system.decompress_data_archive(data_archive_file_path, self.config.data_archives_home)
        self.data_host_file_system.delete_file(data_archive_file_path)

    def _populate_rsr_database(self, latest_data_archive_name):
        data_archive_dir = self._data_archive_path(latest_data_archive_name).replace(FileSystem.DATA_ARCHIVE_EXTENSION, "")

        with self.data_host_file_system.cd(self.config.rsr_deployment_home):
            self.feedback.comment("Creating initial data models")
            self.virtualenv.run_within_virtualenv(DjangoManageCommand.SYNCDB_WITHOUT_CREATING_SUPERUSERS)
            self.feedback.comment("Loading RSR data")
            self.virtualenv.run_within_virtualenv(DBDumpCommand.load_from(data_archive_dir))
            self.feedback.comment("Resyncing data models")
            self.virtualenv.run_within_virtualenv(DjangoManageCommand.SYNCDB_WITH_STALE_CONTENT_TYPE_DELETION)
            self.virtualenv.run_within_virtualenv(DjangoManageCommand.SYNCDB)

    def _data_archive_path(self, latest_data_archive_name):
        return os.path.join(self.config.data_archives_home, latest_data_archive_name)
