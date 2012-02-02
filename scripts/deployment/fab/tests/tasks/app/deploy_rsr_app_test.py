#!/usr/bin/env python

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


import mox

from testing.helpers.execution import TestRunner, TestSuiteLoader

from fab.app.deployer import RSRAppDeployer
from fab.config.rsr.host import CIDeploymentHostConfig
from fab.config.spec import HostConfigSpecification
from fab.config.values.host import HostAlias
from fab.helpers.feedback import ExecutionFeedback
from fab.host.controller import HostControllerMode
from fab.tasks.app.deployment import DeployRSRApp


class StubbedDeployRSRApp(DeployRSRApp):

    def __init__(self, app_deployer, feedback):
        super(StubbedDeployRSRApp, self).__init__()
        self.app_deployer = app_deployer
        self.feedback = feedback

    def _configure_app_deployer_using(self, host_controller_mode, host_config):
        return self.app_deployer


class DeployRSRAppTest(mox.MoxTestBase):

    def setUp(self):
        super(DeployRSRAppTest, self).setUp()
        self.mock_app_deployer = self.mox.CreateMock(RSRAppDeployer)
        self.mock_feedback = self.mox.CreateMock(ExecutionFeedback)

        self.deploy_rsr_app_task = StubbedDeployRSRApp(self.mock_app_deployer, self.mock_feedback)

    def test_has_expected_task_name(self):
        """fab.tests.tasks.app.deploy_rsr_app_test  Has expected task name"""

        self.assertEqual('deploy_rsr_app', DeployRSRApp.name)

    def test_can_configure_app_deployer_using_local_hostcontrollermode(self):
        """fab.tests.tasks.app.deploy_rsr_app_test  Can initialise app deployer using local HostControllerMode"""

        self._can_configure_app_deployer_with(HostControllerMode.LOCAL)

    def test_can_configure_app_deployer_using_remote_hostcontrollermode(self):
        """fab.tests.tasks.app.deploy_rsr_app_test  Can initialise app deployer using remote HostControllerMode"""

        self._can_configure_app_deployer_with(HostControllerMode.REMOTE)

    def _can_configure_app_deployer_with(self, host_controller_mode):
        self.assertIsInstance(DeployRSRApp()._configure_app_deployer_using(host_controller_mode, CIDeploymentHostConfig.for_test()), RSRAppDeployer)

    def test_can_deploy_rsr_app(self):
        """fab.tests.tasks.app.deploy_rsr_app_test  Can deploy RSR app"""

        self.mock_feedback.comment('Starting RSR app deployment')
        self.mock_app_deployer.ensure_user_has_required_deployment_permissions()
        self.mock_app_deployer.ensure_required_directories_exist()
        self.mock_app_deployer.clean_deployment_directories()
        self.mock_app_deployer.download_and_unpack_rsr_archive()
        self.mock_app_deployer.ensure_app_symlinks_exist()
        self.mox.ReplayAll()

        self.deploy_rsr_app_task.run(HostControllerMode.REMOTE, HostConfigSpecification().create_preconfigured_with(HostAlias.TEST))


def suite():
    return TestSuiteLoader().load_tests_from(DeployRSRAppTest)

if __name__ == '__main__':
    from fab.tests.test_settings import TEST_MODE
    TestRunner(TEST_MODE).run_test_suite(suite())

