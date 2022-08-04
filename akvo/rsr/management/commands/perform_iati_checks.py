# -*- coding: utf-8 -*-

# Akvo Reporting is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

from django.core.management.base import BaseCommand
from akvo.rsr.usecases.iati_validation import run_iati_organisation_validation_job, run_iati_activity_validation_job


class Command(BaseCommand):
    help = "Perform all IATI checks."

    def handle(self, *args, **options):
        # Additions/changes to organisation will occur less frequently so they are prioritized.
        run_iati_organisation_validation_job()
        run_iati_activity_validation_job()
