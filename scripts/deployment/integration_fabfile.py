# -*- coding: utf-8 -*-

# python 2.5 compatibilty
from __future__ import with_statement

from fabric.api import *
from fabric.context_managers import cd
from fabric.contrib import files

from fab_config_develop import load_config


def ensure_path_exists(path):
    if not files.exists(path):
        sudo("mkdir %s" % path)
        sudo("chmod 775 %s" % path)

def ensure_required_paths_exist():
    ensure_path_exists(env.repo_checkout_root)
    ensure_path_exists(env.rsr_snapshots_dir)

def clean_deployment_directories():
    if files.exists(env.rsr_snapshot_file):
        print "\n>> Deleting previous snapshot file"
        sudo("rm %s" % env.rsr_snapshot_file)
    if files.exists(env.rsr_src_root):
        print "\n>> Deleting previous deployment directory"
        sudo("rm -r %s" % env.rsr_src_root)

def download_and_unpack_rsr_archive():
    clean_deployment_directories()
    print "\n>> Fetching akvo-rsr archive for %s branch from Github" % env.rsr_branch
    sudo("wget -nv -O %s %s" % (env.rsr_snapshot_file, env.rsr_zipball_path))
    print "\n>> Unpacking akvo-rsr archive in %s" % env.repo_checkout_root
    sudo("unzip -q %s -d %s -x */.gitignore" % (env.rsr_snapshot_file, env.repo_checkout_root))
    sudo("mv %s/akvo-akvo-rsr-* %s/akvo-rsr_develop" % (env.repo_checkout_root, env.repo_checkout_root))

def rebuild_virtualenv():
    print "not implemented: rebuild_virtualenv()"

def deploy_rsr():
    print "\n>> Starting RSR deployment"
    load_config()
    ensure_required_paths_exist()
    download_and_unpack_rsr_archive()
    rebuild_virtualenv()
