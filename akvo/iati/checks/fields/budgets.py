# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

import json


def budgets(project):
    """
    Check if budget has start date, end date and a value.
    Check that start date lies before the end date.
    Check if the budget has a currency if there is not default currency.

    :param project: Project object
    :return: All checks passed boolean, [Check results]
    """
    checks = []
    all_checks_passed = True

    for budget in project.budget_items.all():
        if budget.amount is None:
            all_checks_passed = False
            checks.append(('error', json.dumps({
                'model': 'budget', 'id': budget.id, 'message': f'budget (id: {budget.id}) has no amount'})))

        if not budget.period_start:
            all_checks_passed = False
            checks.append(('error', json.dumps({
                'model': 'budget', 'id': budget.id, 'message': f'budget (id: {budget.id}) has no start date'})))

        if not budget.period_end:
            all_checks_passed = False
            checks.append(('error', json.dumps({
                'model': 'budget', 'id': budget.id, 'message': f'budget (id: {budget.id}) has no end date'})))

        if budget.period_start and budget.period_end and budget.period_start > budget.period_end:
            all_checks_passed = False
            checks.append(('error', json.dumps({
                'model': 'budget', 'id': budget.id, 'message': f'budget (id: {budget.id}) has a start date before end date'})))

        if budget.period_start and budget.period_end and (budget.period_end - budget.period_start).days > 365:
            all_checks_passed = False
            checks.append(('error', json.dumps({
                'model': 'budget', 'id': budget.id, 'message': f'budget (id: {budget.id}) period must not be longer than one year'})))

        if not budget.currency and not project.currency:
            all_checks_passed = False
            checks.append(('error', json.dumps({
                'model': 'budget', 'id': budget.id, 'message': f'budget (id: {budget.id}) has no currency and no default currency specified'})))

        if not budget.value_date:
            all_checks_passed = False
            checks.append(('error', json.dumps({
                'model': 'budget', 'id': budget.id, 'message': f'budget (id: {budget.id}) has no value date'})))

    if project.budget_items.all() and all_checks_passed:
        checks.append(('success', 'has valid budget items'))

    return all_checks_passed, checks
