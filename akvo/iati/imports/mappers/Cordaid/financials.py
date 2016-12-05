# -*- coding: utf-8 -*-

# Akvo Reporting is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

from .....rsr.models.budget_item import BudgetItem, BudgetItemLabel
from ... import akvo_ns
from ..financials import BudgetItems


class BudgetItems(BudgetItems):

    def get_budget(self, budget_from):
        activity = self.parent_elem
        budget_item_data = dict(project=self.project,
                                label=BudgetItemLabel.objects.get(label='Total'),
                                other_extra='',)

        budget = budget_item_data['budget'] = activity.find(
            'budget[@{}="{}"]'.format(akvo_ns('budget-from'), budget_from))

        if budget is not None:
            budget_item_data['type'] = self.get_attrib(budget, 'type', 'type')
            budget_item_data['period_start'] = self.get_child_as_date(
                budget, 'period-start', 'iso-date', 'period_start')
            budget_item_data['period_end'] = self.get_child_as_date(
                budget, 'period-end', 'iso-date', 'period_end')

            budget_item_data['amount'] = self.get_child_element_text_as_decimal(
                budget, 'value', 'amount', 0)

            if budget_item_data['amount']:
                budget_item_data['value_date'] = self.get_child_as_date(
                    budget, 'value', 'value-date', 'value_date')
                currency = self.get_child_elem_attrib(
                    budget, 'value', 'currency', 'currency')
                if not currency:
                    currency = self.get_attrib(activity, 'default-currency', 'currency')
                budget_item_data['currency'] = currency

            else:
                budget_item_data['value_date'] = None
                budget_item_data['currency'] = ''
        else:
            budget_item_data['type'] = ''
            budget_item_data['period_start'] = None
            budget_item_data['period_end'] = None
            budget_item_data['amount'] = 0
            budget_item_data['value_date'] = None
            budget_item_data['currency'] = ''

        return budget_item_data


    def do_import(self):
        """ Very custom handling of the budgets for Cordaid. We look for two budget tags, one with
            budget[@akvo:budget-from="Cordaid"], and one with budget[@akvo:budget-from="Others"].
            The values for those two are added and put in one BudgetItem with the label "total"
            The type, value-date and periods of the "Cordaid" budget is used.
        """
        imported_budgets = []
        changes = []

        cordaid_budget = self.get_budget("Cordaid")
        others_budget = self.get_budget("Others")

        amount = cordaid_budget['amount'] + others_budget['amount']

        # if there is a Cordaid budget we grab meta data from it, otherwise we get it from others
        if cordaid_budget['budget'] is not None:
            budget = cordaid_budget
        else:
            budget = others_budget
        budget['amount'] = amount

        budget.pop('budget')

        budget_obj, created = BudgetItem.objects.get_or_create(**budget)

        if created:
            changes.append(u'added budget item (id: {}): {}'.format(
                budget_obj.pk, budget_obj))
        imported_budgets.append(budget_obj)

        changes += self.delete_objects(self.project.budget_items, imported_budgets, 'budget item')
        return changes
