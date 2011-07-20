#!/usr/bin/env python

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


import mox

from testing.helpers.execution import TestSuiteLoader, TestRunner

from fab.config.deployer import DeployerConfig
from fab.helpers.codebase import Codebase
from fab.helpers.feedback import ExecutionFeedback
from fab.helpers.permissions import Permissions
from fab.helpers.path import Path
from fab.tasks.codedeployment import DeployRSRCode


class DeployRSRCodeTest(mox.MoxTestBase):

    def setUp(self):
        super(DeployRSRCodeTest, self).setUp()
        self.mock_config = self.mox.CreateMock(DeployerConfig)
        self.mock_codebase = self.mox.CreateMock(Codebase)
        self.mock_permissions = self.mox.CreateMock(Permissions)
        self.mock_path = self.mox.CreateMock(Path)
        self.mock_feedback = self.mox.CreateMock(ExecutionFeedback)

        self.deploy_rsr_code_task = DeployRSRCode(self.mock_config, self.mock_codebase, self.mock_permissions,
                                                  self.mock_path, self.mock_feedback)

    def test_has_expected_task_name(self):
        """fab.tests.tasks.deploy_rsr_code_test.DeployRSRCodeTest  Has expected task name"""

        self.assertEqual("deploy_rsr_code", DeployRSRCode.name)

    def test_can_deploy_rsr_code(self):
        """fab.tests.tasks.deploy_rsr_code_test.DeployRSRCodeTest  Can deploy RSR code"""

        self.mock_config.user = "joesoap"
        self.mock_config.akvo_permissions_group = "some-akvo-group"
        self.mock_config.repo_checkout_root = "/var/repo"
        self.mock_config.repo_archives_dir = "/var/repo/archives"
        self.mock_config.virtualenvs_home = "/var/virtualenvs"

        self.mock_feedback.comment("\n>> Starting RSR codebase deployment")
        self.mock_feedback.comment(mox.StrContains("\n>> Checking group membership for user [joesoap]"))
        self.mock_permissions.ensure_user_is_member_of_group("joesoap", "some-akvo-group")
        self.mock_feedback.comment("\n>> Ensuring expected paths exist")
        self.mock_path.ensure_path_exists_with_akvo_group_permissions("/var/repo")
        self.mock_path.ensure_path_exists("/var/repo/archives")
        self.mock_path.ensure_path_exists_with_akvo_group_permissions("/var/virtualenvs")
        self.mock_codebase.download_and_unpack_rsr_archive()
        self.mox.ReplayAll()

        self.deploy_rsr_code_task.run()


def suite():
    return TestSuiteLoader().load_tests_from(DeployRSRCodeTest)

if __name__ == "__main__":
    from fab.tests.test_settings import TEST_MODE
    TestRunner(TEST_MODE).run_test_suite(suite())

