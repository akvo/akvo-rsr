# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

from lxml import etree


def country_budget_items(project):
    """
    Generate the country-budget-items element.

    :param project: Project object
    :return: A list of Etree elements
    """
    if project.country_budget_items.exists():
        country_budget_items_element = etree.Element("country-budget-items")

        if project.country_budget_vocabulary:
            country_budget_items_element.attrib['vocabulary'] = project.country_budget_vocabulary

        for budget_item in project.country_budget_items.all():
            if budget_item.code or budget_item.description:
                if budget_item.code:
                    element = etree.SubElement(country_budget_items_element, "budget-item")
                    element.attrib['code'] = budget_item.code

                if budget_item.description:
                    description_element = etree.SubElement(element, "description")
                    narrative_element = etree.SubElement(description_element, "narrative")
                    narrative_element.text = budget_item.description

                country_budget_items_element.append(element)

        return [country_budget_items_element]

    else:
        return []
