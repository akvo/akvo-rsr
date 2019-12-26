# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


def country_budget_items(project):
    """
    Check if vocabulary is present if there are any country budget items.
    Check if percentages add up to 100 if there are multiple budgets.

    :param project: Project object
    :return: All checks passed boolean, [Check results]
    """
    checks = []
    all_checks_passed = True

    if project.country_budget_items.all() and not project.country_budget_vocabulary:
        all_checks_passed = False
        checks.append(('error', 'vocabulary for country budget items not specified'))

    if project.country_budget_items.all().count() > 1:
        percentage = 0
        for budget in project.country_budget_items.all():
            if budget.percentage is None:
                checks.append(('warning', 'country budget item (id: %s) has no percentage' %
                               str(budget.pk)))

            else:
                percentage += budget.percentage

        if percentage == 100:
            checks.append(('success', 'country budget item percentages add up to 100'))

    return all_checks_passed, checks
