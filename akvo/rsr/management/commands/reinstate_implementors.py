# -*- coding: utf-8 -*-

# Akvo Reporting is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


from django.core.management.base import BaseCommand
from django.utils.encoding import smart_str

from ...models import Project, Partnership, Organisation

IMPLEMENTING_PARTNERS = (
    # (Project ID, Organisation ID,)
    (5357, 3867,),
    (5381, 3870,),
    (5382, 785,),
    (5384, 2832,),
    (5384, 3865,),
    (5385, 3871,),
    (5387, 3869,),
    (5388, 3868,),
    (5389, 2832,),
    (5390, 785,),
    (5391, 1148,),
    (5392, 3866,),
    (5393, 2832,),
    (5394, 3395,),
    (5395, 2832,),
    (5396, 3865,),
    (5397, 3864,),
    (5398, 2832,),
    (5399, 785,),
    (5400, 3395,),
    (5402, 3210,),
    (5402, 1824,),
    (5416, 3950,),
    (5416, 443,),
    (5416, 2769,),
    (5416, 3893,),
    (5416, 3892,),
    (5417, 3889,),
    (5417, 748,),
    (5426, 3888,),
    (5430, 3883,),
    (5441, 4323,),
    (5441, 4324,),
    (5441, 2156,),
    (5453, 3891,),
    (5453, 3894,),
    (5453, 2563,),
    (5454, 4201,),
    (5454, 908,),
    (5454, 3876,),
    (5454, 3883,),
    (5456, 3888,),
    (5461, 1148,),
    (5462, 785,),
    (5462, 3898,),
    (5462, 3897,),
    (5493, 785,),
    (5499, 3954,),
    (5499, 785,),
    (5500, 3954,),
    (5500, 3866,),
    (5501, 3952,),
    (5501, 3953,),
    (5501, 3951,),
    (5531, 1148,),
    (5573, 3979,),
    (5584, 3894,),
    (5590, 1148,),
    (5592, 1148,),
    (5595, 3395,),
    (5595, 1148,),
    (5609, 2563,),
    (5609, 3868,),
    (5610, 3210,),
    (5611, 3994,),
    (5612, 3883,),
    (5613, 3995,),
    (5614, 908,),
    (5616, 3866,),
    (5616, 785,),
    (5617, 3395,),
    (5618, 3979,),
    (5620, 2563,),
    (5620, 3868,),
    (5621, 2563,),
    (5623, 3996,),
    (5624, 3997,),
    (5625, 2755,),
    (5626, 2832,),
    (5627, 3883,),
    (5628, 3864,),
    (5629, 1148,),
    (5630, 1148,),
    (5631, 1148,),
    (5632, 1148,),
    (5633, 1148,),
    (5634, 3395,),
    (5634, 2832,),
    (5634, 1148,),
    (5635, 3782,),
    (5635, 2755,),
    (5635, 130,),
    (5635, 1824,),
    (5635, 3890,),
    (5636, 3888,),
    (5637, 785,),
    (5638, 2755,),
    (5638, 1491,),
    (5638, 3890,),
    (5639, 3979,),
    (5640, 2769,),
    (5641, 3865,),
    (5642, 3943,),
    (5643, 3868,),
    (5643, 2832,),
    (5644, 3892,),
    (5644, 3891,),
    (5644, 3893,),
    (5645, 4043,),
    (5646, 3943,),
    (5647, 3888,),
    (5647, 3395,),
    (5648, 1048,),
    (5648, 1824,),
    (5648, 3890,),
    (5649, 2832,),
    (5882, 3395,),
    (6015, 1148,),
    (6016, 3979,),
    (6028, 3891,),
    (6031, 2769,),
    (6263, 785,),
    (6263, 428,),
    (6263, 1148,),
    (6263, 3883,),
    (6263, 908,),
    (6281, 4566,),
)


class Command(BaseCommand):

    def handle(self, *args, **options):
        print("Setting upthe following implementing partners:")
        print("Project ID\tProject title\tOrganisation ID\tOrganistaion name")
        for project_id, org_id in IMPLEMENTING_PARTNERS:
            project = Project.objects.get(pk=project_id)
            assert project.title[:3] == "DEC", "Not a DEC project"
            organisation = Organisation.objects.get(pk=org_id)
            Partnership.objects.create(
                project=project,
                organisation=organisation,
                iati_organisation_role=Partnership.IATI_IMPLEMENTING_PARTNER
            )
            print(smart_str("{}\t{}\t{}\t{}".format(
                project.pk,
                project.title,
                organisation.pk,
                organisation.name
            )))
