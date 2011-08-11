# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


import fabric.api
import fabric.tasks

import fab.config.dataretriever
import fab.helpers.dataretriever
import fab.helpers.hosts


class FetchRSRData(fabric.tasks.Task):
    """Retrieves RSR data from a specified data server"""

    name = "fetch_rsr_data"

    def __init__(self, data_retriever):
        self.data_retriever = data_retriever

    @staticmethod
    def create_task_instance():
        retriever_config = fab.config.dataretriever.DataRetrieverConfig(fabric.api.env.hosts)
        database_host = fab.helpers.hosts.DatabaseHost.create_instance(retriever_config.rsr_virtualenv_path)

        return FetchRSRData(fab.helpers.dataretriever.DataRetriever(retriever_config, database_host))

    def run(self):
        self.data_retriever.fetch_data_from_database()


instance = FetchRSRData.create_task_instance()
