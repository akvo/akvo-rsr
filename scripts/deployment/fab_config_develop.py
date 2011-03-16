# -*- coding: utf-8 -*-

# python 2.5 compatibilty
from __future__ import with_statement

from fabric.api import *


env.hosts = ["test.akvo.org:2270"]


def load_config():
    env.repo_checkout_root  = "/var/git"
    env.rsr_branch          = "develop"
    env.rsr_snapshots_dir   = "%s/snapshots" % env.repo_checkout_root
    env.rsr_snapshot_file   = "%s/rsr_%s.zip" % (env.rsr_snapshots_dir, env.rsr_branch)
    env.rsr_zipball_path    = "http://nodeload.github.com/akvo/akvo-rsr/zipball/%s" % env.rsr_branch
    env.rsr_src_dir         = "akvo-rsr_%s" % env.rsr_branch
    env.rsr_src_root        = "%s/%s" % (env.repo_checkout_root, env.rsr_src_dir)
