# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

from ....rsr.models.budget_item import BudgetItem, BudgetItemLabel, CountryBudgetItem
from ....rsr.models.iati_import_log import IatiImportLog
from ....rsr.models.planned_disbursement import PlannedDisbursement
from ....rsr.models.transaction import Transaction, TransactionSector

from ..utils import add_log, get_or_create_organisation, get_text, ImporterHelper

from decimal import Decimal, InvalidOperation
from datetime import datetime

from django.conf import settings
from django.db.models import ObjectDoesNotExist

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

class Transactions(ImporterHelper):

    def __init__(self, iati_import, parent_element, project, globals, related_obj=None):
        super(Transactions, self).__init__(iati_import, parent_element, project, globals)
        self.model = Transaction

    def do_import(self):
        """
        Retrieve and store the transactions.
        The transactions will be extracted from the 'transaction' elements.

        :param iati_import: IatiImport instance
        :param activity: ElementTree; contains all data of the activity
        :param project: Project instance
        :param activities_globals: Dictionary; contains all global activities information
        :return: List; contains fields that have changed
        """
        imported_transactions = []
        changes = []

        for transaction in self.parent_elem.findall('transaction'):
            # transaction_ref = ''
            # transaction_type = ''
            # transaction_date = None
            # transaction_value = None
            # transaction_value_date = None
            # transaction_currency = ''
            # transaction_description = ''
            # transaction_provider_org = None
            # transaction_provider_activity_id = ''
            # transaction_receiver_org = None
            # transaction_receiver_activity_id = ''
            # transaction_disbursement = ''
            # transaction_flow = ''
            # transaction_finance = ''
            # transaction_aid = ''
            # transaction_tied_status = ''
            # transaction_country = ''
            # transaction_region = ''
            # transaction_region_vocabulary = ''

            reference = self.get_attrib(transaction, 'ref', 'reference')
            # if 'ref' in transaction.attrib.keys():
            #     if not len(transaction.attrib['ref']) > 25:
            #         transaction_ref = transaction.attrib['ref']
            #     else:
            #         add_log(iati_import, 'transaction_ref', 'ref too long (25 characters allowed)',
            #                 project)

            transaction_type = self.get_child_elem_attrib(
                transaction, 'transaction-type', 'code', 'transaction_type')
            if transaction_type in TYPE_TO_CODE.keys():
                transaction_type = TYPE_TO_CODE[transaction_type]
            # trans_type_element = transaction.find('transaction-type')
            # if not trans_type_element is None and 'code' in trans_type_element.attrib.keys():
            #     if not len(trans_type_element.attrib['code']) > 2:
            #         transaction_type = trans_type_element.attrib['code'].upper()
            #         if transaction_type in TYPE_TO_CODE.keys():
            #             transaction_type = TYPE_TO_CODE[transaction_type]
            #     else:
            #         add_log(iati_import, 'transaction_type', 'type too long (2 characters allowed)',
            #                 project)
            transaction_date = self.get_child_as_date(
                transaction, 'transaction-date', 'iso-date', 'transaction_date')

            # transaction_date = self.get_child_elem_attrib(
            #         transaction, 'transaction-date', 'iso-date', 'transaction_date')
            # try:
            #     transaction_date = datetime.strptime(transaction_date, '%Y-%m-%d').date()
            # except ValueError as e:
            #     self.add_log('transaction-date', 'transaction_date', str(e))

            # trans_date_element = transaction.find('transaction-date')
            # if not trans_date_element is None and 'iso-date' in trans_date_element.attrib.keys():
            #     trans_date_text = trans_date_element.attrib['iso-date']
            #     try:
            #         transaction_date = datetime.strptime(trans_date_text, '%Y-%m-%d').date()
            #     except ValueError as e:
            #         add_log(iati_import, 'transaction_date', str(e), project)

            value = self.get_child_element_text_as_decimal(transaction, 'value', 'value', None)
            if value:
                value_date = self.get_child_as_date(
                    transaction, 'value', 'value-date', 'value_date')
                currency = self.get_child_elem_attrib(transaction, 'value', 'currency', 'currency')
            else:
                value_date = None
                currency = ''

            # value_element = transaction.find('value')
            # if not value_element is None:
            #     try:
            #         if value_element.text:
            #             if not len(value_element.text) > 14:
            #                 transaction_value = Decimal(value_element.text)
            #             else:
            #                 add_log(iati_import, 'transaction_value',
            #                         'value too big (14 characters allowed)', project)
            #     except InvalidOperation as e:
            #         add_log(iati_import, 'transaction_value', str(e), project)
            #
            #     if 'value-date' in value_element.attrib.keys():
            #         value_date_text = value_element.attrib['value-date']
            #         try:
            #             transaction_value_date = datetime.strptime(value_date_text, '%Y-%m-%d').date()
            #         except ValueError as e:
            #             add_log(iati_import, 'transaction_value_date', str(e), project)
            #
            #     if 'currency' in value_element.attrib.keys():
            #         if not len(value_element.attrib['currency']) > 3:
            #             transaction_currency = value_element.attrib['currency'].upper()
            #         else:
            #             add_log(iati_import, 'transaction_currency',
            #                     'currency too long (3 characters allowed)', project)

            description = self.get_child_element_text(transaction, 'description', 'description')
            # description_element = transaction.find('description')
            # if not description_element is None:
            #     transaction_description = get_text(description_element, activities_globals['version'])
            #     if len(transaction_description) > 255:
            #         add_log(iati_import, 'transaction_description',
            #                 'description too long (255 characters allowed)', project,
            #                 IatiImportLog.VALUE_PARTLY_SAVED)
            #         transaction_description = transaction_description[:255]

            prov_org_element = transaction.find('provider-org')
            if prov_org_element is not None:
                transaction_provider_org = get_or_create_organisation(
                    prov_org_element.get('ref', ''), self.get_text(prov_org_element))
                provider_organisation_activity = self.get_child_elem_attrib(
                    transaction, 'provider-org', 'provider-activity-id',
                    'provider_organisation_activity')
            else:
                transaction_provider_org = None
                provider_organisation_activity = ''

                # if 'provider-activity-id' in prov_org_element.attrib.keys():
                #     if not len(prov_org_element.attrib['provider-activity-id']) > 50:
                #         transaction_provider_activity_id = prov_org_element.attrib['provider-activity-id']
                #     else:
                #         add_log(iati_import, 'transaction_provider_activity_id',
                #                 'activity id too long (50 characters allowed)', project)

            rec_org_element = transaction.find('receiver-org')
            if rec_org_element is not None:
                transaction_receiver_org = get_or_create_organisation(
                    rec_org_element.get('ref'), self.get_text(rec_org_element))
                receiver_organisation_activity = self.get_child_elem_attrib(
                    transaction, 'receiver-org', 'receiver-activity-id',
                    'receiver_organisation_activity')
            else:
                transaction_receiver_org = None
                receiver_organisation_activity = ''

                # if 'receiver-activity-id' in rec_org_element.attrib.keys():
                #     if not len(rec_org_element.attrib['receiver-activity-id']) > 50:
                #         transaction_receiver_activity_id = \
                #             rec_org_element.attrib['receiver-activity-id']
                #     else:
                #         add_log(iati_import, 'transaction_receiver_activity_id',
                #                 'activity id too long (50 characters allowed)', project)

            disbursement_channel = self.get_child_elem_attrib(
                transaction, 'disbursement-channel', 'code', 'disbursement_channel')
            # disbursement_element = transaction.find('disbursement-channel')
            # if not disbursement_element is None and 'code' in disbursement_element.attrib.keys():
            #     if not len(disbursement_element.attrib['code']) > 1:
            #         transaction_disbursement = disbursement_element.attrib['code']
            #     else:
            #         add_log(iati_import, 'transaction_disbursement_channel',
            #                 'code too long (1 character allowed)', project)

            flow_type = self.get_child_elem_attrib(transaction, 'flow-type', 'code', 'flow_type')
            # flow_element = transaction.find('flow-type')
            # if not flow_element is None and 'code' in flow_element.attrib.keys():
            #     if not len(flow_element.attrib['code']) > 2:
            #         transaction_flow = flow_element.attrib['code']
            #     else:
            #         add_log(iati_import, 'transaction_flow_type',
            #                 'code too long (2 characters allowed)', project)

            finance_type = self.get_child_elem_attrib(
                transaction, 'finance-type', 'code', 'finance_type')
            # finance_element = transaction.find('finance-type')
            # if not finance_element is None and 'code' in finance_element.attrib.keys():
            #     if not len(finance_element.attrib['code']) > 3:
            #         transaction_finance = finance_element.attrib['code']
            #     else:
            #         add_log(iati_import, 'transaction_finance_type',
            #                 'code too long (3 character allowed)', project)

            aid_type = self.get_child_elem_attrib(transaction, 'aid-type', 'code', 'aid_type')
            # aid_element = transaction.find('aid-type')
            # if not aid_element is None and 'code' in aid_element.attrib.keys():
            #     if not len(aid_element.attrib['code']) > 3:
            #         transaction_aid = aid_element.attrib['code']
            #     else:
            #         add_log(iati_import, 'transaction_aid_type',
            #                 'code too long (3 characters allowed)', project)

            tied_status = self.get_child_elem_attrib(
                transaction, 'tied-status', 'code', 'tied_status')
            # tied_status_element = transaction.find('tied-status')
            # if not tied_status_element is None and 'code' in tied_status_element.attrib.keys():
            #     if not len(tied_status_element.attrib['code']) > 1:
            #         transaction_tied_status = tied_status_element.attrib['code']
            #     else:
            #         add_log(iati_import, 'transaction_tied_status',
            #                 'code too long (1 character allowed)', project)

            recipient_country = self.get_child_elem_attrib(
                transaction, 'recipient-country', 'code', 'recipient_country')
            # country_element = transaction.find('recipient-country')
            # if not country_element is None and 'code' in country_element.attrib.keys():
            #     if not len(country_element.attrib['code']) > 2:
            #         transaction_country = country_element.attrib['code'].upper()
            #     else:
            #         add_log(iati_import, 'transaction_recipient_country',
            #                 'code too long (2 characters allowed)', project)


            region_element = transaction.find('recipient-region')
            if region_element is not None:
                recipient_region = self.get_attrib(region_element, 'code', 'recipient_region')
                recipient_region_vocabulary = self.get_attrib(
                    region_element, 'vocabulary', 'recipient_region_vocabulary')
            else:
                recipient_region = ''
                recipient_region_vocabulary = ''

                # if region_element is not None and 'code' in region_element.attrib.keys():
            #     if not len(region_element.attrib['code']) > 3:
            #         transaction_region = region_element.attrib['code']
            #     else:
            #         add_log(iati_import, 'transaction_recipient_region',
            #                 'code too long (3 characters allowed)', project)
            #
            #     if 'vocabulary' in region_element.attrib.keys():
            #         if not len(region_element.attrib['vocabulary']) > 1:
            #             transaction_region_vocabulary = region_element.attrib['vocabulary']
            #         else:
            #             add_log(iati_import, 'transaction_recipient_region',
            #                     'code too long (3 characters allowed)', project)

            transaction_obj, created = Transaction.objects.get_or_create(
                project=self.project,
                reference=reference,
                aid_type=aid_type,
                description=description,
                disbursement_channel=disbursement_channel,
                finance_type=finance_type,
                flow_type=flow_type,
                tied_status=tied_status,
                transaction_date=transaction_date,
                transaction_type=transaction_type,
                value=value,
                value_date=value_date,
                currency=currency,
                provider_organisation=transaction_provider_org,
                provider_organisation_activity=provider_organisation_activity,
                receiver_organisation=transaction_receiver_org,
                receiver_organisation_activity=receiver_organisation_activity,
                recipient_country=recipient_country,
                recipient_region=recipient_region,
                recipient_region_vocabulary=recipient_region_vocabulary
            )

            # Disregard double transactions
            if not transaction_obj in imported_transactions:
                if created:
                    changes.append(u'added transaction (id: {}): {}'.format(
                            transaction_obj.pk, transaction_obj))

                imported_transactions.append(transaction_obj)

                # Process transaction sectors
                transaction_sectors = TransactionsSectors(
                        self.iati_import, transaction, self.project, self.globals,
                        related_obj=transaction_obj)
                for sector_change in transaction_sectors.do_import():
                    changes.append(sector_change)

        changes += self.delete_objects(
                self.project.transactions, imported_transactions, 'transaction')
        # for transaction in self.project.transactions.all():
        #     if not transaction in imported_transactions:
        #         changes.append(u'deleted transaction (id: {}): {}'.format(
        #                 transaction.pk, transaction.__unicode__()))
        #         transaction.delete()
        return changes


