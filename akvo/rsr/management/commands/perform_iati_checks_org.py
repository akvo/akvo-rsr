# -*- coding: utf-8 -*-

# Akvo Reporting is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

# Based on https://gist.github.com/edelvalle/01886b6f79ba0c4dce66

import sys
from django.core.management.base import BaseCommand
from akvo.rsr.models import Organisation


class Command(BaseCommand):
    help = "Perform all IATI checks for projects of an organisation."

    def add_arguments(self, parser):
        parser.add_argument("org_id", type=int)

    def handle(self, *args, **options):
        try:
            org = Organisation.objects.get(id=options["org_id"])
        except Organisation.DoesNotExist:
            self.stderr.write("Organisation not found")
            sys.exit(1)

        projects = org.all_projects()
        print(f'Performing IATI checks on {projects.count()} projects of "{org.name}"')
        for project in projects:
            self.stdout.write(f'Performing IATI checks for project {project.id}...')
            project.update_iati_checks()
