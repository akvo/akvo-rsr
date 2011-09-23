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

    def ensure_required_directories_exist(self):
        self.deployment_host.exit_if_user_is_not_member_of_web_group(self.config.deployment_user)
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
