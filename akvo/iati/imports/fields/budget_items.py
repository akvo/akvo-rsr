# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

from decimal import Decimal, InvalidOperation
from datetime import datetime

from django.db.models import get_model


def budget_items(activity, project, activities_globals):
    """
    Retrieve and store the budget items.
    The budget items will be extracted from the 'budget' elements.

    :param activity: ElementTree; contains all data of the activity
    :param project: Project instance
    :param activities_globals: Dictionary; contains all global activities information
    :return: List; contains fields that have changed
    """
    imported_budgets = []
    changes = []

    budgets_count = len(activity.findall('budget'))
    original_budgets_count = len(activity.findall("budget[@type='1']"))
    revised_budgets_count = len(activity.findall("budget[@type='2']"))

    for budget in activity.findall('budget'):
        budget_type = ''
        period_start = None
        period_end = None
        value = None
        value_date = None
        currency = ''
        label = get_model('rsr', 'budgetitemlabel').objects.get(label='Other')
        other_label = ''

        if 'type' in budget.attrib.keys():
            budget_type = budget.attrib['type']
            if budget_type == '1' and original_budgets_count == 1:
                label = get_model('rsr', 'budgetitemlabel').objects.get(label='Total')
            elif budget_type == '2' and revised_budgets_count == 1:
                label = get_model('rsr', 'budgetitemlabel').objects.get(label='Total')

        period_start_element = budget.find('period-start')
        if not period_start_element is None and 'iso-date' in period_start_element.attrib.keys():
            period_start_text = period_start_element.attrib['iso-date']
            try:
                period_start = datetime.strptime(period_start_text, '%Y-%m-%d').date()
            except ValueError:
                pass

        period_end_element = budget.find('period-end')
        if not period_end_element is None and 'iso-date' in period_end_element.attrib.keys():
            period_end_text = period_end_element.attrib['iso-date']
            try:
                period_end = datetime.strptime(period_end_text, '%Y-%m-%d').date()
            except ValueError:
                pass

        value_element = budget.find('value')
        if not value_element is None:
            try:
                value = Decimal(value_element.text)
            except InvalidOperation:
                pass

            if 'value-date' in value_element.attrib.keys():
                value_date_text = value_element.attrib['value-date']
                try:
                    value_date = datetime.strptime(value_date_text, '%Y-%m-%d').date()
                except ValueError:
                    pass

            if 'currency' in value_element.attrib.keys():
                currency = value_element.attrib['currency'].upper()

        budget, created = get_model('rsr', 'budgetitem').objects.get_or_create(
            project=project,
            type=budget_type,
            period_start=period_start,
            period_end=period_end,
            amount=value,
            value_date=value_date,
            currency=currency,
            label=label,
            other_extra=other_label
        )

        if created:
            changes.append(u'added budget item (id: %s): %s' % (str(budget.pk), budget))

        imported_budgets.append(budget)

    for budget_item in project.budget_items.all():
        if not budget_item in imported_budgets:
            changes.append(u'deleted budget item (id: %s): %s' %
                           (str(budget_item.pk),
                            budget_item.__unicode__()))
            budget_item.delete()

    return changes
