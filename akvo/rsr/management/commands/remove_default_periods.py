# -*- coding: utf-8 -*-

# Akvo Reporting is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


import sys

from django.core.management.base import BaseCommand

from akvo import settings

from ...models import Project, DefaultPeriod


class Command(BaseCommand):
    args = '<single period hierarchy ID>'
    help = ('Sets Indicator.default_periods to False for all indicators of projects in named '
            'single period hierarchy')

    def handle(self, *args, **options):

        if len(args) != 1:
            print('Usage: {} {} {}'.format(sys.argv[0], sys.argv[1], self.args))
            sys.exit(1)

        hierarchy = settings.SINGLE_PERIOD_INDICATORS.get(args[0], None)

        if hierarchy is None:
            print('ERROR: No hierarchy with name {}'.format(args[0]))
            sys.exit(1)

        root = Project.objects.get(pk=hierarchy['pk'])
        projects = root.descendants()

        default_periods = DefaultPeriod.objects.filter(project_id__in=projects)
        print('Found {} default periods'.format(default_periods.count()))

        if default_periods.count() > 0:
            print('Deleting them all')
            default_periods.delete()
