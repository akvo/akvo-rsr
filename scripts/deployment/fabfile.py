# -*- coding: utf-8 -*-

# python 2.5 compatibilty
from __future__ import with_statement

from fabric.api import *
from fabric.context_managers import cd
from fabric.contrib import files

env.hosts = ['test.akvo.org:2270',]

# ENVIRONMENTS
    
def test_vm():
    """
    Configs for test-vm (dev-head)
    """
    env.hosts       = ['test.akvo.org:2270',]
    env.rsr_root    = '/var/git/akvo-rsr'
    env.web_root    = '/var/www'
    env.virtualenv  = '/var/virtualenvs/rsr' 

def test2():
    """
    Configs for test-vm (dev-head)
    """
    env.hosts       = ['test2.akvo.org:2273',]
    env.rsr_root    = '/var/dev/playpen/akvo-rsr'
    env.web_root    = '/var/www/playpen'
    env.virtualenv  = '/var/dev/virtualenvs/playpen' 

def clone_rsr_from_github():
    """
    clone akvo-rsr from github into env.rsr_root
    """
    require('hosts', provided_by=[test_vm])
    require('rsr_root', provided_by=[test_vm])
    run('git clone git@github.com:akvo/akvo-rsr.git %s' % env.rsr_root)

def install_pip_requirements():
    """
    Install the required packages from the requirements file using pip.
    
    Note: had a problem with updating/installing from a bitbucket, hg didn't trust the current
    owner of the installed package. Solved by creating /etc/mercurial/hgrc and put
    
    [trusted]
    groups = www-edit
    
    in it. But this is obviously dependent on the ownership in each case.
    See http://www.selenic.com/pipermail/mercurial/2008-January/016701.html
    """
    require('hosts', provided_by=[test_vm])
    require('rsr_root', provided_by=[test_vm])
    if files.exists(env.rsr_root):
        with_virtualenv('pip install -r %s/scripts/deployment/pip-requirements.txt' % env.rsr_root)

def setup_symlinks():
    require('hosts', provided_by=[test_vm])
    require('rsr_root', provided_by=[test_vm])
    require('web_root', provided_by=[test_vm])
    path = '%s/scripts/deployment' % env.rsr_root
    file = '%s/static_project_structure.py' % path
    with cd(path):
        #copy symlink setup script template
        run('cp static_project_structure.py.template static_project_structure.py')
        #comment out paths we want to config. sed won't work with cd(), hence the file variable that holds the full path
        files.sed(file, '/var/www/akvo', '%s/akvo' % env.web_root)
        files.sed(file, '/var/virtualenv/akvo', env.virtualenv)
        with_virtualenv('python verify_static_project_structure.py')
    
def push_pull():
    """
    push local repo to github and then pull to selected server
    """
    require('hosts', provided_by=[test_vm])
    require('rsr_root', provided_by=[test_vm])
    local('git push origin master')
    with cd(env.rsr_root):
        run('git pull origin master')


def with_virtualenv(command):
    """
    Executes a command in this project's virtual environment.
    """
    require('virtualenv', provided_by=[test_vm])
    locals().update(env)    
    run('source %(virtualenv)s/bin/activate && %(command)s' % locals())
 
