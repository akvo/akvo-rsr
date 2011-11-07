# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


class DatabaseAdmin(object):

    def __init__(self, statement_executor, database_copier, time_stamp_formatter):
        self.statement_executor = statement_executor
        self.database_copier = database_copier
        self.time_stamp_formatter = time_stamp_formatter

    def create_timestamped_backup_database(self, database_name):
        self._copy_database(database_name, self.time_stamp_formatter.append_timestamp(database_name))

    def _copy_database(self, original_database_name, duplicate_database_name):
        self.create_empty_database(duplicate_database_name)
        self.database_copier.create_duplicate(original_database_name, duplicate_database_name)

    def create_empty_database(self, database_name):
        self.statement_executor.execute(["CREATE DATABASE %s DEFAULT CHARACTER SET UTF8" % database_name])

    def grant_all_database_permissions_for_user(self, database_user, database_name):
        self.statement_executor.execute(["GRANT ALL ON %s.* TO %s@localhost" % (database_name, database_user)])
