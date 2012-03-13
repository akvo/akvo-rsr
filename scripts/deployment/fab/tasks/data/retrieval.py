# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


import fabric.tasks

import fab.config.rsr.credentials.database
import fab.host.dataretrieval
import fab.verifiers.config


class FetchRSRData(fabric.tasks.Task):
    """Retrieves RSR data from a specified data server"""

    name = "fetch_rsr_data"

    def __init__(self, config_file_verifier=fab.verifiers.config.ConfigFileVerifier()):
        self.config_file_verifier = config_file_verifier

    def run(self):
        self.config_file_verifier.exit_if_database_credentials_not_found()
        self.data_retrieval_host = self._configure_data_retrieval_host()
        self.data_retrieval_host.fetch_latest_data()

    def _configure_data_retrieval_host(self):
        database_credentials = fab.config.rsr.credentials.database.DatabaseCredentials()
        return fab.host.dataretrieval.DataRetrievalHost.create_with(database_credentials)


instance = FetchRSRData()
