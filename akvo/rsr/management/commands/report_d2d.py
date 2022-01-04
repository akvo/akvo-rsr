# -*- coding: utf-8 -*-

# Akvo Reporting is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


import datetime
import tablib

from django.contrib.admin.models import LogEntry
from django.core.management.base import BaseCommand
from django.db.models import Q, Count

from akvo.rsr.models import (
    IatiExport, Organisation, Project, IndicatorPeriodData,
    IndicatorPeriodDataComment, LoginLog, PublishingStatus,
    ProjectUpdate
)


def get_active_organisations(date_start, date_end):
    has_project_updates = set(
        ProjectUpdate.objects
        .filter(Q(created_at__range=(date_start, date_end)) | Q(last_modified_at__range=(date_start, date_end)))
        .values_list('project__id', flat=True)
    )
    has_indicator_updates = set(
        IndicatorPeriodData.objects
        .filter(Q(created_at__range=(date_start, date_end)) | Q(last_modified_at__range=(date_start, date_end)))
        .values_list('period__indicator__result__project__id', flat=True)
    )
    pids = has_project_updates | has_indicator_updates
    return set(Project.objects.filter(id__in=pids).values_list('primary_organisation__id', flat=True))


def get_projects_with_active_results_framework(date_start, date_end):
    projects_from_updates = set(
        IndicatorPeriodData.objects
        .filter(Q(created_at__range=(date_start, date_end)) | Q(last_modified_at__range=(date_start, date_end)))
        .values_list('period__indicator__result__project__id', flat=True)
    )
    projects_from_comments = set(
        IndicatorPeriodDataComment.objects
        .filter(Q(created_at__range=(date_start, date_end)) | Q(last_modified_at__range=(date_start, date_end)))
        .values_list('data__period__indicator__result__project__id', flat=True)
    )
    filter_ = (
        Q(content_type__model='indicator')
        | Q(content_type__model='indicatorperiod')
        | Q(content_type__model='result')
    )
    log_entries = LogEntry.objects.filter(action_time__range=(date_start, date_end))\
                                  .filter(filter_)\
                                  .values_list('content_type__model', 'object_id')
    periods = [
        id_ for _, id_ in
        filter(lambda x: x[0] == 'indicatorperiod', log_entries)
    ]
    projects_from_periods = set(
        Project.objects
        .filter(results__indicators__periods__in=periods)
        .values_list('id', flat=True)
    )
    indicators = [
        id_ for _, id_ in
        filter(lambda x: x[0] == 'indicator', log_entries)
    ]
    projects_from_indicators = set(
        Project.objects
        .filter(results__indicators__in=indicators)
        .values_list('id', flat=True)
    )
    results = [
        id_ for _, id_ in
        filter(lambda x: x[0] == 'result', log_entries)
    ]
    projects_from_results = set(
        Project.objects.filter(results__in=results)
        .values_list('id', flat=True)
    )
    return (
        projects_from_comments
        | projects_from_updates
        | projects_from_periods
        | projects_from_indicators
        | projects_from_results
    )


def get_unique_logins(date_start, date_end):
    return LoginLog.objects.\
        filter(success=True, created_at__range=(date_start, date_end))\
        .values('email')\
        .annotate(total=Count('email'))


def get_published_projects(date_latest):
    return Project.objects.filter(created_at__lt=date_latest, publishingstatus__status=PublishingStatus.STATUS_PUBLISHED)


def get_indicator_updates(date_start, date_end):
    return IndicatorPeriodData.objects\
        .filter(Q(created_at__range=(date_start, date_end)) | Q(last_modified_at__range=(date_start, date_end)))


def get_orgs_reporting_to_iati(date_start, date_end):
    return IatiExport.objects\
        .filter(created_at__range=(date_start, date_end))\
        .annotate(project_count=Count('projects'))\
        .filter(project_count__gt=0)\
        .values_list('reporting_organisation_id', flat=True)\
        .distinct()


def get_projects_reporting_to_iati(date_start, date_end):
    return IatiExport.objects\
        .filter(created_at__range=(date_start, date_end))\
        .values_list('projects', flat=True)\
        .distinct()


def make_orgs_reporting_to_iati_list(orgs, date_start, date_end):
    orgs_list = tablib.Dataset()
    orgs_list.headers = ['name', 'long_name', 'iati_org_type', 'report_count', 'project_count']
    for org_id in sorted(set(orgs)):
        org = Organisation.objects.get(pk=org_id)
        exports = IatiExport.objects.filter(
            created_at__range=(date_start, date_end),
            reporting_organisation=org
        )
        projects = set(exports.values_list('projects', flat=True))
        if not projects:
            continue
        orgs_list.append([
            org.name,
            org.long_name,
            org.iati_org_type_unicode(),
            exports.count(),
            len(projects)
        ])
    return orgs_list


class Command(BaseCommand):
    help = """\
    Script to generate the D2D report
    <script> <date_start:%Y-%m-%d> <date_end:%Y-%m-%d>
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
        date_start = options['date_start']
        date_end = options['date_end']

        print(f'RSR Metrics Report ({date_start:%Y-%m-%d} - {date_end:%Y-%m-%d})')

        active_partners_count = len(get_active_organisations(date_start, date_end))
        print(f'# of active partners using RSR: {active_partners_count}')

        new_orgs_count = Organisation.objects.filter(created_at__range=(date_start, date_end)).count()
        print(f'# of new partners using RSR: {new_orgs_count}')

        unique_logins_count = get_unique_logins(date_start, date_end).count()
        print(f'# of unique login: {unique_logins_count}')

        published_projects_count = get_published_projects(date_end).count()
        print(f'# of published RSR projects (total): {published_projects_count}')

        active_projects_count = len(get_projects_with_active_results_framework(date_start, date_end))
        print(f'# of projects using the RSR results framework: {active_projects_count}')

        indicator_updates_count = get_indicator_updates(date_start, date_end).count()
        print(f'# of indicator updates in RSR: {indicator_updates_count}')

        orgs_reporting_to_iati = get_orgs_reporting_to_iati(date_start, date_end)
        print(f'# of partners reporting to IATI: {orgs_reporting_to_iati.count()}')

        projects_reporting_to_iati_count = get_projects_reporting_to_iati(date_start, date_end).count()
        print(f'# of projects reporting to IATI: {projects_reporting_to_iati_count}')

        print('')
        orgs_reporting_to_iati_list = make_orgs_reporting_to_iati_list(orgs_reporting_to_iati, date_start, date_end)
        print(orgs_reporting_to_iati_list.export('rst'))
