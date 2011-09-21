#!/usr/bin/env python

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


import fabric.api
import mox, os

from testing.helpers.execution import TestSuiteLoader, TestRunner

from fab.app.deployer import RSRAppDeployer
from fab.config.rsr.deployment import RSRDeploymentConfig
from fab.helpers.feedback import ExecutionFeedback
from fab.host.deployment import DeploymentHost


class RSRAppDeployerTest(mox.MoxTestBase):

    def setUp(self):
        super(RSRAppDeployerTest, self).setUp()
        self.mock_config = self.mox.CreateMock(RSRDeploymentConfig)
        self.mock_deployment_host = self.mox.CreateMock(DeploymentHost)
        self.mock_feedback = self.mox.CreateMock(ExecutionFeedback)

        self.mock_deployment_host.feedback = self.mock_feedback

        self.app_deployer = RSRAppDeployer(self.mock_config, self.mock_deployment_host)

    def test_initialiser_uses_executionfeedback_instance_from_deployment_host(self):
        """fab.tests.app.rsr_app_deployer_test  Initialiser uses ExecutionFeedback from deployment host"""

        self.mox.ReplayAll()

        self.assertIsInstance(self.app_deployer, RSRAppDeployer)
        self.assertIsInstance(self.app_deployer.feedback, ExecutionFeedback)

    def test_can_ensure_required_directories_exist(self):
        """fab.tests.app.rsr_app_deployer_test  Can ensure required directories exist"""

        deployment_user     = "rupaul"
        repo_checkout_home  = "/var/repo"
        repo_archives_dir   = "/var/repo/archives"
        virtualenvs_home    = "/var/virtualenvs"

        self.mock_config.deployment_user    = deployment_user
        self.mock_config.repo_checkout_home = repo_checkout_home
        self.mock_config.repo_archives_dir  = repo_archives_dir
        self.mock_config.virtualenvs_home   = virtualenvs_home

        self.mock_deployment_host.exit_if_user_is_not_member_of_web_group(deployment_user)
        self.mock_deployment_host.ensure_directory_exists_with_web_group_permissions(repo_checkout_home)
        self.mock_deployment_host.ensure_directory_exists(repo_archives_dir)
        self.mock_deployment_host.ensure_directory_exists_with_web_group_permissions(virtualenvs_home)
        self.mox.ReplayAll()

        self.app_deployer.ensure_required_directories_exist()

    def test_can_clean_deployment_directories(self):
        """fab.tests.app.rsr_app_deployer_test  Can clean deployment directories"""

        deployment_home_dir = "/var/some/path/akvo-rsr_root"
        self.mock_config.rsr_deployment_home = deployment_home_dir

        self.mock_feedback.comment("Clearing previous deployment directories")
        self.mock_deployment_host.delete_directory_with_sudo(deployment_home_dir)
        self.mox.ReplayAll()

        self.app_deployer.clean_deployment_directories()

    def test_can_download_and_unpack_rsr_code_archive_to_deployment_host(self):
        """fab.tests.app.rsr_app_deployer_test  Can download and unpack RSR code archive to deployment host"""

        self._set_expectations_to_download_and_unpack_rsr_archive(archive_exists_on_host=False)
        self.mox.ReplayAll()

        self.app_deployer.download_and_unpack_rsr_archive()

    def test_does_not_download_rsr_code_archive_if_available_on_deployment_host(self):
        """fab.tests.app.rsr_app_deployer_test  Does not download RSR code archive if already available on deployment host"""

        self._set_expectations_to_download_and_unpack_rsr_archive(archive_exists_on_host=True)
        self.mox.ReplayAll()

        self.app_deployer.download_and_unpack_rsr_archive()

    def _set_expectations_to_download_and_unpack_rsr_archive(self, archive_exists_on_host):
        rsr_archive_url         = "http://some.server.org/archives"
        repo_archives_dir       = "/var/repo/archives"
        archive_file_name       = "rsr_v1.0.9.zip"
        archive_file_on_host    = os.path.join(repo_archives_dir, archive_file_name)

        self.mock_config.rsr_archive_url    = rsr_archive_url
        self.mock_config.repo_archives_dir  = repo_archives_dir

        self.mock_deployment_host.file_name_from_url_headers(rsr_archive_url).AndReturn(archive_file_name)
        self.mock_feedback.comment("Downloading RSR archive file")
        self.mock_deployment_host.file_exists(archive_file_on_host).AndReturn(archive_exists_on_host)

        if archive_exists_on_host:
            self.mock_feedback.comment("Latest archive already exists at: %s" % archive_file_on_host)
        else:
            self.mock_feedback.comment("Fetching RSR archive from Github")
            self.mock_deployment_host.download_file_at_url_as(archive_file_on_host, rsr_archive_url)

        self._set_expectations_to_unpack_code_archive(archive_file_on_host)

    def _set_expectations_to_unpack_code_archive(self, archive_file_on_host):
        repo_checkout_home          = "/var/repo"
        rsr_deployment_dir_name     = "rsr_app_dir"
        rsr_deployment_home         = os.path.join(repo_checkout_home, rsr_deployment_dir_name)
        unpacked_archive_dir_mask   = "unpacked_rsr_archive_dir-*"

        self.mock_config.rsr_deployment_dir_name    = rsr_deployment_dir_name
        self.mock_config.rsr_deployment_home        = rsr_deployment_home
        self.mock_config.repo_checkout_home         = repo_checkout_home
        self.mock_config.unpacked_archive_dir_mask  = unpacked_archive_dir_mask

        self.mock_feedback.comment("Unpacking RSR archive in %s" % rsr_deployment_home)
        self.mock_deployment_host.cd(repo_checkout_home).AndReturn(fabric.api.cd(repo_checkout_home))
        self.mock_deployment_host.decompress_code_archive(archive_file_on_host, repo_checkout_home)
        self.mock_deployment_host.rename_directory(unpacked_archive_dir_mask, rsr_deployment_dir_name)
        self.mock_deployment_host.set_web_group_ownership_on_directory(rsr_deployment_dir_name)


def suite():
    return TestSuiteLoader().load_tests_from(RSRAppDeployerTest)

if __name__ == "__main__":
    from fab.tests.test_settings import TEST_MODE
    TestRunner(TEST_MODE).run_test_suite(suite())
