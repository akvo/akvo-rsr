# -*- coding: utf-8 -*-

# Akvo Reporting is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


from django.conf import settings
from django.core.management.base import BaseCommand

from akvo.rsr.models import Project, OrganisationCustomField, ProjectCustomField


class Command(BaseCommand):
    help = 'Script to delete all EUTF custom fields'

    def handle(self, *args, **options):
        org_custom_fields = OrganisationCustomField.objects.filter(organisation_id=settings.EUTF_ORG_ID)
        n = org_custom_fields.count()
        print('Deleting {} organisation custom fields'.format(n))
        org_custom_fields.delete()

        eutf_root = Project.objects.get(id=settings.EUTF_ROOT_PROJECT)
        # FIXME: Setting descendants to 2 doesn't seem to work. There are more
        # projects further down the tree!
        eutf_projects = eutf_root.descendants().values_list('id', flat=True)
        project_custom_fields = ProjectCustomField.objects.filter(project_id__in=eutf_projects)
        n = project_custom_fields.count()
        print('Deleting {} project custom fields'.format(n))
        project_custom_fields.delete()
