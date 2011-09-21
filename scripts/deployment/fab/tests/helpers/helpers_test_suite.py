#!/usr/bin/env python

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


from testing.helpers.execution import TestSuiteLoader, TestRunner

from fab.tests.helpers.akvo_permissions_test import AkvoPermissionsTest
from fab.tests.helpers.data_retriever_test import DataRetrieverTest
from fab.tests.helpers.execution_feedback_test import ExecutionFeedbackTest
from fab.tests.helpers.internet_test import InternetTest


def helpers_suite():
    return TestSuiteLoader().create_suite_from_classes([ExecutionFeedbackTest, AkvoPermissionsTest,
                                                        InternetTest, DataRetrieverTest])

if __name__ == "__main__":
    from fab.tests.test_settings import TEST_MODE
    TestRunner(TEST_MODE).run_test_suite(helpers_suite())
