# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

from lxml import etree


def recipient_country_budget(organisation, *_):
    """
    Generate the recipient-country-budget elements.

    :param organisation: Organisation object
    :param _: Additional context (not used)
    :return: A list of Etree elements
    """
    recipient_country_budget_elements = []

    for country_budget in organisation.recipient_country_budgets.all():
        if country_budget.value or country_budget.value == 0 or country_budget.period_start or \
                country_budget.period_end or country_budget.status or country_budget.country:
            element = etree.Element("recipient-country-budget")

            if country_budget.status:
                element.attrib['status'] = country_budget.status

            if country_budget.country:
                recipient_country_element = etree.SubElement(element, "recipient-country")
                recipient_country_element.attrib['code'] = country_budget.country

                if country_budget.text:
                    narrative_element = etree.SubElement(recipient_country_element, "narrative")
                    narrative_element.text = country_budget.text

            if country_budget.period_start:
                period_start_element = etree.SubElement(element, "period-start")
                period_start_element.attrib['iso-date'] = str(country_budget.period_start)

            if country_budget.period_end:
                period_end_element = etree.SubElement(element, "period-end")
                period_end_element.attrib['iso-date'] = str(country_budget.period_end)

            if country_budget.value == 0 or country_budget.value:
                value_element = etree.SubElement(element, "value")
                value_element.text = str(country_budget.value)

                if country_budget.value_date:
                    value_element.attrib['value-date'] = str(country_budget.value_date)

                if country_budget.currency:
                    value_element.attrib['currency'] = country_budget.currency

            for budget_line in country_budget.budget_lines.all():
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

            recipient_country_budget_elements.append(element)

    return recipient_country_budget_elements
