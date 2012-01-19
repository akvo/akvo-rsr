#!/usr/bin/env python

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


import mox, os

from testing.helpers.execution import TestSuiteLoader, TestRunner

from fab.config.rsr.virtualenv import RSRVirtualEnvInstallerConfig
from fab.config.values.standard import CIDeploymentHostConfig
from fab.environment.python.virtualenv import VirtualEnvInstaller
from fab.helpers.feedback import ExecutionFeedback
from fab.host.controller import LocalHostController, RemoteHostController
from fab.host.virtualenv import VirtualEnvDeploymentHost
from fab.os.filesystem import FileSystem
from fab.os.permissions import AkvoPermissions
from fab.verifiers.user import DeploymentUserVerifier


class VirtualEnvDeploymentHostTest(mox.MoxTestBase):

    def setUp(self):
        super(VirtualEnvDeploymentHostTest, self).setUp()
        self.mock_file_system = self.mox.CreateMock(FileSystem)
        self.mock_user_verifier = self.mox.CreateMock(DeploymentUserVerifier)
        self.mock_permissions = self.mox.CreateMock(AkvoPermissions)
        self.mock_virtualenv_installer = self.mox.CreateMock(VirtualEnvInstaller)
        self.mock_feedback = self.mox.CreateMock(ExecutionFeedback)

        self.deployment_user = "rupaul"
        deployment_host_config = CIDeploymentHostConfig.for_test()
        self.virtualenv_installer_config = RSRVirtualEnvInstallerConfig.create_with(deployment_host_config, self.deployment_user)

        # we don't have any additional expections on the Internet dependency (since this is already
        # tested in the DeploymentHost base class) so we set this to None for now
        self.virtualenv_deployment_host = VirtualEnvDeploymentHost(self.virtualenv_installer_config,
                                                                   self.mock_file_system,
                                                                   self.mock_user_verifier,
                                                                   self.mock_permissions,
                                                                   None,
                                                                   self.mock_virtualenv_installer,
                                                                   self.mock_feedback)

    def test_can_ensure_user_has_required_deployment_permissions(self):
        """fab.tests.host.virtualenv_deployment_host_test  Can ensure user has required deployment permissions"""

        self.mock_user_verifier.verify_sudo_and_web_admin_permissions_for(self.deployment_user)
        self.mox.ReplayAll()

        self.virtualenv_deployment_host.ensure_user_has_required_deployment_permissions()

    def test_can_create_a_remote_host_instance(self):
        """fab.tests.host.virtualenv_deployment_host_test  Can create a remote VirtualEnvDeploymentHost instance"""

        host_instance = self._create_host_instance_with(RemoteHostController)

        self.assertIsInstance(host_instance, VirtualEnvDeploymentHost)

    def test_can_create_a_local_host_instance(self):
        """fab.tests.host.virtualenv_deployment_host_test  Can create a local VirtualEnvDeploymentHost instance"""

        host_instance = self._create_host_instance_with(LocalHostController)

        self.assertIsInstance(host_instance, VirtualEnvDeploymentHost)

    def _create_host_instance_with(self, host_controller_class):
        mock_host_controller = self.mox.CreateMock(host_controller_class)
        mock_host_controller.feedback = self.mox.CreateMock(ExecutionFeedback)

        self.mox.ReplayAll()

        return VirtualEnvDeploymentHost.create_with(self.virtualenv_installer_config, mock_host_controller)

    def test_can_create_empty_virtualenv(self):
        """fab.tests.host.virtualenv_deployment_host_test  Can create empty virtualenv"""

        self._ensure_virtualenvs_home_exists()
        self.mock_virtualenv_installer.create_empty_virtualenv()
        self.mox.ReplayAll()

        self.virtualenv_deployment_host.create_empty_virtualenv()

    def test_can_ensure_virtualenv_exists(self):
        """fab.tests.host.virtualenv_deployment_host_test  Can ensure virtualenv exists"""

        self._ensure_virtualenvs_home_exists()
        self.mock_virtualenv_installer.ensure_virtualenv_exists()
        self.mox.ReplayAll()

        self.virtualenv_deployment_host.ensure_virtualenv_exists()

    def _ensure_virtualenvs_home_exists(self):
        self.mock_file_system.directory_exists(self.virtualenv_installer_config.virtualenvs_home).AndReturn(True)
        self.mock_feedback.comment("Found expected directory: %s" % self.virtualenv_installer_config.virtualenvs_home)
        self.mock_permissions.set_web_group_permissions_on_directory(self.virtualenv_installer_config.virtualenvs_home)

    def test_can_remove_previously_downloaded_package_sources(self):
        """fab.tests.host.virtualenv_deployment_host_test  Can remove previously downloaded package source files"""

        self.mock_virtualenv_installer.remove_previously_downloaded_package_sources()
        self.mox.ReplayAll()

        self.virtualenv_deployment_host.remove_previously_downloaded_package_sources()

    def test_can_install_virtualenv_packages(self):
        """fab.tests.host.virtualenv_deployment_host_test  Can install virtualenv packages"""

        expected_pip_requirements_file = "/some/pip/requirements.txt"

        self.mock_virtualenv_installer.install_packages(expected_pip_requirements_file)
        self.mox.ReplayAll()

        self.virtualenv_deployment_host.install_virtualenv_packages(expected_pip_requirements_file)

    def test_can_ensure_virtualenv_symlinks_exist(self):
        """fab.tests.host.virtualenv_deployment_host_test  Can ensure virtualenv symlinks exist"""

        self.mock_virtualenv_installer.ensure_virtualenv_symlinks_exist()
        self.mox.ReplayAll()

        self.virtualenv_deployment_host.ensure_virtualenv_symlinks_exist()

    def test_can_set_web_group_permissions_and_ownership_on_deployed_virtualenv(self):
        """fab.tests.host.virtualenv_deployment_host_test  Can set web group permissions and ownership on deployed virtualenv"""

        self.mock_feedback.comment("Setting web group permissions and ownership on %s" % self.virtualenv_installer_config.rsr_env_path)
        self.mock_permissions.set_web_group_permissions_on_directory(self.virtualenv_installer_config.rsr_env_path)
        self.mox.ReplayAll()

        self.virtualenv_deployment_host.set_web_group_permissions_and_ownership_on_deployed_virtualenv()


def suite():
    return TestSuiteLoader().load_tests_from(VirtualEnvDeploymentHostTest)

if __name__ == "__main__":
    from fab.tests.test_settings import TEST_MODE
    TestRunner(TEST_MODE).run_test_suite(suite())
