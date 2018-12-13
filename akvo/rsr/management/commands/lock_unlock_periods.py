# -*- coding: utf-8 -*-

# Akvo Reporting is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

import sys

from django.core.management.base import BaseCommand

from ...models import IndicatorPeriod, Keyword, Project


class Command(BaseCommand):

    help = 'Script for locking and unlocking periods based on Keyword'

    def add_arguments(self, parser):
        parser.add_argument(
            'action',
            type=str,
            choices=['lock', 'unlock'],
            help='Action to take - lock or unlock'
        )
        parser.add_argument(
            '-k',
            '--keyword',
            action='store',
            dest='keyword',
            help='Keyword to use for filtering Indicator Periods'
        )

    def handle(self, *args, **options):

        # parse options
        verbosity = int(options['verbosity'])
        keyword = options.get('keyword')
        action = options.get('action')

        if not keyword:
            print 'Keyword argument is required'
            sys.exit(1)

        try:
            keyword = Keyword.objects.get(label=keyword)
        except Keyword.DoesNotExist:
            print 'Keyword does not exist'
            sys.exit(1)

        projects = Project.objects.filter(keywords__in=[keyword])
        indicator_periods = IndicatorPeriod.objects.filter(indicator__result__project_id__in=projects)
        count = indicator_periods.count()
        if count == 0:
            print 'No indicator periods found to {}'.format(action)
            sys.exit(0)

        if verbosity > 1:
            self.stdout.write('{}ing {} periods'.format(action.capitalize(), count))

        locked = action == 'lock'
        indicator_periods.update(locked=locked)
        self.stdout.write('{}ed {} periods'.format(action.capitalize(), count))
