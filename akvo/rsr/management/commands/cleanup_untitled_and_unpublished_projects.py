# -*- coding: utf-8 -*-

# Akvo Reporting is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

from datetime import datetime, timedelta
from tablib import Dataset
from django.core.management.base import BaseCommand
from django.db import transaction
from akvo.rsr.models import Project, PublishingStatus, IndicatorPeriodData, Result, IatiActivityImport


class Command(BaseCommand):
    help = """\
    Delete all Untitled and Unpublished projects
    """

    DEFAULT_DATE = datetime.now() - timedelta(days=7)

    def add_arguments(self, parser):
        parser.add_argument('--date', type=lambda date: datetime.strptime(date, '%Y-%m-%d').date(), default=self.DEFAULT_DATE.date())
        parser.add_argument('--dry-run', action='store_true', help='Do not actually delete projects')

    def handle(self, *args, **options):
        the_date = options['date']
        dry_run = options['dry_run']
        verbosity = options['verbosity']
        projects = Project.objects.filter(
            created_at__lt=the_date,
            title__exact='',
            publishingstatus__status=PublishingStatus.STATUS_UNPUBLISHED
        )
        if not dry_run:
            with transaction.atomic():
                updates = IndicatorPeriodData.objects.filter(period__indicator__result__project__in=projects)
                if verbosity > 0:
                    print(f"Deleting {updates.count()} period updates")
                updates.delete()
                iati_import = IatiActivityImport.objects.filter(project__in=projects)
                if verbosity > 0:
                    print(f"Deleting {iati_import.count()} iati activity import")
                iati_import.delete()
                results = Result.objects.filter(project__in=projects)
                if verbosity > 0:
                    print(f"Deleting {results.count()} results")
                results.delete()
                if verbosity > 0:
                    print(f"Deleting {projects.count()} projects")
                projects.delete()
        else:
            if verbosity > 1:
                data = Dataset()
                data.headers = [
                    'project_id',
                    'project_title',
                    'is_published',
                    'created_at'
                ]
                for p in projects:
                    data.append([
                        p.id,
                        p.title,
                        p.is_published(),
                        p.created_at
                    ])
                print(data.export('csv'))
            if verbosity > 0:
                print(f'Found {projects.count()} projects to delete.')
