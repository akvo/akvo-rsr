# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

from django.db.models import ObjectDoesNotExist

from ....rsr.models.budget_item import BudgetItem, BudgetItemLabel, CountryBudgetItem
from ....rsr.models.iati_import_log import LOG_ENTRY_TYPE
from ....rsr.models.planned_disbursement import PlannedDisbursement
from ....rsr.models.transaction import Transaction, TransactionSector
from .. import ImportMapper, akvo_ns

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


class Transactions(ImportMapper):

    def __init__(self, iati_import_job, parent_elem, project, globals,
                 related_obj=None):
        super(Transactions, self).__init__(
            iati_import_job, parent_elem, project, globals)
        self.model = Transaction

    def do_import(self):
        """
        Retrieve and store the transactions.
        The transactions will be extracted from the 'transaction' elements.

        :return: List; contains fields that have changed
        """
        imported_transactions = []
        changes = []

        # Check if import should ignore this kind of data
        if self.skip_importing('transaction'):
            return changes

        for transaction in self.parent_elem.findall('transaction'):

            reference = self.get_attrib(transaction, 'ref', 'reference')

            humanitarian = self.get_attrib(transaction, 'humanitarian', 'humanitarian', None)

            transaction_type = self.get_child_elem_attrib(
                transaction, 'transaction-type', 'code', 'transaction_type')
            if transaction_type in TYPE_TO_CODE.keys():
                    transaction_type = TYPE_TO_CODE[transaction_type]

            transaction_date = self.get_child_as_date(
                transaction, 'transaction-date', 'iso-date', 'transaction_date')

            value = self.get_child_element_text_as_decimal(transaction, 'value', 'value', None)
            if value:
                value_date = self.get_child_as_date(
                    transaction, 'value', 'value-date', 'value_date')
                currency = self.get_child_elem_attrib(transaction, 'value', 'currency', 'currency')
            else:
                value_date = None
                currency = ''

            description = self.get_child_element_text(transaction, 'description', 'description')

            prov_org_element = transaction.find('provider-org')
            if prov_org_element is not None:
                transaction_provider_org = self.get_or_create_organisation(
                    prov_org_element.get('ref', ''), self.get_text(prov_org_element))
                provider_organisation_activity = self.get_child_elem_attrib(
                    transaction, 'provider-org', 'provider-activity-id',
                    'provider_organisation_activity')
            else:
                transaction_provider_org = None
                provider_organisation_activity = ''

            rec_org_element = transaction.find('receiver-org')
            if rec_org_element is not None:
                transaction_receiver_org = self.get_or_create_organisation(
                    rec_org_element.get('ref'), self.get_text(rec_org_element))
                receiver_organisation_activity = self.get_child_elem_attrib(
                    transaction, 'receiver-org', 'receiver-activity-id',
                    'receiver_organisation_activity')
            else:
                transaction_receiver_org = None
                receiver_organisation_activity = ''

            disbursement_channel = self.get_child_elem_attrib(
                transaction, 'disbursement-channel', 'code', 'disbursement_channel')

            flow_type = self.get_child_elem_attrib(transaction, 'flow-type', 'code', 'flow_type')
            finance_type = self.get_child_elem_attrib(
                transaction, 'finance-type', 'code', 'finance_type')
            aid_type = self.get_child_elem_attrib(transaction, 'aid-type', 'code', 'aid_type')
            tied_status = self.get_child_elem_attrib(
                transaction, 'tied-status', 'code', 'tied_status')
            recipient_country = self.get_child_elem_attrib(
                transaction, 'recipient-country', 'code', 'recipient_country')

            region_element = transaction.find('recipient-region')
            if region_element is not None:
                recipient_region = self.get_attrib(region_element, 'code', 'recipient_region')
                recipient_region_vocabulary = self.get_attrib(
                    region_element, 'vocabulary', 'recipient_region_vocabulary')
                recipient_region_vocabulary_uri = self.get_attrib(
                    region_element, 'vocabulary-uri', 'recipient_region_vocabulary_uri')
            else:
                recipient_region = ''
                recipient_region_vocabulary = ''
                recipient_region_vocabulary_uri = ''

            transaction_obj, created = Transaction.objects.get_or_create(
                project=self.project,
                reference=reference,
                humanitarian=humanitarian,
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
                recipient_region_vocabulary=recipient_region_vocabulary,
                recipient_region_vocabulary_uri=recipient_region_vocabulary_uri
            )

            # Disregard double transactions
            if not transaction_obj in imported_transactions:
                if created:
                    changes.append(u'added transaction (id: {}): {}'.format(
                        transaction_obj.pk, transaction_obj))

                imported_transactions.append(transaction_obj)

                # Process transaction sectors
                transaction_sectors = TransactionsSectors(
                    self.iati_import_job, transaction, self.project,
                    self.globals, related_obj=transaction_obj)
                for sector_change in transaction_sectors.do_import():
                    changes.append(sector_change)

        changes += self.delete_objects(
            self.project.transactions, imported_transactions, 'transaction')
        return changes


