#!/usr/bin/env python

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


import mox

from testing.helpers.execution import TestRunner, TestSuiteLoader

from fab.config.loader import ConfigType
from fab.config.rsr.host import DeploymentHostConfig
from fab.config.values.host import HostAlias
from fab.host.linux import LinuxHost
from fab.tasks.environment.hostbase import LinuxHostBaseTask


class StubbedLinuxHostBaseTask(LinuxHostBaseTask):

    def __init__(self, linux_host):
        super(StubbedLinuxHostBaseTask, self).__init__()
        self.linux_host = linux_host

    def _configure_linux_host_with(self, host_config):
        self.actual_host_config_used = host_config
        return self.linux_host


class LinuxHostBaseTaskTest(mox.MoxTestBase):

    def setUp(self):
        super(LinuxHostBaseTaskTest, self).setUp()

    def test_can_configure_linux_host_when_task_is_executed(self):
        """fab.tests.tasks.environment.linux_host_base_task_test  Can configure Linux host when task is executed"""

        mock_linux_host = self.mox.CreateMock(LinuxHost)

        linux_host_base_task = StubbedLinuxHostBaseTask(mock_linux_host)

        self.mox.ReplayAll()

        linux_host_base_task.run(ConfigType.PRECONFIGURED, HostAlias.TEST)
        self.assertIsInstance(linux_host_base_task.actual_host_config_used, DeploymentHostConfig)


def suite():
    return TestSuiteLoader().load_tests_from(LinuxHostBaseTaskTest)

if __name__ == "__main__":
    from fab.tests.test_settings import TEST_MODE
    TestRunner(TEST_MODE).run_test_suite(suite())
