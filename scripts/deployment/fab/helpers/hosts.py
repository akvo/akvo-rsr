# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


import fabric.api
import fabric.contrib.files

from fab.helpers.feedback import ExecutionFeedback
from fab.helpers.filesystem import FileSystem
from fab.helpers.path import Path
from fab.helpers.permissions import AkvoPermissions
from fab.helpers.virtualenv import VirtualEnv


class RemoteHost(object):
    """RemoteHost encapsulates any calls made to a remote host"""

    def run(self, command):
        return fabric.api.run(command)

    def sudo(self, command):
        return fabric.api.sudo(command)

    def file_exists(self, path):
        return self.path_exists(path)

    def path_exists(self, path):
        return fabric.contrib.files.exists(path)


class DeploymentHost(RemoteHost):

    def __init__(self, file_system, permissions, path_helper, virtualenv):
        self.file_system = file_system
        self.permissions = permissions
        self.path_helper = path_helper
        self.virtualenv = virtualenv

    @staticmethod
    def create_instance(virtualenv_path):
        deployment_host = RemoteHost()
        feedback = ExecutionFeedback()
        file_system = FileSystem(deployment_host, feedback)
        permissions = AkvoPermissions(deployment_host, feedback)
        path = Path(deployment_host, feedback)
        virtualenv = VirtualEnv(virtualenv_path, deployment_host, file_system, feedback)

        return DeploymentHost(file_system, permissions, path, virtualenv)

    def compress_directory(self, full_path_to_compress):
        self.file_system.compress_directory(full_path_to_compress)

    def delete_file(self, file_path):
        self.file_system.delete_file(file_path)

    def delete_file_with_sudo(self, file_path):
        self.file_system.delete_file_with_sudo(file_path)

    def delete_directory(self, dir_path):
        self.file_system.delete_directory(dir_path)

    def delete_directory_with_sudo(self, dir_path):
        self.file_system.delete_directory_with_sudo(dir_path)

    def ensure_user_is_member_of_web_group(self, user_id):
        self.permissions.ensure_user_is_member_of_web_group(user_id)

    def set_web_group_permissions_on_path(self, path):
        self.permissions.set_web_group_permissions_on_path(path)

    def set_web_group_ownership_on_path(self, path):
        self.permissions.set_web_group_ownership_on_path(path)

    def ensure_path_exists(self, path):
        self.path_helper.ensure_path_exists(path)

    def ensure_path_exists_with_sudo(self, path):
        self.path_helper.ensure_path_exists_with_sudo(path)

    def ensure_path_exists_with_web_group_permissions(self, path):
        self.path_helper.ensure_path_exists_with_web_group_permissions(path)

    def create_empty_virtualenv(self, pip_install_log_file):
        self.virtualenv.create_empty_virtualenv(pip_install_log_file)

    def install_virtualenv_packages(self, pip_requirements_file, pip_install_log_file):
        self.virtualenv.install_packages(pip_requirements_file, pip_install_log_file)

    def list_installed_virtualenv_packages(self):
        self.virtualenv.list_installed_virtualenv_packages()

    def run_within_virtualenv(self, command):
        self.virtualenv.run_within_virtualenv(command)
