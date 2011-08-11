# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


import fabric.api
import fabric.contrib.files

from fab.helpers.feedback import ExecutionFeedback
from fab.helpers.filesystem import FileSystem
from fab.helpers.internet import Internet
from fab.helpers.permissions import AkvoPermissions
from fab.helpers.virtualenv import VirtualEnv


class RemoteHost(object):
    """RemoteHost encapsulates basic command execution and path validation calls made to a remote host via Fabric"""

    def __init__(self, feedback):
        self.feedback = feedback

    @staticmethod
    def create_instance():
        return RemoteHost(ExecutionFeedback())

    def run(self, command):
        return fabric.api.run(command)

    def sudo(self, command):
        return fabric.api.sudo(command)

    def path_exists(self, path):
        return fabric.contrib.files.exists(path)


class NeutralHost(object):
    """NeutralHost encapsulates read-only and other neutral actions that won't change the host"""

    def __init__(self, remote_host, file_system):
        self.file_system = file_system
        self.feedback = remote_host.feedback

    @staticmethod
    def create_instance():
        remote_host = RemoteHost.create_instance()

        return NeutralHost(remote_host, FileSystem(remote_host))

    def file_exists(self, file_path):
        return self.file_system.file_exists(file_path)

    def directory_exists(self, dir_path):
        return self.file_system.directory_exists(dir_path)

    def exit_if_file_does_not_exist(self, file_path):
        self.file_system.exit_if_file_does_not_exist(file_path)

    def exit_if_directory_does_not_exist(self, dir_path):
        self.file_system.exit_if_directory_does_not_exist(dir_path)


class DatabaseHost(NeutralHost):
    """DatabaseHost encapsulates common actions available when retrieving data from a database host"""

    def __init__(self, remote_host, file_system, virtualenv):
        super(DatabaseHost, self).__init__(remote_host, file_system)
        self.file_system = file_system
        self.virtualenv = virtualenv

    @staticmethod
    def create_instance(virtualenv_path):
        remote_host = RemoteHost.create_instance()
        file_system = FileSystem(remote_host)
        virtualenv = VirtualEnv(virtualenv_path, remote_host, file_system)

        return DatabaseHost(remote_host, file_system, virtualenv)

    def ensure_directory_exists(self, dir_path):
        self.file_system.ensure_directory_exists(dir_path)

    def ensure_directory_exists_with_sudo(self, dir_path):
        self.file_system.ensure_directory_exists_with_sudo(dir_path)

    def delete_directory(self, dir_path):
        self.file_system.delete_directory(dir_path)

    def compress_directory(self, full_path_to_compress):
        self.file_system.compress_directory(full_path_to_compress)

    def run_within_virtualenv(self, command):
        self.virtualenv.run_within_virtualenv(command)


class DeploymentHost(NeutralHost):
    """DeploymentHost encapsulates common actions available during a deployment"""

    def __init__(self, remote_host, file_system, permissions, internet_helper, virtualenv):
        super(DeploymentHost, self).__init__(remote_host, file_system)
        self.file_system = file_system
        self.permissions = permissions
        self.internet = internet_helper
        self.virtualenv = virtualenv

    @staticmethod
    def create_instance(virtualenv_path):
        remote_host = RemoteHost.create_instance()
        file_system = FileSystem(remote_host)
        permissions = AkvoPermissions(remote_host)
        virtualenv = VirtualEnv(virtualenv_path, remote_host, file_system)

        return DeploymentHost(remote_host, file_system, permissions, Internet(remote_host), virtualenv)

    def file_exists(self, file_path):
        return self.file_system.file_exists(file_path)

    def directory_exists(self, dir_path):
        return self.file_system.directory_exists(dir_path)

    def exit_if_file_does_not_exist(self, file_path):
        self.file_system.exit_if_file_does_not_exist(file_path)

    def exit_if_directory_does_not_exist(self, dir_path):
        self.file_system.exit_if_directory_does_not_exist(dir_path)

    def create_directory(self, dir_path):
        self.file_system.create_directory(dir_path)

    def create_directory_with_sudo(self, dir_path):
        self.file_system.create_directory_with_sudo(dir_path)

    def ensure_directory_exists(self, dir_path):
        self.file_system.ensure_directory_exists(dir_path)

    def ensure_directory_exists_with_sudo(self, dir_path):
        self.file_system.ensure_directory_exists_with_sudo(dir_path)

    def rename_file(self, original_file, new_file):
        self.file_system.rename_file(original_file, new_file)

    def rename_directory(self, original_dir, new_dir):
        self.file_system.rename_directory(original_dir, new_dir)

    def delete_file(self, file_path):
        self.file_system.delete_file(file_path)

    def delete_file_with_sudo(self, file_path):
        self.file_system.delete_file_with_sudo(file_path)

    def delete_directory(self, dir_path):
        self.file_system.delete_directory(dir_path)

    def delete_directory_with_sudo(self, dir_path):
        self.file_system.delete_directory_with_sudo(dir_path)

    def compress_directory(self, full_path_to_compress):
        self.file_system.compress_directory(full_path_to_compress)

    def decompress_code_archive(self, archive_file_name, destination_dir):
        self.file_system.decompress_code_archive(archive_file_name, destination_dir)

    def exit_if_user_is_not_member_of_web_group(self, user_id):
        self.permissions.exit_if_user_is_not_member_of_web_group(user_id)

    def set_web_group_permissions_on_directory(self, dir_path):
        self.permissions.set_web_group_permissions_on_directory(dir_path)

    def set_web_group_ownership_on_directory(self, dir_path):
        self.permissions.set_web_group_ownership_on_directory(dir_path)

    def ensure_directory_exists_with_web_group_permissions(self, dir_path):
        if self.directory_exists(dir_path):
            self.feedback.comment("Found expected directory: %s" % dir_path)
            # TODO: check the file mode and set web group permissions as necessary
        else:
            self.ensure_directory_exists_with_sudo(dir_path)
            self.set_web_group_permissions_on_directory(dir_path)

    def file_name_at_url(self, url):
        return self.internet.file_name_at_url(url)

    def fetch_file_at_url(self, file_url, download_directory):
        self.internet.fetch_file_at_url(file_url, download_directory)

    def create_empty_virtualenv(self, pip_install_log_file):
        self.virtualenv.create_empty_virtualenv(pip_install_log_file)

    def install_virtualenv_packages(self, pip_requirements_file, pip_install_log_file):
        self.virtualenv.install_packages(pip_requirements_file, pip_install_log_file)

    def list_installed_virtualenv_packages(self):
        self.virtualenv.list_installed_virtualenv_packages()

    def run_within_virtualenv(self, command):
        self.virtualenv.run_within_virtualenv(command)
