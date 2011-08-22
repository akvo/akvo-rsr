# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


import os


class Codebase(object):

    RSR_ARCHIVE_URL_ROOT        = "http://nodeload.github.com/akvo/akvo-rsr/zipball"
    UNPACKED_RSR_ARCHIVE_MASK   = "akvo-akvo-rsr-*"

    def __init__(self, deployment_config, deployment_host):
        self.config = deployment_config
        self.deployment_host = deployment_host
        self.feedback = deployment_host.feedback

        self.rsr_archive_url = os.path.join(Codebase.RSR_ARCHIVE_URL_ROOT, self.config.rsr_branch)

    def download_and_unpack_rsr_archive(self):
        archive_file_name = self.deployment_host.file_name_from_url_headers(self.rsr_archive_url)
        archive_file_on_host = os.path.join(self.config.repo_archives_dir, archive_file_name)

        self._clean_deployment_directories()
        self._download_rsr_archive(self.rsr_archive_url, archive_file_on_host)
        self._unpack_rsr_archive(archive_file_on_host)

    def _clean_deployment_directories(self):
        self.feedback.comment("Clearing previous deployment directories")
        self.deployment_host.delete_directory_with_sudo(self.config.rsr_deployment_root)

    def _download_rsr_archive(self, rsr_archive_url, archive_file_on_host):
        self.feedback.comment("Downloading RSR archive file")
        if self.deployment_host.file_exists(archive_file_on_host):
            self.feedback.comment("Latest archive already exists at: %s" % archive_file_on_host)
        else:
            self.feedback.comment("Fetching RSR archive from the [%s] branch on Github" % self.config.rsr_branch)
            self.deployment_host.download_file_at_url_as(archive_file_on_host, rsr_archive_url)

    def _unpack_rsr_archive(self, archive_file_on_host):
        self.feedback.comment("Unpacking RSR archive in %s" % self.config.rsr_deployment_root)
        with self.deployment_host.cd(self.config.repo_checkout_root):
            self.deployment_host.decompress_code_archive(archive_file_on_host, self.config.repo_checkout_root)
            self.deployment_host.rename_directory(Codebase.UNPACKED_RSR_ARCHIVE_MASK, self.config.rsr_deployment_dir_name)
            self.deployment_host.set_web_group_ownership_on_directory(self.config.rsr_deployment_dir_name)
