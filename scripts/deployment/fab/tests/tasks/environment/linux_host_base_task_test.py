#!/usr/bin/env python

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


import mox

from testing.helpers.execution import TestRunner, TestSuiteLoader

from fab.config.loader import DeploymentConfigLoader
from fab.config.rsr.host import CIDeploymentHostConfig
from fab.config.spec import HostConfigSpecification
from fab.config.values.host import HostAlias
from fab.host.linux import LinuxHost
from fab.tasks.environment.hostbase import LinuxHostBaseTask


class LinuxHostBaseTaskTest(mox.MoxTestBase):

    def setUp(self):
        super(LinuxHostBaseTaskTest, self).setUp()
        self.mock_config_loader = self.mox.CreateMock(DeploymentConfigLoader)

        self.linux_host_base_task = LinuxHostBaseTask()
        self.linux_host_base_task.config_loader = self.mock_config_loader

    def test_can_configure_linux_host_with_given_host_config_specification(self):
        """fab.tests.tasks.environment.linux_host_base_task_test  Can configure Linux host with the given host configuration specification"""

        host_config_spec = HostConfigSpecification().create_preconfigured_with(HostAlias.TEST)

        self.mock_config_loader.parse(host_config_spec).AndReturn(CIDeploymentHostConfig.for_test())
        self.mox.ReplayAll()

        self.assertIsInstance(self.linux_host_base_task._configure_linux_host_with(host_config_spec), LinuxHost)


def suite():
    return TestSuiteLoader().load_tests_from(LinuxHostBaseTaskTest)

if __name__ == "__main__":
    from fab.tests.test_settings import TEST_MODE
    TestRunner(TEST_MODE).run_test_suite(suite())
