# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

from akvo.rsr.models.partnership import Partnership


def partners(project):
    """
    Check if a project has at least one valid partner and issue a warning if a partner
    misses the role, IATI identifier or name.

    :param project: Project object
    :return: All checks passed boolean, [Check results]
    """
    checks = []
    all_checks_passed = True
    valid_partner = False

    for partnership in project.partnerships.prefetch_related('organisation').all():

        if partnership.organisation:
            org = partnership.organisation
            org_name = org.long_name or org.name

            if partnership.iati_organisation_role and \
                    partnership.iati_organisation_role in Partnership.IATI_ROLE_LIST[:4]:
                valid_partner = True

            if not partnership.iati_organisation_role:
                all_checks_passed = False
                checks.append((u'error', u'missing role for partner %s' % org_name))

            if not org.iati_org_id:
                checks.append((u'warning', u'partner %s has no IATI identifier' % org_name))

        else:
            all_checks_passed = False
            checks.append((u'error', u'partnership has no organisation'))

    if valid_partner:
        checks.append((u'success', u'has at least one valid partner'))

    else:
        all_checks_passed = False
        checks.append((u'error', u'no valid partners'))

    return all_checks_passed, checks
