# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


import fabric.tasks

import fab.config.rsr.credentials
import fab.config.rsr.database
import fab.host.controller
import fab.host.database


class RSRDatabaseTask(fabric.tasks.Task):
    """Base task for RSR database actions"""

    def __init__(self, deployment_host_config, database_credentials=fab.config.rsr.credentials.DatabaseCredentials()):
        self.database_config = fab.config.rsr.database.RSRDatabaseConfig(database_credentials, deployment_host_config)
        self.deployment_host_config = deployment_host_config

    def run(self, host_controller_mode):
        self.database_host = self._create_database_host(host_controller_mode)

    def _create_database_host(self, host_controller_mode):
        return fab.host.database.DatabaseHost.create_with(self.database_config,
                                                          self.deployment_host_config,
                                                          fab.host.controller.HostController.create_from(host_controller_mode))
