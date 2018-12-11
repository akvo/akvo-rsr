# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

from lxml import etree


def other_identifier(project):
    """
    Generate the other-identifier elements.

    :param project: Project object
    :return: A list of Etree elements
    """
    other_identifier_elements = []

    element = etree.Element("other-identifier")
    element.attrib['ref'] = str(project.pk)
    element.attrib['type'] = 'B9'

    owner_org_element = etree.SubElement(element, "owner-org")
    owner_org_element.attrib['ref'] = 'NL-KVK-27327087'

    narrative_element = etree.SubElement(owner_org_element, "narrative")
    narrative_element.text = 'Akvo Foundation'

    other_identifier_elements.append(element)

    for partnership in project.partnerships.all():
        if partnership.internal_id and partnership.organisation:
            org = partnership.organisation.get_original()

            element = etree.Element("other-identifier")
            element.attrib['ref'] = str(partnership.internal_id)
            element.attrib['type'] = 'A1' if partnership == project.reporting_partner else 'B9'

            owner_org_element = etree.SubElement(element, "owner-org")

            if org.iati_org_id:
                owner_org_element.attrib['ref'] = org.iati_org_id

            narrative_element = etree.SubElement(owner_org_element, "narrative")

            if org.long_name:
                narrative_element.text = org.long_name
            elif org.name:
                narrative_element.text = org.name

            other_identifier_elements.append(element)

    return other_identifier_elements
