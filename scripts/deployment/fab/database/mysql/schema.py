# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


from fab.database.mysql.connection import DatabaseConnection
from fab.database.mysql.statement import SQLStatementExecutor
from fab.database.mysql.table import TableQuery


class SchemaInformation(object):

    def __init__(self, database_connection=DatabaseConnection.for_admin_user()):
        self.statement_executor = SQLStatementExecutor.for_database("information_schema", database_connection)

    def database_exists(self, database_name):
        return TableQuery(self.statement_executor, "schemata").row_count_where("schema_name = '%s'" % database_name) > 0
