#!/usr/bin/env python

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


import mox

from testing.helpers.execution import TestSuiteLoader, TestRunner

from fab.environment.python.virtualenv import VirtualEnv
from fab.helpers.feedback import ExecutionFeedback
from fab.host.controller import LocalHostController, RemoteHostController
from fab.host.virtualenv import VirtualEnvHost
from fab.os.filesystem import FileSystem


class VirtualEnvHostTest(mox.MoxTestBase):

    def setUp(self):
        super(VirtualEnvHostTest, self).setUp()
        self.mock_file_system = self.mox.CreateMock(FileSystem)
        self.mock_virtualenv = self.mox.CreateMock(VirtualEnv)

        # we don't have any additional expections on the AkvoPermission, Internet and ExecutionFeedback
        # dependencies (since those are already tested in the DeploymentHost base class) so we set these
        # to None for now
        self.virtualenv_host = VirtualEnvHost(self.mock_file_system, None, None, self.mock_virtualenv, None)

    def test_can_create_a_remote_virtualenvhost_instance(self):
        """fab.tests.host.virtualenv_host_test  Can create a remote VirtualEnvHost instance"""

        host_instance = self._create_virtualenvhost_instance_with(RemoteHostController)

        self.assertIsInstance(host_instance, VirtualEnvHost)

    def test_can_create_a_local_virtualenvhost_instance(self):
        """fab.tests.host.virtualenv_host_test  Can create a local VirtualEnvHost instance"""

        host_instance = self._create_virtualenvhost_instance_with(LocalHostController)

        self.assertIsInstance(host_instance, VirtualEnvHost)

    def _create_virtualenvhost_instance_with(self, host_controller_class):
        mock_host_controller = self.mox.CreateMock(host_controller_class)
        mock_host_controller.feedback = self.mox.CreateMock(ExecutionFeedback)

        self.mox.ReplayAll()

        return VirtualEnvHost.create_instance("/some/virtualenv/path", mock_host_controller)

    def test_can_create_empty_virtualenv(self):
        """fab.tests.host.virtualenv_host_test  Can create empty virtualenv"""

        expected_pip_log_file = "/some/log/dir/pip_log.txt"

        self.mock_virtualenv.create_empty_virtualenv(expected_pip_log_file)
        self.mox.ReplayAll()

        self.virtualenv_host.create_empty_virtualenv(expected_pip_log_file)

    def test_can_ensure_virtualenv_exists(self):
        """fab.tests.host.virtualenv_host_test  Can ensure virtualenv exists"""

        expected_pip_log_file = "/some/log/dir/pip_log.txt"

        self.mock_virtualenv.ensure_virtualenv_exists(expected_pip_log_file)
        self.mox.ReplayAll()

        self.virtualenv_host.ensure_virtualenv_exists(expected_pip_log_file)

    def test_can_install_virtualenv_packages(self):
        """fab.tests.host.virtualenv_host_test  Can install virtualenv packages"""

        expected_pip_requirements_file = "/some/pip/requirements.txt"
        expected_pip_log_file = "/some/log/dir/pip_log.txt"

        self.mock_virtualenv.install_packages(expected_pip_requirements_file, expected_pip_log_file)
        self.mox.ReplayAll()

        self.virtualenv_host.install_virtualenv_packages(expected_pip_requirements_file, expected_pip_log_file)

    def test_can_list_installed_virtualenv_packages(self):
        """fab.tests.host.virtualenv_host_test  Can create empty virtualenv"""

        self.mock_virtualenv.list_installed_virtualenv_packages()
        self.mox.ReplayAll()

        self.virtualenv_host.list_installed_virtualenv_packages()

    def test_can_run_command_within_virtualenv(self):
        """fab.tests.host.virtualenv_host_test  Can run command within virtualenv"""

        self.mock_virtualenv.run_within_virtualenv("some command")
        self.mox.ReplayAll()

        self.virtualenv_host.run_within_virtualenv("some command")


def suite():
    return TestSuiteLoader().load_tests_from(VirtualEnvHostTest)

if __name__ == "__main__":
    from fab.tests.test_settings import TEST_MODE
    TestRunner(TEST_MODE).run_test_suite(suite())
