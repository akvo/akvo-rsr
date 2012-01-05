# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


from fab.helpers.internet import Internet
from fab.host.neutral import NeutralHost
from fab.os.filesystem import FileSystem
from fab.os.permissions import AkvoPermissions


class DeploymentHost(NeutralHost):
    """DeploymentHost encapsulates common actions available during a deployment"""

    def __init__(self, file_system, permissions, internet_helper, feedback):
        super(DeploymentHost, self).__init__(file_system, feedback)
        self.permissions = permissions
        self.internet = internet_helper

    @staticmethod
    def create_instance(host_controller):
        return DeploymentHost(FileSystem(host_controller),
                              AkvoPermissions(host_controller),
                              Internet(host_controller),
                              host_controller.feedback)

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

    def ensure_symlink_exists(self, symlink_path, real_path, with_sudo=False):
        self.file_system.ensure_symlink_exists(symlink_path, real_path, with_sudo)

    def file_name_at_url(self, url):
        return self.internet.file_name_at_url(url)

    def file_name_from_url_headers(self, url):
        return self.internet.file_name_from_url_headers(url)

    def download_file_at_url_as(self, downloaded_file_path, file_url):
        self.internet.download_file_at_url_as(downloaded_file_path, file_url)
