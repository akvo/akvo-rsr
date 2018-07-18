# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

from lxml import etree


def conditions(project):
    """
    Generate the conditions element.

    :param project: Project object
    :return: A list of Etree elements
    """
    conditions_element = etree.Element("conditions")

    if project.conditions.exists():
        conditions_element.attrib['attached'] = '1'
    else:
        conditions_element.attrib['attached'] = '0'

    for condition in project.conditions.all():
        if condition.type or condition.text:
            if condition.type:
                condition_element = etree.SubElement(conditions_element, "condition")
                condition_element.attrib['type'] = condition.type

            if condition.text:
                narrative_element = etree.SubElement(condition_element, "narrative")
                narrative_element.text = condition.text

            conditions_element.append(condition_element)

    return [conditions_element]
