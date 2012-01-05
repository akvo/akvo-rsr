#!/usr/bin/env python

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


import mox

from testing.helpers.execution import TestSuiteLoader, TestRunner

from fab.app.deployer import RSRAppDeployer
from fab.config.rsr.deployment import RSRDeploymentConfig
from fab.helpers.feedback import ExecutionFeedback
from fab.host.controller import HostControllerMode
from fab.host.deployment import DeploymentHost
from fab.tasks.app.deployment import DeployRSRApp


class StubbedDeployRSRApp(DeployRSRApp):

    def _initialise_app_deployer_using(self, host_controller_mode):
        pass # so that we can mock the app deployer initialisation


class DeployRSRAppTest(mox.MoxTestBase):

    def setUp(self):
        super(DeployRSRAppTest, self).setUp()
        self.mock_config = self.mox.CreateMock(RSRDeploymentConfig)
        self.mock_app_deployer = self.mox.CreateMock(RSRAppDeployer)
        self.mock_feedback = self.mox.CreateMock(ExecutionFeedback)

        self.deploy_rsr_app_task = StubbedDeployRSRApp(self.mock_config)
        self.deploy_rsr_app_task.app_deployer = self.mock_app_deployer
        self.deploy_rsr_app_task.feedback = self.mock_feedback

    def test_has_expected_task_name(self):
        """fab.tests.tasks.app.deploy_rsr_app_test  Has expected task name"""

        self.assertEqual("deploy_rsr_app", DeployRSRApp.name)

    def test_can_create_task_instance(self):
        """fab.tests.tasks.app.deploy_rsr_app_test  Can create task instance"""

        self.assertIsInstance(DeployRSRApp.create_task_instance(), DeployRSRApp)

    def test_can_initialise_app_deployer_using_local_hostcontrollermode(self):
        """fab.tests.tasks.app.deploy_rsr_app_test  Can initialise app deployer using local HostControllerMode"""

        self._verify_app_deployer_creation_with(HostControllerMode.LOCAL)

    def test_can_initialise_app_deployer_using_remote_hostcontrollermode(self):
        """fab.tests.tasks.app.deploy_rsr_app_test  Can initialise app deployer using remote HostControllerMode"""

        self._verify_app_deployer_creation_with(HostControllerMode.REMOTE)

    def _verify_app_deployer_creation_with(self, host_controller_mode):
        deploy_rsr_app_task = DeployRSRApp.create_task_instance()
        deploy_rsr_app_task._initialise_app_deployer_using(host_controller_mode)

        self.assertIsInstance(deploy_rsr_app_task.app_deployer, RSRAppDeployer)
        self.assertIsInstance(deploy_rsr_app_task.feedback, ExecutionFeedback)

    def test_can_deploy_rsr_app(self):
        """fab.tests.tasks.app.deploy_rsr_app_test  Can deploy RSR app"""

        self.mock_feedback.comment("Starting RSR app deployment")
        self.mock_app_deployer.ensure_required_directories_exist()
        self.mock_app_deployer.clean_deployment_directories()
        self.mock_app_deployer.download_and_unpack_rsr_archive()
        self.mock_app_deployer.ensure_app_symlinks_exist()
        self.mox.ReplayAll()

        self.deploy_rsr_app_task.run(HostControllerMode.REMOTE)


def suite():
    return TestSuiteLoader().load_tests_from(DeployRSRAppTest)

if __name__ == "__main__":
    from fab.tests.test_settings import TEST_MODE
    TestRunner(TEST_MODE).run_test_suite(suite())

