# -*- coding: utf-8 -*-

# Akvo Reporting is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


import tablib

from django.contrib.auth.models import Group
from django.core.management.base import BaseCommand
from django.db import IntegrityError

from akvo.rsr.management.utils import rotate_spinner
from ...models import Project, Organisation, User, Employment, Partnership
from ...permissions import (GROUP_NAME_ADMINS, GROUP_NAME_ME_MANAGERS, GROUP_NAME_ENUMERATORS,
                            GROUP_NAME_PROJECT_EDITORS)


EUTF_ORG_ID = 3394
EUTF_PROJECT_ID = 4401
EXCLUDED_ORGS = [
    13,     # WASTE
    405,    # ICCO Cooperation
    428,    # UNDP
    1994,   # SNV Mali
    2251,   # Ecorys
    3210,   # SNV World
    4814,   # APEJ
    4824,   # ICCO CORPORATION Mali
]


class Command(BaseCommand):
    args = ''
    help = u'Script that sets up project access restrictions for "non-EUTF" users'

    def handle(self, *args, **options):

        def create_shadow(eutf, org):
            """ Create a copy of an organisation to be used in the EUTF hierarchy for access
                management purposes
            """
            shadow_org_name = u"EUTF partner: {}".format(org.name)[:40]
            shadow, created = Organisation.objects.get_or_create(
                name=shadow_org_name,
                defaults=dict(
                    long_name=u"EUTF partner: {}".format(org.long_name)[:100],
                    language=org.language,
                    organisation_type=org.organisation_type,
                    currency=org.currency,
                    new_organisation_type=org.new_organisation_type,
                    content_owner=eutf,
                    enable_restrictions=True,
                    original=org,
                    can_create_projects=False,
                )
            )
            return shadow

        def replace_original_with_shadow(eutf_projects, organisation, shadow):
            "Replace an org with its shadow in all projects in the EUTF hierarchy"
            partnerships = Partnership.objects.filter(organisation=organisation,
                                                      project__in=eutf_projects)
            return partnerships.update(organisation=shadow)

        shadows_and_employments = tablib.Dataset()
        shadows_and_employments.headers = [
            u'Original organisation ID',
            u'Organisation ID',
            u'Organisation name',
            u'# of projects with shadow',
            u'User ID',
            u'User email',
            u'Employment type',
        ]

        admins = Group.objects.get(name=GROUP_NAME_ADMINS)
        me_managers = Group.objects.get(name=GROUP_NAME_ME_MANAGERS)
        editors = Group.objects.get(name=GROUP_NAME_PROJECT_EDITORS)
        enumerators = Group.objects.get(name=GROUP_NAME_ENUMERATORS)

        # all partners to EUTF projects
        root = Project.objects.get(pk=EUTF_PROJECT_ID)
        # only use children and grand children. "Lower" levels should be removed from the hierarchy
        eutf_projects = root.descendants(2)
        eutf_partners = eutf_projects.all_partners()

        # all partners that are content owned by EUTF
        eutf = Organisation.objects.get(pk=EUTF_ORG_ID)
        content_owned_by_eutf = eutf.content_owned_organisations()

        # all "non content-owned" partners
        other_organisations = eutf_partners.exclude(pk__in=content_owned_by_eutf)

        # all partners that share content ownership with EUTF
        other_owners = set()
        for org in content_owned_by_eutf:
            other_owners = other_owners.union(
                org.content_owned_by().exclude(pk__in=content_owned_by_eutf).exclude(pk=eutf.pk)
            )
        other_owners_qs = Organisation.objects.filter(pk__in=[o.pk for o in other_owners])

        # all partners content owned by EUTF that have another content owner
        externally_owned = other_owners_qs.content_owned_organisations()
        shared_owned = set(externally_owned).intersection(content_owned_by_eutf)

        # all partners that are either not owned by EUTF or have shared ownership
        to_be_made_shadows = shared_owned.union(other_organisations)

        for organisation in to_be_made_shadows:
            shadow = create_shadow(eutf, organisation)
            count = replace_original_with_shadow(eutf_projects, organisation, shadow)

            shadows_and_employments.append([
                organisation.pk,
                shadow.pk,
                shadow.name,
                count,
                '-',
                '-',
                '-',
            ])
            # EXCLUDED_ORGS will not have any users in their shadows
            if organisation.pk in EXCLUDED_ORGS:
                shadows_and_employments.append([
                    organisation.pk,
                    u'This organisation will not have its users transferred',
                    '-',
                    '-',
                    '-',
                    '-',
                    '-',
                ])
                continue

            users = User.objects.filter(organisations__in=[organisation]).distinct()

            for user in users:

                employments = Employment.objects.filter(user=user, organisation=organisation)

                # convert admin to M&E manager if user does not have M&E employment
                add_me_manager = False
                if (employments.filter(group=admins).exists() and
                        not employments.filter(group=me_managers).exists()):
                    add_me_manager = True

                # convert Project editor to Enumerator if user does not have Enumerator employment
                add_enumerator = False
                if (employments.filter(group=editors).exists() and
                        not employments.filter(group=enumerators).exists()):
                    add_enumerator = True

                for employment in employments:
                    rotate_spinner()

                    # admins are converted to M&E managers
                    if employment.group == admins:
                        if add_me_manager:
                            employment.group = me_managers
                        else:
                            continue

                    # project editors are converted to enumerators
                    if employment.group == editors:
                        if add_enumerator:
                            employment.group = editors
                        else:
                            continue

                    employment.organisation = shadow
                    # setting pk to None creates a new object when saving
                    employment.pk = None
                    # wrap in try:except: to prevent problems if shadow employment already exists
                    try:
                        employment.save()
                        shadows_and_employments.append([
                            organisation.pk,
                            shadow.pk,
                            shadow.name,
                            count,
                            employment.user.pk,
                            employment.user.email,
                            employment.group.name
                        ])
                    except IntegrityError:
                        pass

        print u'\nShadow orgs created and employments added to the shadows:\n'
        print shadows_and_employments.export('tsv').decode('utf-8').encode('utf-8')
