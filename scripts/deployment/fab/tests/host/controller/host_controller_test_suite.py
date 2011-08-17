#!/usr/bin/env python

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


from testing.helpers.execution import TestSuiteLoader, TestRunner

from fab.tests.host.controller.local_host_controller_test import LocalHostControllerTest
from fab.tests.host.controller.remote_host_controller_test import RemoteHostControllerTest


def host_controller_suite():
    return TestSuiteLoader().create_suite_from_classes([LocalHostControllerTest, RemoteHostControllerTest])

if __name__ == "__main__":
    from fab.tests.test_settings import TEST_MODE
    TestRunner(TEST_MODE).run_test_suite(host_controller_suite())
