# -*- coding: utf-8 -*-

# Akvo Reporting is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

from datetime import datetime, timedelta

from django.core.management.base import BaseCommand
from django.db import transaction
from django.utils import timezone
from django.utils.timezone import make_aware
from tablib import Dataset

from akvo.rsr.management.utils import VerbosityAwareWriter
from akvo.rsr.models import IndicatorPeriodData, Project, PublishingStatus, Result
from akvo.utils.datetime import datetime_remove_time


class Command(BaseCommand):
    help = """\
    Delete all Untitled and Unpublished projects
    """

    DEFAULT_DATE = datetime_remove_time(timezone.now() - timedelta(days=7))

    def add_arguments(self, parser):
        parser.add_argument(
            '--date',
            type=lambda date: make_aware(datetime.strptime(date, '%Y-%m-%d')),
            default=self.DEFAULT_DATE,
        )
        parser.add_argument('--dry-run', action='store_true', help='Do not actually delete projects')

    def handle(self, *args, **options):
        the_date = options['date']
        dry_run = options['dry_run']
        writer = VerbosityAwareWriter(self.stdout, options['verbosity'])
        projects = Project.objects.filter(
            created_at__lt=the_date,
            title__exact='',
            publishingstatus__status=PublishingStatus.STATUS_UNPUBLISHED
        )
        if not dry_run:
            with transaction.atomic():
                updates = IndicatorPeriodData.objects.filter(period__indicator__result__project__in=projects)
                writer.write(f"Deleting {updates.count()} period updates")
                updates.delete()
                results = Result.objects.filter(project__in=projects)
                writer.write(f"Deleting {results.count()} results")
                results.delete()
                writer.write(f"Deleting {projects.count()} projects")
                projects.delete()
        else:
            if options['verbosity'] > 1:
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
                writer.write(data.export('csv'))
            writer.write(f'Found {projects.count()} projects to delete.')
