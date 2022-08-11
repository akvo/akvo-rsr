# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

from lxml import etree


def recipient_region_budget(organisation, *_):
    """
    Generate the recipient-region-budget elements.

    :param organisation: Organisation object
    :param _: Additional context (not used)
    :return: A list of Etree elements
    """
    recipient_region_budget_elements = []

    for region_budget in organisation.recipient_region_budgets.all():
        if region_budget.value or region_budget.value == 0 or region_budget.period_start or \
                region_budget.period_end or region_budget.status or region_budget.region:
            element = etree.Element("recipient-region-budget")

            if region_budget.status:
                element.attrib['status'] = region_budget.status

            if region_budget.region:
                recipient_region_element = etree.SubElement(element, "recipient-region")
                recipient_region_element.attrib['code'] = region_budget.region

                if region_budget.region_vocabulary:
                    recipient_region_element.attrib['vocabulary'] = region_budget.region_vocabulary

                if region_budget.region_vocabulary_uri:
                    recipient_region_element.attrib['vocabulary-uri'] = \
                        region_budget.region_vocabulary_uri

                if region_budget.text:
                    narrative_element = etree.SubElement(recipient_region_element, "narrative")
                    narrative_element.text = region_budget.text

            if region_budget.period_start:
                period_start_element = etree.SubElement(element, "period-start")
                period_start_element.attrib['iso-date'] = str(region_budget.period_start)

            if region_budget.period_end:
                period_end_element = etree.SubElement(element, "period-end")
                period_end_element.attrib['iso-date'] = str(region_budget.period_end)

            if region_budget.value == 0 or region_budget.value:
                value_element = etree.SubElement(element, "value")
                value_element.text = str(region_budget.value)

                if region_budget.value_date:
                    value_element.attrib['value-date'] = str(region_budget.value_date)

                if region_budget.currency:
                    value_element.attrib['currency'] = region_budget.currency

            for budget_line in region_budget.budget_lines.all():
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

            recipient_region_budget_elements.append(element)

    return recipient_region_budget_elements
