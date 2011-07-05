# -*- coding: utf-8 -*-
# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


import fabric.api
import fabric.contrib.files as files
import fabric.utils

import fab.helpers.permissions


class PathsHelper():

    def __init__(self, permissions_helper):
        self.permissions = permissions_helper

    def ensure_path_exists_with_akvo_group_permissions(self, path):
        if not files.exists(path):
            self._ensure_path_exists_with(path, fabric.api.sudo)
            self.permissions.set_akvo_group_permissions_on_path(path)
        else:
            print ">> Found expected path: %s" % path

    def ensure_path_exists(self, path):
        self._ensure_path_exists_with(path, fabric.api.run)

    def ensure_path_exists_with_sudo(self, path):
        self._ensure_path_exists_with(path, fabric.api.sudo)

    def _ensure_path_exists_with(self, path, run_command):
        if not files.exists(path):
            print ">> Creating path: %s" % path
            run_command("mkdir %s" % path)
            run_command("chmod 775 %s" % path)
        else:
            print ">> Found expected path: %s" % path

    def exit_if_path_does_not_exist(self, path):
        if not files.exists(path):
            fabric.utils.abort("\n>> Expected path does not exist: %s" % path)

    def path_without_trailing_separator(self, path):
        return path.strip("/")