class TransactionsSectors(ImporterHelper):

    def __init__(self, iati_import, parent_element, project, globals, related_obj):
        super(TransactionsSectors, self).__init__(
                iati_import, parent_element, project, globals, related_obj)
        self.model = TransactionSector

    def do_import(self):
        """
        Retrieve and store the transaction sectors.
        The transaction sectors will be extracted from the 'sector' elements within a 'transaction'
        element.

        :param iati_import: IatiImport instance
        :param transaction_element: ElementTree; contains all data of the transaction
        :param transaction: Transaction instance
        :param activities_globals: Dictionary; contains all global activities information
        :return: List; contains fields that have changed
        """
        imported_sectors = []
        changes = []

        for sector in self.parent_elem.findall('sector'):
            sector_code = ''
            sector_vocabulary = ''

            code = self.get_attrib(sector, 'code', 'code')
            # if 'code' in sector.attrib.keys():
            #     if not len(sector.attrib['code']) > 5:
            #         sector_code = sector.attrib['code']
            #     else:
            #         add_log(iati_import, 'transaction_sector_code',
            #                 'code too long (5 characters allowed)', transaction.project)

            vocabulary = self.get_attrib(sector, 'vocabulary', 'vocabulary')
            # if 'vocabulary' in sector.attrib.keys():
            #     if not len(sector.attrib['vocabulary']) > 5:
            #         sector_vocabulary = sector.attrib['vocabulary']
            #     else:
            #         add_log(iati_import, 'transaction_sector_vocabulary',
            #                 'vocabulary too long (5 characters allowed)', transaction.project)

            text = self.get_element_text(sector, 'text')
            # sector_description = get_text(sector, activities_globals['version'])
            # if len(sector_description) > 100:
            #     add_log(iati_import, 'transaction_sector_description',
            #             'description too long (100 characters allowed)', transaction.project,
            #             IatiImportLog.VALUE_PARTLY_SAVED)
            #     sector_description = sector_description[:100]

            sector_obj, created = TransactionSector.objects.get_or_create(
                transaction=self.related_obj,
                code=code,
                text=text,
                vocabulary=vocabulary
            )

            if created:
                changes.append(u'added transaction sector (id: {}): {}'.format(
                        sector_obj.pk, sector_obj))

            imported_sectors.append(sector_obj)

        changes += self.delete_objects(
                self.related_obj.sectors, imported_sectors, 'transaction sector')
        # for sector in self.related_obj.sectors.all():
        #     if not sector in imported_sectors:
        #         changes.append(u'deleted transaction sector (id: {}): {}'.format(
        #                 sector.pk, sector.__unicode__()))
        #         sector.delete()
        return changes


