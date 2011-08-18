#!/usr/bin/env python

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


from testing.helpers.execution import TestSuiteLoader, TestRunner

from fab.tests.host.controller.host_controller_test_suite import host_controller_suite

from fab.tests.host.database_host_test import DatabaseHostTest
from fab.tests.host.neutral_host_test import NeutralHostTest


def host_suite():
    host_suite = TestSuiteLoader().create_suite_from_classes([NeutralHostTest, DatabaseHostTest])

    return TestSuiteLoader().create_suite_from_list([host_controller_suite(), host_suite])

if __name__ == "__main__":
    from fab.tests.test_settings import TEST_MODE
    TestRunner(TEST_MODE).run_test_suite(host_suite())
