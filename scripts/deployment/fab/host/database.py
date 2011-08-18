# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


from fab.helpers.filesystem import FileSystem
from fab.helpers.virtualenv import VirtualEnv
from fab.host.controller import RemoteHostController
from fab.host.neutral import NeutralHost


class DatabaseHost(NeutralHost):
    """DatabaseHost encapsulates common actions available when retrieving data from a remote database host"""

    def __init__(self, file_system, virtualenv, feedback):
        super(DatabaseHost, self).__init__(file_system, feedback)
        self.file_system = file_system
        self.virtualenv = virtualenv

    @staticmethod
    def create_instance(virtualenv_path):
        host_controller = RemoteHostController.create_instance()
        file_system = FileSystem(host_controller)
        virtualenv = VirtualEnv(virtualenv_path, host_controller, file_system)

        return DatabaseHost(file_system, virtualenv, host_controller.feedback)

    def ensure_directory_exists(self, dir_path):
        self.file_system.ensure_directory_exists(dir_path)

    def ensure_directory_exists_with_sudo(self, dir_path):
        self.file_system.ensure_directory_exists_with_sudo(dir_path)

    def delete_directory(self, dir_path):
        self.file_system.delete_directory(dir_path)

    def compress_directory(self, full_path_to_compress):
        self.file_system.compress_directory(full_path_to_compress)

    def download_file_to_local_directory(self, remote_file_path, local_dir):
        self.file_system.download_file(remote_file_path, local_dir)

    def run_within_virtualenv(self, command):
        self.virtualenv.run_within_virtualenv(command)
