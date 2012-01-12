# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


import fab.tasks.database.basetask


class RebuildRSRDatabase(fab.tasks.database.basetask.RSRDatabaseTask):
    """Rebuilds the RSR database"""

    name = "rebuild_rsr_database"

    def run(self, host_controller_mode):
        super(RebuildRSRDatabase, self).run(host_controller_mode)
        self.database_host.backup_rsr_database()
        self.database_host.rebuild_rsr_database()


instance = RebuildRSRDatabase()
