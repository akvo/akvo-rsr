# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


from fab.config.rsr.dataretriever import RSRDataRetrieverConfig
from fab.environment.python.virtualenv import VirtualEnv
from fab.os.filesystem import FileSystem


class RSRDataRetriever(object):

    def __init__(self, data_retriever_config, file_system, virtualenv, feedback):
        self.config = data_retriever_config
        self.file_system = file_system
        self.virtualenv = virtualenv
        self.feedback = feedback

    @staticmethod
    def create_instance(host_controller):
        data_retriever_config = RSRDataRetrieverConfig.create_instance()
        virtualenv = VirtualEnv(data_retriever_config.rsr_env_path, host_controller)

        return RSRDataRetriever(data_retriever_config, FileSystem(host_controller), virtualenv, host_controller.feedback)

    def fetch_data_from_database(self):
        self._ensure_required_paths_exist()
        self._ensure_rsr_log_file_is_writable()

        rsr_data_dump_path = self.config.time_stamped_rsr_data_dump_path()

        self.feedback.comment("Fetching data from database at %s" % self.config.rsr_app_path)
        self.virtualenv.run_within_virtualenv("python %s -d %s dump" % (self.config.db_dump_script_path, rsr_data_dump_path))
        self.file_system.compress_directory(rsr_data_dump_path)
        self.file_system.delete_directory(rsr_data_dump_path)
        self.file_system.download_file("%s.*" % rsr_data_dump_path, self.config.data_dumps_home)

    def _ensure_required_paths_exist(self):
        self.file_system.ensure_directory_exists_with_sudo(self.config.data_dumps_home)
        self.file_system.exit_if_directory_does_not_exist(self.config.rsr_env_path)
        self.file_system.exit_if_file_does_not_exist(self.config.db_dump_script_path)

    def _ensure_rsr_log_file_is_writable(self):
        self.feedback.comment("Ensuring RSR log file is writable")
        self.file_system.make_file_writable_for_all_users(self.config.rsr_log_file_path)
