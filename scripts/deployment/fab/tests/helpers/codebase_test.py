#!/usr/bin/env python

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


import fabric.api
import mox, os

from testing.helpers.execution import TestSuiteLoader, TestRunner

from fab.config.deployer import DeployerConfig
from fab.helpers.codebase import Codebase
from fab.helpers.feedback import ExecutionFeedback
from fab.host.deployment import DeploymentHost


class CodebaseTest(mox.MoxTestBase):

    def setUp(self):
        super(CodebaseTest, self).setUp()
        self.mock_config = self.mox.CreateMock(DeployerConfig)
        self.mock_deployment_host = self.mox.CreateMock(DeploymentHost)
        self.mock_feedback = self.mox.CreateMock(ExecutionFeedback)

        self.mock_config.rsr_branch = "dev_branch"
        self.mock_deployment_host.feedback = self.mock_feedback

        self.codebase = Codebase(self.mock_config, self.mock_deployment_host)

    def test_initialiser_sets_rsr_archive_url(self):
        """fab.tests.helpers.codebase_test  Initialiser sets RSR archive URL"""

        self.mox.ReplayAll()

        self.assertEqual(os.path.join(Codebase.RSR_ARCHIVE_URL_ROOT, "dev_branch"), self.codebase.rsr_archive_url)

    def test_can_clean_deployment_directories(self):
        """fab.tests.helpers.codebase_test  Can clean deployment directories"""

        deployment_root_dir = "/var/some/path/akvo-rsr_root"
        self.mock_config.rsr_deployment_root = deployment_root_dir

        self.mock_feedback.comment("Clearing previous deployment directories")
        self.mock_deployment_host.delete_directory_with_sudo(deployment_root_dir)
        self.mox.ReplayAll()

        self.codebase._clean_deployment_directories()

    def test_can_download_rsr_code_archive_to_deployment_host(self):
        """fab.tests.helpers.codebase_test  Can download RSR code archive to deployment host"""

        rsr_archive_url = "http://some.server.org/archives"
        archive_file_on_host = "/var/git/archives/rsr_v1.0.9.zip"

        self.mock_feedback.comment("Downloading RSR archive file")
        self.mock_deployment_host.file_exists(archive_file_on_host).AndReturn(False)
        self.mock_feedback.comment("Fetching RSR archive from the [dev_branch] branch on Github")
        self.mock_deployment_host.download_file_at_url_as(archive_file_on_host, rsr_archive_url)
        self.mox.ReplayAll()

        self.codebase._download_rsr_archive(rsr_archive_url, archive_file_on_host)

    def test_does_not_download_rsr_code_archive_if_available_on_deployment_host(self):
        """fab.tests.helpers.codebase_test  Does not download RSR code archive if already available on deployment host"""

        rsr_archive_url = "http://some.server.org/archives"
        archive_file_on_host = "/var/git/archives/rsr_v1.0.9.zip"

        self.mock_feedback.comment("Downloading RSR archive file")
        self.mock_deployment_host.file_exists(archive_file_on_host).AndReturn(True)
        self.mock_feedback.comment("Latest archive already exists at: %s" % archive_file_on_host)
        self.mox.ReplayAll()

        self.codebase._download_rsr_archive(rsr_archive_url, archive_file_on_host)

    def test_can_unpack_rsr_code_archive_on_host(self):
        """fab.tests.helpers.codebase_test  Can unpack RSR code archive on host"""

        archive_file_on_host = "/var/git/archives/rsr_v1.0.9.zip"
        repo_checkout_root = "/var/apps"
        rsr_deployment_dir_name = "rsr_dev_branch"
        rsr_deployment_root = os.path.join(repo_checkout_root, rsr_deployment_dir_name)
        self.mock_config.repo_checkout_root = repo_checkout_root
        self.mock_config.rsr_deployment_dir_name = rsr_deployment_dir_name
        self.mock_config.rsr_deployment_root = rsr_deployment_root

        self.mock_feedback.comment("Unpacking RSR archive in %s" % rsr_deployment_root)
        self.mock_deployment_host.cd(repo_checkout_root).AndReturn(fabric.api.cd(repo_checkout_root))
        self.mock_deployment_host.decompress_code_archive(archive_file_on_host, repo_checkout_root)
        self.mock_deployment_host.rename_directory(Codebase.UNPACKED_RSR_ARCHIVE_MASK, rsr_deployment_dir_name)
        self.mock_deployment_host.set_web_group_ownership_on_directory(rsr_deployment_dir_name)
        self.mox.ReplayAll()

        self.codebase._unpack_rsr_archive(archive_file_on_host)


def suite():
    return TestSuiteLoader().load_tests_from(CodebaseTest)

if __name__ == "__main__":
    from fab.tests.test_settings import TEST_MODE
    TestRunner(TEST_MODE).run_test_suite(suite())
