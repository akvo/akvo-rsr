# -*- coding: utf-8 -*-

# Akvo Reporting is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


import datetime

from django.contrib.admin.models import LogEntry
from django.core.management.base import BaseCommand
from django.db.models import Q, Count

from akvo.rsr.models import (
    IatiExport, Organisation, Project, IndicatorPeriodData,
    IndicatorPeriodDataComment,
)


def projects_using_results_framework(before_date):
    """Return projects which had activity in the results framework before a date."""

    projects_from_updates = set(
        IndicatorPeriodData.objects
        .filter(Q(created_at__lt=before_date) | Q(last_modified_at__lt=before_date))
        .values_list('period__indicator__result__project__id', flat=True)
    )

    projects_from_comments = set(
        IndicatorPeriodDataComment.objects
        .filter(Q(created_at__lt=before_date) | Q(last_modified_at__lt=before_date))
        .values_list('data__period__indicator__result__project__id', flat=True)
    )

    filter_ = (
        Q(content_type__model='indicator')
        | Q(content_type__model='indicatorperiod')
        | Q(content_type__model='result')
    )
    log_entries = LogEntry.objects.filter(action_time__lt=before_date)\
                                  .filter(filter_)\
                                  .values_list('content_type__model', 'object_id')

    indicators = [
        id_ for _, id_ in
        filter(lambda x: x[0] == 'indicator', log_entries)
    ]
    periods = [
        id_ for _, id_ in
        filter(lambda x: x[0] == 'indicatorperiod', log_entries)
    ]
    results = [
        id_ for _, id_ in
        filter(lambda x: x[0] == 'result', log_entries)
    ]

    projects_from_periods = set(
        Project.objects
        .filter(results__indicators__periods__in=periods)
        .values_list('id', flat=True)
    )
    projects_from_indicators = set(
        Project.objects
        .filter(results__indicators__in=indicators)
        .values_list('id', flat=True)
    )
    projects_from_results = set(
        Project.objects.filter(results__in=results)
        .values_list('id', flat=True)
    )

    results_projects = (projects_from_comments
                        | projects_from_updates
                        | projects_from_periods
                        | projects_from_indicators
                        | projects_from_results)

    return results_projects


class Command(BaseCommand):
    help = """\
    Script to generate the D2D report
    <script> <new_date:%Y-%m-%d> <old_date:%Y-%m-%d>
    """

    def add_arguments(self, parser):
        parser.add_argument(
            'date_start',
            type=lambda date: datetime.datetime.strptime(date, '%Y-%m-%d').date(),
            help='Start date for the period',
        )
        parser.add_argument(
            'date_end',
            type=lambda date: datetime.datetime.strptime(date, '%Y-%m-%d').date(),
            help='End date for the period',
        )

    def handle(self, *args, **options):

        date_new = options['date_end']
        date_old = options['date_start']

        print('Metric parameter,{:%Y-%m-%d},{:%Y-%m-%d}'.format(date_new, date_old))

        # Total number of organisations/partners on RSR
        orgs_new = Organisation.objects.filter(created_at__lt=date_new).distinct()
        orgs_old = Organisation.objects.filter(created_at__lt=date_old).distinct()
        print('# of partners using RSR,{},{}'.format(orgs_new.count(), orgs_old.count()))

        # Total number of projects on RSR
        projects_new = Project.objects.filter(created_at__lt=date_new).distinct()
        projects_old = Project.objects.filter(created_at__lt=date_old).distinct()
        print('# of RSR projects,{},{}'.format(projects_new.count(), projects_old.count()))

        # Total number of projects which had some activity going on in the results
        # framework...
        print('# of projects using the RSR results framework,{},{}'.format(
            len(projects_using_results_framework(date_new)),
            len(projects_using_results_framework(date_old)),
        ))

        # No. of Indicator Updates
        updates_new = IndicatorPeriodData.objects.filter(created_at__lt=date_new).distinct()
        updates_old = IndicatorPeriodData.objects.filter(created_at__lt=date_old).distinct()

        print('# of indicator updates in RSR,{},{}'.format(
            updates_new.count(), updates_old.count()
        ))

        # No. of organisations reporting to IATI
        iati_orgs_new = IatiExport.objects.filter(created_at__lt=date_new)\
                                          .annotate(project_count=Count('projects'))\
                                          .filter(project_count__gt=0)\
                                          .values_list('reporting_organisation_id', flat=True)\
                                          .distinct()
        iati_orgs_old = IatiExport.objects.filter(created_at__lt=date_old)\
                                          .annotate(project_count=Count('projects'))\
                                          .filter(project_count__gt=0)\
                                          .values_list('reporting_organisation_id', flat=True)\
                                          .distinct()
        print('# of partners reporting to IATI,{},{}'.format(
            iati_orgs_new.count(), iati_orgs_old.count()
        ))

        # No. of projects reporting to IATI
        iati_projects_new = IatiExport.objects.filter(created_at__lt=date_new)\
                                              .values_list('projects', flat=True)\
                                              .distinct()
        iati_projects_old = IatiExport.objects.filter(created_at__lt=date_old)\
                                              .values_list('projects', flat=True)\
                                              .distinct()
        print('# of projects reporting to IATI,{},{}'.format(
            iati_projects_new.count(), iati_projects_old.count()
        ))
