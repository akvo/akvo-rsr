#!/usr/bin/env python

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


import mox

from testing.helpers.execution import TestSuiteLoader, TestRunner

from fab.data.retriever import RSRDataRetriever
from fab.host.dataretrieval import DataRetrievalHost


class DataRetrievalHostTest(mox.MoxTestBase):

    def setUp(self):
        super(DataRetrievalHostTest, self).setUp()
        self.mock_data_retriever = self.mox.CreateMock(RSRDataRetriever)

        self.data_retrieval_host = DataRetrievalHost(self.mock_data_retriever)

    def test_can_create_instance(self):
        """fab.tests.host.data_retrieval_host_test  Can create a DataRetrievalHost instance"""

        self.assertIsInstance(DataRetrievalHost.create(), DataRetrievalHost)

    def test_can_record_last_applied_migration(self):
        """fab.tests.host.data_retrieval_host_test  Can record the last applied database migration number"""

        self.mock_data_retriever.record_last_applied_migration()
        self.mox.ReplayAll()

        self.data_retrieval_host.record_last_applied_migration()

    def test_can_fetch_data_from_host(self):
        """fab.tests.host.data_retrieval_host_test  Can fetch data from the host"""

        self.mock_data_retriever.fetch_data_from_database()
        self.mox.ReplayAll()

        self.data_retrieval_host.fetch_latest_data()


def suite():
    return TestSuiteLoader().load_tests_from(DataRetrievalHostTest)

if __name__ == "__main__":
    from fab.tests.test_settings import TEST_MODE
    TestRunner(TEST_MODE).run_test_suite(suite())
