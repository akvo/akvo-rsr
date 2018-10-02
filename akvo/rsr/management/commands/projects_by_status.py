# -*- coding: utf-8 -*-

# Akvo Reporting is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

from collections import defaultdict
import sys

from django.core.management.base import BaseCommand

from akvo.rsr.models import Project


class Command(BaseCommand):
    help = """Script to print counts of projects by iati_status per reporting organisation"""
    args = 'iati_status'

    def valid_status(self, status):
        status = set(status.split(','))
        return status.issubset(set('123456'))

    def handle(self, *args, **options):
        if len(args) != 1 or not self.valid_status(args[0]):
            print 'Usage: {} {} {}'.format(sys.argv[0], sys.argv[1], self.args)
            sys.exit(1)

        iati_status = args[0].split(',')
        projects = Project.objects.published()\
                                  .filter(iati_status__in=iati_status)
        print('Found {} projects with status {}'.format(projects.count(), iati_status))
        organisations = defaultdict(set)
        for project in projects:
            reporting_org = project.reporting_org
            organisations[project.reporting_org].add(project.pk)

        for org, project_ids in organisations.items():
            print('{}, {}, "{}"'.format(org, len(project_ids), ','.join(sorted(str(id_) for id_ in project_ids))))
