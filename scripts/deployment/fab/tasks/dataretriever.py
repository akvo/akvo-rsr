# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


import fabric.api
import fabric.tasks

import fab.config.dataretriever
import fab.helpers.dataretriever
import fab.helpers.feedback
import fab.helpers.filesystem
import fab.helpers.hosts
import fab.helpers.path
import fab.helpers.permissions
import fab.helpers.virtualenv


class FetchRSRData(fabric.tasks.Task):
    """Retrieves RSR data from a specified data server"""

    name = "fetch_rsr_data"

    def __init__(self, data_retriever):
        self.data_retriever = data_retriever

    def run(self):
        self.data_retriever.fetch_data_from_database()


def create_task_instance():
    retriever_config = fab.config.dataretriever.DataRetrieverConfig(fabric.api.env.hosts)
    database_host = fab.helpers.hosts.RemoteHost()
    feedback = fab.helpers.feedback.ExecutionFeedback()
    file_system = fab.helpers.filesystem.FileSystem(database_host, feedback)
    virtualenv = fab.helpers.virtualenv.VirtualEnv(retriever_config.rsr_virtualenv_path, database_host, file_system, feedback)
    permissions = fab.helpers.permissions.Permissions(retriever_config, database_host, feedback)
    path = fab.helpers.path.Path(database_host, permissions, feedback)
    data_retriever = fab.helpers.dataretriever.DataRetriever(retriever_config, database_host, virtualenv, path, file_system, feedback)

    return FetchRSRData(data_retriever)


instance = create_task_instance()
