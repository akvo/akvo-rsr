# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


from fab.config.rsr.database import RSRDatabaseConfig
from fab.database.scriptrunner import DatabaseAdminScriptRunner
from fab.host.neutral import NeutralHost
from fab.os.filesystem import FileSystem


class DatabaseHost(NeutralHost):
    """DatabaseHost encapsulates database deployment actions"""

    def __init__(self, database_config, admin_script_runner, file_system, feedback):
        super(DatabaseHost, self).__init__(file_system, feedback)
        self.database_config = database_config
        self.admin_script_runner = admin_script_runner

    @staticmethod
    def create_instance(host_controller):
        database_config = RSRDatabaseConfig.from_local_config_values()

        return DatabaseHost(database_config,
                            DatabaseAdminScriptRunner(database_config, host_controller),
                            FileSystem(host_controller),
                            host_controller.feedback)

    def upload_database_configuration(self):
        self.file_system.ensure_directory_exists(self.database_config.remote_config_values_home)
        self.file_system.upload_file(self.database_config.local_config_values_file, self.database_config.remote_config_values_home)

    def rename_existing_database(self):
        self.admin_script_runner.run("rename_existing_rsr_database.py")

    def create_empty_database(self):
        self.admin_script_runner.run("create_empty_rsr_database.py")
