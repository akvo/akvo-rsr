#!/usr/bin/env python

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


from testing.helpers.execution import TestSuiteLoader, TestRunner

from fab.tests.host.database_host_test import DatabaseHostTest
from fab.tests.host.deployment_host_test import DeploymentHostTest
from fab.tests.host.host_controller_mode_test import HostControllerModeTest
from fab.tests.host.host_controller_test import HostControllerTest
from fab.tests.host.linux_host_test import LinuxHostTest
from fab.tests.host.local_host_controller_test import LocalHostControllerTest
from fab.tests.host.neutral_host_test import NeutralHostTest
from fab.tests.host.remote_host_controller_test import RemoteHostControllerTest
from fab.tests.host.virtualenv_deployment_host_test import VirtualEnvDeploymentHostTest


def host_suite():
    return TestSuiteLoader().create_suite_from_classes([HostControllerModeTest, HostControllerTest,
                                                        LocalHostControllerTest, RemoteHostControllerTest,
                                                        LinuxHostTest, NeutralHostTest, DatabaseHostTest,
                                                        DeploymentHostTest, VirtualEnvDeploymentHostTest])

if __name__ == "__main__":
    from fab.tests.test_settings import TEST_MODE
    TestRunner(TEST_MODE).run_test_suite(host_suite())
