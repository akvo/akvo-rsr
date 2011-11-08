# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


from fab.config.rsr.database import RSRDatabaseConfig
from fab.database.mysql.command import DatabaseCopier, MySQLResponseData, SQLStatementExecutor
from fab.format.timestamp import TimeStampFormatter


class DatabaseAdmin(object):

    def __init__(self, statement_executor, database_copier, time_stamp_formatter, feedback):
        self.statement_executor = statement_executor
        self.database_copier = database_copier
        self.time_stamp_formatter = time_stamp_formatter
        self.feedback = feedback

    @staticmethod
    def create_instance(database_config, host_controller):
        return DatabaseAdmin(SQLStatementExecutor(database_config, host_controller),
                             DatabaseCopier(database_config, host_controller),
                             TimeStampFormatter(),
                             host_controller.feedback)

    def database_exists(self, database_name):
        database_search = self.statement_executor.execute_without_output(["SHOW DATABASES LIKE '%s'" % database_name])
        if database_search.contains(database_name):
            self.feedback.comment("Found database '%s'" % database_name)
        else:
            self.feedback.comment("Database '%s' does not exist" % database_name)

        return database_search.contains(database_name)

    def database_user_exists(self, user_name):
        sql_to_find_user = ["USE mysql", "SELECT User FROM user WHERE User = '%s'" % user_name]
        user_search = self.statement_executor.execute_without_output(sql_to_find_user)

        if user_search.contains(user_name):
            self.feedback.comment("Found user '%s'" % user_name)
        else:
            self.feedback.comment("User '%s' does not exist" % user_name)

        return user_search.contains(user_name)

    def create_timestamped_backup_database(self, database_name):
        if self.database_exists(database_name):
            duplicate_database_name = self.time_stamp_formatter.append_timestamp(database_name)
            self.create_empty_database(duplicate_database_name)
            self.database_copier.create_duplicate(database_name, duplicate_database_name)
        else:
            self.feedback.comment("No backup created for database: %s" % database_name)

    def create_empty_database(self, database_name):
        self.statement_executor.execute(["CREATE DATABASE %s DEFAULT CHARACTER SET UTF8" % database_name])

    def grant_all_database_permissions_for_user(self, database_user, database_name):
        self.statement_executor.execute(["GRANT ALL ON %s.* TO %s@localhost" % (database_name, database_user)])
