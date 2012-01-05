# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


from fab.os.system import SystemInfo, SystemType


class PathType(object):

    DIRECTORY   = "directory"
    FILE        = "file"
    SYMLINK     = "symbolic link"


class PathInfo(object):

    def __init__(self, path, host_controller):
        self.path = path
        self.host_controller = host_controller

        self.determine_path_type(host_controller)

    def determine_path_type(self, host_controller):
        system_type = SystemInfo(host_controller).system_type
        path_type_query_format = { SystemType.LINUX: "-c %F", SystemType.MAC_OSX: "-f %HT" }[system_type]

        self.path_type = self.host_controller.run("stat %s %s" % (path_type_query_format, self.path)).lower()

    def exists(self):
        return self.host_controller.path_exists(self.path)

    def is_directory(self):
        return self.path_type == PathType.DIRECTORY

    def is_file(self):
        return self.path_type.find(PathType.FILE) > 0

    def is_symlink(self):
        return self.path_type == PathType.SYMLINK
