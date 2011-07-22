# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


# python 2.5 compatibilty
from __future__ import with_statement

import os

import fabric.context_managers


class Codebase(object):

    def __init__(self, deployment_config, deployment_host, file_system, internet_helper, permissions, execution_feedback):
        self.config = deployment_config
        self.deployment_host = deployment_host
        self.file_system = file_system
        self.internet = internet_helper
        self.permissions = permissions
        self.feedback = execution_feedback

    def download_and_unpack_rsr_archive(self):
        self._clean_deployment_directories()
        self._download_rsr_archive()
        self._unpack_rsr_archive()

    def _clean_deployment_directories(self):
        self.feedback.comment("Clearing previous deployment directories")
        self.file_system.delete_directory_with_sudo(self.config.rsr_deployment_root)

    def _download_rsr_archive(self):
        self.feedback.comment("Downloading RSR archive file")
        rsr_archive_url = self.config.rsr_archive_url
        archives_dir = self.config.repo_archives_dir
        if not self.internet.file_from_url_exists_in_directory(rsr_archive_url, archives_dir):
            self.feedback.comment("Fetching akvo-rsr archive for the [%s] branch from Github" % self.config.rsr_branch)
            self.deployment_host.run("wget -nv -P %s %s" % (archives_dir, rsr_archive_url))
        else:
            archive_file_name = self.internet.file_name_at_url(rsr_archive_url)
            self.feedback.comment("Latest archive already exists at: %s" % os.path.join(archives_dir, archive_file_name))

    def _unpack_rsr_archive(self):
        rsr_deployment_root = self.config.rsr_deployment_root
        self.feedback.comment("Unpacking RSR archive in %s" % rsr_deployment_root)
        with fabric.context_managers.cd(self.config.repo_archives_dir):
            archive_file_name = self.internet.file_name_at_url(self.config.rsr_archive_url)
            self.deployment_host.run("unzip -q %s -d %s -x */.gitignore" % (archive_file_name, self.config.repo_checkout_root))
        self.deployment_host.run("mv %s %s" % (self.config.unpacked_rsr_archive_match, rsr_deployment_root))
        self.permissions.set_akvo_ownership_on_path(rsr_deployment_root)
