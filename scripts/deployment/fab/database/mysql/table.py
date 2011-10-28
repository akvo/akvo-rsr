# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

from fab.database.mysql.statement import SQLStatementExecutor


class TableQuery(object):

    def __init__(self, statement_executor, table_name):
        self.statement_executor = statement_executor
        self.table_name = table_name

    def row_count_where(self, condition):
        return self.statement_executor.scalar_query("SELECT COUNT(*) FROM %s WHERE %s" % (self.table_name, condition))
