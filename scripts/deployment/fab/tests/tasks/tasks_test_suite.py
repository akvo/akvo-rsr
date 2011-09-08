#!/usr/bin/env python

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


from testing.helpers.execution import TestSuiteLoader, TestRunner

from fab.tests.tasks.deploy_rsr_code_test import DeployRSRCodeTest
from fab.tests.tasks.fetch_rsr_data_test import FetchRSRDataTest

from fab.tests.tasks.verify.linux.system_packages_test_suite import system_packages_suite
from fab.tests.tasks.virtualenv.virtualenv_test_suite import virtualenv_suite


def tasks_suite():
    tasks_suite = TestSuiteLoader().create_suite_from_classes([DeployRSRCodeTest, FetchRSRDataTest])

    return TestSuiteLoader().create_suite_from_list([system_packages_suite(), tasks_suite, virtualenv_suite()])

if __name__ == "__main__":
    from fab.tests.test_settings import TEST_MODE
    TestRunner(TEST_MODE).run_test_suite(tasks_suite())
