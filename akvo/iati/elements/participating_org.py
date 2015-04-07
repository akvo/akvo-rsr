# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

from lxml import etree

TYPE_TO_CODE = {
    'funding': '1',
    'support': '2',
    'sponsor': '3',
    'field': '4',
}


def participating_org(project):
    """
    Generate the participating-org element.

    :param project: Project object
    :return: A list of Etree elements
    """
    partnership_elements = []

    for partnership in project.partnerships.all():
        org = partnership.organisation
        element = etree.Element("participating-org")

        if org.iati_org_id:
            element.attrib['ref'] = org.iati_org_id

        if org.new_organisation_type:
            element.attrib['type'] = str(org.new_organisation_type)

        if partnership.partner_type in TYPE_TO_CODE.keys():
            element.attrib['role'] = TYPE_TO_CODE[partnership.partner_type]

        narrative_element = etree.SubElement(element, "narrative")

        if org.long_name:
            narrative_element.text = org.long_name
        elif org.name:
            narrative_element.text = org.name

        partnership_elements.append(element)

    return partnership_elements
