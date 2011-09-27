#!/usr/bin/env python

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


from testing.helpers.execution import TestSuiteLoader, TestRunner

from fab.tests.os.akvo_permissions_test import suite as permissions_suite
from fab.tests.os.file_system_test import suite as file_system_suite
from fab.tests.os.linux.linux_test_suite import linux_suite


def os_suite():
    return TestSuiteLoader().create_suite_from_list([linux_suite(), file_system_suite(), permissions_suite()])

if __name__ == "__main__":
    from fab.tests.test_settings import TEST_MODE
    TestRunner(TEST_MODE).run_test_suite(os_suite())
