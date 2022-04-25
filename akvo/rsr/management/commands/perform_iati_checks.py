# -*- coding: utf-8 -*-

# Akvo Reporting is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.
import argparse
import datetime
import sys

from akvo.rsr.models import Project, Organisation

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
        parser.add_argument(
            '-o', '--org-id',
            type=int,
            help='Check all project of an organisation. Other options will be ignored if this option is set',
        )

    def handle(self, *args, **options):
        projects = self.get_projects(options)

        self.stdout.write('Performing IATI checks for {} ...'.format(projects.count()))
        for project in projects:
            self.stdout.write('Performing IATI checks for project {0}...'.format(project.pk))
            project.update_iati_checks()

    def get_projects(self, options):
        org_id = options["org_id"]
        if org_id:
            try:
                org = Organisation.objects.get(id=org_id)
                return org.all_projects()
            except Organisation.DoesNotExist:
                self.stderr.write("Organisation not found")
                sys.exit(1)

        all_option = options["all"]
        date_start = options["date_start"]
        date_end = options["date_end"]

        projects = Project.objects.all()

        if not (all_option or date_start or date_end):
            self.stdout.write("No options provided: only checking projects with run_iati_checks=True")
            return projects.filter(run_iati_checks=True)

        if all_option:
            self.stdout.write("Checking ALL projects. This might take a while...")
            return projects

        if date_start:
            self.stdout.write("Filtering projects on and after %s" % date_start)
            projects = projects.filter(created_at__gte=date_start)
        if date_end:
            self.stdout.write("Filtering projects on and before %s" % date_end)
            projects = projects.filter(created_at__lte=date_end)

        return projects
