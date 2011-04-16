# -*- coding: utf-8 -*-
# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


from fabric.api import env, run, sudo
from fabric.contrib import files
from fabric.utils import abort

from helpers.permissions import set_akvo_group_permissions_on_path


def ensure_path_exists_with_akvo_group_permissions(path):
    if not files.exists(path):
        _ensure_path_exists_with(path, sudo)
        set_akvo_group_permissions_on_path(path)

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
        abort("\n>> Expected path does not exist: %s" % path)

def path_without_trailing_separator(path):
    if path[-1] == '/':
        return path[0:-1]
    return path
