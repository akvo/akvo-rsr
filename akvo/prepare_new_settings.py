#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""Script to be run before new settings are introduced"""

import os
import settings
import subprocess
import sys

from django.core.management import setup_environ
from django.template import Context, Template

cwd = os.path.abspath(os.path.dirname(__file__))
settings_dir = os.path.join(cwd, 'settings')
backup_dir = os.path.join(settings_dir, 'backup')


confs = {
    'SECRET_KEY': '',
    'PVW_RSR': '',
    'MEDIA_ROOT': '',
    'MEDIA_URL': '',
    'LIVE_EARTH_ENABLED': '',
    'WALKING_FOR_WATER_ENABLED': '',
    'SITE_ID': ''
}


def verify_settings_dir():
    """Make sure the akvo/settings/ dir exists"""
    try:
        os.makedirs(settings_dir)
    except OSError:
        pass


def backup_old_settings():
    """Copying the settings.py and settings_base.py into
    akvo/settings/backup"""
    try:
        os.makedirs(backup_dir)
    except OSError:
        pass

    # copy settings.py to backup
    try:
        settings_string = \
            'cp %s/settings.py %s/settings.py' % (cwd, backup_dir)
        retcode = subprocess.call(settings_string, shell=True)
        if retcode < 0:
            print >> sys.stderr, \
                "Could not copy the settings file," \
                "Copy was terminated by signal", -retcode
    except OSError, e:
        print 'Could not add copy settings file, Got error: %s' % e
        sys.exit(0)

    # copy settings_base.py to backup
    try:
        settings_base_string = \
            'cp %s/settings_base.py %s/settings_base.py' % (cwd, backup_dir)
        retcode = subprocess.call(settings_base_string, shell=True)
        if retcode < 0:
            print >> sys.stderr, \
            "Could not copy the settings_base file," \
            "Copy was terminated by signal", -retcode
    except OSError, e:
        print 'Could not add copy settings_base file, Got error: %s' % e
        sys.exit(0)

    # create copy of settings.py with another name
    try:
        settings_old_string = \
            'cp %s/settings.py %s/ye_olde_settings.py' % (cwd, cwd,)
        retcode = subprocess.call(settings_old_string, shell=True)
        if retcode < 0:
            print >> sys.stderr, \
            "Could not copy settings.py to ye_olde_settings.py file," \
            "Copy was terminated by signal", -retcode
    except OSError, e:
        print 'Could not copy settings.py to ye_olde_settings.py file, Got error: %s' % e
        sys.exit(0)

    print '\nCompleted backing up old settings files to: \n\t%s/' % backup_dir


def get_simple_settings():
    """Add the simple values to the conf dictinary"""
    import ye_olde_settings as settings
    for key in confs.keys():
        try:
            confs[key] = getattr(settings, '%s' % key)
        except Exception, e:
            print "Simple setting import error:", e

def get_multilevel_settings():
    """Add multilevel dictionaries(DATABASES) to the confs dictionary"""
    import ye_olde_settings as settings
    db_confs = {
        'NAME': '',
        'ENGINE': '',
        'USER': '',
        'PASSWORD': '',
        'HOST': ''
    }
    for key in db_confs.keys():
        try:
            confs['DB_%s' % key] = settings.DATABASES['default']['%s' % key]
        except KeyError, e:
            print 'Default database parsing got KeyErrors: %s' % e

        try:
            confs['WP_%s' % key] = settings.DATABASES['wordpress']['%s' % key]
        except KeyError, e:
            print 'Wordpress database parsing got KeyErrors: %s' % e


def generate_new_settings():
    """Use the confs and the settings template to create a settings string"""
    setup_environ(settings)
    
    template_file = open('%s/prepare_new_settings_local.template' % cwd)
    template_content = template_file.read()
    template_file.close()
    t = Template(template_content)

    return t.render(Context(confs))


def persist_settings(settings_content):
    """Persist the site specific settings to akvo/settings/60-local.conf"""
    local_file_path = '%s/60-local.conf' % settings_dir
    try:
        local_file = open(local_file_path, 'w')
        local_file.write(settings_content)
        local_file.close()
    except IOError:
        print 'Could not persist 60-local.conf'
        sys.exit(0)
    print '\nLocal settings have been saved to:\n\t%s' % local_file_path


def main():
    """Kickstart the script"""
    print 'Starting migration script...'
    verify_settings_dir()
    backup_old_settings()
    get_simple_settings()
    get_multilevel_settings()
    persist_settings(generate_new_settings())
    print '\nComplete, you can now checkout a branch with new settings :-)'


if __name__ == '__main__':
    main()
