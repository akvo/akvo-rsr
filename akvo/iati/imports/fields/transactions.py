# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

from ..utils import get_or_create_organisation, get_text

from decimal import Decimal, InvalidOperation
from datetime import datetime

from django.db.models import get_model

TYPE_TO_CODE = {
    'C': '2',
    'D': '3',
    'E': '4',
    'IF': '1',
    'IR': '5',
    'LR': '6',
    'R': '7',
    'QP': '8',
    'QS': '9',
    'CG': '10'
}


def transactions(activity, project, activities_globals):
    """
    Retrieve and store the transactions.
    The transactions will be extracted from the 'transaction' elements.

    :param activity: ElementTree; contains all data of the activity
    :param project: Project instance
    :param activities_globals: Dictionary; contains all global activities information
    :return: List; contains fields that have changed
    """
    imported_transactions = []
    changes = []

    for transaction in activity.findall('transaction'):
        transaction_ref = ''
        transaction_type = ''
        transaction_date = None
        transaction_value = None
        transaction_value_date = None
        transaction_currency = ''
        transaction_description = ''
        transaction_provider_org = None
        transaction_provider_activity_id = ''
        transaction_receiver_org = None
        transaction_receiver_activity_id = ''
        transaction_disbursement = ''
        transaction_flow = ''
        transaction_finance = ''
        transaction_aid = ''
        transaction_tied_status = ''
        transaction_country = ''
        transaction_region = ''
        transaction_region_vocabulary = ''

        if 'ref' in transaction.attrib.keys():
            transaction_ref = transaction.attrib['ref']

        trans_type_element = transaction.find('transaction-type')
        if not trans_type_element is None and 'code' in trans_type_element.attrib.keys():
            transaction_type = trans_type_element.attrib['code'].upper()
            if transaction_type in TYPE_TO_CODE.keys():
                transaction_type = TYPE_TO_CODE[transaction_type]

        trans_date_element = transaction.find('transaction-date')
        if not trans_date_element is None and 'iso-date' in trans_date_element.attrib.keys():
            trans_date_text = trans_date_element.attrib['iso-date']
            try:
                transaction_date = datetime.strptime(trans_date_text, '%Y-%m-%d').date()
            except ValueError:
                pass

        value_element = transaction.find('value')
        if not value_element is None:
            try:
                transaction_value = Decimal(value_element.text)
            except InvalidOperation:
                pass

            if 'value-date' in value_element.attrib.keys():
                value_date_text = value_element.attrib['value-date']
                try:
                    transaction_value_date = datetime.strptime(value_date_text, '%Y-%m-%d').date()
                except ValueError:
                    pass

            if 'currency' in value_element.attrib.keys():
                transaction_currency = value_element.attrib['currency'].upper()

        description_element = transaction.find('description')
        if not description_element is None:
            transaction_description = get_text(description_element, activities_globals['version'])

        prov_org_element = transaction.find('provider-org')
        if not prov_org_element is None:
            transaction_provider_org = get_or_create_organisation(
                prov_org_element.attrib['ref'] if 'ref' in prov_org_element.attrib.keys() else '',
                get_text(prov_org_element, activities_globals['version'])
            )

            if 'provider-activity-id' in prov_org_element.attrib.keys():
                transaction_provider_activity_id = prov_org_element.attrib['provider-activity-id']

        rec_org_element = transaction.find('receiver-org')
        if not rec_org_element is None:
            transaction_receiver_org = get_or_create_organisation(
                rec_org_element.attrib['ref'] if 'ref' in rec_org_element.attrib.keys() else '',
                get_text(rec_org_element, activities_globals['version'])
            )

            if 'receiver-activity-id' in rec_org_element.attrib.keys():
                transaction_receiver_activity_id = rec_org_element.attrib['receiver-activity-id']

        disbursement_element = transaction.find('disbursement-channel')
        if not disbursement_element is None and 'code' in disbursement_element.attrib.keys():
            transaction_disbursement = disbursement_element.attrib['code']

        flow_element = transaction.find('flow-type')
        if not flow_element is None and 'code' in flow_element.attrib.keys():
            transaction_flow = flow_element.attrib['code']

        finance_element = transaction.find('finance-type')
        if not finance_element is None and 'code' in finance_element.attrib.keys():
            transaction_finance = finance_element.attrib['code']

        aid_element = transaction.find('aid-type')
        if not aid_element is None and 'code' in aid_element.attrib.keys():
            transaction_aid = aid_element.attrib['code']

        tied_status_element = transaction.find('tied-status')
        if not tied_status_element is None and 'code' in tied_status_element.attrib.keys():
            transaction_tied_status = tied_status_element.attrib['code']

        country_element = transaction.find('recipient-country')
        if not country_element is None and 'code' in country_element.attrib.keys():
            transaction_country = country_element.attrib['code'].upper()

        region_element = transaction.find('recipient-region')
        if not region_element is None and 'code' in region_element.attrib.keys():
            transaction_region = region_element.attrib['code']

            if 'vocabulary' in region_element.attrib.keys():
                transaction_region_vocabulary = region_element.attrib['vocabulary']

        trans, created = get_model('rsr', 'transaction').objects.get_or_create(
            project=project,
            reference=transaction_ref,
            aid_type=transaction_aid,
            description=transaction_description,
            disbursement_channel=transaction_disbursement,
            finance_type=transaction_finance,
            flow_type=transaction_flow,
            tied_status=transaction_tied_status,
            transaction_date=transaction_date,
            transaction_type=transaction_type,
            value=transaction_value,
            value_date=transaction_value_date,
            currency=transaction_currency,
            provider_organisation=transaction_provider_org,
            provider_organisation_activity=transaction_provider_activity_id,
            receiver_organisation=transaction_receiver_org,
            receiver_organisation_activity=transaction_receiver_activity_id,
            recipient_country=transaction_country,
            recipient_region=transaction_region,
            recipient_region_vocabulary=transaction_region_vocabulary
        )

        # Disregard double transactions
        if not trans in imported_transactions:
            if created:
                changes.append(u'added transaction (id: %s): %s' % (str(trans.pk), trans))

            imported_transactions.append(trans)

            # Process transaction sectors
            for sector_change in transaction_sectors(transaction, trans, activities_globals):
                changes.append(sector_change)

    for transaction in project.transactions.all():
        if not transaction in imported_transactions:
            changes.append(u'deleted transaction (id: %s): %s' %
                           (str(transaction.pk),
                            transaction.__unicode__()))
            transaction.delete()

    return changes


