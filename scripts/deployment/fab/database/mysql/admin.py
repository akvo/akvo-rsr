# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


from fab.config.rsr.database import RSRDatabaseConfig
from fab.data.populator import RSRDataPopulator
from fab.database.mysql.admincommand import DatabaseAdminCommand
from fab.database.mysql.commandexecution import DatabaseCopier, SQLStatementExecutor
from fab.format.timestamp import TimeStampFormatter


class DatabaseAdmin(object):

    def __init__(self, admin_command, database_copier, data_populator, time_stamp_formatter, feedback):
        self.admin_command = admin_command
        self.database_copier = database_copier
        self.data_populator = data_populator
        self.time_stamp_formatter = time_stamp_formatter
        self.feedback = feedback

    @staticmethod
    def create_with(database_config, deployment_host_config, host_controller):
        return DatabaseAdmin(DatabaseAdminCommand.create_with(database_config, host_controller),
                             DatabaseCopier(database_config, host_controller),
                             RSRDataPopulator.create_with(deployment_host_config, host_controller),
                             TimeStampFormatter(),
                             host_controller.feedback)

    def create_timestamped_backup_database(self, database_name):
        if self.admin_command.database_exists(database_name):
            duplicate_database_name = self.time_stamp_formatter.append_timestamp(database_name)
            self.admin_command.create_empty_database(duplicate_database_name)
            self.database_copier.create_duplicate(database_name, duplicate_database_name)
        else:
            self.feedback.comment("No backup required for database: %s" % database_name)

    def rebuild_database(self, database_name, user_name, password):
        self._create_empty_database(database_name)
        self._grant_all_permissions_for_user(database_name, user_name, password)
        self.data_populator.initialise_database()
        self.data_populator.populate_database()

    def _create_empty_database(self, database_name):
        self.feedback.comment("Creating empty database '%s'" % database_name)
        if self.admin_command.database_exists(database_name):
            self.admin_command.drop_database(database_name)

        self.admin_command.create_empty_database(database_name)

    def _grant_all_permissions_for_user(self, database_name, user_name, password):
        self.feedback.comment("Granting all database permissions to user '%s'" % user_name)
        if not self.admin_command.user_exists(user_name):
            self.admin_command.create_user_account(user_name, password)

        self.admin_command.grant_all_database_permissions_for_user(user_name, database_name)

    def run_all_migrations(self):
        self.data_populator.run_all_migrations()
