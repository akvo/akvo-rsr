# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

from lxml import etree


def _provider_organisation(element, trans):
    """
    Helper function for transaction()
    """
    org = trans.provider_organisation
    provider_org_element = etree.SubElement(element, "provider-org")

    if trans.provider_organisation_activity:
        provider_org_element.attrib['provider-activity-id'] = trans.provider_organisation_activity

    if org.iati_org_id:
        provider_org_element.attrib['ref'] = org.iati_org_id

    if org.long_name:
        narrative_element = etree.SubElement(provider_org_element, "narrative")
        narrative_element.text = org.long_name
    elif org.name:
        narrative_element = etree.SubElement(provider_org_element, "narrative")
        narrative_element.text = org.name

    return element


def _receiver_organisation(element, trans):
    """
    Helper function for transaction()
    """
    org = trans.receiver_organisation
    receiver_org_element = etree.SubElement(element, "receiver-org")

    if trans.receiver_organisation_activity:
        receiver_org_element.attrib['receiver-activity-id'] = trans.receiver_organisation_activity

    if org.iati_org_id:
        receiver_org_element.attrib['ref'] = org.iati_org_id

    if org.long_name:
        narrative_element = etree.SubElement(receiver_org_element, "narrative")
        narrative_element.text = org.long_name
    elif org.name:
        narrative_element = etree.SubElement(receiver_org_element, "narrative")
        narrative_element.text = org.name

    return element


def _sector(element, sector):
    """
    Helper function for transaction()
    """
    if sector.code:
        sector_element = etree.SubElement(element, "sector")
        sector_element.attrib['code'] = sector.code

        if not sector.vocabulary or sector.vocabulary == 'DAC':
            sector_element.attrib['vocabulary'] = '1'
        elif sector.vocabulary == 'DAC-3':
            sector_element.attrib['vocabulary'] = '2'
        else:
            sector_element.attrib['vocabulary'] = sector.vocabulary

        if sector.percentage:
            sector_element.attrib['percentage'] = str(sector.percentage)

        if sector.text:
            sector_element.text = sector.text

    return element


def transaction(project):
    """
    Generate the transaction elements.

    :param project: Project object
    :return: A list of Etree elements
    """

    transaction_elements = []

    for trans in project.transactions.all():
        element = etree.Element("transaction")

        if trans.reference:
            element.attrib['ref'] = trans.reference

        if trans.transaction_type:
            type_element = etree.SubElement(element, "transaction-type")
            type_element.attrib['code'] = trans.transaction_type

        if trans.transaction_date:
            date_element = etree.SubElement(element, "transaction-date")
            date_element.attrib['iso-date'] = str(trans.transaction_date)

        if trans.value:
            value_element = etree.SubElement(element, "value")
            value_element.text = str(trans.value)

            if trans.currency:
                value_element.attrib['currency'] = trans.currency

            if trans.value_date:
                value_element.attrib['value-date'] = str(trans.value_date)

        if trans.description:
            description_element = etree.SubElement(element, "description")
            narrative_element = etree.SubElement(description_element, "narrative")
            narrative_element.text = trans.description

        if trans.provider_organisation:
            element = _provider_organisation(element, trans)

        if trans.receiver_organisation:
            element = _receiver_organisation(element, trans)

        if trans.disbursement_channel:
            disbursement_channel_element = etree.SubElement(element, "disbursement-channel")
            disbursement_channel_element.attrib['code'] = trans.disbursement_channel

        for sector in trans.sectors.all():
            element = _sector(element, sector)

        if trans.recipient_country:
            recipient_country_element = etree.SubElement(element, "recipient-country")
            recipient_country_element.attrib['code'] = trans.recipient_country

        if trans.recipient_region:
            recipient_region_element = etree.SubElement(element, "recipient-region")
            recipient_region_element.attrib['code'] = trans.recipient_region

            if trans.recipient_region_vocabulary:
                recipient_region_element.attrib['vocabulary'] = trans.recipient_region_vocabulary

        if trans.flow_type:
            flow_type_element = etree.SubElement(element, "flow-type")
            flow_type_element.attrib['code'] = trans.flow_type

        if trans.finance_type:
            finance_type_element = etree.SubElement(element, "finance-type")
            finance_type_element.attrib['code'] = trans.finance_type

        if trans.aid_type:
            aid_type_element = etree.SubElement(element, "aid-type")
            aid_type_element.attrib['code'] = trans.aid_type

        if trans.tied_status:
            tied_status_element = etree.SubElement(element, "tied-status")
            tied_status_element.attrib['code'] = trans.tied_status

        transaction_elements.append(element)

    return transaction_elements
