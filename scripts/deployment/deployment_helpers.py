# -*- coding: utf-8 -*-

import sys

from fabric.api import *
from fabric.contrib import files


def ensure_path_exists_with_sudo(path):
    if not files.exists(path):
        print ">> Creating path: %s" % path
        sudo("mkdir %s" % path)
        sudo("chmod 775 %s" % path)

def exit_if_path_does_not_exist(path):
    if not files.exists(path):
        print ">> Expected path does not exist: %s" % path
        sys.exit(1)

def with_virtualenv(command):
    sudo("source %s/bin/activate && %s" % (env.virtualenv_path, command))
