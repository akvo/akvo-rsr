# -*- coding: utf-8 -*-

# Akvo Reporting is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

import sys

from django.core.management.base import BaseCommand

from ...models import UserPermissionedProjects, User


class Command(BaseCommand):

    args = '<email_id> (all|none|<project_id_list>)'
    help = 'Script to permission projects for a user'

    def handle(self, *args, **options):

        if len(args) != 2:
            print 'Usage: {} {}'.format(sys.argv[0], self.args)
            sys.exit(1)

        email, projects = args
        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            print('Could not find user with email id: {}'.format(email))
            sys.exit(1)

        if projects == 'all':
            UserPermissionedProjects.objects.filter(user=user).delete()
            print('Removed all permission restrictions for user - {}'.format(email))

        elif projects == 'none':
            permissions, created = UserPermissionedProjects.objects.get_or_create(user=user)
            if not created:
                permissions.projects.clear()
            print('User({}) cannot access any projects'.format(email))

        else:
            projects = projects.split(',')
            permissions, created = UserPermissionedProjects.objects.get_or_create(user=user)
            if not created:
                permissions.projects.clear()
            for project in projects:
                permissions.projects.add(project)
            print('User({}) given permissions to projects: {}'.format(email, ', '.join(projects)))
