# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


# python 2.5 compatibilty
from __future__ import with_statement

import os

import fabric.context_managers


class FileSystem(object):

    def __init__(self, remote_host, feedback):
        self.remote_host = remote_host
        self.feedback = feedback

    def compress_directory(self, full_path_to_compress):
        stripped_path = full_path_to_compress.rstrip("/")
        self.feedback.comment("Compressing %s" % stripped_path)
        parent_dir = os.path.dirname(stripped_path)
        compressed_file_name = os.path.basename(stripped_path)
        with fabric.context_managers.cd(parent_dir):
            self.remote_host.run("tar -cjf %s.tar.bz2 %s" % (compressed_file_name, compressed_file_name))

    def delete_file(self, file_path):
        self._delete_file_or_directory(file_path, "file", self.remote_host.run)

    def delete_file_with_sudo(self, file_path):
        self._delete_file_or_directory(file_path, "file", self.remote_host.sudo)

    def delete_directory(self, dir_path):
        self._delete_file_or_directory(dir_path, "directory", self.remote_host.run)

    def delete_directory_with_sudo(self, dir_path):
        self._delete_file_or_directory(dir_path, "directory", self.remote_host.sudo)

    def _delete_file_or_directory(self, at_path, file_or_dir, run_command):
        if self.remote_host.path_exists(at_path):
            self.feedback.comment("Deleting %s: %s" % (file_or_dir, at_path))
            run_command("rm -r %s" % at_path)
