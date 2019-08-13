# -*- coding: utf-8 -*-

# Akvo Reporting is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

from django.core.management.base import BaseCommand

from django.db.models import Q
from akvo.rsr.models import IndicatorPeriod


class Command(BaseCommand):
    help = "Clean up period.actual_comment that contains only period update dates"

    def handle(self, *args, **options):
        periods = IndicatorPeriod.objects.filter(~Q(actual_comment=''))
        for period in periods:
            period.update_actual_comment()
