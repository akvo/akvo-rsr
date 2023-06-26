from datetime import datetime
from typing import List, Optional
from django.core.management.base import BaseCommand, CommandParser
import tablib

from akvo.rsr.usecases.search_customers import (
    OrganisationAdmins,
    ProjectMainOrganisationAdmins,
    get_organisation_admins_of_active_top_level_projects,
    get_organisation_admins_of_active_users,
    get_paying_organisations_admins
)


class Command(BaseCommand):
    help = 'Script to generate list of organisation admins of possible RSR customers'

    def add_arguments(self, parser: CommandParser) -> None:
        parser.add_argument(
            '-t', '--type', default=3, type=int, choices=[1, 2, 3],
            help='Search type; 1=from active top level projects, 2=from active users, 3=from organisation that can create projects')
        parser.add_argument(
            '-d', '--date',
            type=lambda date: datetime.strptime(date, '%Y-%m-%d'),
            help='Starting date of counted activities, used for type 1 & 2',
        )

    def handle(self, *_, **options):
        search_type = options['type']
        start_date = options['date']
        if search_type == 1:
            return self.search_1(start_date)
        if search_type == 2:
            return self.search_2(start_date)
        return self.search_3()

    def search_1(self, start_date: Optional[datetime]):
        data = get_organisation_admins_of_active_top_level_projects(start_date)
        self.export_project_main_organisation_admins(data)

    def search_2(self, start_date: Optional[datetime]):
        data = get_organisation_admins_of_active_users(start_date)
        self.export_project_main_organisation_admins(data)

    def search_3(self):
        data = get_paying_organisations_admins()
        self.export_organisation_admins(data)

    def export_project_main_organisation_admins(self, data: List[ProjectMainOrganisationAdmins]):
        tbl = tablib.Dataset()
        tbl.headers = ['Project', 'Organisation', 'Email', 'Full name']
        for it in data:
            project = it.project.title
            organisation = it.project.primary_organisation.name
            for user in it.admins:
                email = user.email
                name = user.get_full_name()
                tbl.append([project, organisation, email, name])
        self.stdout.write(tbl.export('csv'))

    def export_organisation_admins(self, data: List[OrganisationAdmins]):
        tbl = tablib.Dataset()
        tbl.headers = ['Organisation', 'Email', 'Full name']
        for it in data:
            organisation = it.organisation.name
            for user in it.admins:
                email = user.email
                name = user.get_full_name()
                tbl.append([organisation, email, name])
        self.stdout.write(tbl.export('csv'))
