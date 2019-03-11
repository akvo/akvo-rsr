# -*- coding: utf-8 -*-

# Akvo Reporting is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

from django.core.management.base import BaseCommand
from django.utils import timezone
from datetime import timedelta
from ...models import Project, PublishingStatus


class Command(BaseCommand):
    help = 'Script for cleaning up empty projects'

    def add_arguments(self, parser):
        parser.add_argument(
            '-n',
            '--num-days',
            action='store', dest='num_days',
            default=7,
            help='Filter projects older than \'n\' days'
        )
        parser.add_argument(
            '-d', '--delete',
            action='store_true', dest='delete',
            default=False,
            help='Delete filtered projects in addition to listing them'
        )

    def handle(self, *args, **options):

        # parse options
        verbosity = int(options['verbosity'])
        delete = bool(options['delete'])
        num_days = int(options['num_days'])

        # set filter date
        filter_date = timezone.now() - timedelta(days=num_days)
        if verbosity > 1:
            self.stdout.write('Pruning date: {0}'.format(str(filter_date)))

        # filter empty projects
        if verbosity > 0:
            self.stdout.write('Filtering all empty projects older than {0} days.'.format(
                str(num_days)))

        filter_projects = Project.objects.filter(
            publishingstatus__status=PublishingStatus.STATUS_UNPUBLISHED
        ).exclude(created_at__gt=filter_date)

        empty_projects = [p for p in filter_projects if p.is_empty()]

        for n, p in enumerate(empty_projects):
            if verbosity > 1:
                self.stdout.write('- [{0}/{1}] Empty project by {2} (created {3}) '.format(
                    str(n + 1),
                    str(len(empty_projects)),
                    p.primary_organisation.name.encode('ascii', 'ignore'),
                    str(p.created_at)
                ))

            if delete:
                p.delete()

        # delete filtered projects
        if delete:
            if verbosity > 0:
                self.stdout.write(
                    '{0} projects(s) matched filter and were successfully removed.'.format(
                        str(len(empty_projects))))

        elif verbosity > 0:
            self.stdout.write(
                '{0} projects(s) matched filter, use \'-d\' flag to remove them.'.format(
                    str(len(empty_projects))))