class TransactionsSectors(ImportMapper):

    def __init__(self, iati_import_job, parent_elem, project, globals,
                 related_obj):
        super(TransactionsSectors, self).__init__(iati_import_job, parent_elem, project, globals,
                                                  related_obj)
        self.model = TransactionSector

    def do_import(self):
        """
        Retrieve and store the transaction sectors.
        The transaction sectors will be extracted from the 'sector' elements within a 'transaction'
        element.
        :return: List; contains fields that have changed
        """
        imported_sectors = []
        changes = []

        for sector in self.parent_elem.findall('sector'):

            code = self.get_attrib(sector, 'code', 'code')
            vocabulary = self.get_attrib(sector, 'vocabulary', 'vocabulary')
            vocabulary_uri = self.get_attrib(sector, 'vocabulary-uri', 'vocabulary_uri')
            text = self.get_element_text(sector, 'text')

            sector_obj, created = TransactionSector.objects.get_or_create(
                transaction=self.related_obj,
                code=code,
                text=text,
                vocabulary=vocabulary,
                vocabulary_uri=vocabulary_uri
            )
            if created:
                changes.append(u'added transaction sector (id: {}): {}'.format(
                    sector_obj.pk, sector_obj))
            imported_sectors.append(sector_obj)

        changes += self.delete_objects(
            self.related_obj.sectors, imported_sectors, 'transaction sector')
        return changes


