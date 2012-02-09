# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


import fab.tasks.database.basetask


class RunNewDatabaseMigrations(fab.tasks.database.basetask.RSRDatabaseTask):
    """Runs any new database migrations since the last migration cycle"""

    name = 'run_new_database_migrations'

    def _perform_database_actions_with(self, database_host):
        database_host.run_new_migrations()


instance = RunNewDatabaseMigrations()
