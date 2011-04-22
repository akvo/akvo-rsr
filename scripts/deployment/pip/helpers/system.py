# -*- coding: utf-8 -*-
# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

import os, subprocess


def command_exists_on_path(command):
    return len(subprocess.Popen(['which', command], stdout=subprocess.PIPE).communicate()[0]) > 0

def header_path_exists(header_path):
    return _header_exists_in('/usr/include', header_path) or _header_exists_in('/usr/local/include', header_path)

def _header_exists_in(include_dir, header_path):
    return os.path.exists(os.path.join(include_dir, header_path))

def library_exists(library_name):
    return library_exists_in('/usr/lib', library_name) or library_exists_in('/usr/local/lib', library_name)

def _library_exists_in(lib_dir, library_name):
    return os.path.exists(os.path.join(lib_dir, library_file(library_name)))

def library_file(library_name):
    return library_name + system_library_extension()

def system_library_extension():
    return '.dylib' if system_is_osx() else '.so'

def system_is_osx():
    return os.uname()[0] == 'Darwin'
