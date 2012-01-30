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
from fab.tasks.environment.python.systempackages import UpdateSystemPythonPackages


class StubbedUpdateSystemPythonPackages(UpdateSystemPythonPackages):

    def __init__(self, linux_host):
        super(StubbedUpdateSystemPythonPackages, self).__init__()
        self.linux_host = linux_host

    def _configure_linux_host_with(self, host_config_specification):
        return self.linux_host



class UpdateSystemPythonPackagesTest(mox.MoxTestBase):

    def setUp(self):
        super(UpdateSystemPythonPackagesTest, self).setUp()

    def test_has_expected_task_name(self):
        """fab.tests.tasks.environment.python.update_system_python_packages_test  Has expected task name"""

        self.assertEqual('update_system_python_packages', UpdateSystemPythonPackages.name)

    def test_can_update_system_python_packages(self):
        """fab.tests.tasks.environment.python.update_system_python_packages_test  Can update system python packages"""

        mock_linux_host = self.mox.CreateMock(LinuxHost)

        update_system_python_packages_task = StubbedUpdateSystemPythonPackages(mock_linux_host)

        mock_linux_host.ensure_user_has_required_deployment_permissions(UserCredentials.CURRENT_USER)
        mock_linux_host.update_system_python_packages()
        self.mox.ReplayAll()

        update_system_python_packages_task.run(HostConfigSpecification().create_preconfigured_with(HostAlias.TEST))


def suite():
    return TestSuiteLoader().load_tests_from(UpdateSystemPythonPackagesTest)

if __name__ == "__main__":
    from fab.tests.test_settings import TEST_MODE
    TestRunner(TEST_MODE).run_test_suite(suite())
