#!/usr/bin/env python

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


import mox

from testing.helpers.execution import TestRunner, TestSuiteLoader

from fab.config.rsr.credentials.reader import CredentialsFileReader
from fab.host.controller import RemoteHostController
from fab.host.dataretrieval import DataRetrievalHost
from fab.tasks.data.retrieval import FetchRSRData


class StubbedFetchRSRData(FetchRSRData):

    def __init__(self, host_controller, data_retrieval_host):
        super(StubbedFetchRSRData, self).__init__(host_controller)
        self.data_retrieval_host = data_retrieval_host

    def _configure_data_retrieval_host(self):
        return self.data_retrieval_host


class FetchRSRDataTest(mox.MoxTestBase):

    def setUp(self):
        super(FetchRSRDataTest, self).setUp()
        self.mock_host_controller = self.mox.CreateMock(RemoteHostController)
        self.mock_data_retrieval_host = self.mox.CreateMock(DataRetrievalHost)

        self.fetch_rsr_data_task = StubbedFetchRSRData(self.mock_host_controller, self.mock_data_retrieval_host)

    def test_has_expected_task_name(self):
        """fab.tests.tasks.data.fetch_rsr_data_test  Has expected task name"""

        self.assertEqual("fetch_rsr_data", FetchRSRData.name)

    def test_can_create_task_instance(self):
        """fab.tests.tasks.data.fetch_rsr_data_test  Can create task instance"""

        mock_host_controller = self.mox.CreateMock(RemoteHostController)

        self.assertIsInstance(FetchRSRData(mock_host_controller), FetchRSRData)

    def test_can_fetch_data_from_data_host(self):
        """fab.tests.tasks.data.fetch_rsr_data_test  Can fetch RSR data from the data host"""

        self.mock_data_retrieval_host.fetch_latest_data()
        self.mox.ReplayAll()

        self.fetch_rsr_data_task.run()


def suite():
    return TestSuiteLoader().load_tests_from(FetchRSRDataTest)

if __name__ == '__main__':
    TestRunner().run_test_suite(suite())
