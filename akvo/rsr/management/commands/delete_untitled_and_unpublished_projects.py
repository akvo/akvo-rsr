# -*- coding: utf-8 -*-

# Akvo Reporting is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

import datetime

from tablib import Dataset
from django.core.management.base import BaseCommand
from django.db.models import Q
from akvo.rsr.models import Project, PublishingStatus, IndicatorPeriodData, Result, IatiActivityImport


class Command(BaseCommand):
    help = """\
    Delete all Untitled and Unpublished projects created before the given date
    <script> <date:%Y-%m-%d> --delete
    """

    def add_arguments(self, parser):
        parser.add_argument('date', type=lambda date: datetime.datetime.strptime(date, '%Y-%m-%d').date())
        parser.add_argument('--delete', action='store_true', help='Actually delete projects')
        parser.add_argument('--quiet', action='store_true', help='Silent output messages')

    def handle(self, *args, **options):
        the_date = options['date']
        verbose = not options['quiet']
        projects = Project.objects\
            .filter(created_at__lt=the_date)\
            .filter(Q(title__exact='') | Q(publishingstatus__status=PublishingStatus.STATUS_UNPUBLISHED))
        project_ids = projects.values_list('id', flat=True)
        if options['delete']:
            updates = IndicatorPeriodData.objects.filter(period__indicator__result__project__in=project_ids)
            if verbose:
                print(f"Deleting {updates.count()} period updates")
            updates.delete()
            iati_import = IatiActivityImport.objects.filter(project__in=project_ids)
            if verbose:
                print(f"Deleting {iati_import.count()} iati activity import")
            iati_import.delete()
            results = Result.objects.filter(project__in=project_ids)
            if verbose:
                print(f"Deleting {results.count()} results")
            results.delete()
            if verbose:
                print(f"Deleting {projects.count()} projects)")
            projects.delete()
        else:
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
            print(f'Found {projects.count()} projects to delete.')
