# -*- coding: utf-8 -*-
# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


# python 2.5 compatibilty
from __future__ import with_statement

import os

from fabric.api import run, sudo
from fabric.context_managers import cd
from fabric.contrib import files

from helpers.paths import path_without_trailing_separator


def compress_directory(full_path):
    full_path = path_without_trailing_separator(full_path)
    print "\n>> Compressing %s" % full_path
    working_dir = os.path.dirname(full_path)
    dir_to_archive = os.path.basename(full_path)
    with cd(working_dir):
        run("tar -cjf %s.tar.bz2 %s" % (dir_to_archive, dir_to_archive))

def delete_file(file_path):
    delete_file(file_path, None)

def delete_file_with_sudo(file_path):
    delete_file_with_sudo(file_path, None)

def delete_file(file_path, deletion_message):
    _delete_file(file_path, deletion_message, run)

def delete_file_with_sudo(file_path, deletion_message):
    _delete_file(file_path, deletion_message, sudo)

def _delete_file(file_path, deletion_message, run_command):
    _delete_file_or_directory(file_path, deletion_message, "file", run_command)

def delete_directory(dir_path):
    delete_directory(dir_path, None)

def delete_directory_with_sudo(dir_path):
    delete_directory_with_sudo(dir_path, None)

def delete_directory(dir_path, deletion_message):
    _delete_directory(dir_path, deletion_message, run)

def delete_directory_with_sudo(dir_path, deletion_message):
    _delete_directory(dir_path, deletion_message, sudo)

def _delete_directory(dir_path, deletion_message, run_command):
    _delete_file_or_directory(dir_path, deletion_message, "directory", run_command)

def _delete_file_or_directory(at_path, deletion_message, file_or_dir, run_command):
    if files.exists(at_path):
        if (deletion_message):
            print deletion_message
        else:
            print "\n>> Deleting %s: %s" % (file_or_dir, at_path)
        run_command("rm -r %s" % at_path)
