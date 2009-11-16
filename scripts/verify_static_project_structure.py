#!/usr/bin/env python

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module. 
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

import os, sys

if len(sys.argv) > 0 and sys.argv[-1] == 'ci_mode':
    print '>> running script in continuous integration mode'
    from static_project_structure_ci import *
else:
    from static_project_structure import *


def ensure_directory_exists(dir_path):
    full_path = os.path.realpath(dir_path)
    if not os.path.exists(full_path):
        print ">> [+] creating directory: [%s]" % (full_path)
        os.mkdir(full_path, 0777)
    else:
        print ">> directory exists:       [%s]" % (full_path)

def ensure_symlink_exists(link_path, destination_path):
    full_link_path = os.path.realpath(link_path)
    if not os.path.lexists(link_path):
        print ">> [+] creating symlink:   [%s -> %s]" % (full_link_path, destination_path)
        os.symlink(destination_path, full_link_path)
    elif os.path.lexists(link_path):
        if not os.path.islink(link_path):
            print ">> [warning] path exists but isn't a symlink: [%s]" %(full_link_path)
        elif os.readlink(link_path) != destination_path:
            print ">> [warning] symlink exists but differs: [%s -> %s]" % (link_path, os.readlink(link_path))
            print ">>                            should be: [%s -> %s]" % (link_path, destination_path)
        elif os.path.islink(link_path):
            print ">> symlink exists:         [%s -> %s]" % (link_path, os.readlink(link_path))

def ensure_static_dir_and_links_exist():
    print '\nverifying static directory structure:'
    ensure_directory_exists(STATIC_DIR)
    ensure_symlink_exists(os.path.join(STATIC_DIR, 'akvo'), STATIC_AKVO_DESTINATION)
    ensure_symlink_exists(os.path.join(STATIC_DIR, 'akvo-env'), STATIC_AKVO_VIRTUALENV_DESTINATION)
    ensure_symlink_exists(os.path.join(STATIC_DIR, 'django'), STATIC_DJANGO_DESTINATION)
    if STATIC_DB_DIR_IS_LINK:
        ensure_symlink_exists(os.path.join(STATIC_DIR, 'db'), STATIC_DB_DESTINATION)
    else:
        ensure_directory_exists(os.path.join(STATIC_DIR, 'db'))

def ensure_project_links_exist():
    print '\nverifying project directory links:'
    ensure_symlink_exists(os.path.join(PROJECT_ROOT_DIR, 'akvo/settings.py'), SETTINGS_FILE_DESTINATION)
    ensure_symlink_exists(os.path.join(MEDIAROOT_DIR, 'admin'), MEDIAROOT_ADMIN_DESTINATION)
    ensure_symlink_exists(os.path.join(MEDIAROOT_DIR, 'db'), MEDIAROOT_DB_DESTINATION)

def ensure_web_dir_and_links_exist():
    print '\nverifying web directory links:'
    ensure_directory_exists(WEB_DIR)
    ensure_directory_exists(WEB_DB_DIR)
    ensure_symlink_exists(os.path.join(WEB_DIR, 'mediaroot'), WEB_MEDIAROOT_DESTINATION)

def verify_all_directories_and_links_exist():
    print ">> project root:           [%s]" % (PROJECT_ROOT_DIR)
    ensure_static_dir_and_links_exist()
    ensure_project_links_exist()
    ensure_web_dir_and_links_exist()
    print


verify_all_directories_and_links_exist()

