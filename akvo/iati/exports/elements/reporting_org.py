# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

from lxml import etree


def reporting_org(project):
    """
    Generate the reporting-org element.

    :param project: Project object
    :return: A list of Etree elements
    """
    org = project.reporting_org
    if org:
        element = etree.Element("reporting-org")

        if org.iati_org_id:
            element.attrib['ref'] = org.iati_org_id

        if project.reporting_org.is_secondary_reporter:
            element.attrib['secondary-reporter'] = '1'
        else:
            element.attrib['secondary-reporter'] = '0'

        if org.new_organisation_type:
            element.attrib['type'] = str(org.new_organisation_type)

        narrative_element = etree.SubElement(element, "narrative")

        if org.long_name:
            narrative_element.text = org.long_name
        elif org.name:
            narrative_element.text = org.name

        return [element]

    return []
