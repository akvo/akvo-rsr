# -*- coding: utf-8 -*-
# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


# python 2.5 compatibilty
from __future__ import with_statement

from fabric.api import env, run
from fabric.context_managers import cd
from fabric.contrib import files

from fabfiles.data_retrieval_config import load_data_retrieval_config

from helpers.files import compress_directory, delete_directory
from helpers.paths import ensure_path_exists_with_sudo, exit_if_path_does_not_exist
from helpers.virtualenv import with_virtualenv


def ensure_required_paths_exist():
    ensure_path_exists_with_sudo(env.data_dumps_root)
    exit_if_path_does_not_exist(env.virtualenv_path)
    exit_if_path_does_not_exist(env.db_dump_path)

def fetch_data_from_live_database():
    print "\n>> Fetching data from live database"
    with cd(env.live_akvo_app_path):
        run("pwd")
        with_virtualenv("python db_dump.py -d %s dump" % env.rsr_data_dump_path)
    compress_directory(env.rsr_data_dump_path)
    delete_directory(env.rsr_data_dump_path, "\n>> Deleting archived directory: %s" % env.rsr_data_dump_path)

def fetch_live_data():
    load_data_retrieval_config()
    ensure_required_paths_exist()
    fetch_data_from_live_database()
