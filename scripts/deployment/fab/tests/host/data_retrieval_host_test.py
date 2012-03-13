#!/usr/bin/env python

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


import mox

from testing.helpers.execution import TestRunner, TestSuiteLoader

import fab.tests.templates.database_credentials_template
from database_credentials import DatabaseCredentials

from fab.data.retriever import RSRDataRetriever
from fab.host.dataretrieval import DataRetrievalHost


class DataRetrievalHostTest(mox.MoxTestBase):

    def setUp(self):
        super(DataRetrievalHostTest, self).setUp()
        self.mock_data_retriever = self.mox.CreateMock(RSRDataRetriever)

        self.data_retrieval_host = DataRetrievalHost(self.mock_data_retriever)

    def test_can_create_instance(self):
        """fab.tests.host.data_retrieval_host_test  Can create a DataRetrievalHost instance"""

        self.assertIsInstance(DataRetrievalHost.create_with(DatabaseCredentials()), DataRetrievalHost)

    def test_can_fetch_data_from_host(self):
        """fab.tests.host.data_retrieval_host_test  Can fetch data from the host"""

        self.mock_data_retriever.fetch_data_from_database()
        self.mox.ReplayAll()

        self.data_retrieval_host.fetch_latest_data()


def suite():
    return TestSuiteLoader().load_tests_from(DataRetrievalHostTest)

if __name__ == '__main__':
    TestRunner().run_test_suite(suite())
