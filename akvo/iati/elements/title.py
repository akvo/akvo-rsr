# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

from lxml import etree


def title(project):
    """
    Generate the title element.

    :param project: Project object
    :return: A list of Etree elements
    """
    if project.title:
        element = etree.Element("title")
        narrative_element = etree.SubElement(element, "narrative")
        narrative_element.text = project.title
        return [element]

    return []
