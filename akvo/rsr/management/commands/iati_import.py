# -*- coding: utf-8 -*-

# Akvo Reporting is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

from django.core.management.base import BaseCommand
from ...models.iati_import import IatiImport


class Command(BaseCommand):
    help = "Check all enabled iati_imports to see if they should execute"

    def handle(self, *args, **options):

        iati_imports = (
            IatiImport.objects.filter(enabled=True)
        )

        for iati_import in iati_imports:
            iati_import.check_execution()
