# -*- coding: utf-8 -*-

# Akvo Reporting is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

from django.core.management.base import BaseCommand
from optparse import make_option
from django.utils import timezone
from datetime import timedelta
from ...models import Project, PublishingStatus


class Command(BaseCommand):

    args = ''
    help = 'Script for cleaning up empty projects'

    option_list = BaseCommand.option_list + (
        make_option('-n', '--num-days',
                    action='store', dest='num_days',
                    default=7,
                    help='Filter projects older than \'n\' days'),
        make_option('-d', '--delete',
            action='store_true', dest='delete',
            default=False,
            help='Delete filtered projects in addition to listing them'),
        )

    def handle(self, *args, **options):
        
        # parse options
        verbosity = int(options['verbosity'])
        delete = bool(options['delete'])
        num_days = int(options['num_days'])


        # initialize arrays
        empty_projects = []

        # set filter date
        filter_date = timezone.now() - timedelta(days=num_days)
        if verbosity > 1: self.stdout.write('Pruning date: %s' % (filter_date))

        # filter empty projects
        if verbosity > 0: self.stdout.write('Filtering all empty projects older than %s days.'
                                            % (num_days))

        filter_projects = Project.objects.filter(publishingstatus__status=PublishingStatus.STATUS_UNPUBLISHED)\
            .exclude(created_at__gt=filter_date)

        for n, p in enumerate(filter_projects):
            if p.is_empty():
                empty_projects += [p]

        for n, p in enumerate(empty_projects):
            if verbosity > 1: self.stdout.write('- [%s/%s] Empty project by %s (created %s) '
                                                % (n + 1, len(empty_projects), p.find_primary_organisation(), p.created_at))

            if delete:
                p.delete()

        # delete filtered projects
        if delete:
            if verbosity > 0: self.stdout.write('%s projects(s) matched filter and were successfully removed.'
                              % (len(empty_projects)))

        else:
            if verbosity > 0: self.stdout.write('%s projects(s) matched filter, use \'-d\' flag to remove them.'
                              % (len(empty_projects)))