class BudgetItems(ImporterHelper):

    def __init__(self, iati_import, parent_elem, project, globals, related_obj=None):
        super(BudgetItems, self).__init__(iati_import, parent_elem, project, globals)
        self.model = BudgetItem

    def do_import(self):
        """
        Retrieve and store the budget items.
        The budget items will be extracted from the 'budget' elements. Since there is no place to
        indicate the budget item label in IATI, we set it to the 'Total' label if there is only one
        budget item (per type, e.g. if there's one original and one revised budget item, both will be
        set to 'Total'). In all other cases, the budget item label will be set to 'Other'.

        :param iati_import: IatiImport instance
        :param activity: ElementTree; contains all data of the activity
        :param project: Project instance
        :param activities_globals: Dictionary; contains all global activities information
        :return: List; contains fields that have changed
        """
        imported_budgets = []
        changes = []

        activity = self.parent_elem
        all_budget_count = len(activity.findall("budget"))
        original_budgets_count = len(activity.findall("budget[@type='1']"))
        revised_budgets_count = len(activity.findall("budget[@type='2']"))

        for budget in activity.findall('budget'):
            budget_type = ''
            period_start = None
            period_end = None
            value = None
            value_date = None
            currency = ''
            label = BudgetItemLabel.objects.get(label='Other')
            other_extra = 'Other'

            budget_type = self.get_attrib(budget, 'type', 'type')
            # if 'type' in budget.attrib.keys() and len(budget.attrib['type']) < 2:
            #     budget_type = budget.attrib['type']

            if ((budget_type == '1' and original_budgets_count == 1) or
                    (budget_type == '2' and revised_budgets_count == 1) or
                    all_budget_count == 1):
                label = BudgetItemLabel.objects.get(label='Total')
                other_extra = ''


            akvo_budget_type = budget.attrib.get('{%s}type' % settings.AKVO_NS)
            akvo_budget_label = budget.attrib.get('{%s}label' % settings.AKVO_NS)

            if akvo_budget_type:
                try:
                    label = BudgetItemLabel.objects.get(pk=int(akvo_budget_type))
                except (ValueError, ObjectDoesNotExist) as e:
                    self.add_log('budget[@type]', 'budget_item_label', str(e),
                            IatiImportLog.VALUE_PARTLY_SAVED)

            if akvo_budget_label:
                other_extra = akvo_budget_label
                if len(other_extra) > 30:
                    self.add_log('budget[@label]', 'budget_item_label',
                            'label too long (30 characters allowed)',
                            IatiImportLog.VALUE_PARTLY_SAVED)
                    other_extra = other_extra[:30]

            period_start = self.get_child_as_date(
                    budget, 'period-start', 'iso-date', 'period_start')
            if period_start and other_extra == 'Other':
                other_extra = str(period_start.year)

            # period_start_element = budget.find('period-start')
            # if not period_start_element is None and 'iso-date' in period_start_element.attrib.keys():
            #     period_start_text = period_start_element.attrib['iso-date']
            #     try:
            #         period_start = datetime.strptime(period_start_text, '%Y-%m-%d').date()
            #         if other_extra == 'Other':
            #             other_extra = str(period_start.year)
            #     except ValueError as e:
            #         add_log(iati_import, 'budget_item_period_start', str(e), project)

            period_end = self.get_child_as_date(budget, 'period-end', 'iso-date', 'period_end')
            # period_end_element = budget.find('period-end')
            # if not period_end_element is None and 'iso-date' in period_end_element.attrib.keys():
            #     period_end_text = period_end_element.attrib['iso-date']
            #     try:
            #         period_end = datetime.strptime(period_end_text, '%Y-%m-%d').date()
            #     except ValueError as e:
            #         add_log(iati_import, 'budget_item_period_end', str(e), project)

            amount = self.get_child_element_text_as_decimal(budget, 'value', 'amount', None)
            if amount:
                value_date = self.get_child_as_date(
                        budget, 'value', 'value-date', 'value_date')
                # TODO get currency from activity@[default-currency]
                currency = self.get_child_elem_attrib(budget, 'value', 'currency', 'currency')
            else:
                value_date = None
                currency = ''

            # value_element = budget.find('value')
            # if not value_element is None:
            #     try:
            #         if value_element.text:
            #             if not len(value_element.text) > 14:
            #                 value = Decimal(value_element.text)
            #             else:
            #                 add_log(iati_import, 'budget_item_period_start',
            #                         'value too big (14 characters allowed)', project)
            #     except InvalidOperation as e:
            #         add_log(iati_import, 'budget_item_value', str(e), project)
            #
            #     if 'value-date' in value_element.attrib.keys():
            #         value_date_text = value_element.attrib['value-date']
            #         try:
            #             value_date = datetime.strptime(value_date_text, '%Y-%m-%d').date()
            #         except ValueError as e:
            #             add_log(iati_import, 'budget_item_value_date', str(e), project)
            #
            #     if 'currency' in value_element.attrib.keys():
            #         if not len(value_element.attrib['currency']) > 3:
            #             currency = value_element.attrib['currency'].upper()
            #         else:
            #             add_log(iati_import, 'budget_item_currency',
            #                     'currency too long (3 characters allowed)', project)

            budget_obj, created = BudgetItem.objects.get_or_create(
                project=self.project,
                type=budget_type,
                period_start=period_start,
                period_end=period_end,
                amount=amount,
                value_date=value_date,
                currency=currency,
                label=label,
                other_extra=other_extra
            )

            if created:
                changes.append(u'added budget item (id: {}): {}'.format(
                        budget_obj.pk, budget_obj))

            imported_budgets.append(budget_obj)

        changes += self.delete_objects(self.project.budget_items, imported_budgets, 'budget item')
        # for budget_item in self.project.budget_items.all():
        #     if not budget_item in imported_budgets:
        #         changes.append(u'deleted budget item (id: {}): {}'.format(
        #                 budget_item.pk, budget_item.__unicode__()))
        #         budget_item.delete()
        return changes


