# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

from lxml import etree

from akvo.iati.exports.elements.utils import has_data


def _provider_organisation(element, pd):
    """
    Helper function for planned_disbursement()
    """
    org = pd.provider_organisation.get_original()
    provider_org_element = etree.SubElement(element, "provider-org")

    if pd.provider_organisation_activity:
        provider_org_element.attrib['provider-activity-id'] = pd.provider_organisation_activity

    if org.iati_org_id:
        provider_org_element.attrib['ref'] = org.iati_org_id

    if org.new_organisation_type:
        provider_org_element.attrib['type'] = str(org.new_organisation_type)

    if org.long_name:
        narrative_element = etree.SubElement(provider_org_element, "narrative")
        narrative_element.text = org.long_name
    elif org.name:
        narrative_element = etree.SubElement(provider_org_element, "narrative")
        narrative_element.text = org.name

    return element


def _receiver_organisation(element, pd):
    """
    Helper function for planned_disbursement()
    """
    org = pd.receiver_organisation.get_original()
    receiver_org_element = etree.SubElement(element, "receiver-org")

    if pd.receiver_organisation_activity:
        receiver_org_element.attrib['receiver-activity-id'] = pd.receiver_organisation_activity

    if org.iati_org_id:
        receiver_org_element.attrib['ref'] = org.iati_org_id

    if org.new_organisation_type:
        receiver_org_element.attrib['type'] = str(org.new_organisation_type)

    if org.long_name:
        narrative_element = etree.SubElement(receiver_org_element, "narrative")
        narrative_element.text = org.long_name
    elif org.name:
        narrative_element = etree.SubElement(receiver_org_element, "narrative")
        narrative_element.text = org.name

    return element


def planned_disbursement(project):
    """
    Generate the planned-disbursement elements.

    :param project: Project object
    :return: A list of Etree elements
    """
    planned_disbursement_elements = []

    for pd in project.planned_disbursements.all():
        if has_data(pd, ['value', 'type', 'period_start', 'period_end', 'value_date', 'currency',
                         'provider_organisation', 'receiver_organisation', ]):
            element = etree.Element("planned-disbursement")

            if pd.type:
                element.attrib['type'] = pd.type

            if pd.period_start:
                period_start_element = etree.SubElement(element, "period-start")
                period_start_element.attrib['iso-date'] = str(pd.period_start)

            if pd.period_end:
                period_end_element = etree.SubElement(element, "period-end")
                period_end_element.attrib['iso-date'] = str(pd.period_end)

            if pd.value == 0 or pd.value:
                value_element = etree.SubElement(element, "value")
                value_element.text = str(pd.value)

            if (pd.value == 0 or pd.value) and pd.value_date:
                value_element.attrib['value-date'] = str(pd.value_date)

            if pd.currency:
                value_element.attrib['currency'] = pd.currency

            if pd.provider_organisation:
                element = _provider_organisation(element, pd)

            if pd.receiver_organisation:
                element = _receiver_organisation(element, pd)

            planned_disbursement_elements.append(element)

    return planned_disbursement_elements
