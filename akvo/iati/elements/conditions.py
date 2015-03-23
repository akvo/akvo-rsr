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
    if project.conditions.all():
        conditions_element = etree.Element("conditions")
    else:
        return []

    if project.conditions_attached is not None:
        conditions_element.attrib['attached'] = '1' if project.conditions_attached else '0'

    for condition in project.conditions.all():
        if condition.type:
            condition_element = etree.SubElement(conditions_element, "condition")
            condition_element.attrib['type'] = condition.type

            if condition.text:
                narrative_element = etree.SubElement(condition_element, "narrative")
                narrative_element.text = condition.text

            conditions_element.append(condition_element)

    return [conditions_element]
