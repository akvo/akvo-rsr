#!/usr/bin/env python

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


from testing.helpers.execution import TestSuiteLoader, TestRunner

from fab.tests.helpers.codebase_test import CodebaseTest
from fab.tests.helpers.data_retriever_test import DataRetrieverTest
from fab.tests.helpers.execution_feedback_test import ExecutionFeedbackTest
from fab.tests.helpers.file_system_test import FileSystemTest
from fab.tests.helpers.internet_test import InternetTest
from fab.tests.helpers.path_test import PathTest
from fab.tests.helpers.permissions_test import PermissionsTest
from fab.tests.helpers.virtualenv_test import VirtualEnvTest


def helpers_suite():
    return TestSuiteLoader().create_suite_from_classes([CodebaseTest, DataRetrieverTest, ExecutionFeedbackTest,
                                                        FileSystemTest, InternetTest, PathTest, PermissionsTest,
                                                        VirtualEnvTest])

if __name__ == "__main__":
    from fab.tests.test_settings import TEST_MODE
    TestRunner(TEST_MODE).run_test_suite(helpers_suite())
