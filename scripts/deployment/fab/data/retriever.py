# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


import os

from fab.app.admin import DBDump
from fab.config.rsr.data.retriever import RSRDataRetrieverConfig
from fab.config.values.host import DataHostPaths
from fab.environment.python.virtualenv import VirtualEnv
from fab.format.timestamp import TimeStampFormatter
from fab.os.filesystem import FileSystem, LocalFileSystem


class RSRDataRetriever(object):

    def __init__(self, data_retriever_config, data_host_file_system, local_file_system, db_dump, feedback, time_stamp_formatter):
        self.config = data_retriever_config
        self.data_host_file_system = data_host_file_system
        self.local_file_system = local_file_system
        self.db_dump = db_dump
        self.feedback = feedback
        self.time_stamp_formatter = time_stamp_formatter

    @staticmethod
    def create_with(host_controller):
        data_retriever_config = RSRDataRetrieverConfig(DataHostPaths())

        return RSRDataRetriever(data_retriever_config,
                                FileSystem(host_controller),
                                LocalFileSystem(),
                                DBDump(VirtualEnv(data_retriever_config.rsr_env_path, host_controller)),
                                host_controller.feedback,
                                TimeStampFormatter())

    def fetch_data_from_database(self):
        self._ensure_required_paths_exist()
        self._ensure_rsr_log_file_is_writable()

        data_archive_dir = self.time_stamp_formatter.append_timestamp("rsrdb")
        rsr_data_archive_path = os.path.join(self.config.data_archives_home, data_archive_dir)

        self._create_data_extract(rsr_data_archive_path)
        self._remove_extraneous_database_files(rsr_data_archive_path)
        self._compress_and_download_data_archive(rsr_data_archive_path)

    def _ensure_required_paths_exist(self):
        self.local_file_system.ensure_directory_exists(self.config.data_archives_home)
        self.data_host_file_system.ensure_directory_exists_with_sudo(self.config.data_archives_home)
        self.data_host_file_system.exit_if_directory_does_not_exist(self.config.rsr_env_path)
        self.data_host_file_system.exit_if_file_does_not_exist(self.config.rsr_app_path)
        self.data_host_file_system.exit_if_file_does_not_exist(self.config.rsr_log_file_path)

    def _ensure_rsr_log_file_is_writable(self):
        self.feedback.comment("Ensuring RSR log file is writable")
        self.data_host_file_system.make_file_writable_for_all_users(self.config.rsr_log_file_path)

    def _create_data_extract(self, data_archive_path):
        self.feedback.comment("Extracting latest data from database at %s" % self.config.rsr_app_path)
        with self.data_host_file_system.cd(self.config.rsr_app_path):
            self.db_dump.extract_data_to(data_archive_path)

    def _remove_extraneous_database_files(self, data_archive_path):
        self.data_host_file_system.delete_file(os.path.join(data_archive_path, "workflows_workflowpermissionrelation.py"))

    def _compress_and_download_data_archive(self, data_archive_path):
        self.data_host_file_system.compress_directory(data_archive_path)
        self.data_host_file_system.delete_directory(data_archive_path)
        self.data_host_file_system.download_file("%s.zip" % data_archive_path, self.config.data_archives_home)
