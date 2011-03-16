# -*- coding: utf-8 -*-

# python 2.5 compatibilty
from __future__ import with_statement

from fabric.api import *
from fabric.context_managers import cd
from fabric.contrib import files

from fab_config_develop import load_config


def ensure_path_exists(path_env_var, path):
    if not files.exists(path):
        sudo("mkdir %s" % path)
        sudo("chmod 775 %s" % path)

def ensure_required_paths_exist():
    ensure_path_exists('repo_checkout_root', env.repo_checkout_root)
    ensure_path_exists('rsr_snapshots_dir', env.rsr_snapshots_dir)

def download_and_unpack_rsr_zipball():
    print ">> Fetching akvo-rsr zipball for %s branch from Github" % env.rsr_branch
    sudo("wget -nv -O %s %s" % (env.rsr_snapshot_file, env.rsr_zipball_path))
    print ">> Unpacking akvo-rsr zipball in %s" % env.repo_checkout_root
    sudo("unzip -q %s -d %s -x */.gitignore" % (env.rsr_snapshot_file, env.repo_checkout_root))
    sudo("mv %s/akvo-akvo-rsr-* %s/akvo-rsr_develop" % (env.repo_checkout_root, env.repo_checkout_root))

def rebuild_virtualenv():
    print "not implemented: rebuild_virtualenv()"

def deploy_rsr():
    load_config()
    ensure_required_paths_exist()
    download_and_unpack_rsr_zipball()
    rebuild_virtualenv()
