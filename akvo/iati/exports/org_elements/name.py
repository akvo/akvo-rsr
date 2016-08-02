# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

from lxml import etree


def name(organisation, _request):
    """
    Generate the title element.

    :param organisation: Organisation object
    :param _request: Django request (not used)
    :return: A list of Etree elements
    """
    element = etree.Element("name")
    narrative_element = etree.SubElement(element, "narrative")
    narrative_element.text = organisation.long_name or organisation.name
    return [element]
