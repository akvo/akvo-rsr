#!/usr/bin/env python

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


import mox

from testing.helpers.execution import TestSuiteLoader, TestRunner

from fab.config.rsr.virtualenv import RSRVirtualEnvConfig
from fab.environment.python.virtualenv import VirtualEnv
from fab.helpers.feedback import ExecutionFeedback
from fab.host.controller import LocalHostController, RemoteHostController
from fab.host.virtualenv import VirtualEnvHost
from fab.os.filesystem import FileSystem


class VirtualEnvHostTest(mox.MoxTestBase):

    def setUp(self):
        super(VirtualEnvHostTest, self).setUp()
        self.mock_virtualenv_config = self.mox.CreateMock(RSRVirtualEnvConfig)
        self.mock_file_system = self.mox.CreateMock(FileSystem)
        self.mock_virtualenv = self.mox.CreateMock(VirtualEnv)
        self.mock_feedback = self.mox.CreateMock(ExecutionFeedback)

        # we don't have any additional expections on the AkvoPermission and Internet dependencies (since
        # those are already tested in the DeploymentHost base class) so we set these to None for now
        self.virtualenv_host = VirtualEnvHost(self.mock_virtualenv_config, self.mock_file_system,
                                              None, None, self.mock_virtualenv, self.mock_feedback)

    def test_can_create_a_remote_virtualenvhost_instance(self):
        """fab.tests.host.virtualenv_host_test  Can create a remote VirtualEnvHost instance"""

        host_instance = self._create_virtualenvhost_instance_with(RemoteHostController)

        self.assertIsInstance(host_instance, VirtualEnvHost)

    def test_can_create_a_local_virtualenvhost_instance(self):
        """fab.tests.host.virtualenv_host_test  Can create a local VirtualEnvHost instance"""

        host_instance = self._create_virtualenvhost_instance_with(LocalHostController)

        self.assertIsInstance(host_instance, VirtualEnvHost)

    def _create_virtualenvhost_instance_with(self, host_controller_class):
        mock_virtualenv_config = self.mox.CreateMock(RSRVirtualEnvConfig)
        mock_virtualenv_config.rsr_env_path = "/some/path/to/virtualenvs/rsr"
        mock_host_controller = self.mox.CreateMock(host_controller_class)
        mock_host_controller.feedback = self.mox.CreateMock(ExecutionFeedback)

        self.mox.ReplayAll()

        return VirtualEnvHost.create_instance(mock_virtualenv_config, mock_host_controller)

    def test_can_create_empty_virtualenv(self):
        """fab.tests.host.virtualenv_host_test  Can create empty virtualenv"""

        self._set_expectations_to_ensure_virtualenvs_home_exists()
        self.mock_virtualenv.create_empty_virtualenv()
        self.mox.ReplayAll()

        self.virtualenv_host.create_empty_virtualenv()

    def test_can_ensure_virtualenv_exists(self):
        """fab.tests.host.virtualenv_host_test  Can ensure virtualenv exists"""

        self._set_expectations_to_ensure_virtualenvs_home_exists()
        self.mock_virtualenv.ensure_virtualenv_exists()
        self.mox.ReplayAll()

        self.virtualenv_host.ensure_virtualenv_exists()

    def _set_expectations_to_ensure_virtualenvs_home_exists(self):
        virtualenvs_home = "/var/virtualenvs"

        self.mock_virtualenv_config.virtualenvs_home = virtualenvs_home
        self.mock_file_system.directory_exists(virtualenvs_home).AndReturn(True)
        self.mock_feedback.comment("Found expected directory: %s" % virtualenvs_home)

    def test_can_install_virtualenv_packages(self):
        """fab.tests.host.virtualenv_host_test  Can install virtualenv packages"""

        expected_pip_requirements_file = "/some/pip/requirements.txt"

        self.mock_virtualenv.install_packages(expected_pip_requirements_file)
        self.mox.ReplayAll()

        self.virtualenv_host.install_virtualenv_packages(expected_pip_requirements_file)

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
