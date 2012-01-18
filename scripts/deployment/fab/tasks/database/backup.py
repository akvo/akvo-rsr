# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


import fab.config.loaders
import fab.tasks.database.basetask


class BackupRSRDatabase(fab.tasks.database.basetask.RSRDatabaseTask):
    """Creates a backup of the RSR database"""

    name = "backup_rsr_database"

    @staticmethod
    def create_task():
        return BackupRSRDatabase(fab.config.loaders.DeploymentConfigLoader.load())

    def run(self, host_controller_mode):
        super(BackupRSRDatabase, self).run(host_controller_mode)
        self.database_host.backup_rsr_database()


instance = BackupRSRDatabase.create_task()
