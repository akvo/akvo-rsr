# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


import os

from fab.host.controller import LocalHostController
from fab.os.path import PathInfo
from fab.os.symlink import SymlinkInfo


class ArchiveOptions(object):

    CODE_ARCHIVE_EXCLUSIONS = "*/.gitignore"
    NONE = ""


class FileSystem(object):
    """FileSystem encapsulates file system actions that are common to both local and remote hosts"""

    def __init__(self, host_controller):
        self.host_controller = host_controller
        self.feedback = self.host_controller.feedback

    def cd(self, dir_path):
        return self.host_controller.cd(dir_path)

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
        run_command("mkdir -p %s" % dir_path)
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

    def create_symlink(self, symlink_path, real_path, with_sudo=False):
        self._run_command("ln -s %s %s" % (real_path, symlink_path), with_sudo)
        self.feedback.comment("Created symlink: %s" % SymlinkInfo(symlink_path, self.host_controller))

    def remove_symlink(self, symlink_path, with_sudo=False):
        self.feedback.comment("Removing symlink: %s" % symlink_path)
        self._run_command("unlink %s" % symlink_path, with_sudo)

    def ensure_symlink_exists(self, symlink_path, real_path, with_sudo=False):
        path = PathInfo(symlink_path, self.host_controller)

        if path.exists() and not path.is_symlink():
            self.feedback.abort("Found existing path but path is not a symlink: %s" % symlink_path)
        elif not PathInfo(real_path, self.host_controller).exists():
            self.feedback.abort("Cannot create symlink to nonexistent path: %s" % real_path)
        else:
            symlink = SymlinkInfo(symlink_path, self.host_controller)

            if symlink.exists() and symlink.is_linked_to(real_path):
                self.feedback.comment("Found expected symlink: %s" % symlink)
            elif symlink.exists():
                self.remove_symlink(symlink_path)
                self.create_symlink(symlink_path, real_path, with_sudo)
            else:
                self.create_symlink(symlink_path, real_path, with_sudo)

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

    def _run_command(self, command, with_sudo=False):
        return self.host_controller.sudo(command) if with_sudo else self.host_controller.run(command)

    def decompress_code_archive(self, archive_file_path, destination_dir):
        self._decompress_archive(archive_file_path, destination_dir, "-x %s" % ArchiveOptions.CODE_ARCHIVE_EXCLUSIONS)

    def decompress_data_archive(self, archive_file_path, destination_dir):
        self._decompress_archive(archive_file_path, destination_dir)

    def _decompress_archive(self, archive_file_path, destination_dir, options=ArchiveOptions.NONE):
        self.host_controller.run("unzip -q %s -d %s %s".rstrip() % (archive_file_path, destination_dir, options))

    def compress_file(self, file_path):
        self._compress_resource(file_path)

    def compress_directory(self, dir_path):
        self._compress_resource(dir_path.rstrip("/"))

    def _compress_resource(self, full_path):
        self.feedback.comment("Compressing %s" % full_path)
        parent_dir = os.path.dirname(full_path)
        resource_to_compress = os.path.basename(full_path)
        archive_file_name = "%s.zip" % resource_to_compress
        with self.host_controller.cd(parent_dir):
            self.host_controller.run("zip -r %s %s" % (archive_file_name, resource_to_compress))

    def download_file(self, host_file_path, local_dir):
        self.host_controller.get(host_file_path, local_dir)

    def upload_file(self, local_file_path, remote_dir):
        self.host_controller.put(local_file_path, remote_dir, mirror_local_mode=True)

    def most_recent_file_in_directory(self, dir_path):
        return self.host_controller.run("ls -1tr %s | tail -1" % dir_path)


class LocalFileSystem(FileSystem):

    def __init__(self):
        super(LocalFileSystem, self).__init__(LocalHostController())
