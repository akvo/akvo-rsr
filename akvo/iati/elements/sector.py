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
        if sec.sector_code:
            element = etree.Element("sector")
            element.attrib['code'] = sec.sector_code

            if not sec.vocabulary or sec.vocabulary == 'DAC':
                element.attrib['vocabulary'] = '1'
            elif sec.vocabulary == 'DAC-3':
                element.attrib['vocabulary'] = '2'
            else:
                element.attrib['vocabulary'] = sec.vocabulary

            if sec.percentage:
                element.attrib['percentage'] = str(sec.percentage)

            if sec.text:
                element.text = sec.text

            sector_elements.append(element)

    return sector_elements
