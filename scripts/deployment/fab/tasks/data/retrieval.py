# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


import fabric.tasks

import fab.config.rsr.credentials.database
import fab.config.rsr.credentials.reader
import fab.config.values.host
import fab.host.controller
import fab.host.dataretrieval


class FetchRSRData(fabric.tasks.Task):
    """Retrieves RSR data from a specified data server"""

    name = "fetch_rsr_data"

    def __init__(self, host_controller=fab.host.controller.RemoteHostController()):
        self.host_controller = host_controller

    def run(self):
        self._configure_data_retrieval_host().fetch_latest_data()

    def _configure_data_retrieval_host(self):
        credentials_reader = fab.config.rsr.credentials.reader.CredentialsFileReader.create_with(fab.config.values.host.DataHostPaths(), host_controller)
        database_credentials = fab.config.rsr.credentials.database.DatabaseCredentials.read_with(credentials_reader)

        return fab.host.dataretrieval.DataRetrievalHost.create_with(database_credentials)


instance = FetchRSRData()
