# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

from lxml import etree


def current_situation(project):
    """
    Generate the current situation element, a description element with type "1" and akvo type "9".

    :param project: Project object
    :return: A list of Etree elements
    """
    if project.current_status:
        element = etree.Element("description")
        element.attrib['type'] = '1'
        element.attrib['{http://akvo.org/iati-activities}type'] = '9'

        narrative_element = etree.SubElement(element, "narrative")
        narrative_element.text = project.current_status
        return [element]

    return []