class CountryBudgetItems(ImporterHelper):

    def __init__(self, iati_import, parent_elem, project, globals, related_obj=None):
        super(CountryBudgetItems, self).__init__(iati_import, parent_elem, project, globals)
        self.model = CountryBudgetItem

    def do_import(self):

        """
        Retrieve and store the country budget items.
        The country budget items will be extracted from the 'country-budget-items' element.

        :param iati_import: IatiImport instance
        :param activity: ElementTree; contains all data of the activity
        :param project: Project instance
        :param activities_globals: Dictionary; contains all global activities information
        :return: List; contains fields that have changed
        """
        imported_cbis = []
        changes = []

        # country_budget_vocabulary = ''

        cbis_element = self.parent_elem.find('country-budget-items')
        if cbis_element is not None:
            country_budget_vocabulary = self.get_attrib(cbis_element, 'vocabualry', 'vocabualry')
            # if 'vocabulary' in cbis_element.attrib.keys():
            #     if not len(cbis_element['vocabulary']) > 1:
            #         country_budget_vocabulary = cbis_element.attrib['vocabulary']
            #     else:
            #         add_log(iati_import, 'country_budget_vocabulary',
            #                 'vocabulary is too long (1 characters allowed)', project)

            for cbi_element in cbis_element.findall('budget-item'):
                code_text = ''
                description_text = ''
                percentage = None

                code = self.get_attrib(cbi_element, 'code', 'code')
                # if 'code' in cbi_element.attrib.keys():
                #     if not len(cbi_element.attrib['code']) > 6:
                #         code_text = cbi_element.attrib['code']
                #     else:
                #         add_log(iati_import, 'country_budget_item',
                #                 'code too long (6 characters allowed)', project)

                description = self.get_child_element_text(cbi_element, 'description', 'description')
                # description_element = cbi_element.find('description')
                # if not description_element is None:
                #     description_text = get_text(description_element, activities_globals['version'])
                #     if len(description_text) > 100:
                #         add_log(iati_import, 'country_budget_item_description',
                #                 'description is too long (100 characters allowed)', project,
                #                 IatiImportLog.VALUE_PARTLY_SAVED)
                #         description_text = description_text[:100]
                percentage = self.get_attrib(cbi_element, 'percentage', 'percentage')
                percentage = self.cast_to_decimal(percentage, 'percentage', 'percentage')
                # try:
                #     if 'percentage' in cbi_element.attrib.keys():
                #         percentage = Decimal(cbi_element.attrib['percentage'])
                # except InvalidOperation as e:
                #     add_log(iati_import, 'country_budget_item_percentage', str(e), project)

                cbi_obj, created = CountryBudgetItem.objects.get_or_create(
                    project=self.project,
                    code=code,
                    description=description,
                    percentage=percentage
                )

                if created:
                    changes.append(u'added country budget item (id: {}): {}'.format(cbi_obj.pk, cbi_obj))

                imported_cbis.append(cbi_obj)

            changes += self.delete_objects(self.project.country_budget_items, imported_cbis,
                                           'country budget item')
            # for cbi in self.project.country_budget_items.all():
            #     if not cbi in imported_cbis:
            #         changes.append(u'deleted country budget item (id: {}): {}'.format(
            #                 cbi.pk, cbi.__unicode__()))
            #         cbi.delete()

        changes += self.update_project_field('country_budget_vocabulary', country_budget_vocabulary)
        # if project.country_budget_vocabulary != country_budget_vocabulary:
        #     project.country_budget_vocabulary = country_budget_vocabulary
        #     project.save(update_fields=['country_budget_vocabulary'])
        #     changes.append('country_budget_vocabulary')
        return changes


