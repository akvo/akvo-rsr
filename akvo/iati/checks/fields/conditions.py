# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


def conditions(project):
    """
    Check if condition has a type and description.

    :param project: Project object
    :return: All checks passed boolean, [Check results]
    """
    checks = []
    all_checks_passed = True

    for condition in project.conditions.all():
        if not condition.type:
            all_checks_passed = False
            checks.append(('error', 'condition (id: %s) has no type specified' %
                           str(condition.pk)))

        if not condition.text:
            all_checks_passed = False
            checks.append(('error', 'condition (id: %s) has no description specified' %
                           str(condition.pk)))

    if project.conditions.all() and all_checks_passed:
        checks.append(('success', 'has valid condition(s)'))

    return all_checks_passed, checks
