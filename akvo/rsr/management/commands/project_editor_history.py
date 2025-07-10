#!/usr/bin/env python3

# Akvo Reporting is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


from django.contrib.admin.models import ADDITION, CHANGE, DELETION, LogEntry
from django.contrib.contenttypes.models import ContentType
from django.core.management.base import BaseCommand
from tablib import Dataset

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
        dataset = Dataset()
        dataset.headers = [
            "datetime",
            "user",
            "action",
            "object",
            "message",
        ]
        for entry in entries:
            dataset.append(
                [
                    entry.action_time,
                    entry.user.email,
                    ACTIONS[entry.action_flag],
                    entry.object_repr,
                    entry.change_message,
                ]
            )
        self.stdout.write(dataset.export("csv"))
