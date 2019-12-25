# -*- coding: utf-8 -*-

# Akvo Reporting is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

"""Create a collaborator organisation for a given organisation.

Usage:

    python manage.py create_collaborator_organisation <org-id>

"""
from __future__ import print_function

import sys

from django.core.management.base import BaseCommand

from akvo.rsr.models import Organisation


class Command(BaseCommand):
    help = __doc__

    def add_arguments(self, parser):
        parser.add_argument('org_id', type=int)

    def handle(self, *args, **options):
        org_id = options['org_id']
        try:
            organisation = Organisation.objects.get(id=org_id)
        except Organisation.DoesNotExist:
            sys.exit('Could not find organisation with ID: {}'.format(org_id))

        collaborator, _ = Organisation.objects.get_or_create(
            content_owner=organisation,
            original=organisation,
            defaults=dict(
                name='Collaborator: {}'.format(organisation.name),
                long_name='Collaborator: {}'.format(organisation.long_name),
            )
        )
        print('Collaborator Organisation created with ID: {}'.format(collaborator.id))
