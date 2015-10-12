# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

from ....rsr.models.iati_import_log import IatiImportLog
from ..utils import add_log, get_or_create_organisation, get_text

from django.conf import settings
from django.db.models import get_model

ROLE_TO_CODE = {
    'accountable': 2,
    'extending': 3,
    'funding': 1,
    'implementing': 4
}


def partnerships(iati_import, activity, project, activities_globals):
    """
    Retrieve and store the partnerships.
    The partnerships will be extracted from the 'participating-org' elements. Since it is not
    possible in the IATI standard to supply the funding amount for a funding partner, this value
    is calculated by taking the total budget of the project and dividing that by the number of
    funding partners.

    :param iati_import: IatiImport instance
    :param activity: ElementTree; contains all data for the activity
    :param project: Project instance
    :param activities_globals: Dictionary; contains all global activities information
    :return: List; contains fields that have changed
    """
    imported_partnerships = []
    changes = []
    funding_amount_present = False

    for partnership in activity.findall('participating-org'):
        org_ref = ''
        partner_role = None
        funding_amount = None

        if 'ref' in partnership.attrib.keys():
            org_ref = partnership.attrib['ref']

        org_name = get_text(partnership, activities_globals['version'])

        partner = get_or_create_organisation(org_ref, org_name)

        if 'role' in partnership.attrib.keys():
            partner_role = partnership.attrib['role']
            if partner_role and partner_role.lower() in ROLE_TO_CODE:
                partner_role = ROLE_TO_CODE[partner_role.lower()]
            elif partner_role:
                try:
                    partner_role = int(partner_role)
                except ValueError as e:
                    add_log(iati_import, 'participating_org_role', str(e), project)

        if '{%s}funding-amount' % settings.AKVO_NS in partnership.attrib.keys():
            try:
                funding_amount = int(partnership.attrib['{%s}funding-amount' % settings.AKVO_NS])
                funding_amount_present = True
            except ValueError as e:
                add_log(iati_import, 'funding_amount', str(e), project)

        if not (partner or partner_role):
            add_log(iati_import, 'participating_org', 'participating organisation or role missing',
                    project)
            continue

        ps, created = get_model('rsr', 'partnership').objects.get_or_create(
            project=project,
            organisation=partner,
            iati_organisation_role=partner_role,
            funding_amount=funding_amount
        )

        if created:
            changes.append(u'added partnership (id: %s): %s' % (str(ps.pk), ps))

        imported_partnerships.append(ps)

    for partnership in project.partnerships.all():
        if not partnership in imported_partnerships:
            changes.append(u'deleted partnership (id: %s): %s' %
                           (str(partnership.pk),
                            partnership.__unicode__()))
            partnership.delete()

    if not funding_amount_present:
        funding_partners = project.partnerships.filter(iati_organisation_role=1)
        total_budget = project.budget

        if funding_partners.count() > 0 and total_budget > 0:
            average_budget = total_budget / funding_partners.count()
            for funding_partner in funding_partners:
                if funding_partner.funding_amount != average_budget:
                    funding_partner.funding_amount = average_budget
                    funding_partner.save()
                    changes.append(u'updated funding amount for partnership (id: %s): %s' %
                                   (str(funding_partner.pk), funding_partner))

    return changes
