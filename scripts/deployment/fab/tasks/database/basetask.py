# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


import fab.config.rsr.credentials.database
import fab.config.rsr.credentials.reader
import fab.config.rsr.database
import fab.host.controller
import fab.host.database
import fab.tasks.base


class RSRDatabaseTask(fab.tasks.base.BaseDeploymentTask):
    """Base task for RSR database actions"""

    def run(self, host_controller_mode, host_config_specification):
        host_controller = fab.host.controller.HostController.create_from(host_controller_mode)
        host_config = self.config_loader.parse(host_config_specification)

        self._perform_database_actions_with(self._configure_database_host_with(host_controller, host_config))

    def _perform_database_actions_with(self, database_host):
        raise NotImplementedError('No database actions defined')

    def _configure_database_host_with(self, host_controller, host_config):
        credentials_reader = fab.config.rsr.credentials.reader.CredentialsFileReader.create_with(host_config.host_paths, host_controller)
        database_credentials = fab.config.rsr.credentials.database.DatabaseCredentials.read_with(credentials_reader)
        database_config = fab.config.rsr.database.RSRDatabaseConfig(database_credentials, host_config.rsr_database_name)

        return fab.host.database.DatabaseHost.create_with(database_config, host_config, host_controller)
