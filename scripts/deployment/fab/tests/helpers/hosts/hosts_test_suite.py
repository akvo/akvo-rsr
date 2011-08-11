#!/usr/bin/env python

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


from testing.helpers.execution import TestSuiteLoader, TestRunner

from fab.tests.helpers.hosts.database_host_test import DatabaseHostTest
from fab.tests.helpers.hosts.deployment_host_test import DeploymentHostTest
from fab.tests.helpers.hosts.neutral_host_test import NeutralHostTest
from fab.tests.helpers.hosts.remote_host_test import RemoteHostTest


def hosts_suite():
    return TestSuiteLoader().create_suite_from_classes([RemoteHostTest, NeutralHostTest, DatabaseHostTest, DeploymentHostTest])

if __name__ == "__main__":
    from fab.tests.test_settings import TEST_MODE
    TestRunner(TEST_MODE).run_test_suite(hosts_suite())
