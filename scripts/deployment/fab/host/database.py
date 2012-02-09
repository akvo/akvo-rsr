# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


from fab.config.rsr.database import RSRDatabaseConfig
from fab.database.mysql.admin import DatabaseAdmin
from fab.verifiers.config import RSRSettingsVerifier


class DatabaseHost(object):
    """DatabaseHost encapsulates database deployment actions"""

    def __init__(self, settings_verifier, database_config, database_admin):
        self.settings_verifier = settings_verifier
        self.database_config = database_config
        self.database_admin = database_admin

    @staticmethod
    def create_with(database_config, deployment_host_config, host_controller):
        return DatabaseHost(RSRSettingsVerifier.create_with(deployment_host_config, host_controller),
                            database_config,
                            DatabaseAdmin.create_with(database_config, deployment_host_config, host_controller))

    def backup_rsr_database(self):
        self._verify_database_configuration()
        self.database_admin.create_timestamped_backup_database(self.database_config.rsr_database)

    def rebuild_rsr_database(self):
        self._verify_database_configuration()
        self.database_admin.rebuild_database(self.database_config.rsr_database,
                                             self.database_config.rsr_user,
                                             self.database_config.rsr_password)

    def run_new_migrations(self):
        self._verify_database_configuration()
        self.database_admin.run_new_rsr_migrations()

    def _verify_database_configuration(self):
        self.settings_verifier.exit_if_local_rsr_settings_not_deployed()
        self.settings_verifier.exit_if_settings_have_mismatched_database_name()
