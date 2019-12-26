# -*- coding: utf-8 -*-

# Akvo Reporting is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

from __future__ import print_function
import sys

from django.core.management.base import BaseCommand
from ...models import Project, OrganisationCustomField, ProjectCustomField


class Command(BaseCommand):
    help = '''
        Update the custom fields for projects of the organisations listed in the args.
        Fields are only updated if there is a matching organisation custom field where the match is
        determined by equality of the 'name' and 'section' fields.
    '''

    def handle(self, *args, **options):

        if not args:
            print(self.help)
            sys.exit(1)

        for org_id in map(int, args):
            org_fields = OrganisationCustomField.objects.filter(organisation__id=org_id)
            for project in Project.objects.filter(primary_organisation=org_id).order_by('pk'):
                print("Updating custom fields for project ID: {}".format(project.pk))
                for org_field in org_fields:
                    ProjectCustomField.objects.filter(
                        project=project, name=org_field.name, section=org_field.section
                    ).update(
                        max_characters=org_field.max_characters,
                        help_text=org_field.help_text,
                        mandatory=org_field.mandatory,
                        order=org_field.order,
                    )
