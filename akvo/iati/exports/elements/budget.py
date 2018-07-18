# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

from lxml import etree

from akvo.iati.exports.elements.utils import has_data


def budget(project):
    """
    Generate the budget elements.

    :param project: Project object
    :return: A list of Etree elements
    """
    budget_elements = []

    for budget_item in project.budget_items.all():
        if has_data(budget_item, ['amount', 'period_start', 'period_end', 'type', 'status',
                                  'value_date', 'currency', 'other_extra', 'label']):
            element = etree.Element("budget")

            if budget_item.type:
                element.attrib['type'] = budget_item.type

            if budget_item.status:
                element.attrib['status'] = budget_item.status

            if budget_item.period_start:
                period_start_element = etree.SubElement(element, "period-start")
                period_start_element.attrib['iso-date'] = str(budget_item.period_start)

            if budget_item.period_end:
                period_end_element = etree.SubElement(element, "period-end")
                period_end_element.attrib['iso-date'] = str(budget_item.period_end)

            if budget_item.amount == 0 or budget_item.amount:
                value_element = etree.SubElement(element, "value")
                value_element.text = str(budget_item.amount)

                if budget_item.value_date:
                    value_element.attrib['value-date'] = str(budget_item.value_date)

                if budget_item.currency:
                    value_element.attrib['currency'] = budget_item.currency

                akvo_label = '{http://akvo.org/iati-activities}label'
                if budget_item.other_extra:
                    value_element.attrib[akvo_label] = budget_item.other_extra
                elif budget_item.label and budget_item.label.label:
                    value_element.attrib[akvo_label] = budget_item.label.label

            budget_elements.append(element)

    return budget_elements
