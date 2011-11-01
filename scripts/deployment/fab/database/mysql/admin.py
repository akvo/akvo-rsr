# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


from fab.database.mysql.schema import SchemaInformation
from fab.database.mysql.statement import SQLStatementExecutor


class DatabaseAdmin(object):

    def __init__(self, database_connection):
        self.database_connection = database_connection

    def database_exists(self, database_name):
        return self._create_schema_information().database_exists(database_name)

    def create_empty_database(self, database_name):
        self._create_statement_executor().execute_statement("CREATE DATABASE %s DEFAULT CHARACTER SET UTF8" % database_name)

    def grant_all_database_permissions_for_user(self, database_user, database_name):
        self._create_statement_executor().execute_statement("GRANT ALL ON %s.* TO %s@localhost" % (database_name, database_user))

    def _create_schema_information(self):
        return SchemaInformation(self.database_connection)

    def _create_statement_executor(self):
        return SQLStatementExecutor(self.database_connection)