class CapitalSpend(ImporterHelper):

    def do_import(self):
        """
        Retrieve and store the capital spend percentage.
        The capital spend percentage will be extracted from the 'capital-spend' element.

        :param iati_import: IatiImport instance
        :param activity: ElementTree; contains all data of the activity
        :param project: Project instance
        :param activities_globals: Dictionary; contains all global activities information
        :return: List; contains fields that have changed
        """
        capital_spend_percentage = self.get_child_elem_attrib(
                self.parent_elem, 'capital-spend', 'percentage', 'capital_spend_percentage')
        capital_spend_percentage = self.cast_to_decimal(
                capital_spend_percentage, 'capital-spend', 'capital_spend_percentage')
            # try:
        #     cap_spend_element = activity.find('capital-spend')
        #     if not cap_spend_element is None and 'percentage' in cap_spend_element.attrib.keys():
        #         capital_spend_percentage = Decimal(cap_spend_element.attrib['percentage'])
        # except InvalidOperation as e:
        #     add_log(iati_import, 'capital_spend_percentage', str(e), project)

        return self.update_project_field('capital_spend_percentage', capital_spend_percentage)
        # if project.capital_spend_percentage != capital_spend_percentage:
        #     project.capital_spend_percentage = capital_spend_percentage
        #     project.save(update_fields=['capital_spend_percentage'])
        #     return ['capital_spend_percentage']
        #
        # return []

