# -*- coding: utf-8 -*-

# Akvo Reporting is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

from __future__ import print_function
import sys

from django.core.management.base import BaseCommand

from ...models import UserProjects, Project, User


class Command(BaseCommand):

    args = '<email_id> (all|none|<project_id_list>)'
    help = 'Script restricting project access for an employment'

    def handle(self, *args, **options):

        if len(args) != 3:
            print('Usage: {} {}'.format(sys.argv[0], self.args))
            sys.exit(1)

        email, projects = args
        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            print('Error: Could not find user with email id: {}.'.format(email))
            sys.exit(1)

        if projects == 'all':
            UserProjects.objects.filter(user=user).delete()
            print('Removed all permission restrictions for user {}.'.format(user.email))

        elif projects == 'none':
            whitelist, created = UserProjects.objects.get_or_create(user=user)
            if not created:
                whitelist.projects.clear()
            print('User {}  cannot access any projects'.format(user.email))

        else:
            pks = projects.split(',')
            whitelist, created = UserProjects.objects.get_or_create(user=user)
            if not created:
                whitelist.projects.clear()
            for pk in pks:
                whitelist.projects.add(Project.objects.get(pk=pk))
            print('User {} limited to access projects: {}'.format(
                user.email, projects))
