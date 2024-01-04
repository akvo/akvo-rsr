

import sys
from django.core.management.base import BaseCommand, CommandParser
from tablib import Dataset
from akvo.rsr.models import User, Project, Organisation


def get_users(organisation: Organisation):
    employees = User.objects.filter(employers__organisation=organisation)

    programs = Project.objects.exclude(projecthierarchy__isnull=True).filter(primary_organisation=organisation) 
    program_projects = set(programs.values_list('id', flat=True))
    for program in programs:
        program_projects = program_projects | set(program.descendants().values_list('id', flat=True))
    program_users = User.objects.filter(projectrole__project__in=program_projects)

    other_projects = Project.objects.filter(primary_organisation=organisation).exclude(id__in=program_projects)
    other_users = User.objects.filter(projectrole__project__in=other_projects)

    return employees.union(program_users).union(other_users)


class Command(BaseCommand):
    help = "Script to get list of users who are employed by or have role access to projects of the given organisation"

    def add_arguments(self, parser: CommandParser):
        parser.add_argument('org_id', type=int)

    def handle(self, *args, **options):
        try:
            org = Organisation.objects.get(id=options['org_id'])
        except Organisation.DoesNotExist:
            self.stderr.write("Organisation not found")
            sys.exit(1)

        users = get_users(org)
        tbl = Dataset()
        tbl.headers = ['email', 'name']
        for user in users:
            tbl.append([user.email, user.get_full_name()])
        self.stdout.write(tbl.export('csv'))
