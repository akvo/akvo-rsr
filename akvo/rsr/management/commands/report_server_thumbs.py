# -*- coding: utf-8 -*-

# Akvo Reporting is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

from django.core.management.base import BaseCommand

from akvo.utils import get_report_thumbnail
from ..utils import rotate_spinner
from ...models import ProjectUpdate


class Command(BaseCommand):
    help = """
    Script that generates thumbnails to be used by the report server of all project update images.
    """

    def handle(self, *args, **options):

        updates = ProjectUpdate.objects.all()

        for update in updates:
            rotate_spinner()
            if update.photo:
                get_report_thumbnail(update.photo)
