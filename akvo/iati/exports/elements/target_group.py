# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

from lxml import etree


def target_group(project):
    """
    Generate the target group element, a description element with type "3" and akvo type "3".

    :param project: Project object
    :return: A list of Etree elements
    """
    if project.target_group:
        element = etree.Element("description")
        element.attrib['type'] = '3'
        element.attrib['{http://akvo.org/iati-activities}type'] = '3'

        narrative_element = etree.SubElement(element, "narrative")
        narrative_element.text = project.target_group
        return [element]

    return []
