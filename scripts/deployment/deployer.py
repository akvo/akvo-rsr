# -*- coding: utf-8 -*-
# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


# python 2.5 compatibilty
from __future__ import with_statement

import os

from fabric.api import env, run
from fabric.context_managers import cd

from deployer_config import load_deployment_config

from helpers.file_helpers import delete_directory_with_sudo, delete_file_with_sudo
from helpers.path_helpers import ensure_path_exists, ensure_path_exists_with_akvo_group_permissions
from helpers.permissions_helpers import ensure_user_is_member_of_group, set_akvo_ownership_on_path
from helpers.url_helpers import file_name_at_url, url_file_exists_at_path
from helpers.virtualenv_helpers import rebuild_virtualenv


def ensure_user_is_member_of_akvo_permissions_group():
    print "\n>> Checking that user [%s] is a member of group [%s]" % (env.user,
        env.akvo_permissions_group) + " (required later for setting directory permissions)"
    ensure_user_is_member_of_group(env.akvo_permissions_group)

def ensure_required_paths_exist():
    ensure_user_is_member_of_akvo_permissions_group()
    ensure_path_exists_with_akvo_group_permissions(env.repo_checkout_root)
    ensure_path_exists(env.rsr_snapshots_dir)
    ensure_path_exists_with_akvo_group_permissions(env.virtualenvs_root)

def clean_deployment_directories():
    delete_directory_with_sudo(env.rsr_src_root, "\n>> Deleting previous deployment directory")

def download_rsr_archive():
    if not url_file_exists_at_path(env.rsr_archive_url, env.rsr_snapshots_dir):
        print "\n>> Fetching akvo-rsr archive for the [%s] branch from Github" % env.rsr_branch
        run("wget -nv -P %s %s" % (env.rsr_snapshots_dir, env.rsr_archive_url))
    else:
        archive_file_name = file_name_at_url(env.rsr_archive_url)
        print "\n>> Latest archive already exists at: %s" % os.path.join(env.rsr_snapshots_dir, archive_file_name)

def unpack_rsr_archive():
    print "\n>> Unpacking akvo-rsr archive in %s" % env.repo_checkout_root
    with cd(env.rsr_snapshots_dir):
        run("unzip -q %s -d %s -x */.gitignore" % (file_name_at_url(env.rsr_archive_url), env.repo_checkout_root))
    run("mv %s %s" % (env.rsr_unpacked_archive_match, env.rsr_src_root))
    set_akvo_ownership_on_path(env.rsr_src_root)

def download_and_unpack_rsr_archive():
    clean_deployment_directories()
    download_rsr_archive()
    unpack_rsr_archive()

def install_akvo_modpython():
    run("cp -p %s %s" % (env.mod_python_template_file, env.mod_python_destination_path))

def deploy_rsr():
    print "\n>> Starting RSR deployment"
    load_deployment_config()
    ensure_required_paths_exist()
    download_and_unpack_rsr_archive()
    rebuild_virtualenv(env.pip_requirements_file, env.pip_install_log_file)
    install_akvo_modpython()
