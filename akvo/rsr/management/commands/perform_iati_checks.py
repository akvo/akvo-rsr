# -*- coding: utf-8 -*-

# Akvo Reporting is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

from akvo.rsr.models.project import Project

from django.core.management.base import BaseCommand


class Command(BaseCommand):
    help = u"Perform all IATI checks for all projects and store the checks in the DB."

    def handle(self, *args, **options):
        for project in Project.objects.all():
            self.stdout.write('Performing IATI checks for project {0}...'.format(project.pk))
            project.update_iati_checks()
