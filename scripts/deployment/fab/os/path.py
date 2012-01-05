# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


from fab.os.command.stat import StatCommand
from fab.os.system import SystemInfo


class PathType(object):

    DIRECTORY   = "directory"
    FILE        = "file"
    SYMLINK     = "symbolic link"


class PathInfo(object):

    def __init__(self, path, host_controller):
        self.path = path
        self.host_controller = host_controller

        self.determine_path_type(SystemInfo(host_controller).system_type)

    def determine_path_type(self, system_type):
        path_type_query = StatCommand(system_type).for_path(self.path)
        self.path_type = self.host_controller.run(path_type_query).lower()

    def exists(self):
        return self.host_controller.path_exists(self.path)

    def is_directory(self):
        return self.path_type == PathType.DIRECTORY

    def is_file(self):
        return self.path_type.find(PathType.FILE) > 0

    def is_symlink(self):
        return self.path_type == PathType.SYMLINK
