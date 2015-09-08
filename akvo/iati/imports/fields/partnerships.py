# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

from ..utils import get_or_create_organisation, get_text

from django.db.models import get_model

ROLE_TO_CODE = {
    'accountable': '2',
    'extending': '3',
    'funding': '1',
    'implementing': '4'
}


def partnerships(activity, project, activities_globals):
    """
    Retrieve and store the partnerships.
    The partnerships will be extracted from the 'participating-org' elements.

    :param activity: ElementTree; contains all data for the activity
    :param project: Project instance
    :param activities_globals: Dictionary; contains all global activities information
    :return: List; contains fields that have changed
    """
    imported_partnerships = []
    changes = []

    for partnership in activity.findall('participating-org'):
        org_ref = partnership.attrib['ref'] if 'ref' in partnership.attrib.keys() else ''
        org_name = get_text(partnership, activities_globals['version'])
        partner = get_or_create_organisation(org_ref, org_name)
        partner_role = partnership.attrib['role'] if 'role' in partnership.attrib.keys() else None
        if activities_globals['version'][0] == '1':
            partner_role = ROLE_TO_CODE[partner_role.lower()]
        ps, created = get_model('rsr', 'partnership').objects.get_or_create(
            project=project,
            organisation=partner,
            iati_organisation_role=int(partner_role) if partner_role else None
        )
        imported_partnerships.append(ps)
        if created:
            changes.append(ps)

    for partnership in project.partnerships.all():
        if not partnership in imported_partnerships:
            changes.append(u'deleted %s' % partnership.__unicode__())
            partnership.delete()

    return changes
