#!/usr/bin/env python

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


import mox

from testing.helpers.execution import TestRunner, TestSuiteLoader

from fab.config.rsr.credentials.user import User
from fab.config.rsr.host import CIDeploymentHostConfig
from fab.config.rsr.virtualenv import RSRVirtualEnvInstallerConfig
from fab.config.spec import HostConfigSpecification
from fab.config.values.host import HostAlias
from fab.host.controller import HostControllerMode
from fab.host.virtualenv import VirtualEnvDeploymentHost

from fab.tasks.environment.python.virtualenv.rsr import RebuildRSREnv


class StubbedRebuildRSREnv(RebuildRSREnv):

    def __init__(self, virtualenv_deployment_host):
        super(StubbedRebuildRSREnv, self).__init__()
        self.virtualenv_deployment_host = virtualenv_deployment_host

    def _configure_host_using(self, virtualenv_installer_config, host_controller_mode):
        return self.virtualenv_deployment_host


class RebuildRSREnvTest(mox.MoxTestBase):

    def setUp(self):
        super(RebuildRSREnvTest, self).setUp()

        self.virtualenv_installer_config = RSRVirtualEnvInstallerConfig.create_with(CIDeploymentHostConfig.for_test(), User.CURRENT)
        self.mock_virtualenv_deployment_host = self.mox.CreateMock(VirtualEnvDeploymentHost)

        self.rebuild_virtualenv_task = StubbedRebuildRSREnv(self.mock_virtualenv_deployment_host)

    def test_has_expected_task_name(self):
        """fab.tests.tasks.environment.python.virtualenv.rebuild_rsr_env_test  Has expected task name"""

        self.assertEqual('rebuild_rsr_env', RebuildRSREnv.name)

    def test_can_configure_host_using_local_hostcontrollermode(self):
        """fab.tests.tasks.environment.python.virtualenv.rebuild_rsr_env_test  Can configure host using local HostControllerMode"""

        self._verify_host_configuration_with(HostControllerMode.LOCAL)

    def test_can_configure_host_using_remote_hostcontrollermode(self):
        """fab.tests.tasks.environment.python.virtualenv.rebuild_rsr_env_test  Can configure host using remote HostControllerMode"""

        self._verify_host_configuration_with(HostControllerMode.REMOTE)

    def _verify_host_configuration_with(self, host_controller_mode):
        self.assertIsInstance(RebuildRSREnv()._configure_host_using(self.virtualenv_installer_config, host_controller_mode), VirtualEnvDeploymentHost)

    def test_can_rebuild_rsr_virtualenv(self):
        """fab.tests.tasks.environment.python.virtualenv.rebuild_rsr_env_test  Can rebuild an RSR virtualenv"""

        self.mock_virtualenv_deployment_host.ensure_user_has_required_deployment_permissions()
        self.mock_virtualenv_deployment_host.ensure_virtualenv_exists()
        self.mock_virtualenv_deployment_host.remove_previously_downloaded_package_sources()
        self.mock_virtualenv_deployment_host.set_web_group_permissions_and_ownership_on_deployed_virtualenv()
        self.mock_virtualenv_deployment_host.install_virtualenv_packages(self.virtualenv_installer_config.rsr_requirements_url)
        self.mock_virtualenv_deployment_host.set_web_group_permissions_and_ownership_on_deployed_virtualenv()
        self.mock_virtualenv_deployment_host.ensure_virtualenv_symlinks_exist()
        self.mox.ReplayAll()

        self.rebuild_virtualenv_task.run(HostControllerMode.REMOTE, HostConfigSpecification().create_preconfigured_with(HostAlias.TEST))


def suite():
    return TestSuiteLoader().load_tests_from(RebuildRSREnvTest)

if __name__ == '__main__':
    TestRunner().run_test_suite(suite())