class PlannedDisbursements(ImporterHelper):

    def __init__(self, iati_import, parent_elem, project, globals, related_obj=None):
        super(PlannedDisbursements, self).__init__(iati_import, parent_elem, project, globals)
        self.model = PlannedDisbursement

    def do_import(self):
        """
        Retrieve and store the planned disbursements.
        The planned disbursements will be extracted from the 'planned-disbursement' elements.

        :param iati_import: IatiImport instance
        :param activity: ElementTree; contains all data of the activity
        :param project: Project instance
        :param activities_globals: Dictionary; contains all global activities information
        :return: List; contains fields that have changed
        """
        imported_pds = []
        changes = []

        for planned_disbursement in self.parent_elem.findall('planned-disbursement'):
            # value = None
            # value_date = None
            # currency = ''
            # updated = None
            # period_start = None
            # period_end = None
            # disbursement_type = ''

            disbursement_type = self.get_attrib(planned_disbursement, 'type', 'type')
            # if 'type' in planned_disbursement.attrib.keys():
            #     if not len(planned_disbursement.attrib['type']) > 1:
            #         disbursement_type = planned_disbursement.attrib['type']
            #     else:
            #         add_log(iati_import, 'planned_disbursement_type',
            #                 'type is too long (1 character allowed)', project)

            updated = self.get_date(planned_disbursement, 'updated', 'updated')
            # if 'updated' in planned_disbursement.attrib.keys():
            #     updated_text = planned_disbursement.attrib['updated']
            #     try:
            #         updated = datetime.strptime(updated_text, '%Y-%m-%d').date()
            #     except ValueError as e:
            #         add_log(iati_import, 'planned_disbursement_updated', str(e), project)

            period_start  = self.get_child_as_date(
                    planned_disbursement, 'period-start', 'iso-date', 'period_start')
            # period_start_element = planned_disbursement.find('period-start')
            # if not period_start_element is None and 'iso-date' in period_start_element.attrib.keys():
            #     period_start_text = period_start_element.attrib['iso-date']
            #     try:
            #         period_start = datetime.strptime(period_start_text, '%Y-%m-%d').date()
            #     except ValueError as e:
            #         add_log(iati_import, 'planned_disbursement_period_start', str(e), project)

            period_end = self.get_child_as_date(
                planned_disbursement, 'period-end', 'iso-date', 'period_end')
            # period_end_element = planned_disbursement.find('period-end')
            # if not period_end_element is None and 'iso-date' in period_end_element.attrib.keys():
            #     period_end_text = period_end_element.attrib['iso-date']
            #     try:
            #         period_end = datetime.strptime(period_end_text, '%Y-%m-%d').date()
            #     except ValueError as e:
            #         add_log(iati_import, 'planned_disbursement_period_end', str(e), project)

            value = self.get_child_element_text_as_decimal(planned_disbursement, 'value', 'value')
            if value:
                value_date = self.get_child_as_date(
                        planned_disbursement, 'value', 'value-date', 'value_date')
                currency = self.get_child_elem_attrib(
                        planned_disbursement, 'value', 'currency', 'currency')
            else:
                value_date = None
                currency = ''


            # value_element = planned_disbursement.find('value')
            # if not value_element is None:
            #     try:
            #         if value_element.text:
            #             if not len(value_element.text) > 14:
            #                 value = Decimal(value_element.text)
            #             else:
            #                 add_log(iati_import, 'planned_disbursement_value',
            #                         'value too long (14 characters allowed)', project)
            #     except InvalidOperation as e:
            #         add_log(iati_import, 'planned_disbursement_value', str(e), project)
            #
            #     if 'value-date' in value_element.attrib.keys():
            #         value_date_text = value_element.attrib['value-date']
            #         try:
            #             value_date = datetime.strptime(value_date_text, '%Y-%m-%d').date()
            #         except ValueError as e:
            #             add_log(iati_import, 'planned_disbursement_value_date', str(e), project)
            #
            #     if 'currency' in value_element.attrib.keys():
            #         if not len(value_element.attrib['currency']) > 3:
            #             currency = value_element.attrib['currency'].upper()
            #         else:
            #             add_log(iati_import, 'planned_disbursement_currency',
            #                     'currency too long (3 characters allowed)', project)

            disbursement_obj, created = PlannedDisbursement.objects.get_or_create(
                project=self.project,
                value=value,
                value_date=value_date,
                currency=currency,
                updated=updated,
                period_start=period_start,
                period_end=period_end,
                type=disbursement_type
            )

            if created:
                changes.append(u'added planned disbursement (id: {}): {}'.format(
                        disbursement_obj.pk, disbursement_obj))

            imported_pds.append(disbursement_obj)

        changes += self.delete_objects(
                self.project.planned_disbursements, imported_pds, 'planned disbursement')
        # for planned_disbursement in self.project.planned_disbursements.all():
        #     if not planned_disbursement in imported_pds:
        #         changes.append(u'deleted planned disbursement (id: {}): {}'.format(
        #                 planned_disbursement.pk, planned_disbursement.__unicode__()))
        #         planned_disbursement.delete()
        return changes
