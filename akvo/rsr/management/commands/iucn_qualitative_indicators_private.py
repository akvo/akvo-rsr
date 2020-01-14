# -*- coding: utf-8 -*-

# Akvo Reporting is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


from django.core.management.base import BaseCommand

from akvo.rsr.models import Partnership, Indicator
from akvo.rsr.models.result.utils import QUALITATIVE


class Command(BaseCommand):
    help = 'Script to prevent all IUCN qualitative indicators from being exported'

    def handle(self, *args, **options):
        project_ids = Partnership.objects.filter(
            iati_organisation_role=Partnership.IATI_REPORTING_ORGANISATION,
            organisation_id=3257
        ).values_list('project_id', flat=True)
        qualitative_indicators = Indicator.objects.filter(result__project__in=project_ids, type=QUALITATIVE)
        qualitative_indicators.update(export_to_iati=False)
