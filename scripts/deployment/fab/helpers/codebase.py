# -*- coding: utf-8 -*-
# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


# python 2.5 compatibilty
from __future__ import with_statement

import os

import fabric.api
import fabric.context_managers

import fab.helpers.files
import fab.helpers.permissions
import fab.helpers.urls


class CodebaseHelper():

    def __init__(self, environment):
        self.env = environment
        self.urls = fab.helpers.urls.URLHelper()

    def download_and_unpack_rsr_archive(self):
        self._clean_deployment_directories()
        self._download_rsr_archive()
        self._unpack_rsr_archive()

    def _clean_deployment_directories(self):
        print "\n>> Clearing previous deployment directories"
        fab.helpers.files.FilesHelper().delete_directory_with_sudo(self.env.rsr_src_root)

    def _download_rsr_archive(self):
        print "\n\n>> Downloading RSR archive file"
        rsr_archive_url = self.env.rsr_archive_url
        snapshots_dir = self.env.rsr_snapshots_dir
        if not self.urls.url_file_exists_at_path(rsr_archive_url, snapshots_dir):
            print ">> Fetching akvo-rsr archive for the [%s] branch from Github" % self.env.rsr_branch
            fabric.api.run("wget -nv -P %s %s" % (snapshots_dir, rsr_archive_url))
        else:
            archive_file_name = self.urls.file_name_at_url(rsr_archive_url)
            print ">> Latest archive already exists at: %s" % os.path.join(snapshots_dir, archive_file_name)

    def _unpack_rsr_archive(self):
        permissions = fab.helpers.permissions.PermissionsHelper(self.env)
        rsr_src_root = self.env.rsr_src_root
        print "\n>> Unpacking RSR archive in %s" % rsr_src_root
        with fabric.context_managers.cd(self.env.rsr_snapshots_dir):
            fabric.api.run("unzip -q %s -d %s -x */.gitignore" % (self.urls.file_name_at_url(self.env.rsr_archive_url), self.env.repo_checkout_root))
        fabric.api.run("mv %s %s" % (self.env.rsr_unpacked_archive_match, rsr_src_root))
        permissions.set_akvo_ownership_on_path(rsr_src_root)
