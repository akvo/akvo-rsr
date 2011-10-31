# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


from fab.database.mysql.connection import DatabaseConnection


class SQLStatementExecutor(object):

    def __init__(self, database_connection):
        self.database_connection = database_connection

    @staticmethod
    def for_admin():
        return SQLStatementExecutor(DatabaseConnection.for_admin_user())

    @staticmethod
    def for_database(database_name, database_connection=DatabaseConnection.for_admin_user()):
        statement_executor = SQLStatementExecutor(database_connection)
        statement_executor.use_database(database_name)

        return statement_executor

    def use_database(self, database_name):
        self.execute_statement("USE %s" % database_name)

    def execute_statement(self, statement_text):
        self._execute(statement_text)

    def scalar_query(self, scalar_query_text):
        return self.query(scalar_query_text)[0][0]

    def query(self, query_text):
        return self._execute(query_text).fetchall()

    def _execute(self, statement_text):
        cursor = self.database_connection.create_cursor()
        cursor.execute(statement_text)

        return cursor
