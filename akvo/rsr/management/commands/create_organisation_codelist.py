# -*- coding: utf-8 -*-

# Akvo Reporting is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

"""Create or Update a codelist and optionally link it to organisations.

Usage:

    python manage.py create_organisation_codelist <slug> <json-path>_[<org-ids>]

"""


import json
import sys

from django.core.management.base import BaseCommand

from akvo.rsr.models import OrganisationCodelist, Organisation


class Command(BaseCommand):
    help = __doc__

    def add_arguments(self, parser):
        parser.add_argument('slug', type=str)
        parser.add_argument('json_path', type=open)
        parser.add_argument('org_ids', nargs='+', type=int)
        parser.add_argument('--update', action='store_true', dest='update')

    def handle(self, *args, **options):
        org_ids = options['org_ids']
        organisations = Organisation.objects.filter(id__in=org_ids)
        update = options['update']
        data = json.load(options['json_path'])

        codelist, created = OrganisationCodelist.objects.get_or_create(
            slug=options['slug'], defaults={'data': data})

        if not created and not update:
            print('Codelist with the slug already exists. Use --update to update it.')
            sys.exit(1)

        if update:
            codelist.data = data
            codelist.save(update_fields=['data'])

        missing_orgs = set(org_ids) - set(org.id for org in organisations)
        if missing_orgs:
            print('Could not find organisations with ids: ', list(missing_orgs))
            sys.exit(1)

        organisations.update(codelist=codelist)
