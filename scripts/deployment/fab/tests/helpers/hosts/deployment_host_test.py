#!/usr/bin/env python

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


import mox

from testing.helpers.execution import TestSuiteLoader, TestRunner

from fab.helpers.filesystem import FileSystem
from fab.helpers.hosts import DeploymentHost
from fab.helpers.permissions import AkvoPermissions
from fab.helpers.virtualenv import VirtualEnv


class DeploymentHostTest(mox.MoxTestBase):

    def setUp(self):
        super(DeploymentHostTest, self).setUp()
        self.mock_file_system = self.mox.CreateMock(FileSystem)
        self.mock_permissions = self.mox.CreateMock(AkvoPermissions)
        self.mock_virtualenv = self.mox.CreateMock(VirtualEnv)

        self.deployment_host = DeploymentHost(self.mock_file_system, self.mock_permissions, self.mock_virtualenv)

    def test_can_create_a_deploymenthost_instance(self):
        """fab.tests.helpers.hosts.deployment_host_test  Can create a DeploymentHost instance"""

        self.assertTrue(isinstance(DeploymentHost.create_instance("/some/virtualenv/path"), DeploymentHost))

    def test_can_create_directory(self):
        """fab.tests.helpers.hosts.deployment_host_test  Can create a directory"""

        new_dir = "/var/new/dir"

        self.mock_file_system.create_directory(new_dir)
        self.mox.ReplayAll()

        self.deployment_host.create_directory(new_dir)

    def test_can_create_directory_with_sudo(self):
        """fab.tests.helpers.hosts.deployment_host_test  Can create a directory with sudo"""

        new_dir = "/var/new/dir"

        self.mock_file_system.create_directory_with_sudo(new_dir)
        self.mox.ReplayAll()

        self.deployment_host.create_directory_with_sudo(new_dir)

    def test_can_ensure_directory_exists(self):
        """fab.tests.helpers.hosts.deployment_host_test  Can ensure a directory exists"""

        new_dir = "/var/new/dir"

        self.mock_file_system.ensure_directory_exists(new_dir)
        self.mox.ReplayAll()

        self.deployment_host.ensure_directory_exists(new_dir)

    def test_can_ensure_directory_exists_with_sudo(self):
        """fab.tests.helpers.hosts.deployment_host_test  Can ensure a directory exists with sudo"""

        new_dir = "/var/new/dir"

        self.mock_file_system.ensure_directory_exists_with_sudo(new_dir)
        self.mox.ReplayAll()

        self.deployment_host.ensure_directory_exists_with_sudo(new_dir)

    def test_can_delete_file(self):
        """fab.tests.helpers.hosts.deployment_host_test  Can delete a file"""

        expected_file_path = "/some/dir/file_to_delete.txt"

        self.mock_file_system.delete_file(expected_file_path)
        self.mox.ReplayAll()

        self.deployment_host.delete_file(expected_file_path)

    def test_can_delete_file_with_sudo(self):
        """fab.tests.helpers.hosts.deployment_host_test  Can delete a file with sudo"""

        expected_file_path = "/some/dir/file_to_delete.txt"

        self.mock_file_system.delete_file_with_sudo(expected_file_path)
        self.mox.ReplayAll()

        self.deployment_host.delete_file_with_sudo(expected_file_path)

    def test_can_delete_directory(self):
        """fab.tests.helpers.hosts.deployment_host_test  Can delete a directory"""

        expected_dir_to_delete = "/some/dir/to/delete"

        self.mock_file_system.delete_directory(expected_dir_to_delete)
        self.mox.ReplayAll()

        self.deployment_host.delete_directory(expected_dir_to_delete)

    def test_can_delete_directory_with_sudo(self):
        """fab.tests.helpers.hosts.deployment_host_test  Can delete a directory with sudo"""

        expected_dir_to_delete = "/some/dir/to/delete"

        self.mock_file_system.delete_directory_with_sudo(expected_dir_to_delete)
        self.mox.ReplayAll()

        self.deployment_host.delete_directory_with_sudo(expected_dir_to_delete)

    def test_can_compress_directory(self):
        """fab.tests.helpers.hosts.deployment_host_test  Can compress a directory"""

        expected_dir_to_compress = "/some/dir/to/compress"

        self.mock_file_system.compress_directory(expected_dir_to_compress)
        self.mox.ReplayAll()

        self.deployment_host.compress_directory(expected_dir_to_compress)

    def test_can_ensure_user_is_member_of_web_group(self):
        """fab.tests.helpers.hosts.deployment_host_test  Can ensure user is a member of the web user group"""

        self.mock_permissions.ensure_user_is_member_of_web_group("joesoap")
        self.mox.ReplayAll()

        self.deployment_host.ensure_user_is_member_of_web_group("joesoap")

    def test_can_set_web_group_permissions_on_specified_directory(self):
        """fab.tests.helpers.hosts.deployment_host_test  Can set web user group permissions on a specified directory"""

        self.mock_permissions.set_web_group_permissions_on_directory("/some/web/dir")
        self.mox.ReplayAll()

        self.deployment_host.set_web_group_permissions_on_directory("/some/web/dir")

    def test_can_set_web_group_ownership_on_specified_directory(self):
        """fab.tests.helpers.hosts.deployment_host_test  Can set web user group ownership on a specified directory"""

        self.mock_permissions.set_web_group_ownership_on_directory("/some/web/dir")
        self.mox.ReplayAll()

        self.deployment_host.set_web_group_ownership_on_directory("/some/web/dir")

    def test_can_ensure_directory_exists_with_web_group_permissions(self):
        """fab.tests.helpers.hosts.deployment_host_test  Can ensure directory exists with web user group permissions"""

        web_dir = "/some/web/dir"
        self.mock_file_system.ensure_directory_exists_with_sudo(web_dir)
        self.mock_permissions.set_web_group_permissions_on_directory(web_dir)
        self.mox.ReplayAll()

        self.deployment_host.ensure_directory_exists_with_web_group_permissions(web_dir)

    def test_can_create_empty_virtualenv(self):
        """fab.tests.helpers.hosts.deployment_host_test  Can create empty virtualenv"""

        expected_pip_log_file = "/some/log/dir/pip_log.txt"

        self.mock_virtualenv.create_empty_virtualenv(expected_pip_log_file)
        self.mox.ReplayAll()

        self.deployment_host.create_empty_virtualenv(expected_pip_log_file)

    def test_can_install_virtualenv_packages(self):
        """fab.tests.helpers.hosts.deployment_host_test  Can install virtualenv packages"""

        expected_pip_requirements_file = "/some/pip/requirements.txt"
        expected_pip_log_file = "/some/log/dir/pip_log.txt"

        self.mock_virtualenv.install_packages(expected_pip_requirements_file, expected_pip_log_file)
        self.mox.ReplayAll()

        self.deployment_host.install_virtualenv_packages(expected_pip_requirements_file, expected_pip_log_file)

    def test_can_list_installed_virtualenv_packages(self):
        """fab.tests.helpers.hosts.deployment_host_test  Can create empty virtualenv"""

        self.mock_virtualenv.list_installed_virtualenv_packages()
        self.mox.ReplayAll()

        self.deployment_host.list_installed_virtualenv_packages()

    def test_can_run_command_within_virtualenv(self):
        """fab.tests.helpers.hosts.deployment_host_test  Can run command within virtualenv"""

        self.mock_virtualenv.run_within_virtualenv("some command")
        self.mox.ReplayAll()

        self.deployment_host.run_within_virtualenv("some command")


def suite():
    return TestSuiteLoader().load_tests_from(DeploymentHostTest)

if __name__ == "__main__":
    from fab.tests.test_settings import TEST_MODE
    TestRunner(TEST_MODE).run_test_suite(suite())
