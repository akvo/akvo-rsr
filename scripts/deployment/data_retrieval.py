# -*- coding: utf-8 -*-

# python 2.5 compatibilty
from __future__ import with_statement

from fabric.api import *
from fabric.context_managers import cd
from fabric.contrib import files

from data_retrieval_config import load_data_retrieval_config
from deployment_helpers import *

def ensure_required_paths_exist():
    ensure_path_exists_with_sudo(env.data_dumps_root)
    exit_if_path_does_not_exist(env.virtualenv_path)
    exit_if_path_does_not_exist(env.db_dump_path)

def fetch_data_from_live_database():
    with cd(env.live_akvo_app_path):
        with_virtualenv("python %s -d %s dump" % (env.db_dump_path, env.rsr_data_dump_path))

def fetch_live_data():
    print ">> Fetching data from live database"
    load_data_retrieval_config()
    ensure_required_paths_exist()
    fetch_data_from_live_database()
