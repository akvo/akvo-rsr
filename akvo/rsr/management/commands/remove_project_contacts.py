# -*- coding: utf-8 -*-

# Akvo Reporting is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


from django.core.management.base import BaseCommand

from akvo.rsr.models import ProjectContact


class Command(BaseCommand):
    help = "Remove ProjectContacts for all the given projects."

    def add_arguments(self, parser):
        parser.add_argument(
            'project_ids',
            action='store',
            nargs='+',
            help='IDs of projects where contacts should be deleted'
        )

    def handle(self, *args, **options):
        project_ids = options['project_ids']
        contacts = ProjectContact.objects.filter(project_id__in=project_ids)
        count = contacts.count()
        if count > 0:
            print('Deleting {} contacts'.format(count))
            contacts.delete()
        else:
            print('No contacts found to delete')
