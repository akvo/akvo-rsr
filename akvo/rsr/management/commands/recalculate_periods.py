# -*- coding: utf-8 -*-

# Akvo Reporting is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


from django.core.management.base import BaseCommand
from django.db.models import Count

from ...models import IndicatorPeriod


class Command(BaseCommand):

    args = '[<project_id>]'
    help = 'Script for recalculating periods which have children'

    def handle(self, *args, **options):

        # parse options
        verbosity = int(options['verbosity'])

        if len(args) == 1:
            project_id = args[0]
        else:
            project_id = None

        periods = IndicatorPeriod.objects\
                                 .annotate(child_count=Count('child_periods'))\
                                 .filter(child_count__gt=0)

        if project_id:
            periods = periods.filter(indicator__result__project=project_id)
            if verbosity > 1:
                print('Recalculating periods on project {}'.format(project_id))

        if verbosity > 1:
            print('Recalculating {} periods'.format(periods.count()))

        for period in periods:
            if verbosity > 1:
                print('Recalculating period {}'.format(period.id))
            period.recalculate_period()
