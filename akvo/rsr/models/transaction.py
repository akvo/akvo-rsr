# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


from django.db import models
from django.utils.translation import ugettext_lazy as _

from ..fields import ValidXMLCharField

from akvo.codelists.models import (AidType, Currency, DisbursementChannel, FinanceType, FlowType, TiedStatus,
                                   TransactionType)
from akvo.utils import codelist_choices, codelist_value


class Transaction(models.Model):
    project = models.ForeignKey('Project', verbose_name=_(u'project'), related_name='transactions')
    reference = ValidXMLCharField(
        _(u'reference'), blank=True, max_length=25,
        help_text=_(u'Enter a reference for the transaction. (25 characters)')
    )
    aid_type = ValidXMLCharField(
        _(u'aid type'), blank=True, max_length=3, choices=codelist_choices(AidType)
    )
    aid_type_text = ValidXMLCharField(
        _(u'aid type text'), max_length=100, blank=True, help_text=_(u'(max 100 characters)')
    )
    description = ValidXMLCharField(
        _(u'description'), max_length=255, blank=True,
        help_text=_(u'Enter a description for the transaction. (255 characters)')
    )
    disbursement_channel = ValidXMLCharField(
        _(u'disbursement channel'), blank=True, max_length=1, choices=codelist_choices(DisbursementChannel)
    )
    disbursement_channel_text = ValidXMLCharField(
        _(u'disbursement channel text'), max_length=100, blank=True, help_text=_(u'(max 100 characters)')
    )
    finance_type = ValidXMLCharField(
        _(u'finance type'), max_length=3, blank=True, choices=codelist_choices(FinanceType)
    )
    finance_type_text = ValidXMLCharField(
        _(u'finance type text'), max_length=100, blank=True, help_text=_(u'(max 100 characters)')
    )
    flow_type = ValidXMLCharField(_(u'flow type'), max_length=2, blank=True, choices=codelist_choices(FlowType))
    flow_type_text = ValidXMLCharField(
        _(u'flow type text'), max_length=100, blank=True, help_text=_(u'(max 100 characters)')
    )
    tied_status = ValidXMLCharField(_(u'tied status'), blank=True, max_length=1, choices=codelist_choices(TiedStatus))
    tied_status_text = ValidXMLCharField(
        _(u'tied status text'), max_length=100, blank=True, help_text=_(u'(max 100 characters)')
    )
    transaction_date = models.DateField(
        _(u'transaction date'), blank=True, null=True,
        help_text=u'Enter the financial reporting date that the transaction was/will be undertaken.'
    )
    transaction_type = ValidXMLCharField(
        _(u'transaction type'), blank=True, max_length=2, choices=codelist_choices(TransactionType),
        help_text=_(u'Select the type of transaction from the list.')
    )
    transaction_type_text = ValidXMLCharField(
        _(u'transaction type text'), max_length=100, blank=True, help_text=_(u'(max 100 characters)')
    )
    value = models.DecimalField(
        _(u'value'), blank=True, null=True, max_digits=11, decimal_places=2,
        help_text=u'Enter the transaction amount.'
    )
    value_date = models.DateField(_(u'value date'), blank=True, null=True)
    currency = ValidXMLCharField(_(u'currency'), blank=True, max_length=3, choices=codelist_choices(Currency))
    provider_organisation = models.ForeignKey(
        'Organisation', verbose_name=_(u'provider organisation'), related_name='providing_transactions', blank=True,
        null=True, on_delete=models.SET_NULL
    )
    provider_organisation_activity = ValidXMLCharField(
        _(u'provider organisation activity id'), blank=True, max_length=50
    )
    receiver_organisation = models.ForeignKey(
        'Organisation', verbose_name=_(u'receiver organisation'), related_name='receiving_transactions', blank=True,
        null=True, on_delete=models.SET_NULL
    )
    receiver_organisation_activity = ValidXMLCharField(
        _(u'receiver organisation activity id'), blank=True, max_length=50
    )

    def __unicode__(self):
        return self.value

    def iati_currency(self):
        return codelist_value(Currency, self, 'currency')

    def iati_transaction_type(self):
        return codelist_value(TransactionType, self, 'transaction_type')

    def iati_disbursement_channel(self):
        return codelist_value(DisbursementChannel, self, 'disbursement_channel')

    class Meta:
        app_label = 'rsr'
        verbose_name = _(u'transaction')
        verbose_name_plural = _(u'transactions')
