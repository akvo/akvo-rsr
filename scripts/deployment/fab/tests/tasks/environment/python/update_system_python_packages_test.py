#!/usr/bin/env python

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


import mox

from testing.helpers.execution import TestSuiteLoader, TestRunner

from fab.host.linux import LinuxHost
from fab.tasks.environment.python.systempackages import UpdateSystemPythonPackages


class UpdateSystemPythonPackagesTest(mox.MoxTestBase):

    def setUp(self):
        super(UpdateSystemPythonPackagesTest, self).setUp()

        self.deployment_user = "rupaul"

    def test_has_expected_task_name(self):
        """fab.tests.tasks.environment.python.update_system_python_packages_test  Has expected task name"""

        self.assertEqual("update_system_python_packages", UpdateSystemPythonPackages.name)

    def test_can_create_task_instance(self):
        """fab.tests.tasks.environment.python.update_system_python_packages_test  Can create task instance"""

        self.assertIsInstance(UpdateSystemPythonPackages.create_task(), UpdateSystemPythonPackages)

    def test_can_update_system_python_packages(self):
        """fab.tests.tasks.environment.python.update_system_python_packages_test  Can update system python packages"""

        mock_linux_host = self.mox.CreateMock(LinuxHost)

        update_system_python_packages_task = UpdateSystemPythonPackages(self.deployment_user, mock_linux_host)

        mock_linux_host.ensure_user_has_required_deployment_permissions(self.deployment_user)
        mock_linux_host.update_system_python_packages()
        self.mox.ReplayAll()

        update_system_python_packages_task.run()


def suite():
    return TestSuiteLoader().load_tests_from(UpdateSystemPythonPackagesTest)

if __name__ == "__main__":
    from fab.tests.test_settings import TEST_MODE
    TestRunner(TEST_MODE).run_test_suite(suite())
