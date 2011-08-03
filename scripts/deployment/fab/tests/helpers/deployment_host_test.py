#!/usr/bin/env python

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


import mox

from testing.helpers.execution import TestSuiteLoader, TestRunner

from fab.helpers.filesystem import FileSystem
from fab.helpers.hosts import DeploymentHost
from fab.helpers.virtualenv import VirtualEnv


class DeploymentHostTest(mox.MoxTestBase):

    def setUp(self):
        super(DeploymentHostTest, self).setUp()
        self.mock_file_system = self.mox.CreateMock(FileSystem)
        self.mock_virtualenv = self.mox.CreateMock(VirtualEnv)

        self.deployment_host = DeploymentHost(self.mock_file_system, self.mock_virtualenv)

    def test_can_create_a_deploymenthost_instance(self):
        """fab.tests.helpers.deployment_host_test  Can create a DeploymentHost instance"""

        DeploymentHost.create_instance("/some/virtualenv/path")

    def test_can_compress_directory(self):
        """fab.tests.helpers.deployment_host_test  Can compress directory"""

        expected_dir_to_compress = "/some/dir/to/compress"

        self.mock_file_system.compress_directory(expected_dir_to_compress)
        self.mox.ReplayAll()

        self.deployment_host.compress_directory(expected_dir_to_compress)

    def test_can_delete_file(self):
        """fab.tests.helpers.deployment_host_test  Can delete file"""

        expected_file_path = "/some/dir/file_to_delete.txt"

        self.mock_file_system.delete_file(expected_file_path)
        self.mox.ReplayAll()

        self.deployment_host.delete_file(expected_file_path)

    def test_can_delete_file_with_sudo(self):
        """fab.tests.helpers.deployment_host_test  Can delete file with sudo"""

        expected_file_path = "/some/dir/file_to_delete.txt"

        self.mock_file_system.delete_file_with_sudo(expected_file_path)
        self.mox.ReplayAll()

        self.deployment_host.delete_file_with_sudo(expected_file_path)

    def test_can_delete_directory(self):
        """fab.tests.helpers.deployment_host_test  Can delete directory"""

        expected_dir_to_delete = "/some/dir/to/delete"

        self.mock_file_system.delete_directory(expected_dir_to_delete)
        self.mox.ReplayAll()

        self.deployment_host.delete_directory(expected_dir_to_delete)

    def test_can_delete_directory_with_sudo(self):
        """fab.tests.helpers.deployment_host_test  Can delete directory with sudo"""

        expected_dir_to_delete = "/some/dir/to/delete"

        self.mock_file_system.delete_directory_with_sudo(expected_dir_to_delete)
        self.mox.ReplayAll()

        self.deployment_host.delete_directory_with_sudo(expected_dir_to_delete)

    def test_can_create_empty_virtualenv(self):
        """fab.tests.helpers.deployment_host_test  Can create empty virtualenv"""

        expected_pip_log_file = "/some/log/dir/pip_log.txt"

        self.mock_virtualenv.create_empty_virtualenv(expected_pip_log_file)
        self.mox.ReplayAll()

        self.deployment_host.create_empty_virtualenv(expected_pip_log_file)

    def test_can_install_virtualenv_packages(self):
        """fab.tests.helpers.deployment_host_test  Can install virtualenv packages"""

        expected_pip_requirements_file = "/some/pip/requirements.txt"
        expected_pip_log_file = "/some/log/dir/pip_log.txt"

        self.mock_virtualenv.install_packages(expected_pip_requirements_file, expected_pip_log_file)
        self.mox.ReplayAll()

        self.deployment_host.install_virtualenv_packages(expected_pip_requirements_file, expected_pip_log_file)

    def test_can_list_installed_virtualenv_packages(self):
        """fab.tests.helpers.deployment_host_test  Can create empty virtualenv"""

        self.mock_virtualenv.list_installed_virtualenv_packages()
        self.mox.ReplayAll()

        self.deployment_host.list_installed_virtualenv_packages()

    def test_can_run_command_within_virtualenv(self):
        """fab.tests.helpers.deployment_host_test  Can run command within virtualenv"""

        self.mock_virtualenv.run_within_virtualenv("some command")
        self.mox.ReplayAll()

        self.deployment_host.run_within_virtualenv("some command")


def suite():
    return TestSuiteLoader().load_tests_from(DeploymentHostTest)

if __name__ == "__main__":
    from fab.tests.test_settings import TEST_MODE
    TestRunner(TEST_MODE).run_test_suite(suite())
