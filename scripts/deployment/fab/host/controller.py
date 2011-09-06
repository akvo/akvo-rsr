# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


import os

import fabric.api
import fabric.contrib.files

from fab.helpers.feedback import ExecutionFeedback


class RemoteHostController(object):
    """RemoteHostController encapsulates basic command execution and path validation calls made to a remote host via Fabric"""

    def __init__(self, feedback):
        self.feedback = feedback

    @staticmethod
    def create_instance():
        return RemoteHostController(ExecutionFeedback())

    def path_exists(self, path):
        return fabric.contrib.files.exists(path)

    def run(self, command):
        return fabric.api.run(command)

    def sudo(self, command):
        return fabric.api.sudo(command)

    def cd(self, path):
        return fabric.api.cd(path)

    def hide_output(self):
        return fabric.api.hide('stdout')

    def get(self, remote_path, local_path=None):
        return fabric.api.get(remote_path, local_path)


class LocalHostController(object):
    """LocalHostController encapsulates basic command execution and path validation calls made to a local host via Fabric"""

    def __init__(self, feedback):
        self.feedback = feedback

    @staticmethod
    def create_instance():
        return LocalHostController(ExecutionFeedback())

    def path_exists(self, path):
        return os.path.exists(path)

    def run(self, command):
        return fabric.api.local(command)

    def sudo(self, command):
        return self.run("sudo %s" % command)

    def cd(self, path):
        return fabric.api.lcd(path)

    def hide_output(self):
        return fabric.api.hide('stdout')

    def get(self, remote_path, local_path=None):
        raise Exception("Unsupported operation: %s.get()" % LocalHostController.__name__)


class HostControllerMode(object):

    LOCAL = 'local'
    REMOTE = 'remote'

    allowed_modes = [LOCAL, REMOTE]

    @staticmethod
    def parse(mode_key):
        mode = mode_key.lower()
        if mode not in HostControllerMode.allowed_modes:
            raise Exception("Unknown host controller mode: %s" % mode)

        return mode


class HostController(object):

    classes = { HostControllerMode.LOCAL: LocalHostController,
                HostControllerMode.REMOTE: RemoteHostController }

    @staticmethod
    def create_from(controller_mode_text):
        return HostController.classes[HostControllerMode.parse(controller_mode_text)].create_instance()
