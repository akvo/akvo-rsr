#!/usr/bin/env python

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


import mox

from testing.helpers.execution import TestSuiteLoader, TestRunner

from fab.config.deployer import DeployerConfig
from fab.helpers.codebase import Codebase
from fab.helpers.feedback import ExecutionFeedback
from fab.host.controller import HostControllerMode
from fab.host.deployment import DeploymentHost
from fab.tasks.codedeployment import DeployRSRCode


class StubbedDeployRSRCode(DeployRSRCode):

    def initialise_codebase_using(self, host_controller_mode):
        pass


class DeployRSRCodeTest(mox.MoxTestBase):

    def setUp(self):
        super(DeployRSRCodeTest, self).setUp()
        self.mock_config = self.mox.CreateMock(DeployerConfig)
        self.mock_codebase = self.mox.CreateMock(Codebase)
        self.mock_feedback = self.mox.CreateMock(ExecutionFeedback)

        self.deploy_rsr_code_task = StubbedDeployRSRCode(self.mock_config)
        self.deploy_rsr_code_task.codebase = self.mock_codebase
        self.deploy_rsr_code_task.feedback = self.mock_feedback

    def test_has_expected_task_name(self):
        """fab.tests.tasks.deploy_rsr_code_test  Has expected task name"""

        self.assertEqual("deploy_rsr_code", DeployRSRCode.name)

    def test_can_create_task_instance(self):
        """fab.tests.tasks.deploy_rsr_code_test  Can create task instance"""

        self.assertIsInstance(DeployRSRCode.create_task_instance(), DeployRSRCode)

    def test_can_initialise_codebase_member_using_local_hostcontrollermode(self):
        """fab.tests.tasks.deploy_rsr_code_test  Can initialise Codebase member using local HostControllerMode"""

        deploy_rsr_code_task = DeployRSRCode.create_task_instance()
        deploy_rsr_code_task.initialise_codebase_using(HostControllerMode.LOCAL)

        self.assertIsInstance(deploy_rsr_code_task.codebase, Codebase)
        self.assertIsInstance(deploy_rsr_code_task.feedback, ExecutionFeedback)

    def test_can_initialise_codebase_member_using_remote_hostcontrollermode(self):
        """fab.tests.tasks.deploy_rsr_code_test  Can initialise Codebase member using remote HostControllerMode"""

        deploy_rsr_code_task = DeployRSRCode.create_task_instance()
        deploy_rsr_code_task.initialise_codebase_using(HostControllerMode.REMOTE)

        self.assertIsInstance(deploy_rsr_code_task.codebase, Codebase)
        self.assertIsInstance(deploy_rsr_code_task.feedback, ExecutionFeedback)

    def test_can_deploy_rsr_code(self):
        """fab.tests.tasks.deploy_rsr_code_test  Can deploy RSR code"""

        self.mock_feedback.comment("Starting RSR codebase deployment")
        self.mock_codebase.ensure_required_directories_exist()
        self.mock_codebase.clean_deployment_directories()
        self.mock_codebase.download_and_unpack_rsr_archive()
        self.mox.ReplayAll()

        self.deploy_rsr_code_task.run(HostControllerMode.REMOTE)


def suite():
    return TestSuiteLoader().load_tests_from(DeployRSRCodeTest)

if __name__ == "__main__":
    from fab.tests.test_settings import TEST_MODE
    TestRunner(TEST_MODE).run_test_suite(suite())

