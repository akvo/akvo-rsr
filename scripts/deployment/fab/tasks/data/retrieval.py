# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


import fabric.tasks

import fab.host.dataretrieval


class FetchRSRData(fabric.tasks.Task):
    """Retrieves RSR data from a specified data server"""

    name = "fetch_rsr_data"

    def __init__(self, data_retrieval_host):
        self.data_retrieval_host = data_retrieval_host

    @staticmethod
    def create_task_instance():
        return FetchRSRData(fab.host.dataretrieval.DataRetrievalHost.create_instance())

    def run(self):
        self.data_retrieval_host.fetch_latest_data()


instance = FetchRSRData.create_task_instance()
