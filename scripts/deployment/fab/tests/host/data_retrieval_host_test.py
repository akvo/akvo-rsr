#!/usr/bin/env python

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


import mox

from testing.helpers.execution import TestRunner, TestSuiteLoader

from fab.config.rsr.data.retriever import RSRDataRetrieverConfig
from fab.config.values.host import DataHostPaths
from fab.data.retriever import RSRDataRetriever
from fab.helpers.feedback import ExecutionFeedback
from fab.host.controller import RemoteHostController
from fab.host.dataretrieval import DataRetrievalHost
from fab.tests.template.loader import TemplateLoader


class DataRetrievalHostTest(mox.MoxTestBase):

    def setUp(self):
        super(DataRetrievalHostTest, self).setUp()
        self.mock_data_retriever = self.mox.CreateMock(RSRDataRetriever)

        self.data_retrieval_host = DataRetrievalHost(self.mock_data_retriever)

    def test_can_create_instance_for_remote_host(self):
        """fab.tests.host.data_retrieval_host_test  Can create a DataRetrievalHost instance for a remote host"""

        mock_remote_host_controller = self.mox.CreateMock(RemoteHostController)
        mock_remote_host_controller.feedback = self.mox.CreateMock(ExecutionFeedback)
        mock_remote_host_controller.sudo('chmod a+w %s' % RSRDataRetrieverConfig(DataHostPaths()).rsr_log_file_path)
        self.mox.ReplayAll()

        self.assertIsInstance(DataRetrievalHost.create_with(TemplateLoader.load_database_credentials(), mock_remote_host_controller),
                              DataRetrievalHost)

    def test_can_fetch_data_from_host(self):
        """fab.tests.host.data_retrieval_host_test  Can fetch data from the host"""

        self.mock_data_retriever.fetch_data_from_database()
        self.mox.ReplayAll()

        self.data_retrieval_host.fetch_latest_data()


def suite():
    return TestSuiteLoader().load_tests_from(DataRetrievalHostTest)

if __name__ == '__main__':
    TestRunner().run_test_suite(suite())
