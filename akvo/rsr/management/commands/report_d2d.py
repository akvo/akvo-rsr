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
    LoginLog, PublishingStatus,
)


def get_active_organisations(date_start, date_end):
    projects_with_project_updates = Project.objects.filter(
        Q(project_updates__created_at__range=(date_start, date_end))
        | Q(project_updates__last_modified_at__range=(date_start, date_end))
    ).distinct()
    projects_with_indicator_updates = Project.objects.filter(
        Q(results__indicators__periods__data__created_at__range=(date_start, date_end))
        | Q(results__indicators__periods__data__last_modified_at__range=(date_start, date_end))
    ).distinct()
    active_projects = projects_with_project_updates.union(projects_with_indicator_updates)
    org_ids_of_active_projects = active_projects.values_list('primary_organisation', flat=True)
    return Organisation.objects.filter(id__in=set(org_ids_of_active_projects))


def get_projects_with_active_results_framework(date_start, date_end):
    log_entries = LogEntry.objects\
        .filter(action_time__range=(date_start, date_end))\
        .filter(Q(content_type__model='indicator') | Q(content_type__model='indicatorperiod') | Q(content_type__model='result'))\
        .values_list('content_type__model', 'object_id')
    result_ids = [r for _, r in filter(lambda x: x[0] == 'result', log_entries)]
    indicator_ids = [i for _, i in filter(lambda x: x[0] == 'indicator', log_entries)]
    period_ids = [p for _, p in filter(lambda x: x[0] == 'indicatorperiod', log_entries)]
    projects_with_results = Project.objects.filter(results__in=result_ids).distinct()
    projects_with_indicators = Project.objects.filter(results__indicators__in=indicator_ids).distinct()
    projects_with_periods = Project.objects.filter(results__indicators__periods__in=period_ids).distinct()
    projects_with_indicator_updates = Project.objects.filter(
        Q(results__indicators__periods__data__created_at__range=(date_start, date_end))
        | Q(results__indicators__periods__data__last_modified_at__range=(date_start, date_end))
    ).distinct()
    projects_with_indicator_update_comments = Project.objects.filter(
        Q(results__indicators__periods__data__comments__created_at__range=(date_start, date_end))
        | Q(results__indicators__periods__data__comments__last_modified_at__range=(date_start, date_end))
    ).distinct()
    return projects_with_results.union(
        projects_with_indicators,
        projects_with_periods,
        projects_with_indicator_updates,
        projects_with_indicator_update_comments,
    )


def get_unique_login_emails(date_start, date_end):
    return LoginLog.objects\
        .filter(success=True, created_at__range=(date_start, date_end))\
        .values('email')\
        .distinct()


def get_published_projects(date_latest):
    return Project.objects\
        .filter(created_at__lt=date_latest, publishingstatus__status=PublishingStatus.STATUS_PUBLISHED)


def get_indicator_updates(date_start, date_end):
    return IndicatorPeriodData.objects\
        .filter(Q(created_at__range=(date_start, date_end)) | Q(last_modified_at__range=(date_start, date_end)))


def get_orgs_reporting_to_iati(date_start, date_end):
    return Organisation.objects\
        .filter(iati_exports__created_at__range=(date_start, date_end))\
        .annotate(project_count=Count('iati_exports__projects'))\
        .filter(project_count__gt=0)\
        .distinct()


def get_projects_reporting_to_iati(date_start, date_end):
    return Project.objects.filter(iatiexport__created_at__range=(date_start, date_end)).distinct()


def make_orgs_reporting_to_iati_list(orgs, date_start, date_end):
    orgs_list = tablib.Dataset()
    orgs_list.headers = ['name', 'long_name', 'iati_org_type', 'report_count', 'project_count']
    for org in orgs:
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
            len(projects),
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

        active_partners = get_active_organisations(date_start, date_end)
        print(f'# of active partners using RSR: {active_partners.count()}')

        new_orgs = Organisation.objects.filter(created_at__range=(date_start, date_end))
        print(f'# of new partners using RSR: {new_orgs.count()}')

        unique_login_emails = get_unique_login_emails(date_start, date_end)
        print(f'# of unique login: {unique_login_emails.count()}')

        new_projects = Project.objects.filter(created_at__range=(date_start, date_end))
        print(f'# of new projects in RSR: {new_projects.count()}')

        published_projects = get_published_projects(date_end)
        print(f'# of published RSR projects (total): {published_projects.count()}')

        active_projects = get_projects_with_active_results_framework(date_start, date_end)
        print(f'# of projects using the RSR results framework: {active_projects.count()}')

        indicator_updates = get_indicator_updates(date_start, date_end)
        print(f'# of indicator updates in RSR: {indicator_updates.count()}')

        orgs_reporting_to_iati = get_orgs_reporting_to_iati(date_start, date_end)
        print(f'# of partners reporting to IATI: {orgs_reporting_to_iati.count()}')

        projects_reporting_to_iati = get_projects_reporting_to_iati(date_start, date_end)
        print(f'# of projects reporting to IATI: {projects_reporting_to_iati.count()}')

        print('')
        orgs_reporting_to_iati_list = make_orgs_reporting_to_iati_list(orgs_reporting_to_iati, date_start, date_end)
        print(orgs_reporting_to_iati_list.export('rst'))
