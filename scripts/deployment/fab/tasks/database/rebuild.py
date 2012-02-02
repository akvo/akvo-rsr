# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


import fab.tasks.database.basetask


class RebuildRSRDatabase(fab.tasks.database.basetask.RSRDatabaseTask):
    """Rebuilds the RSR database"""

    name = 'rebuild_rsr_database'

    def _perform_database_actions_with(self, database_host):
        database_host.backup_rsr_database()
        database_host.rebuild_rsr_database()


instance = RebuildRSRDatabase()
