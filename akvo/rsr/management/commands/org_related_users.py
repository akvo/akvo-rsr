import sys
from django.core.management.base import BaseCommand, CommandParser
from tablib import Dataset
from akvo.rsr.models import Organisation
from akvo.rsr.usecases.toggle_org_enforce_2fa import find_related_users


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

        users = find_related_users(org)
        tbl = Dataset()
        tbl.headers = ['email', 'name']
        for user in users:
            tbl.append([user.email, user.get_full_name()])
        self.stdout.write(tbl.export('csv'))
