# -*- coding: utf-8 -*-

# Akvo Reporting is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


from django.core.management.base import BaseCommand
from django.db.models import Q
from ...models import Project, Organisation


class Command(BaseCommand):
    help = "Lists all Organisations that are project creators, and lists all projects that " \
           "don't have a project creator associated with it."

    def handle(self, *args, **options):
        self.stdout.write("List of project creator Organisations:")
        self.stdout.write("ID, Name")
        for org in Organisation.objects.filter(can_create_projects=True):
            self.stdout.write('{}, "{}"'.format(org.pk, org.name))

        self.stdout.write("List of Projects without a project creator Organisation "
                          "(Not including projects with an Akvo organisation as a partner):")
        self.stdout.write("ID, Title, sync_owner ID, sync_owner name")
        for project in Project.objects.all().prefetch_related('partners').select_related('sync_owner)'):
            if not project.partners.filter(Q(can_create_projects=True) | Q(name__icontains='akvo')):
                self.stdout.write('{},"{}",{},"{}"'.format(
                    project.pk,
                    project.title,
                    project.sync_owner.pk if project.sync_owner else "",
                    project.sync_owner.name if project.sync_owner else "",
                ))

        self.stdout.write("\nDone!")
