# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


import os


class RSRAppDeployer(object):

    def __init__(self, deployment_config, deployment_host):
        self.config = deployment_config
        self.deployment_host = deployment_host
        self.feedback = deployment_host.feedback

    def ensure_user_has_required_deployment_permissions(self):
        self.deployment_host.ensure_user_has_required_deployment_permissions(self.config.deployment_user)

    def ensure_required_directories_exist(self):
        self.deployment_host.ensure_directory_exists_with_web_group_permissions(self.config.repo_checkout_home)
        self.deployment_host.ensure_directory_exists(self.config.repo_archives_dir)

    def clean_deployment_directories(self):
        self.feedback.comment("Clearing previous deployment directories")
        self.deployment_host.delete_directory_with_sudo(self.config.rsr_deployment_home)

    def download_and_unpack_rsr_archive(self):
        archive_file_name = self.deployment_host.file_name_from_url_headers(self.config.rsr_archive_url)
        archive_file_on_host = os.path.join(self.config.repo_archives_dir, archive_file_name)

        self._download_rsr_archive(self.config.rsr_archive_url, archive_file_on_host)
        self._unpack_rsr_archive(archive_file_on_host)

    def _download_rsr_archive(self, rsr_archive_url, archive_file_on_host):
        self.feedback.comment("Downloading RSR archive file")
        if self.deployment_host.file_exists(archive_file_on_host):
            self.feedback.comment("Latest archive already exists at: %s" % archive_file_on_host)
        else:
            self.feedback.comment("Fetching RSR archive from Github")
            self.deployment_host.download_file_at_url_as(archive_file_on_host, rsr_archive_url)

    def _unpack_rsr_archive(self, archive_file_on_host):
        self.feedback.comment("Unpacking RSR archive in %s" % self.config.rsr_deployment_home)
        with self.deployment_host.cd(self.config.repo_checkout_home):
            self.deployment_host.decompress_code_archive(archive_file_on_host, self.config.repo_checkout_home)
            self.deployment_host.rename_directory(self.config.unpacked_archive_dir_mask, self.config.rsr_deployment_dir_name)
            self.deployment_host.set_web_group_ownership_on_directory(self.config.rsr_deployment_dir_name)

    def ensure_app_symlinks_exist(self):
        self.feedback.comment("Verifying expected symlink target paths")
        self._verify_symlink_target_paths()
        self.feedback.comment("Ensuring expected RSR app symlinks exist")
        self._link_configuration_files()
        self._link_mediaroot_directories()
        self._link_current_deployment_home()
        self._link_static_media_directories()

    def _verify_symlink_target_paths(self):
        self.deployment_host.exit_if_directory_does_not_exist(self.config.host_config_home)
        self.deployment_host.exit_if_file_does_not_exist(self.config.deployed_rsr_settings_file)
        self.deployment_host.exit_if_directory_does_not_exist(self.config.django_media_admin_path)
        self.deployment_host.exit_if_directory_does_not_exist(self.config.rsr_static_media_home)
        self.deployment_host.exit_if_directory_does_not_exist(self.config.static_media_db_path)

    def _link_configuration_files(self):
        with self.deployment_host.cd(self.config.rsr_settings_home):
            self.deployment_host.ensure_symlink_exists(self.config.local_rsr_settings_file_name, self.config.deployed_rsr_settings_file)

    def _link_mediaroot_directories(self):
        with self.deployment_host.cd(self.config.rsr_media_root):
            self.deployment_host.ensure_symlink_exists("admin", self.config.django_media_admin_path)
            self.deployment_host.ensure_symlink_exists("db", self.config.static_media_db_path)

    def _link_current_deployment_home(self):
        with self.deployment_host.cd(self.config.repo_checkout_home):
            self.deployment_host.ensure_symlink_exists("current", self.config.rsr_deployment_dir_name)

    def _link_static_media_directories(self):
        with self.deployment_host.cd(self.config.rsr_static_media_home):
            self.deployment_host.ensure_symlink_exists("mediaroot", self.config.current_rsr_media_root)
