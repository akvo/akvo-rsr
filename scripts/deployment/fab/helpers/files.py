# -*- coding: utf-8 -*-
# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


# python 2.5 compatibilty
from __future__ import with_statement

import os

import fabric.api
import fabric.context_managers
import fabric.contrib.files as files


class FilesHelper():

    def compress_directory(self, full_path):
        stripped_path = full_path.strip("/")
        print ">> Compressing %s" % stripped_path
        working_dir = os.path.dirname(stripped_path)
        dir_to_archive = os.path.basename(stripped_path)
        with fabric.context_managers.cd(working_dir):
            fabric.api.run("tar -cjf %s.tar.bz2 %s" % (dir_to_archive, dir_to_archive))

    def delete_file(self, file_path, deletion_message=None):
        self._delete_file(file_path, deletion_message, fabric.api.run)

    def delete_file_with_sudo(self, file_path, deletion_message=None):
        self._delete_file(file_path, deletion_message, fabric.api.sudo)

    def _delete_file(self, file_path, deletion_message, run_command):
        self._delete_file_or_directory(file_path, deletion_message, "file", run_command)

    def delete_directory(self, dir_path, deletion_message=None):
        self._delete_directory(dir_path, deletion_message, fabric.api.run)

    def delete_directory_with_sudo(self, dir_path, deletion_message=None):
        self._delete_directory(dir_path, deletion_message, fabric.api.sudo)

    def _delete_directory(self, dir_path, deletion_message, run_command):
        self._delete_file_or_directory(dir_path, deletion_message, "directory", run_command)

    def _delete_file_or_directory(self, at_path, deletion_message, file_or_dir, run_command):
        if files.exists(at_path):
            if (deletion_message):
                print deletion_message
            else:
                print ">> Deleting %s: %s" % (file_or_dir, at_path)
            run_command("rm -r %s" % at_path)
