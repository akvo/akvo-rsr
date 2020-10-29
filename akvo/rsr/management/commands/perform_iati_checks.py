# -*- coding: utf-8 -*-

# Akvo Reporting is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

from akvo.rsr.models.project import Project

from django.core.management.base import BaseCommand


class Command(BaseCommand):
    help = "Perform all IATI checks for projects."

    def add_arguments(self, parser):
        parser.add_argument(
            '--all',
            action='store_true',
            default=False,
            help='Run IATI checks for all the projects in the DB.',
        )

    def handle(self, *args, **options):
        projects = Project.objects.all() if options['all'] else Project.objects.filter(run_iati_checks=True)
        self.stdout.write('Performing IATI checks for {} ...'.format(projects.count()))
        for project in projects:
            self.stdout.write('Performing IATI checks for project {0}...'.format(project.pk))
            project.update_iati_checks()
