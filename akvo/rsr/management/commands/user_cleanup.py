# -*- coding: utf-8 -*-

# Akvo Reporting is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

from datetime import timedelta

from django.core.management.base import BaseCommand
from django.db.models import F
from django.utils import timezone

from ...models import User


class Command(BaseCommand):
    help = 'Script for cleaning up inactive user accounts'

    def add_arguments(self, parser):
        parser.add_argument(
            '-n', '--num-days',
            action='store', dest='num_days',
            default=30,
            help='Filter users who joined more than \'n\' days ago'
        )
        parser.add_argument(
            '-d', '--delete',
            action='store_true', dest='delete',
            default=False,
            help='Delete filtered users in addition to listing them'
        )
        parser.add_argument(
            '-i', '--inactive',
            action='store_true', dest='inactive',
            default=False,
            help='Filter non-active users'
        )
        parser.add_argument(
            '-e', '--no-employment',
            action='store_true', dest='no_employment',
            default=False,
            help='Filter users lacking employment'
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
        no_activity = []

        # prune users with 'date_joined' older than
        filter_date = timezone.now() - timedelta(days=num_days)
        if verbosity > 1:
            self.stdout.write('Pruning date: %s' % (filter_date))

        users_queryset = User.objects.exclude(date_joined__gt=filter_date)\
                                     .exclude(is_admin=True)\
                                     .exclude(is_superuser=True)

        count = 0

        # remove inactive accounts
        if prune_inactive:
            if verbosity > 0:
                self.stdout.write('Filtering all non-activated user accounts older than %s days.'
                                  % (num_days))
            non_active = users_queryset.filter(is_active=False, last_login=F('date_joined'))
            count += non_active.count()
            if verbosity > 1:
                for n, u in enumerate(non_active):
                    self.stdout.write('- %s (joined %s) [%s/%s]'
                                      % (u.username, u.date_joined, n + 1, len(non_active)))
            if delete:
                non_active.delete()

        # remove no employment accounts
        if prune_employment:
            if verbosity > 0:
                self.stdout.write('Filtering all non-admin/superuser user accounts without an employment older than %s days.' % (num_days))
            no_activity = users_queryset\
                .filter(employers__isnull=True)\
                .filter(projectupdate__isnull=True)\
                .filter(projectcomment__isnull=True)\
                .filter(created_period_updates__isnull=True)\
                .filter(approved_period_updates__isnull=True)\
                .filter(indicatorperioddatacomment__isnull=True)\
                .filter(user_projects__isnull=True)\
                .filter(iati_exports__isnull=True)\
                .filter(iati_imports__isnull=True)\
                .filter(logentry__isnull=True)

            count += no_activity.count()
            if verbosity > 1:
                for n, u in enumerate(no_activity):
                    self.stdout.write('- %s (joined %s) [%s/%s]'
                                      % (u.username, u.date_joined, n + 1, len(no_activity)))
            if delete:
                no_activity.delete()

        if delete:
            if verbosity > 0:
                self.stdout.write(
                    '%s user(s) matched filter and were successfully removed.' % count)

        else:
            if verbosity > 0:
                self.stdout.write(
                    '%s user(s) matched filter, use \'-d\' flag to remove them.' % count)
