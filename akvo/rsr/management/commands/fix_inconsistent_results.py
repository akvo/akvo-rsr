# -*- coding: utf-8 -*-

# Akvo Reporting is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

from django.core.management.base import BaseCommand
from akvo.rsr.checks.results import get_with_non_familial_parents
from akvo.rsr.usecases.fix_inconsistent_results import fix_inconsistent_results


class Command(BaseCommand):
    def handle(self, *args, **options):
        results = get_with_non_familial_parents()
        fix_inconsistent_results(results)
