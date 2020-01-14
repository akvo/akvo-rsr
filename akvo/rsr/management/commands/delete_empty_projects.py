# -*- coding: utf-8 -*-

# Akvo Reporting is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


from collections import Counter

from datetime import datetime
from django.contrib.admin.models import LogEntry, ADDITION
from django.core.management.base import BaseCommand
from optparse import make_option

from ...models import Project


class Command(BaseCommand):
    help = ("Delete empty projects. Look for projects that have only one entry in the LogEntry "
            "table, that entry being of type ADDITION. If the project is older than 14 days, "
            "delete it. NOTE: To actually delete projects supply the '--delete' option.")

    option_list = BaseCommand.option_list + (
        make_option(
            '--delete',
            action='store_true',
            dest='delete',
            default=False,
            help='Actually delete the projects'),
    )

    def handle(self, *args, **options):

        # There are a lot of projects with lower ID than 4986 that aren't empty. This is probably
        # because they were created in the Django admin. As projects are only created in the project
        # editor now, this is not a problem for newer projects.
        MAX_PROTECTED_PROJECT_ID = 4986
        PROJECT_CONTENT_TYPE_ID = 12

        # Log entries for Project
        object_ids = LogEntry.objects.filter(
            content_type=PROJECT_CONTENT_TYPE_ID).values_list('object_id', flat=True)
        # Count the number of entries per project ID
        counts = Counter(id for id in object_ids)

        # Find projects that have only one log entry
        project_ids = [
            id for (id, count) in counts.most_common()[:-len(counts) - 1:-1] if count < 2
        ]
        project_logs = LogEntry.objects.filter(
            content_type=PROJECT_CONTENT_TYPE_ID, object_id__in=project_ids).order_by('-object_id')

        for log in project_logs:
            time_since_creation = datetime.now() - log.action_time
            # Some projects only have one ChANGE entry, those should not be deleted
            if (
                    log.action_flag == ADDITION
                    and time_since_creation.days > 14
                    and int(log.object_id) > MAX_PROTECTED_PROJECT_ID
            ):
                try:
                    p = Project.objects.get(pk=int(log.object_id))
                except Project.DoesNotExist:
                    continue

                if options['delete']:
                    print('Deleting empty project. ID: {}'.format(p.pk))
                    p.delete()
                else:
                    print('Empty project ID {}'.format(p.pk))
