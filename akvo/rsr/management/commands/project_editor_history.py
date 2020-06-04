#!/usr/bin/env python3

# Akvo Reporting is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


from django.contrib.admin.models import LogEntry, ADDITION, CHANGE, DELETION
from django.contrib.contenttypes.models import ContentType
from django.core.management.base import BaseCommand

from akvo.rsr.models import Project

ACTIONS = {
    ADDITION: "Added",
    CHANGE: "Changed",
    DELETION: "Deleted",
}


class Command(BaseCommand):
    help = "List all the edits to a project in the reverse chronological order."

    def add_arguments(self, parser):
        parser.add_argument("project_id")

    def handle(self, *args, **options):
        project_id = options["project_id"]
        entries = LogEntry.objects.select_related("user").filter(
            content_type_id=ContentType.objects.get_for_model(Project).pk,
            object_id=project_id,
        )
        for entry in entries:
            action = ACTIONS[entry.action_flag]
            user = entry.user.email
            time = entry.action_time
            message = entry.change_message
            print(f"{time}\t{action}\t{user}\t{message}")
