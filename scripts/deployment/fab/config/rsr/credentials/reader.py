# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


import os
import json

from fab.host.controller import RemoteHostController
from fab.os.filesystem import FileSystem


class CredentialsFileReader(object):

    def __init__(self, host_paths, host_file_system, host_controller):
        self.host_paths = host_paths
        self.host_file_system = host_file_system
        self.host_controller = host_controller

    @staticmethod
    def create_with(host_paths, host_controller):
        return CredentialsFileReader(host_paths, FileSystem(host_controller), host_controller)

    def read_deployed_credentials(self, credentials_file_name):
        deployed_credentials_file = os.path.join(self.host_paths.config_home, 'credentials', credentials_file_name)

        self.host_file_system.exit_if_file_does_not_exist(deployed_credentials_file)

        with self.host_controller.hide_command_and_output():
            return json.loads(self.host_file_system.read_file(deployed_credentials_file))


class RemoteCredentialsFileReader(CredentialsFileReader):

    @staticmethod
    def create_with(host_paths):
        remote_host_controller = RemoteHostController()

        return RemoteCredentialsFileReader(host_paths, FileSystem(remote_host_controller), remote_host_controller)
