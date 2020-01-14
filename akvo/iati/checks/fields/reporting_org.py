# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


def reporting_org(project):
    """
    Check if a project has a reporting organisation and if the reporting organisation has an
    IATI identifier.

    :param project: Project object
    :return: All checks passed boolean, [Check results]
    """
    checks = []
    all_checks_passed = True

    if project.reporting_org:
        checks.append(('success', 'has reporting organisation'))

        if project.reporting_org.iati_org_id:
            checks.append(('success', 'reporting organisation has IATI identifier'))

        else:
            all_checks_passed = False
            checks.append(('error', 'IATI identifier for reporting organisation missing'))

    else:
        all_checks_passed = False
        checks.append(('error', 'reporting organisation missing'))
        checks.append(('error', 'IATI identifier for reporting organisation missing'))

    return all_checks_passed, checks
