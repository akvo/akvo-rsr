# -*- coding: utf-8 -*-

# Akvo Reporting is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


import tablib

from django.contrib.auth.models import Group
from django.core.management.base import BaseCommand

from akvo.rsr.management.utils import rotate_spinner
from akvo.rsr.models.user_projects import restrict_projects
from ...models import Project, Organisation, User
from ...permissions import GROUP_NAME_ADMINS


EUTF_ORG_ID = 3394
EUTF_PROJECT_ID = 4401


class Command(BaseCommand):
    args = ''
    help = u'Script that sets up project access restrictions for "non-EUTF" users'

    def handle(self, *args, **options):

        def shared_projects(org):
            return eutf_projects.filter(partners=org)

        users = tablib.Dataset()
        users.headers = [
            u'Organisation ID',
            u'Organisation name',
            u'User ID',
            u'User email',
            u'Restricted projects'
        ]

        admins = Group.objects.get(name=GROUP_NAME_ADMINS)

        # all partners to EUTF projects
        root = Project.objects.get(pk=EUTF_PROJECT_ID)
        eutf_projects = root.descendants()
        eutf_partners = eutf_projects.all_partners()

        # all partners that are content owned by EUTF
        eutf = Organisation.objects.get(pk=EUTF_ORG_ID)
        content_owned_organisations = eutf.content_owned_organisations()

        # all "non content-owned" partners
        other_organisations = eutf_partners.exclude(pk__in=content_owned_organisations)

        for organisation in other_organisations:
            organisation_users = User.objects.filter(employers__organisation=organisation)
            for user in organisation_users:
                rotate_spinner()

                if user.employers.filter(organisation=organisation, group=admins):
                    users.append([
                        organisation.pk,
                        organisation.name,
                        user.pk,
                        user.email,
                        u'User is admin for this organisation'
                    ])
                else:
                    restrict_projects(None, user, shared_projects(organisation))

                    shared_projects_ids = ", ".join([
                        str(p.pk) for p in shared_projects(organisation)
                    ])
                    users.append([
                        organisation.pk,
                        organisation.name,
                        user.pk,
                        user.email,
                        shared_projects_ids
                    ])

        print u'\nThe following users have been restricted:\n'
        print users.export('tsv')
