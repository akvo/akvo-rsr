#!/usr/bin/env python

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


import mox

from testing.helpers.execution import TestRunner, TestSuiteLoader

from fab.config.rsr.credentials.user import UserCredentials
from fab.config.spec import HostConfigSpecification
from fab.config.values.host import HostAlias
from fab.host.linux import LinuxHost
from fab.tasks.environment.python.installer import InstallPython


class StubbedInstallPython(InstallPython):

    def __init__(self, linux_host):
        super(StubbedInstallPython, self).__init__()
        self.linux_host = linux_host

    def _configure_linux_host_with(self, host_config_specification):
        return self.linux_host


class InstallPythonTest(mox.MoxTestBase):

    def setUp(self):
        super(InstallPythonTest, self).setUp()

    def test_has_expected_task_name(self):
        """fab.tests.tasks.environment.python.install_python_test  Has expected task name"""

        self.assertEqual('install_python', InstallPython.name)

    def test_can_install_specified_python_version(self):
        """fab.tests.tasks.environment.python.install_python_test  Can install specified python version"""

        mock_linux_host = self.mox.CreateMock(LinuxHost)

        install_python_task = StubbedInstallPython(mock_linux_host)

        mock_linux_host.ensure_user_has_required_deployment_permissions(UserCredentials.CURRENT_USER)
        mock_linux_host.ensure_python_is_installed_with_version('2.7.2')
        self.mox.ReplayAll()

        install_python_task.run('2.7.2', HostConfigSpecification().create_preconfigured_with(HostAlias.TEST))


def suite():
    return TestSuiteLoader().load_tests_from(InstallPythonTest)

if __name__ == "__main__":
    from fab.tests.test_settings import TEST_MODE
    TestRunner(TEST_MODE).run_test_suite(suite())
