# -*- coding: utf-8 -*-

# Akvo Reporting is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

from akvo.rsr.models.iati_export import IatiExport

from django.core.management.base import BaseCommand


class Command(BaseCommand):
    help = "Execute all pending IATI exports"

    def handle(self, *args, **options):
        """
        Checks whether there are pending IATI exports (status 1) and executes all pending exports.

        Having multiple exports run at once can do no harm.
        """
        for iati_export in IatiExport.objects.filter(status=1):
            iati_export.create_iati_file()
