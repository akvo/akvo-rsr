# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

from lxml import etree


def total_budget(organisation, _={}):
    """
    Generate the total-budget elements.

    :param organisation: Organisation object
    :param _: Additional context (not used)
    :return: A list of Etree elements
    """
    total_budget_elements = []

    for total_budget_obj in organisation.total_budgets.all():
        if total_budget_obj.value or total_budget_obj.value == 0 or \
                total_budget_obj.period_start or total_budget_obj.period_end or \
                total_budget_obj.status:
            element = etree.Element("total-budget")

            if total_budget_obj.status:
                element.attrib['status'] = total_budget_obj.status

            if total_budget_obj.period_start:
                period_start_element = etree.SubElement(element, "period-start")
                period_start_element.attrib['iso-date'] = str(total_budget_obj.period_start)

            if total_budget_obj.period_end:
                period_end_element = etree.SubElement(element, "period-end")
                period_end_element.attrib['iso-date'] = str(total_budget_obj.period_end)

            if total_budget_obj.value == 0 or total_budget_obj.value:
                value_element = etree.SubElement(element, "value")
                value_element.text = str(total_budget_obj.value)

                if total_budget_obj.value_date:
                    value_element.attrib['value-date'] = str(total_budget_obj.value_date)

                if total_budget_obj.currency:
                    value_element.attrib['currency'] = total_budget_obj.currency

            for budget_line in total_budget_obj.budget_lines.all():
                if budget_line.reference or budget_line.value or budget_line.value == 0 or \
                        budget_line.text:
                    budget_line_element = etree.SubElement(element, "budget-line")

                    if budget_line.reference:
                        budget_line_element.attrib['ref'] = budget_line.reference

                    if budget_line.value or budget_line.value == 0:
                        budget_line_value_element = etree.SubElement(budget_line_element, "value")
                        budget_line_value_element.text = str(budget_line.value)

                        if budget_line.currency:
                            budget_line_value_element.attrib['currency'] = budget_line.currency

                        if budget_line.value_date:
                            budget_line_value_element.attrib['value-date'] = \
                                str(budget_line.value_date)

                    if budget_line.text:
                        budget_line_narrative_element = etree.SubElement(budget_line_element,
                                                                         "narrative")
                        budget_line_narrative_element.text = str(budget_line.text)

            total_budget_elements.append(element)

    return total_budget_elements
