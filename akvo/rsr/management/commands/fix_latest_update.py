# -*- coding: utf-8 -*-

# Akvo Reporting is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


import sys

from django.core.management.base import BaseCommand
from django.db.models import Prefetch

from ...models import Project, ProjectUpdate

class Command(BaseCommand):
    help = "Set Project.last_update field. Fixes potential errors due to a bug"

    def handle(self, *args, **options):
        """Set Project.last_update to latest update for the project.

        This fixes a bug that was introduced when updates could be deleted.
        """
        sys.stdout.write(u"Fix latest update for projects"
            "\n+ means latest update added"
            "\n. means no change"
            "\n! means project has no updates\n\n")
        for project in Project.objects.all().prefetch_related(
            Prefetch(
                "project_updates",
                queryset=ProjectUpdate.objects.all().order_by('-created_at'),
            )
        ):
            try:
                if project.last_update == project.project_updates.all()[0]:
                    sys.stdout.write(".")
                else:
                    project.last_update = project.project_updates.all()[0]
                    project.save(update_fields=['last_update'])
                    sys.stdout.write("+")
            except IndexError:
                project.last_update = None
                sys.stdout.write("!")
        sys.stdout.write("\n\nDone!\n")
