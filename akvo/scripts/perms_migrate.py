# -*- coding: utf-8 -*-

################################################################################
#
# Django permissions migrator
#
# This script creates a file, permissions_data.py, that holds info about the
# Groups and Group_Permissions defined for the current django project.
#
# The idea is to use this to be able to port Groups and Permissions data from
# one django installation to another that may need the same Permissions
# settings but that does not have the exact same content type PK ids.
#
# The generated permissions_data.py can be moved to another django installation
# and be used as data for creating/adding the Groups and their Permissions.
#
# To generate permissions_data.py run "python perms_migrate.py dump" from the
# command line. Move the resulting permissions_data.py to the new installation
# and run "python perms_migrate load"
#
# The loading is somewhat careful: it only generates new Groups if there is no
# Group already with the same name. Permissions are only created if they don't
# already exist.
#
################################################################################

#from django.core.management import setup_environ
#import settings
#setup_environ(settings)

from optparse import OptionParser
import os
import pprint
import sys

# this is the local data file
import permissions_data

def pretty():
    pp = pprint.PrettyPrinter()
    pp.pprint(permissions_data.GROUP_LIST)
    pp.pprint(permissions_data.PERMS_DICT)

def dump():
    from django.contrib.auth.models import Group
    groups = Group.objects.all()
    group_list = []
    perms_dict = {}
    for group in groups:
        group_name = group.name
        group_list.append(group_name)
        #print group_list
        perms_dict[group_name] = []
        for perm in group.permissions.all():
            if perm.content_type.model == perm.codename.split('_')[-1]:
                perms_dict[group_name].append(
                    {
                        'name'      : perm.name,
                        'app_label' : perm.content_type.app_label,
                        'model'     : perm.content_type.model,
                        'codename'  : perm.codename,
                    }
                )
            else:
                print "%s don't match %s" % (perm.content_type.model, perm.codename.split('_')[-1], )

    data_str = "GROUP_LIST = %s\nPERMS_DICT = %s\n" % (str(group_list),str(perms_dict))
    perms_file_path = os.path.join(os.path.dirname(__file__), 'permissions_data.py').replace('\\','/')
    perms_file = open(perms_file_path,"w")
    perms_file.write(data_str)
    perms_file.close()
    print 'Done! Groups and Permissions dumped into permissions_data.py'

def load(options):
    from django.contrib.auth.models import Group, Permission
    from django.contrib.contenttypes.models import ContentType
    group_list = permissions_data.GROUP_LIST
    perms_dict = permissions_data.PERMS_DICT
    for group_name in group_list:
        group, created = Group.objects.get_or_create(name=group_name)
        if options.verbose:
            if created:
                print "Created group: %s" % group
            else:
                print "Found existing group: %s" % group
        #print group.permissions.all()
        perms_list = perms_dict.get(group_name, [])
        for perm in perms_list:
            try:
                content_type = ContentType.objects.get(app_label=perm['app_label'], model=perm['model'])
            except:
                return "Content type %s_%s does not exist in this DB" % (perm['app_label'], perm['model'])
            permission, created = Permission.objects.get_or_create(
                codename=perm['codename'], content_type=content_type, defaults={'name': perm['name']}

            )
            if options.verbose:
                if created:
                    print "Created permission: %s" % permission
                else:
                    print "Found existing permission: %s" % permission
            if not permission in group.permissions.all():
                group.permissions.add(permission)
                if options.verbose:
                    print "Adding %s to %s" %(permission, group)

    print "Done!"

def get_usage():
    usage = """
  %prog [options] action:
      action: dump load pretty analyze
"""
    return usage


def run_terminal_command(argv=None):
    # Use sys.argv if we've not passed in a custom argv
    if argv is None:
        argv = sys.argv
        
    parser = OptionParser(usage=get_usage())
    parser.add_option('--settings',
        help='Python path to settings module, e.g. "myproject.settings.main". If this isn\'t provided, the DJANGO_SETTINGS_MODULE environment variable will be used.')
    parser.add_option('-v', '--verbose', help='Verbose mode', action='store_true')

    options, args = parser.parse_args(argv[1:])

    if len(args) == 0:
        parser.print_help()
        sys.exit(0)

    action = args[0]
    apps = args[1:]
    if options.settings:
        os.environ['DJANGO_SETTINGS_MODULE'] = options.settings
    else:
        from django.core.management import setup_environ
        try:
            import settings
        except ImportError:
            print "You don't appear to have a settings file in this directory!"
            print "Please run this from inside a project directory"
            sys.exit()
        setup_environ(settings)

    if action == 'load':
        load(options)
    elif action == 'dump':
        dump()
    elif action == 'pretty':
        pretty()
    else:
        parser.print_help()
        
if __name__ == '__main__':
    run_terminal_command()