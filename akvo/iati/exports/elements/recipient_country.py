# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

from lxml import etree


def recipient_country(project):
    """
    Generate the recipient-country element.

    :param project: Project object
    :return: A list of Etree elements
    """
    recipient_country_elements = []

    for country in project.recipient_countries.all():
        if country.country or country.percentage or country.text:
            element = etree.Element("recipient-country")

            if country.country:
                element.attrib['code'] = country.country

            if country.percentage:
                element.attrib['percentage'] = str(country.percentage)

            if country.text:
                narrative_element = etree.SubElement(element, "narrative")
                narrative_element.text = country.text

            recipient_country_elements.append(element)

    return recipient_country_elements
