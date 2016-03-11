# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

from lxml import etree


def _provider_organisation(element, pd):
    """
    Helper function for planned_disbursement()
    """
    org = pd.provider_organisation
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
    org = pd.receiver_organisation
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

    for planned_disbursement in project.planned_disbursements.all():
        if planned_disbursement.value or planned_disbursement.type or \
                planned_disbursement.period_start or planned_disbursement.period_end or \
                planned_disbursement.value_date or planned_disbursement.currency or \
                planned_disbursement.provider_organisation or \
                planned_disbursement.receiver_organisation:
            element = etree.Element("planned-disbursement")

            if planned_disbursement.type:
                element.attrib['type'] = planned_disbursement.type

            if planned_disbursement.period_start:
                period_start_element = etree.SubElement(element, "period-start")
                period_start_element.attrib['iso-date'] = str(planned_disbursement.period_start)

            if planned_disbursement.period_end:
                period_end_element = etree.SubElement(element, "period-end")
                period_end_element.attrib['iso-date'] = str(planned_disbursement.period_end)

            if planned_disbursement.value:
                value_element = etree.SubElement(element, "value")
                value_element.text = str(planned_disbursement.value)

            if planned_disbursement.value_date:
                value_element.attrib['value-date'] = str(planned_disbursement.value_date)

            if planned_disbursement.currency:
                value_element.attrib['currency'] = planned_disbursement.currency

            if planned_disbursement.provider_organisation:
                element = _provider_organisation(element, planned_disbursement)

            if planned_disbursement.receiver_organisation:
                element = _receiver_organisation(element, planned_disbursement)

            planned_disbursement_elements.append(element)

    return planned_disbursement_elements
