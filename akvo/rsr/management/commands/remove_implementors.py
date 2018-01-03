# -*- coding: utf-8 -*-

# Akvo Reporting is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

# -*- coding: utf-8 -*-

# Akvo Reporting is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


from django.core.management.base import BaseCommand
from django.utils.encoding import smart_str

from ...models import Project, Partnership, Organisation


class Command(BaseCommand):

    def handle(self, *args, **options):
        """
        Find and remove all partnerships to EUTF "DEC" projects that are implementing partners that
        are also present in one or more child level, "CTR", projects.
        """
        decs = Project.objects.filter(title__startswith='DEC').order_by('id')
        field_partner = Partnership.IATI_IMPLEMENTING_PARTNER
        print(u"Removing the following implementing partners from DEC projects:")
        print u"Project ID\tProject title\tImplementing partner ID\tImplementing partner name"
        for dec in decs:
            dec_impl = set(
                Partnership.objects
                    .filter(project=dec)
                    .filter(iati_organisation_role=field_partner)
                    .values_list('organisation__id', flat=True)
            )
            ctr_impl = set()
            for ctr in dec.children_all():
                ctr_impl = ctr_impl | set(
                    Partnership.objects
                        .filter(project=ctr)
                        .filter(iati_organisation_role=field_partner)
                        .values_list('organisation__id', flat=True)
                )
            # Find the intersection of the two sets.
            # These are field partners that appear both in the DEC and the CTR
            both_levels = dec_impl & ctr_impl
            to_be_removed = (
                Partnership.objects
                    .filter(project=dec)
                    .filter(iati_organisation_role=field_partner)
                    .filter(organisation_id__in=both_levels)
            )
            for partner in to_be_removed:
                org = Organisation.objects.get(pk=partner.organisation.pk)
                print smart_str(u"{}\t{}\t{}\t{}".format(
                    dec.pk, dec.title, org.pk, org.name,
                ))
                partner.delete()
