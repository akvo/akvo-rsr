#!/usr/bin/env python

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


import mox

from testing.helpers.execution import TestSuiteLoader, TestRunner

from fab.config.deployer import DeployerConfig
from fab.helpers.codebase import Codebase
from fab.helpers.feedback import ExecutionFeedback
from fab.helpers.hosts import DeploymentHost
from fab.tasks.codedeployment import DeployRSRCode


class DeployRSRCodeTest(mox.MoxTestBase):

    def setUp(self):
        super(DeployRSRCodeTest, self).setUp()
        self.mock_config = self.mox.CreateMock(DeployerConfig)
        self.mock_deployment_host = self.mox.CreateMock(DeploymentHost)
        self.mock_codebase = self.mox.CreateMock(Codebase)
        self.mock_feedback = self.mox.CreateMock(ExecutionFeedback)

        self.mock_deployment_host.feedback = self.mock_feedback

        self.deploy_rsr_code_task = DeployRSRCode(self.mock_config, self.mock_deployment_host, self.mock_codebase)

    def test_has_expected_task_name(self):
        """fab.tests.tasks.deploy_rsr_code_test  Has expected task name"""

        self.assertEqual("deploy_rsr_code", DeployRSRCode.name)

    def test_can_deploy_rsr_code(self):
        """fab.tests.tasks.deploy_rsr_code_test  Can deploy RSR code"""

        user_id = "joesoap"
        repo_checkout_root = "/var/repo"
        repo_archives_dir = "/var/repo/archives"
        virtualenvs_home = "/var/virtualenvs"
        self.mock_config.user = user_id
        self.mock_config.repo_checkout_root = repo_checkout_root
        self.mock_config.repo_archives_dir = repo_archives_dir
        self.mock_config.virtualenvs_home = virtualenvs_home

        self.mock_feedback.comment("Starting RSR codebase deployment")
        self.mock_deployment_host.exit_if_user_is_not_member_of_web_group(user_id)
        self.mock_deployment_host.ensure_directory_exists_with_web_group_permissions(repo_checkout_root)
        self.mock_deployment_host.ensure_directory_exists(repo_archives_dir)
        self.mock_deployment_host.ensure_directory_exists_with_web_group_permissions(virtualenvs_home)
        self.mock_codebase.download_and_unpack_rsr_archive()
        self.mox.ReplayAll()

        self.deploy_rsr_code_task.run()


def suite():
    return TestSuiteLoader().load_tests_from(DeployRSRCodeTest)

if __name__ == "__main__":
    from fab.tests.test_settings import TEST_MODE
    TestRunner(TEST_MODE).run_test_suite(suite())

