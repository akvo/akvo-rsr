# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


def legacy_data(project):
    """
    Check if legacy data has a name and value.

    :param project: Project object
    :return: All checks passed boolean, [Check results]
    """
    checks = []
    all_checks_passed = True

    for ld in project.legacy_data.all():
        if not ld.name:
            all_checks_passed = False
            checks.append(('error', 'legacy data (id: %s) has no name specified' % str(ld.pk)))

        if not ld.value:
            all_checks_passed = False
            checks.append(('error', 'legacy data (id: %s) has no value specified' % str(ld.pk)))

    if project.legacy_data.all() and all_checks_passed:
        checks.append(('success', 'has valid legacy data'))

    return all_checks_passed, checks
