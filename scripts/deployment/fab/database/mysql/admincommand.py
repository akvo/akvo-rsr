# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


from fab.database.mysql.command import SQLStatementExecutor


class DatabaseAdminCommand(object):

    def __init__(self, statement_executor, feedback):
        self.statement_executor = statement_executor
        self.feedback = feedback

    @staticmethod
    def create_instance(database_config, host_controller):
        return DatabaseAdminCommand(SQLStatementExecutor(database_config, host_controller),
                                    host_controller.feedback)

    def database_exists(self, database_name):
        database_search = self.statement_executor.execute_without_output(["SHOW DATABASES LIKE '%s'" % database_name])
        database_found = database_search.contains(database_name)

        if database_found:
            self.feedback.comment("Found database '%s'" % database_name)
        else:
            self.feedback.comment("Database '%s' does not exist" % database_name)

        return database_found

    def user_exists(self, user_name):
        sql_to_find_user = ["USE mysql", "SELECT User FROM user WHERE User = '%s'" % user_name]
        user_found = self.statement_executor.execute_without_output(sql_to_find_user).contains(user_name)

        if user_found:
            self.feedback.comment("Found user '%s'" % user_name)
        else:
            self.feedback.comment("User '%s' does not exist" % user_name)

        return user_found

    def drop_database(self, database_name):
        self.statement_executor.execute(["DROP DATABASE %s" % database_name])

    def create_empty_database(self, database_name):
        self.statement_executor.execute(["CREATE DATABASE %s DEFAULT CHARACTER SET UTF8" % database_name])

    def create_user_account(self, user_name, password):
        sql_to_create_user = ["CREATE USER %s IDENTIFIED BY '%s'" % (user_name, password)]
        self.statement_executor.execute_without_output(sql_to_create_user)

    def grant_all_database_permissions_for_user(self, database_user, database_name):
        self.statement_executor.execute(["GRANT ALL ON %s.* TO %s@localhost" % (database_name, database_user)])
