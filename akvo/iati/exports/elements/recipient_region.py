# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

from lxml import etree

from akvo.iati.exports.elements.utils import has_data


def recipient_region(project):
    """
    Generate the recipient-region element.

    :param project: Project object
    :return: A list of Etree elements
    """
    recipient_region_elements = []

    for region in project.recipient_regions.all():
        if has_data(region, ['region', 'percentage', 'region_vocabulary', 'region_vocabulary_uri',
                             'text', ]):
            element = etree.Element("recipient-region")

            if region.region:
                element.attrib['code'] = region.region

            if region.percentage:
                element.attrib['percentage'] = str(region.percentage)

            if region.region_vocabulary:
                element.attrib['vocabulary'] = str(region.region_vocabulary)

            if region.region_vocabulary_uri:
                element.attrib['vocabulary-uri'] = region.region_vocabulary_uri

            if region.text:
                narrative_element = etree.SubElement(element, "narrative")
                narrative_element.text = region.text

            recipient_region_elements.append(element)

    return recipient_region_elements
