# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


import os
import simplejson as json

from fab.host.controller import RemoteHostController
from fab.os.filesystem import FileSystem, LocalFileSystem, RemoteFileSystem


class CredentialsFileReader(object):

    def __init__(self, host_paths, host_file_system, local_file_system=LocalFileSystem()):
        self.host_paths = host_paths
        self.host_file_system = host_file_system
        self.local_file_system = local_file_system

    @staticmethod
    def create_with(host_paths, host_controller):
        return CredentialsFileReader(host_paths, FileSystem(host_controller))

    def read_local_credentials(self, credentials_file_name, delete_after_reading=False):
        local_credentials_home = os.path.join(self.host_paths.deployment_processing_home, 'credentials')
        local_credentials_file = os.path.join(local_credentials_home, credentials_file_name)

        self.local_file_system.exit_if_file_does_not_exist(local_credentials_file)

        with self.local_file_system.open_file(local_credentials_file) as credentials_file:
            credentials_data = json.load(credentials_file)

        if delete_after_reading:
            self.local_file_system.delete_file(local_credentials_file)

        return credentials_data

    def read_deployed_credentials(self, credentials_file_name):
        deployed_credentials_file = os.path.join(self.host_paths.config_home, 'credentials', credentials_file_name)
        local_credentials_home = os.path.join(self.host_paths.deployment_processing_home, 'credentials')

        self.host_file_system.exit_if_file_does_not_exist(deployed_credentials_file)
        self.host_file_system.download_file(deployed_credentials_file, local_credentials_home)

        return self.read_local_credentials(credentials_file_name, delete_after_reading=True)


class RemoteCredentialsFileReader(CredentialsFileReader):

    @staticmethod
    def create_with(host_paths):
        return RemoteCredentialsFileReader(host_paths, RemoteFileSystem())
