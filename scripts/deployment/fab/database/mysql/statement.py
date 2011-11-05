# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


class SQLStatementExecutor(object):

    def __init__(self, database_config, host_controller):
        self.admin_credentials = "--user=%s --password=%s" % (database_config.admin_user, database_config.admin_password)
        self.host_controller = host_controller

    def execute(self, statement_list):
        self.host_controller.run('mysql %s -e "%s"' % (self.admin_credentials, self._format_statements(statement_list)))

    def _format_statements(self, statement_list):
        return "; ".join(statement_list)
