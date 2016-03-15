# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

from lxml import etree


def sector(project):
    """
    Generate the sector elements.

    :param project: Project object
    :return: A list of Etree elements
    """
    sector_elements = []

    for sec in project.sectors.all():
        if sec.sector_code or sec.vocabulary or sec.vocabulary_uri or sec.percentage or sec.text:
            element = etree.Element("sector")

            if sec.sector_code:
                element.attrib['code'] = sec.sector_code

            if sec.vocabulary:
                element.attrib['vocabulary'] = sec.vocabulary

            if sec.vocabulary_uri:
                element.attrib['vocabulary-uri'] = sec.vocabulary_uri

            if sec.percentage:
                element.attrib['percentage'] = str(sec.percentage)

            if sec.text:
                narrative_element = etree.SubElement(element, "narrative")
                narrative_element.text = sec.text

            sector_elements.append(element)

    return sector_elements
