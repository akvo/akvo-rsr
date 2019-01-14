# -*- coding: utf-8 -*-

# Akvo Reporting is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

# -*- coding: utf-8 -*-

# Akvo Reporting is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


import tablib

from django.contrib.auth.models import Group
from django.core.management.base import BaseCommand

from ...models import Organisation, Employment
from ...permissions import GROUP_NAME_PROJECT_EDITORS, GROUP_NAME_ENUMERATORS


EUTF_ORG_ID = 3394

GROUPS_TO_CHANGE = [GROUP_NAME_PROJECT_EDITORS]


class Command(BaseCommand):
    args = ''
    help = u'Script that changes Project editors employments to Enumerators'

    def handle(self, *args, **options):
        users = tablib.Dataset()
        users.headers = [
            'Organisation ID',
            'Organisation name',
            'User ID',
            'User email',
        ]

        eutf = Organisation.objects.get(pk=EUTF_ORG_ID)
        content_owned_orgs = eutf.content_owned_organisations()
        groups = Group.objects.filter(name__in=GROUPS_TO_CHANGE)
        enumerator = Group.objects.get(name=GROUP_NAME_ENUMERATORS)
        employments = Employment.objects.filter(
            organisation__in=content_owned_orgs,
            group__in=groups
        ).order_by('organisation_id', 'user_id').select_related('organisation', 'user')

        organisation_id, user_id = None, None
        for employment in employments:
            if employment.organisation.pk != organisation_id or employment.user.pk != user_id:
                employment.group = enumerator
                employment.save()
                users.append([
                    employment.organisation.pk,
                    employment.organisation.name,
                    employment.user.pk,
                    employment.user.email,
                ])
            else:
                # multiple employments in the same org
                employment.delete()
            organisation_id, user_id = employment.organisation.pk, employment.user.pk

        print u'The following users have had their employment(s) changed to Enumerator:\n'
        print users.export('tsv')