class BudgetItems(ImportMapper):

    def __init__(self, iati_import_job, parent_elem, project, globals, related_obj=None):
        super(BudgetItems, self).__init__(iati_import_job, parent_elem, project, globals)
        self.model = BudgetItem

    def do_import(self):
        """
        Retrieve and store the budget items.
        The budget items will be extracted from the 'budget' elements. Since there is no place to
        indicate the budget item label in IATI, we set it to the 'Total' label if there is only one
        budget item (per type, e.g. if there's one original and one revised budget item, both will be
        set to 'Total'). In all other cases, the budget item label will be set to 'Other'.

        :return: List; contains fields that have changed
        """
        imported_budgets = []
        changes = []

        # Check if import should ignore this kind of data
        if self.skip_importing('budget'):
            return changes

        activity = self.parent_elem
        all_budget_count = len(activity.findall("budget"))
        original_budgets_count = len(activity.findall("budget[@type='1']"))
        revised_budgets_count = len(activity.findall("budget[@type='2']"))

        for budget in activity.findall('budget'):

            label = BudgetItemLabel.objects.get(label='Other')
            other_extra = 'Other'

            budget_type = self.get_attrib(budget, 'type', 'type')
            if ((budget_type == '1' and original_budgets_count == 1) or
                    (budget_type == '2' and revised_budgets_count == 1) or
                    all_budget_count == 1):
                label = BudgetItemLabel.objects.get(label='Total')
                other_extra = ''

            akvo_budget_type = budget.attrib.get(akvo_ns('type'))
            if akvo_budget_type:
                try:
                    label = BudgetItemLabel.objects.get(pk=int(akvo_budget_type))
                except (ValueError, ObjectDoesNotExist) as e:
                    self.add_log('budget[@type]', 'budget_item_label', str(e),
                                 LOG_ENTRY_TYPE.VALUE_PARTLY_SAVED)

            budget_status = self.get_attrib(budget, 'status', 'status')

            akvo_budget_label = budget.attrib.get(akvo_ns('label'))
            if akvo_budget_label:
                other_extra = akvo_budget_label
                if len(other_extra) > 30:
                    self.add_log('budget[@label]', 'budget_item_label',
                                 'label too long (30 characters allowed)',
                                 LOG_ENTRY_TYPE.VALUE_PARTLY_SAVED)
                    other_extra = other_extra[:30]

            period_start = self.get_child_as_date(
                budget, 'period-start', 'iso-date', 'period_start')
            if period_start and other_extra == 'Other':
                other_extra = str(period_start.year)

            period_end = self.get_child_as_date(budget, 'period-end', 'iso-date', 'period_end')

            amount = self.get_child_element_text_as_decimal(budget, 'value', 'amount', None)
            if amount:
                value_date = self.get_child_as_date(
                    budget, 'value', 'value-date', 'value_date')
                currency = self.get_child_elem_attrib(budget, 'value', 'currency', 'currency')
                if not currency:
                    currency = self.get_attrib(activity, 'default-currency', 'currency')
            else:
                value_date = None
                currency = ''

            budget_obj, created = BudgetItem.objects.get_or_create(
                project=self.project,
                type=budget_type,
                status=budget_status,
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
        return changes


class CountryBudgetItems(ImportMapper):

    def __init__(self, iati_import_job, parent_elem, project, globals,
                 related_obj=None):
        super(CountryBudgetItems, self).__init__(
            iati_import_job, parent_elem, project, globals)
        self.model = CountryBudgetItem

    def do_import(self):

        """
        Retrieve and store the country budget items.
        The country budget items will be extracted from the 'country-budget-items' element.

        :return: List; contains fields that have changed
        """
        imported_cbis = []
        changes = []
        country_budget_vocabulary = ''

        cbis_element = self.parent_elem.find('country-budget-items')

        if cbis_element is not None:
            country_budget_vocabulary = self.get_attrib(cbis_element, 'vocabulary', 'vocabulary')

            for cbi_element in cbis_element.findall('budget-item'):

                code = self.get_attrib(cbi_element, 'code', 'code')
                description = self.get_child_element_text(cbi_element, 'description', 'description')

                percentage = self.get_attrib(cbi_element, 'percentage', 'percentage')
                percentage = self.cast_to_decimal(percentage, 'percentage', 'percentage')

                cbi_obj, created = CountryBudgetItem.objects.get_or_create(
                    project=self.project,
                    code=code,
                    description=description,
                    percentage=percentage
                )
                if created:
                    changes.append(
                        u'added country budget item (id: {}): {}'.format(cbi_obj.pk, cbi_obj))
                imported_cbis.append(cbi_obj)

            changes += self.delete_objects(self.project.country_budget_items, imported_cbis,
                                           'country budget item')

        changes += self.update_project_field('country_budget_vocabulary', country_budget_vocabulary)
        return changes


class CapitalSpend(ImportMapper):

    def do_import(self):
        """
        Retrieve and store the capital spend percentage.
        The capital spend percentage will be extracted from the 'capital-spend' element.

        :return: List; contains fields that have changed
        """
        capital_spend_percentage = self.get_child_elem_attrib(
            self.parent_elem, 'capital-spend', 'percentage', 'capital_spend_percentage', None)
        if capital_spend_percentage:
            capital_spend_percentage = self.cast_to_decimal(
                capital_spend_percentage, 'capital-spend', 'capital_spend_percentage')

        return self.update_project_field('capital_spend_percentage', capital_spend_percentage)


class PlannedDisbursements(ImportMapper):

    def __init__(self, iati_import_job, parent_elem, project, globals,
                 related_obj=None):
        super(PlannedDisbursements, self).__init__(
            iati_import_job, parent_elem, project, globals)
        self.model = PlannedDisbursement

    def do_import(self):
        """
        Retrieve and store the planned disbursements.
        The planned disbursements will be extracted from the 'planned-disbursement' elements.

        :return: List; contains fields that have changed
        """
        imported_pds = []
        changes = []

        # Check if import should ignore this kind of data
        if self.skip_importing('planned-disbursement'):
            return changes

        for planned_disbursement in self.parent_elem.findall('planned-disbursement'):

            disbursement_type = self.get_attrib(planned_disbursement, 'type', 'type')
            updated = self.get_date(planned_disbursement, 'updated', 'updated')
            period_start = self.get_child_as_date(
                planned_disbursement, 'period-start', 'iso-date', 'period_start')
            period_end = self.get_child_as_date(
                planned_disbursement, 'period-end', 'iso-date', 'period_end')

            value = self.get_child_element_text_as_decimal(planned_disbursement, 'value', 'value')
            if value:
                value_date = self.get_child_as_date(
                    planned_disbursement, 'value', 'value-date', 'value_date')
                currency = self.get_child_elem_attrib(
                    planned_disbursement, 'value', 'currency', 'currency')
            else:
                value_date = None
                currency = ''

            prov_org_element = planned_disbursement.find('provider-org')
            if prov_org_element is not None:
                provider_org = self.get_or_create_organisation(
                    prov_org_element.get('ref', ''), self.get_text(prov_org_element))
                provider_org_activity = self.get_child_elem_attrib(
                    planned_disbursement, 'provider-org', 'provider-activity-id',
                    'provider_organisation_activity')
            else:
                provider_org = None
                provider_org_activity = ''

            rec_org_element = planned_disbursement.find('receiver-org')
            if rec_org_element is not None:
                receiver_org = self.get_or_create_organisation(
                    rec_org_element.get('ref'), self.get_text(rec_org_element))
                receiver_org_activity = self.get_child_elem_attrib(
                    planned_disbursement, 'receiver-org', 'receiver-activity-id',
                    'receiver_organisation_activity')
            else:
                receiver_org = None
                receiver_org_activity = ''

            disbursement_obj, created = PlannedDisbursement.objects.get_or_create(
                project=self.project,
                value=value,
                value_date=value_date,
                currency=currency,
                updated=updated,
                period_start=period_start,
                period_end=period_end,
                type=disbursement_type,
                provider_organisation=provider_org,
                provider_organisation_activity=provider_org_activity,
                receiver_organisation=receiver_org,
                receiver_organisation_activity=receiver_org_activity
            )
            if created:
                changes.append(u'added planned disbursement (id: {}): {}'.format(
                    disbursement_obj.pk, disbursement_obj))
            imported_pds.append(disbursement_obj)

        changes += self.delete_objects(
            self.project.planned_disbursements, imported_pds, 'planned disbursement')
        return changes
