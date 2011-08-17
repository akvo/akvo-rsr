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

    def run(self, command):
        return fabric.api.run(command)

    def sudo(self, command):
        return fabric.api.sudo(command)

    def get(self, remote_path, local_path=None):
        return fabric.api.get(remote_path, local_path)

    def path_exists(self, path):
        return fabric.contrib.files.exists(path)


class LocalHostController(object):
    """LocalHostController encapsulates basic command execution and path validation calls made to a local host via Fabric"""

    def __init__(self, feedback):
        self.feedback = feedback

    @staticmethod
    def create_instance():
        return LocalHostController(ExecutionFeedback())

    def run(self, command):
        return fabric.api.local(command)

    def sudo(self, command):
        return self.run("sudo %s" % command)

    def path_exists(self, path):
        return os.path.exists(path)
