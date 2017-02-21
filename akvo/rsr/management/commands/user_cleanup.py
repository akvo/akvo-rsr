# -*- coding: utf-8 -*-

# Akvo Reporting is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

from django.core.management.base import BaseCommand
from optparse import make_option
from django.utils import timezone
from datetime import timedelta
from itertools import chain
from ...models import User


class Command(BaseCommand):

    args = ''
    help = 'Script for cleaning up inactive user accounts'

    option_list = BaseCommand.option_list + (
        make_option('-n', '--num-days',
                    action='store', dest='num_days',
                    default=7,
                    help='Filter users who joined more than \'n\' days ago'),
        make_option('-d', '--delete',
                    action='store_true', dest='delete',
                    default=False,
                    help='Delete filtered users in addition to listing them'),
        make_option('-i', '--inactive',
                    action='store_true', dest='inactive',
                    default=False,
                    help='Filter non-active users'),
        make_option('-e', '--no-employment',
                    action='store_true', dest='no_employment',
                    default=False,
                    help='Filter users lacking employment'),
    )

    def handle(self, *args, **options):

        # parse options
        verbosity = int(options['verbosity'])
        delete = bool(options['delete'])
        num_days = int(options['num_days'])

        if bool(options['inactive']) and not bool(options['no_employment']):
            prune_inactive = True
            prune_employment = False

        elif not bool(options['inactive']) and bool(options['no_employment']):
            prune_inactive = False
            prune_employment = True

        else:
            prune_inactive = True
            prune_employment = True

        # initialize arrays
        non_active = []
        no_employment = []

        # prune users with 'date_joined' older than
        filter_date = timezone.now() - timedelta(days=num_days)
        if verbosity > 1: self.stdout.write('Pruning date: %s' % (filter_date))

        # remove inactive accounts
        if prune_inactive:
            if verbosity > 0: self.stdout.write('Filtering all non-activated user accounts older than %s days.'
                                                % (num_days))
            non_active = User.objects.exclude(date_joined__gt=filter_date).filter(is_active=False)\
                .exclude(is_admin=True).exclude(is_superuser=True)

            for n, u in enumerate(non_active):
                if verbosity > 1: self.stdout.write('- %s (joined %s) [%s/%s]'
                                                    % (u.username, u.date_joined, n + 1, len(non_active)))
                if delete:
                    u.delete()

        # remove no employment accounts
        if prune_employment:
            if verbosity > 0: self.stdout.write('Filtering all non-admin/superuser user accounts without an employment older than %s days.' % (num_days))
            no_employment = User.objects.exclude(date_joined__gt=filter_date).filter(employers__isnull=True)\
                .exclude(is_admin=True).exclude(is_superuser=True)

            for n, u in enumerate(no_employment):
                if verbosity > 1: self.stdout.write('- %s (joined %s) [%s/%s]'
                                                    % (u.username, u.date_joined, n + 1, len(no_employment)))
                if delete:
                    u.delete()

        if delete:
            if verbosity > 0: self.stdout.write('%s user(s) matched filter and were successfully removed.'
                                                % (len(set(list(chain(non_active, no_employment))))))

        else:
            if verbosity > 0: self.stdout.write('%s user(s) matched filter, use \'-d\' flag to remove them.'
                                                % (len(set(list(chain(non_active, no_employment))))))
