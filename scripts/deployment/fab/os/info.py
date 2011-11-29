# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


class SystemType(object):

    LINUX   = "Linux"
    MAC_OSX = "Darwin"


class SystemInfo(object):

    def __init__(self, host_controller):
        self.host_controller = host_controller

    def is_linux(self):
        return self._system_name() == SystemType.LINUX

    def is_osx(self):
        return self._system_name() == SystemType.MAC_OSX

    def _system_name(self):
        return self.host_controller.run("uname -s")
