#!/usr/bin/env python

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


import mox, os

from testing.helpers.execution import TestSuiteLoader, TestRunner

from fab.config.deployer import DeployerConfig
from fab.host.controller import HostControllerMode
from fab.host.deployment import DeploymentHost

from fab.tasks.environment.python.virtualenv.rsr import RebuildRSREnv


class StubbedRebuildRSREnv(RebuildRSREnv):

    def configure_deployment_host_using(self, host_controller_mode):
        pass


class RebuildRSREnvTest(mox.MoxTestBase):

    def setUp(self):
        super(RebuildRSREnvTest, self).setUp()
        self.mock_config = self.mox.CreateMock(DeployerConfig)
        self.mock_deployment_host = self.mox.CreateMock(DeploymentHost)

        self.rebuild_virtualenv_task = StubbedRebuildRSREnv(self.mock_config)
        self.rebuild_virtualenv_task.deployment_host = self.mock_deployment_host

    def test_has_expected_task_name(self):
        """fab.tests.tasks.environment.python.virtualenv.rebuild_rsr_env_test  Has expected task name"""

        self.assertEqual("rebuild_rsr_env", RebuildRSREnv.name)

    def test_can_create_task_instance(self):
        """fab.tests.tasks.environment.python.virtualenv.rebuild_rsr_env_test  Can create task instance"""

        self.assertIsInstance(RebuildRSREnv.create_task_instance(), RebuildRSREnv)

    def test_can_configure_deploymenthost_member_using_local_hostcontrollermode(self):
        """fab.tests.tasks.environment.python.virtualenv.rebuild_rsr_env_test  Can configure DeploymentHost member using local HostControllerMode"""

        rebuild_rsr_virtualenv_task = RebuildRSREnv.create_task_instance()
        rebuild_rsr_virtualenv_task.configure_deployment_host_using(HostControllerMode.LOCAL)

        self.assertIsInstance(rebuild_rsr_virtualenv_task.deployment_host, DeploymentHost)

    def test_can_configure_deploymenthost_member_using_remote_hostcontrollermode(self):
        """fab.tests.tasks.environment.python.virtualenv.rebuild_rsr_env_test  Can configure DeploymentHost member using remote HostControllerMode"""

        rebuild_rsr_virtualenv_task = RebuildRSREnv.create_task_instance()
        rebuild_rsr_virtualenv_task.configure_deployment_host_using(HostControllerMode.REMOTE)

        self.assertIsInstance(rebuild_rsr_virtualenv_task.deployment_host, DeploymentHost)

    def test_can_rebuild_rsr_virtualenv(self):
        """fab.tests.tasks.environment.python.virtualenv.rebuild_rsr_env_test  Can rebuild an RSR virtualenv"""

        pip_log_file = "/some/log/path/pip.log"
        pip_requirements_home = "/path/to/pip/requirements"
        rsr_requirements_path = os.path.join(pip_requirements_home, RebuildRSREnv.RSR_REQUIREMENTS_FILE)
        self.mock_config.pip_install_log_file = pip_log_file
        self.mock_config.pip_requirements_home = pip_requirements_home

        self.mock_deployment_host.ensure_virtualenv_exists(pip_log_file)
        self.mock_deployment_host.install_virtualenv_packages(rsr_requirements_path, pip_log_file)
        self.mox.ReplayAll()

        self.rebuild_virtualenv_task.run(HostControllerMode.REMOTE)


def suite():
    return TestSuiteLoader().load_tests_from(RebuildRSREnvTest)

if __name__ == "__main__":
    from fab.tests.test_settings import TEST_MODE
    TestRunner(TEST_MODE).run_test_suite(suite())
