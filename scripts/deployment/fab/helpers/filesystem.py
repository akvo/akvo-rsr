# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


# python 2.5 compatibilty
from __future__ import with_statement

import os

import fabric.context_managers


class FileSystem(object):
    """FileSystem encapsulates file system actions that are common to both local and remote hosts"""

    def __init__(self, host_controller):
        self.host_controller = host_controller
        self.feedback = self.host_controller.feedback

    def file_exists(self, file_path):
        return self.host_controller.path_exists(file_path)

    def directory_exists(self, dir_path):
        return self.host_controller.path_exists(dir_path)

    def exit_if_file_does_not_exist(self, file_path):
        self._exit_if_path_does_not_exist("file", file_path)

    def exit_if_directory_does_not_exist(self, dir_path):
        self._exit_if_path_does_not_exist("directory", dir_path)

    def _exit_if_path_does_not_exist(self, path_type, path):
        if self.host_controller.path_exists(path):
            self.feedback.comment("Found expected %s: %s" % (path_type, path))
        else:
            self.feedback.abort("Expected %s does not exist: %s" % (path_type, path))

    def create_directory(self, dir_path):
        self._create_directory_with(self.host_controller.run, dir_path)

    def create_directory_with_sudo(self, dir_path):
        self._create_directory_with(self.host_controller.sudo, dir_path)

    def _create_directory_with(self, run_command, dir_path):
        self.feedback.comment("Creating directory: %s" % dir_path)
        run_command("mkdir %s" % dir_path)
        run_command("chmod 755 %s" % dir_path)

    def ensure_directory_exists(self, dir_path):
        self._ensure_directory_exists_with(self.host_controller.run, dir_path)

    def ensure_directory_exists_with_sudo(self, dir_path):
        self._ensure_directory_exists_with(self.host_controller.sudo, dir_path)

    def _ensure_directory_exists_with(self, run_command, dir_path):
        if self.directory_exists(dir_path):
            self.feedback.comment("Found expected directory: %s" % dir_path)
        else:
            self._create_directory_with(run_command, dir_path)

    def rename_file(self, original_file, new_file):
        self._rename_path(original_file, new_file)

    def rename_directory(self, original_dir, new_dir):
        self._rename_path(original_dir, new_dir)

    def _rename_path(self, original_path, new_path):
        self.host_controller.run("mv %s %s" % (original_path, new_path))

    def make_file_writable_for_all_users(self, file_path):
        self.host_controller.sudo("chmod a+w %s" % file_path)

    def delete_file(self, file_path):
        self._delete_at_path_with(self.host_controller.run, "file", file_path)

    def delete_file_with_sudo(self, file_path):
        self._delete_at_path_with(self.host_controller.sudo, "file", file_path)

    def delete_directory(self, dir_path):
        self._delete_at_path_with(self.host_controller.run, "directory", dir_path)

    def delete_directory_with_sudo(self, dir_path):
        self._delete_at_path_with(self.host_controller.sudo, "directory", dir_path)

    def _delete_at_path_with(self, run_command, path_type, path):
        if self.host_controller.path_exists(path):
            self.feedback.comment("Deleting %s: %s" % (path_type, path))
            run_command("rm -r %s" % path)


class RemoteFileSystem(FileSystem):
    """RemoteFileSystem extends FileSystem with additional commands for remote hosts"""

    CODE_ARCHIVE_EXCLUSIONS = "*/.gitignore"

    def download_file(self, remote_file_path, local_dir):
        self.host_controller.get(remote_file_path, local_dir)

    def compress_directory(self, full_path_to_compress):
        stripped_path = full_path_to_compress.rstrip("/")
        self.feedback.comment("Compressing %s" % stripped_path)
        parent_dir = os.path.dirname(stripped_path)
        compressed_file_name = os.path.basename(stripped_path)
        with fabric.context_managers.cd(parent_dir):
            self.host_controller.run("tar -cjf %s.tar.bz2 %s" % (compressed_file_name, compressed_file_name))

    def decompress_code_archive(self, archive_file_name, destination_dir):
        self.host_controller.run("unzip -q %s -d %s -x %s" % (archive_file_name, destination_dir, RemoteFileSystem.CODE_ARCHIVE_EXCLUSIONS))
