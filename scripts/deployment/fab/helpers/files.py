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


class FilesHelper(object):

    def compress_directory(self, full_path):
        stripped_path = full_path.strip("/")
        print ">> Compressing %s" % stripped_path
        working_dir = os.path.dirname(stripped_path)
        dir_to_archive = os.path.basename(stripped_path)
        with fabric.context_managers.cd(working_dir):
            fabric.api.run("tar -cjf %s.tar.bz2 %s" % (dir_to_archive, dir_to_archive))

    def delete_file(self, file_path):
        self._delete_file_or_directory(file_path, "file", fabric.api.run)

    def delete_file_with_sudo(self, file_path):
        self._delete_file_or_directory(file_path, "file", fabric.api.sudo)

    def delete_directory(self, dir_path):
        self._delete_file_or_directory(dir_path, "directory", fabric.api.run)

    def delete_directory_with_sudo(self, dir_path):
        self._delete_file_or_directory(dir_path, "directory", fabric.api.sudo)

    def _delete_file_or_directory(self, at_path, file_or_dir, run_command):
        if files.exists(at_path):
            print ">> Deleting %s: %s" % (file_or_dir, at_path)
            run_command("rm -r %s" % at_path)
