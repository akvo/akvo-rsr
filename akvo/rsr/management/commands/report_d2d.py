# -*- coding: utf-8 -*-
import argparse
# Akvo Reporting is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


import collections
import datetime
from pathlib import Path
from typing import Iterable, Optional, OrderedDict

import tablib
from tablib.formats import available as tablib_formats

from django.contrib.admin.models import LogEntry
from django.core.management.base import BaseCommand
from django.db.models import Q, Count

from akvo.rsr.models import (
    IatiExport, Organisation, Project, IndicatorPeriodData,
    LoginLog, PublishingStatus,
)


def get_dataset(title, objects: Iterable, mapping: OrderedDict[str, Optional[str]]):
    dataset = tablib.Dataset()
    dataset.title = title
    dataset.headers = list(mapping.keys())
    for _object in objects:
        row = []
        for attr_name in mapping.values():
            if attr_name:
                row.append(getattr(_object, attr_name, None))
            else:
                row.append(str(_object))
        dataset.append(row)

    return dataset

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
    logins = []
    unique_emails = set()
    for log in LoginLog.objects.filter(success=True, created_at__range=(date_start, date_end)):
        if (email := log.email) in unique_emails:
            continue
        unique_emails.add(email)
        logins.append(log)
    return logins


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

    def add_arguments(self, parser: argparse.ArgumentParser):
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
        output_group = parser.add_argument_group("output", "Control the report output")
        # Formats that support outputting books with sheets of tables
        book_formats = [
            tl_format.title
            for tl_format in tablib_formats
            if hasattr(tl_format, "export_book")
        ]
        output_group.add_argument(
            '-f', '--format',
            choices=book_formats,
            default=book_formats[0],
            help='What format the output file will have',
        )
        output_group.add_argument(
            '-o', '--output',
            help='Where to output the report. "-" means to stdout',
        )

    def handle(self, *args, **options):
        date_start = options['date_start']
        date_end = options['date_end']
        output_format = options["format"]
        output_destination = options.get("output")

        active_partners = get_active_organisations(date_start, date_end)
        new_orgs = Organisation.objects.filter(created_at__range=(date_start, date_end))
        unique_login_emails = get_unique_login_emails(date_start, date_end)
        new_projects = Project.objects.filter(created_at__range=(date_start, date_end))
        published_projects = get_published_projects(date_end)
        active_projects = get_projects_with_active_results_framework(date_start, date_end)
        indicator_updates = get_indicator_updates(date_start, date_end)
        orgs_reporting_to_iati = get_orgs_reporting_to_iati(date_start, date_end)
        projects_reporting_to_iati = get_projects_reporting_to_iati(date_start, date_end)
        orgs_reporting_to_iati_list = make_orgs_reporting_to_iati_list(orgs_reporting_to_iati, date_start, date_end)
        orgs_reporting_to_iati_list.title = "Projects reporting to IATI"

        if output_destination:
            # Ensure path isn't a directory
            output_path = Path(output_destination)
            if output_path.is_dir():
                self.stderr.write("output path cannot be a directory\n")
                exit(1)
            # Create parent directory structure in order to be able to write a file
            output_path.parent.mkdir(parents=True, exist_ok=True)

            org_column_map = collections.OrderedDict([
                ("ID", "id"),
                ("Name", "name"),
                ("Created At", "created_at"),
            ])
            project_column_map = collections.OrderedDict([
                ("ID", "id"),
                ("TItle", "title"),
                ("Created At", "created_at"),
            ])
            book = tablib.Databook([
                get_dataset("Active Partners", active_partners, org_column_map),
                get_dataset("New Organisations", new_orgs, org_column_map),
                get_dataset("Unique Login Emails", unique_login_emails, collections.OrderedDict([
                    ("Email", "email"),
                    ("Date", "created_at"),
                ])),
                get_dataset("New Projects", new_projects, project_column_map),
                get_dataset("Published Projects", published_projects, project_column_map),
                get_dataset("Active Projects", active_projects, project_column_map),
                get_dataset("Orgs reporting to IATI", orgs_reporting_to_iati, org_column_map),
                orgs_reporting_to_iati_list,
            ])

            # Output the export to stdout or file
            export = book.export(output_format)
            if output_destination == "-":
                self.stdout.write(export)
            else:
                output_path.write_bytes(export)
        else:
            print(f'RSR Metrics Report ({date_start:%Y-%m-%d} - {date_end:%Y-%m-%d})')
            print(f'# of active partners using RSR: {active_partners.count()}')
            print(f'# of new partners using RSR: {new_orgs.count()}')
            print(f'# of unique login: {len(unique_login_emails)}')
            print(f'# of new projects in RSR: {new_projects.count()}')
            print(f'# of published RSR projects (total): {published_projects.count()}')
            print(f'# of projects using the RSR results framework: {active_projects.count()}')
            print(f'# of indicator updates in RSR: {indicator_updates.count()}')
            print(f'# of partners reporting to IATI: {orgs_reporting_to_iati.count()}')
            print(f'# of projects reporting to IATI: {projects_reporting_to_iati.count()}')
            print('')
            print(orgs_reporting_to_iati_list.export('rst'))
