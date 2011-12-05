# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


import os

from fab.app.command import DBDumpCommand
from fab.config.rsr.dataretriever import RSRDataRetrieverConfig
from fab.environment.python.virtualenv import VirtualEnv
from fab.format.timestamp import TimeStampFormatter
from fab.os.filesystem import FileSystem


class RSRDataRetriever(object):

    def __init__(self, data_retriever_config, file_system, virtualenv, feedback, time_stamp_formatter):
        self.config = data_retriever_config
        self.file_system = file_system
        self.virtualenv = virtualenv
        self.feedback = feedback
        self.time_stamp_formatter = time_stamp_formatter

    @staticmethod
    def create_instance(host_controller):
        data_retriever_config = RSRDataRetrieverConfig.create_instance()
        virtualenv = VirtualEnv(data_retriever_config.rsr_env_path, host_controller)

        return RSRDataRetriever(data_retriever_config,
                                FileSystem(host_controller),
                                virtualenv,
                                host_controller.feedback,
                                TimeStampFormatter())

    def fetch_data_from_database(self):
        self._ensure_required_paths_exist()
        self._ensure_rsr_log_file_is_writable()

        self.rsr_data_dump_path = os.path.join(self.config.data_dumps_home, self.time_stamp_formatter.append_timestamp("rsrdb"))

        self._extract_latest_data()
        self._remove_extraneous_database_files()
        self._compress_and_download_data_archive()

    def _ensure_required_paths_exist(self):
        self.file_system.ensure_directory_exists_with_sudo(self.config.data_dumps_home)
        self.file_system.exit_if_directory_does_not_exist(self.config.rsr_env_path)
        self.file_system.exit_if_file_does_not_exist(self.config.rsr_app_path)
        self.file_system.exit_if_file_does_not_exist(self.config.rsr_log_file_path)

    def _ensure_rsr_log_file_is_writable(self):
        self.feedback.comment("Ensuring RSR log file is writable")
        self.file_system.make_file_writable_for_all_users(self.config.rsr_log_file_path)

    def _extract_latest_data(self):
        self.feedback.comment("Extracting latest data from database at %s" % self.config.rsr_app_path)
        with self.file_system.cd(self.config.rsr_app_path):
            self.virtualenv.run_within_virtualenv(DBDumpCommand.dump_to(self.rsr_data_dump_path))

    def _remove_extraneous_database_files(self):
        self.file_system.delete_file(os.path.join(self.rsr_data_dump_path, "workflows_workflowpermissionrelation.py"))

    def _compress_and_download_data_archive(self):
        self.file_system.compress_directory(self.rsr_data_dump_path)
        self.file_system.delete_directory(self.rsr_data_dump_path)
        self.file_system.download_file("%s.*" % self.rsr_data_dump_path, self.config.data_dumps_home)
