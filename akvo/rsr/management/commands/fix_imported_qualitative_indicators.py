# -*- coding: utf-8 -*-

# Akvo Reporting is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


from django.core.management.base import BaseCommand

from akvo.rsr.models import Indicator
from akvo.rsr.models.result.utils import QUANTITATIVE, QUALITATIVE


class Command(BaseCommand):

    help = 'Script for fixing incorrectly imported qualitative indicators'

    def handle(self, *args, **options):

        incorrect_quantitative_indicators = Indicator.objects\
                                                     .exclude(parent_indicator=None)\
                                                     .filter(type=QUANTITATIVE, parent_indicator__type=QUALITATIVE)

        print('Updating {} incorrectly imported qualitative indicators'.format(
            incorrect_quantitative_indicators.count())
        )
        incorrect_quantitative_indicators.update(type=QUALITATIVE)
