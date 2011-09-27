# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


from fab.data.retriever import RSRDataRetriever
from fab.host.controller import RemoteHostController


class DatabaseHost(object):
    """DatabaseHost encapsulates common actions available when retrieving data from a remote database host"""

    def __init__(self, data_retriever):
        self.data_retriever = data_retriever

    @staticmethod
    def create_instance():
        return DatabaseHost(RSRDataRetriever.create_instance(RemoteHostController.create_instance()))

    def fetch_latest_data(self):
        self.data_retriever.fetch_data_from_database()
