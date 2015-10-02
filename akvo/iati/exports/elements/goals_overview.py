# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

from lxml import etree


def goals_overview(project):
    """
    Generate the goals overview element, a description element with type "2" and akvo type "8".

    :param project: Project object
    :return: A list of Etree elements
    """
    if project.goals_overview:
        element = etree.Element("description")
        element.attrib['type'] = '2'
        element.attrib['{http://akvo.org/iati-activities}type'] = '8'

        narrative_element = etree.SubElement(element, "narrative")
        narrative_element.text = project.goals_overview
        return [element]

    return []
