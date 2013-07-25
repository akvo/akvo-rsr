# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.
from django.core.files.uploadedfile import UploadedFile

from django.core.management import setup_environ
import settings

setup_environ(settings)

from akvo.rsr.models import Project, Partnership, Organisation

MIN_CORDAID_PK = 940

def fix_funding():
    import pdb
    pdb.set_trace()
    cordaid = Organisation.objects.get(pk=273)
    projects = Project.objects.filter(pk__gte=MIN_CORDAID_PK)
    for project in projects:
        if project.funds_needed > 0:
            cord_fund = Partnership.objects.create(
                organisation=cordaid,
                project=project,
                partner_type=Partnership.FUNDING_PARTNER,
                funding_amount = project.funds_needed,
            )

if __name__ == '__main__':
    fix_funding()
