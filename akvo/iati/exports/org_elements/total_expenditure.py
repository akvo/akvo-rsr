# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

from lxml import etree


def total_expenditure(organisation, *_):
    """
    Generate the total-expenditure elements.

    :param organisation: Organisation object
    :param _: Additional context (not used)
    :return: A list of Etree elements
    """
    total_expenditure_elements = []

    for total_exp_obj in organisation.total_expenditures.all():
        if total_exp_obj.value or total_exp_obj.value == 0 or total_exp_obj.period_start or \
                total_exp_obj.period_end:
            element = etree.Element("total-expenditure")

            if total_exp_obj.period_start:
                period_start_element = etree.SubElement(element, "period-start")
                period_start_element.attrib['iso-date'] = str(total_exp_obj.period_start)

            if total_exp_obj.period_end:
                period_end_element = etree.SubElement(element, "period-end")
                period_end_element.attrib['iso-date'] = str(total_exp_obj.period_end)

            if total_exp_obj.value == 0 or total_exp_obj.value:
                value_element = etree.SubElement(element, "value")
                value_element.text = str(total_exp_obj.value)

                if total_exp_obj.value_date:
                    value_element.attrib['value-date'] = str(total_exp_obj.value_date)

                if total_exp_obj.currency:
                    value_element.attrib['currency'] = total_exp_obj.currency

            for expense_line in total_exp_obj.expense_lines.all():
                if expense_line.reference or expense_line.value or expense_line.value == 0 or \
                        expense_line.text:
                    expense_line_element = etree.SubElement(element, "expense-line")

                    if expense_line.reference:
                        expense_line_element.attrib['ref'] = expense_line.reference

                    if expense_line.value or expense_line.value == 0:
                        expense_line_value_element = etree.SubElement(expense_line_element, "value")
                        expense_line_value_element.text = str(expense_line.value)

                        if expense_line.currency:
                            expense_line_value_element.attrib['currency'] = expense_line.currency

                        if expense_line.value_date:
                            expense_line_value_element.attrib['value-date'] = \
                                str(expense_line.value_date)

                    if expense_line.text:
                        expense_line_narrative_element = etree.SubElement(expense_line_element,
                                                                          "narrative")
                        expense_line_narrative_element.text = str(expense_line.text)

            total_expenditure_elements.append(element)

    return total_expenditure_elements
