#!/usr/bin/env python

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


import fabric.api
import mox, os

from testing.helpers.execution import TestRunner, TestSuiteLoader

from fab.app.deployer import RSRAppDeployer
from fab.config.rsr.deployment import RSRDeploymentConfig
from fab.config.rsr.host import CIDeploymentHostConfig
from fab.helpers.feedback import ExecutionFeedback
from fab.host.deployment import DeploymentHost


class RSRAppDeployerTest(mox.MoxTestBase):

    def setUp(self):
        super(RSRAppDeployerTest, self).setUp()
        self.mock_deployment_host = self.mox.CreateMock(DeploymentHost)
        self.mock_feedback = self.mox.CreateMock(ExecutionFeedback)

        self.deployment_config = RSRDeploymentConfig.create_with(CIDeploymentHostConfig.for_test(), "rupaul")
        self.mock_deployment_host.feedback = self.mock_feedback

        self.app_deployer = RSRAppDeployer(self.deployment_config, self.mock_deployment_host)

    def test_initialiser_uses_executionfeedback_instance_from_deployment_host(self):
        """fab.tests.app.rsr_app_deployer_test  Initialiser uses ExecutionFeedback from deployment host"""

        self.mox.ReplayAll()

        self.assertIsInstance(self.app_deployer, RSRAppDeployer)
        self.assertIsInstance(self.app_deployer.feedback, ExecutionFeedback)

    def test_can_ensure_user_has_required_deployment_permissions(self):
        """fab.tests.app.rsr_app_deployer_test  Can ensure user has required deployment permissions"""

        self.mock_deployment_host.ensure_user_has_required_deployment_permissions(self.deployment_config.deployment_user)
        self.mox.ReplayAll()

        self.app_deployer.ensure_user_has_required_deployment_permissions()

    def test_can_ensure_required_directories_exist(self):
        """fab.tests.app.rsr_app_deployer_test  Can ensure required directories exist"""

        self.mock_deployment_host.ensure_directory_exists_with_web_group_permissions(self.deployment_config.repo_checkout_home)
        self.mock_deployment_host.ensure_directory_exists(self.deployment_config.repo_archives_dir)
        self.mox.ReplayAll()

        self.app_deployer.ensure_required_directories_exist()

    def test_can_clean_deployment_directories(self):
        """fab.tests.app.rsr_app_deployer_test  Can clean deployment directories"""

        self.mock_feedback.comment("Clearing previous deployment directories")
        self.mock_deployment_host.delete_directory_with_sudo(self.deployment_config.rsr_deployment_home)
        self.mox.ReplayAll()

        self.app_deployer.clean_deployment_directories()

    def test_can_download_and_unpack_rsr_code_archive_to_deployment_host(self):
        """fab.tests.app.rsr_app_deployer_test  Can download and unpack RSR code archive to deployment host"""

        self._download_and_unpack_rsr_archive(archive_exists_on_host=False)
        self.mox.ReplayAll()

        self.app_deployer.download_and_unpack_rsr_archive()

    def test_does_not_download_rsr_code_archive_if_available_on_deployment_host(self):
        """fab.tests.app.rsr_app_deployer_test  Does not download RSR code archive if already available on deployment host"""

        self._download_and_unpack_rsr_archive(archive_exists_on_host=True)
        self.mox.ReplayAll()

        self.app_deployer.download_and_unpack_rsr_archive()

    def _download_and_unpack_rsr_archive(self, archive_exists_on_host):
        archive_file_name       = "rsr_v1.0.9.zip"
        archive_file_on_host    = os.path.join(self.deployment_config.repo_archives_dir, archive_file_name)

        self.mock_deployment_host.file_name_from_url_headers(self.deployment_config.rsr_archive_url).AndReturn(archive_file_name)
        self.mock_feedback.comment("Downloading RSR archive file")
        self.mock_deployment_host.file_exists(archive_file_on_host).AndReturn(archive_exists_on_host)

        if archive_exists_on_host:
            self.mock_feedback.comment("Latest archive already exists at: %s" % archive_file_on_host)
        else:
            self.mock_feedback.comment("Fetching RSR archive from Github")
            self.mock_deployment_host.download_file_at_url_as(archive_file_on_host, self.deployment_config.rsr_archive_url)

        self._unpack_code_archive(archive_file_on_host)

    def _unpack_code_archive(self, archive_file_on_host):
        self.mock_feedback.comment("Unpacking RSR archive in %s" % self.deployment_config.rsr_deployment_home)
        self._change_dir_to(self.deployment_config.repo_checkout_home)
        self.mock_deployment_host.decompress_code_archive(archive_file_on_host, self.deployment_config.repo_checkout_home)
        self.mock_deployment_host.rename_directory(self.deployment_config.unpacked_archive_dir_mask, self.deployment_config.rsr_deployment_dir_name)
        self.mock_deployment_host.set_web_group_ownership_on_directory(self.deployment_config.rsr_deployment_dir_name)

    def test_can_create_app_symlinks(self):
        """fab.tests.app.rsr_app_deployer_test  Can create app symlinks"""

        self.mock_feedback.comment("Verifying expected symlink target paths")
        self._verify_symlink_target_paths()
        self.mock_feedback.comment("Ensuring expected RSR app symlinks exist")
        self._link_configuration_files()
        self._link_mediaroot_directories()
        self._link_current_deployment_home()
        self._link_static_media_directories()
        self.mox.ReplayAll()

        self.app_deployer.ensure_app_symlinks_exist()

    def _verify_symlink_target_paths(self):
        self.mock_deployment_host.exit_if_directory_does_not_exist(self.deployment_config.host_config_home)
        self.mock_deployment_host.exit_if_file_does_not_exist(self.deployment_config.deployed_rsr_settings_file)
        self.mock_deployment_host.exit_if_directory_does_not_exist(self.deployment_config.django_media_admin_path)
        self.mock_deployment_host.exit_if_directory_does_not_exist(self.deployment_config.rsr_static_media_home)
        self.mock_deployment_host.exit_if_directory_does_not_exist(self.deployment_config.static_media_db_path)

    def _link_configuration_files(self):
        self._change_dir_to(self.deployment_config.rsr_settings_home)
        self.mock_deployment_host.ensure_symlink_exists(self.deployment_config.local_rsr_settings_file_name,
                                                        self.deployment_config.deployed_rsr_settings_file)

    def _link_mediaroot_directories(self):
        self._change_dir_to(self.deployment_config.rsr_media_root)
        self.mock_deployment_host.ensure_symlink_exists("admin", self.deployment_config.django_media_admin_path)
        self.mock_deployment_host.ensure_symlink_exists("db", self.deployment_config.static_media_db_path)

    def _link_current_deployment_home(self):
        self._change_dir_to(self.deployment_config.repo_checkout_home)
        self.mock_deployment_host.ensure_symlink_exists("current", self.deployment_config.rsr_deployment_dir_name)

    def _link_static_media_directories(self):
        self._change_dir_to(self.deployment_config.rsr_static_media_home)
        self.mock_deployment_host.ensure_symlink_exists("mediaroot", self.deployment_config.current_rsr_media_root)

    def _change_dir_to(self, expected_dir):
        self.mock_deployment_host.cd(expected_dir).AndReturn(fabric.api.cd(expected_dir))


def suite():
    return TestSuiteLoader().load_tests_from(RSRAppDeployerTest)

if __name__ == '__main__':
    TestRunner().run_test_suite(suite())
