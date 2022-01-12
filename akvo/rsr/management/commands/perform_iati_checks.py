# -*- coding: utf-8 -*-

# Akvo Reporting is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.
import argparse
import datetime

from akvo.rsr.models.project import Project

from django.core.management.base import BaseCommand


def date_arg_type(string):
    return datetime.datetime.strptime(string, '%Y-%m-%d').date()


class Command(BaseCommand):
    help = "Perform all IATI checks for projects."

    def add_arguments(self, parser: argparse.ArgumentParser):
        parser.add_argument(
            '--all',
            action='store_true',
            default=False,
            help='Run IATI checks for all the projects in the DB.',

        )
        parser.add_argument(
            '--date-start',
            type=date_arg_type,
            help='Limit to projects created on and after this day',
        )
        parser.add_argument(
            '--date-end',
            type=date_arg_type,
            help='Limit to projects created on or before this day',
        )

    def handle(self, *args, **options):
        all_option = options["all"]
        date_start = options["date_start"]
        date_end = options["date_end"]

        # Filter projects with options
        projects = Project.objects.all()
        if not (all_option or date_start or date_end):
            self.stdout.write("No options provided: only checking projects with run_iati_checks=True")
            projects = projects.filter(run_iati_checks=True)
        elif all_option:
            self.stdout.write("Checking ALL projects. This might take a while...")
        else:
            if date_start:
                self.stdout.write("Filtering projects on and after %s" % date_start)
                projects = projects.filter(created_at__gte=date_start)
            if date_end:
                self.stdout.write("Filtering projects on and before %s" % date_end)
                projects = projects.filter(created_at__lte=date_end)

        self.stdout.write('Performing IATI checks for {} ...'.format(projects.count()))
        for project in projects:
            self.stdout.write('Performing IATI checks for project {0}...'.format(project.pk))
            project.update_iati_checks()