def transaction_sectors(transaction_element, transaction, activities_globals):
    """
    Retrieve and store the transaction sectors.
    The transaction sectors will be extracted from the 'sector' elements within a 'transaction'
    element.

    :param transaction_element: ElementTree; contains all data of the transaction
    :param transaction: Transaction instance
    :param activities_globals: Dictionary; contains all global activities information
    :return: List; contains fields that have changed
    """
    imported_sectors = []
    changes = []

    for sector in transaction_element.findall('sector'):
        sector_code = ''
        sector_vocabulary = ''

        if 'code' in sector.attrib.keys():
            sector_code = sector.attrib['code']

        if 'vocabulary' in sector.attrib.keys():
            sector_vocabulary = sector.attrib['vocabulary']

        sector_description = get_text(sector, activities_globals['version'])

        sec, created = get_model('rsr', 'transactionsector').objects.get_or_create(
            transaction=transaction,
            code=sector_code,
            text=sector_description,
            vocabulary=sector_vocabulary
        )

        if created:
            changes.append(u'added transaction sector (id: %s): %s' % (str(sec.pk), sec))

        imported_sectors.append(sec)

    for sector in transaction.sectors.all():
        if not sector in imported_sectors:
            changes.append(u'deleted transaction sector (id: %s): %s' %
                           (str(sector.pk),
                            sector.__unicode__()))
            sector.delete()

    return changes
