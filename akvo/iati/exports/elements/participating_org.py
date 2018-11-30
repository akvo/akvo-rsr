# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

from lxml import etree


def participating_org(project):
    """
    Generate the participating-org element.

    :param project: Project object
    :return: A list of Etree elements
    """
    partnership_elements = []

    from akvo.rsr.models import Partnership

    for partnership in project.partnerships.all():
        # Don't include reporting orgs or sponsor partners
        if partnership.iati_organisation_role in Partnership.IATI_ROLE_LIST[:4] and \
                partnership.organisation:
            org = partnership.organisation.get_original()

            element = etree.Element("participating-org")

            if org.iati_org_id:
                element.attrib['ref'] = org.iati_org_id

            if org.new_organisation_type:
                element.attrib['type'] = str(org.new_organisation_type)

            if partnership.iati_organisation_role:
                element.attrib['role'] = str(partnership.iati_organisation_role)

            if partnership.iati_activity_id:
                element.attrib['activity-id'] = partnership.iati_activity_id

            # TODO: Funding amount

            narrative_element = etree.SubElement(element, "narrative")

            if org.long_name:
                narrative_element.text = org.long_name
            elif org.name:
                narrative_element.text = org.name

            partnership_elements.append(element)

    return partnership_elements
