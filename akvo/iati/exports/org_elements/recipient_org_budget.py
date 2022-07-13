# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

from lxml import etree


def recipient_org_budget(organisation, _={}):
    """
    Generate the recipient-org-budget elements.

    :param organisation: Organisation object
    :param _: Additional context (not used)
    :return: A list of Etree elements
    """
    recipient_org_budget_elements = []

    for org_budget in organisation.recipient_org_budgets.all():
        if org_budget.value or org_budget.value == 0 or org_budget.period_start or \
                org_budget.period_end or org_budget.status or org_budget.recipient_organisation:
            element = etree.Element("recipient-org-budget")

            if org_budget.status:
                element.attrib['status'] = org_budget.status

            if org_budget.recipient_organisation:
                org = org_budget.recipient_organisation
                recipient_org_element = etree.SubElement(element, "recipient-org")

                if org.iati_org_id:
                    recipient_org_element.attrib['ref'] = org.iati_org_id

                if org.long_name or org.name:
                    narrative_element = etree.SubElement(recipient_org_element, "narrative")
                    narrative_element.text = org.long_name or org.name

            if org_budget.period_start:
                period_start_element = etree.SubElement(element, "period-start")
                period_start_element.attrib['iso-date'] = str(org_budget.period_start)

            if org_budget.period_end:
                period_end_element = etree.SubElement(element, "period-end")
                period_end_element.attrib['iso-date'] = str(org_budget.period_end)

            if org_budget.value == 0 or org_budget.value:
                value_element = etree.SubElement(element, "value")
                value_element.text = str(org_budget.value)

                if org_budget.value_date:
                    value_element.attrib['value-date'] = str(org_budget.value_date)

                if org_budget.currency:
                    value_element.attrib['currency'] = org_budget.currency

            for budget_line in org_budget.budget_lines.all():
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

            recipient_org_budget_elements.append(element)

    return recipient_org_budget_elements
