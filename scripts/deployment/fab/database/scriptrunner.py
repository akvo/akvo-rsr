# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


import os

from fab.config.rsr.database import RSRDatabaseConfig


class DatabaseAdminScriptRunner(object):

    def __init__(self, database_config, host_controller):
        self.db_config = database_config
        self.host_controller = host_controller

    @staticmethod
    def create_instance(host_controller):
        return DatabaseAdminScriptRunner(RSRDatabaseConfig.create_instance(), host_controller)

    def run(self, script_name):
        self.host_controller.run("python %s %s" % (self._admin_script_path(script_name), self.db_config.config_values_file_path))

    def _admin_script_path(self, script_name):
        return os.path.join(self.db_config.admin_scripts_path, script_name)
