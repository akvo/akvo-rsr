# -*- coding: utf-8 -*-
# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


# python 2.5 compatibilty
from __future__ import with_statement

import os

import fabric.api
import fabric.context_managers
import fabric.tasks

import fab.config.deployer_config
import fab.helpers.files
import fab.helpers.paths
import fab.helpers.permissions
import fab.helpers.urls


class DeployRSRCode(fabric.tasks.Task):
    """Deploys RSR codebase to a specified location"""

    name = "deploy_rsr_code"

    def __init__(self, environment):
        self.env = environment
        self.permissions = fab.helpers.permissions.PermissionsHelper(self.env)
        self.paths = fab.helpers.paths.PathsHelper(self.permissions)
        self.urls = fab.helpers.urls.URLHelper()

    def run(self):
        print "\n>> Starting RSR codebase deployment"
        fab.config.deployer_config.DeployerConfig(self.env).load_config()
        self.ensure_required_paths_exist()
        self.download_and_unpack_rsr_archive()

    def ensure_required_paths_exist(self):
        self.ensure_user_is_member_of_akvo_permissions_group()
        print "\n>> Ensuring expected paths exist"
        self.paths.ensure_path_exists_with_akvo_group_permissions(self.env.repo_checkout_root)
        self.paths.ensure_path_exists(self.env.rsr_snapshots_dir)
        self.paths.ensure_path_exists_with_akvo_group_permissions(self.env.virtualenvs_root)

    def ensure_user_is_member_of_akvo_permissions_group(self):
        print "\n>> Checking group membership for user [%s]" % self.env.user + " (required for setting directory permissions later on)"
        self.permissions.ensure_user_is_member_of_group(self.env.akvo_permissions_group)

    def download_and_unpack_rsr_archive(self):
        self.clean_deployment_directories()
        self.download_rsr_archive()
        self.unpack_rsr_archive()

    def clean_deployment_directories(self):
        print "\n>> Clearing previous deployment directories"
        fab.helpers.files.FilesHelper().delete_directory_with_sudo(self.env.rsr_src_root)

    def download_rsr_archive(self):
        print "\n\n>> Downloading RSR archive file"
        rsr_archive_url = self.env.rsr_archive_url
        snapshots_dir = self.env.rsr_snapshots_dir
        if not self.urls.url_file_exists_at_path(rsr_archive_url, snapshots_dir):
            print ">> Fetching akvo-rsr archive for the [%s] branch from Github" % self.env.rsr_branch
            fabric.api.run("wget -nv -P %s %s" % (snapshots_dir, rsr_archive_url))
        else:
            archive_file_name = self.urls.file_name_at_url(rsr_archive_url)
            print ">> Latest archive already exists at: %s" % os.path.join(snapshots_dir, archive_file_name)

    def unpack_rsr_archive(self):
        print "\n>> Unpacking RSR archive in %s" % self.env.rsr_src_root
        with fabric.context_managers.cd(self.env.rsr_snapshots_dir):
            fabric.api.run("unzip -q %s -d %s -x */.gitignore" % (self.urls.file_name_at_url(self.env.rsr_archive_url), self.env.repo_checkout_root))
        fabric.api.run("mv %s %s" % (self.env.rsr_unpacked_archive_match, self.env.rsr_src_root))
        self.permissions.set_akvo_ownership_on_path(self.env.rsr_src_root)


instance = DeployRSRCode(fabric.api.env)
