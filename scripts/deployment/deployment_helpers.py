# -*- coding: utf-8 -*-

# python 2.5 compatibilty
from __future__ import with_statement

import os, sys

from fabric.api import env, run, sudo
from fabric.context_managers import cd
from fabric.contrib import files


def ensure_path_exists(path):
    _ensure_path_exists_with(path, run)

def ensure_path_exists_with_sudo(path):
    _ensure_path_exists_with(path, sudo)

def _ensure_path_exists_with(path, run_command):
    if not files.exists(path):
        print "\n>> Creating path: %s" % path
        run_command("mkdir %s" % path)
        run_command("chmod 775 %s" % path)

def exit_if_path_does_not_exist(path):
    if not files.exists(path):
        print "\n>> Expected path does not exist: %s" % path
        sys.exit(1)

def with_virtualenv(command):
    run("source %s/bin/activate && %s" % (env.virtualenv_path, command))

def path_without_trailing_separator(path):
    if path[-1] == '/':
        return path[0:-1]
    return path

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
