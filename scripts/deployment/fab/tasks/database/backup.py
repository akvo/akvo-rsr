# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


import fabric.tasks

import fab.host.controller
import fab.host.database


class BackupRSRDatabase(fabric.tasks.Task):
    """Creates a duplicate RSR database"""

    name = "duplicate_rsr_database"

    def run(self, host_controller_mode):
        self._create_database_host_with(host_controller_mode).backup_existing_database()

    def _create_database_host_with(self, host_controller_mode):
        host_controller = fab.host.controller.HostController.create_from(host_controller_mode)

        return fab.host.database.DatabaseHost.create_instance(host_controller)


instance = BackupRSRDatabase()
