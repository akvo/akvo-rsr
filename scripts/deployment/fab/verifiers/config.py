# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


import os

from fab.os.filesystem import LocalFileSystem


class ConfigFileVerifier(object):

    DEPLOYMENT_SCRIPTS_HOME = os.path.realpath(os.path.join(os.path.dirname(__file__), '../..'))

    def __init__(self, local_file_system=LocalFileSystem()):
        self.local_file_system = local_file_system

    def exit_if_database_credentials_not_found(self):
        self._exit_if_file_is_missing('fab/config/rsr/credentials/database.py')

    def exit_if_config_loaders_not_found(self):
        self._exit_if_file_is_missing('fab/config/loaders.py')

    def _exit_if_file_is_missing(self, relative_deployment_file_path):
        self.local_file_system.exit_if_file_does_not_exist(os.path.join(self.DEPLOYMENT_SCRIPTS_HOME, relative_deployment_file_path))
