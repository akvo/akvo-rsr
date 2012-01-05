# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


class SymlinkInfo(object):

    def __init__(self, symlink_path, host_controller):
        self.symlink_path = symlink_path
        self.host_controller = host_controller

    def exists(self):
        return self.host_controller.path_exists(self.symlink_path)

    def linked_path_exists(self):
        return self.host_controller.path_exists(self._linked_path())

    def is_unbroken(self):
        return self.linked_path_exists()

    def is_broken(self):
        return not self.linked_path_exists()

    def is_linked_to(self, expected_path):
        return self._linked_path() == expected_path

    def _linked_path(self):
        return self.host_controller.run("readlink %s" % self.symlink_path)
