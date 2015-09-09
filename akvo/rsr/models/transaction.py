# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


from django.db import models
from django.utils.translation import ugettext_lazy as _

from ..fields import ValidXMLCharField

from akvo.codelists.models import (Currency, DisbursementChannel,TransactionType, Country, Region,
                                   RegionVocabulary, Sector, SectorCategory, SectorVocabulary)
from akvo.codelists.store.codelists_v201 import (AID_TYPE, CURRENCY, DISBURSEMENT_CHANNEL,
                                                 FINANCE_TYPE, FLOW_TYPE, TIED_STATUS,
                                                 TRANSACTION_TYPE, COUNTRY, REGION,
                                                 REGION_VOCABULARY, SECTOR_VOCABULARY)
from akvo.utils import codelist_choices, codelist_value


class Transaction(models.Model):
    project = models.ForeignKey('Project', verbose_name=_(u'project'), related_name='transactions')
    reference = ValidXMLCharField(
        _(u'reference'), blank=True, max_length=25,
        help_text=_(u'Enter a reference for the transaction. (25 characters)')
    )
    aid_type = ValidXMLCharField(
        _(u'aid type'), blank=True, max_length=3, choices=codelist_choices(AID_TYPE)
    )
    description = ValidXMLCharField(
        _(u'description'), max_length=255, blank=True,
        help_text=_(u'Enter a description for the transaction. (255 characters)')
    )
    disbursement_channel = ValidXMLCharField(
        _(u'disbursement channel'), blank=True, max_length=1,
        choices=codelist_choices(DISBURSEMENT_CHANNEL)
    )
    finance_type = ValidXMLCharField(
        _(u'finance type'), max_length=3, blank=True, choices=codelist_choices(FINANCE_TYPE)
    )
    flow_type = ValidXMLCharField(
        _(u'flow type'), max_length=2, blank=True, choices=codelist_choices(FLOW_TYPE)
    )
    tied_status = ValidXMLCharField(
        _(u'tied status'), blank=True, max_length=1, choices=codelist_choices(TIED_STATUS)
    )
    transaction_date = models.DateField(
        _(u'transaction date'), blank=True, null=True,
        help_text=_(u'Enter the financial reporting date that '
                    u'the transaction was/will be undertaken.')
    )
    transaction_type = ValidXMLCharField(
        _(u'transaction type'), blank=True, max_length=2,
        choices=codelist_choices(TRANSACTION_TYPE),
        help_text=_(u'Select the type of transaction from the list.')
    )
    value = models.DecimalField(
        _(u'value'), blank=True, null=True, max_digits=11, decimal_places=2,
        help_text=_(u'Enter the transaction amount.')
    )
    value_date = models.DateField(_(u'value date'), blank=True, null=True)
    currency = ValidXMLCharField(
        _(u'currency'), blank=True, max_length=3, choices=codelist_choices(CURRENCY)
    )
    provider_organisation = models.ForeignKey(
        'Organisation', verbose_name=_(u'provider organisation'),
        related_name='providing_transactions', blank=True, null=True, on_delete=models.SET_NULL
    )
    provider_organisation_activity = ValidXMLCharField(
        _(u'provider organisation activity id'), blank=True, max_length=50
    )
    receiver_organisation = models.ForeignKey(
        'Organisation', verbose_name=_(u'receiver organisation'),
        related_name='receiving_transactions', blank=True, null=True, on_delete=models.SET_NULL
    )
    receiver_organisation_activity = ValidXMLCharField(
        _(u'receiver organisation activity id'), blank=True, max_length=50
    )
    recipient_country = ValidXMLCharField(
        _(u'recipient country'), blank=True, max_length=2, choices=codelist_choices(COUNTRY)
    )
    recipient_region = ValidXMLCharField(
        _(u'recipient region'), blank=True, max_length=3, choices=codelist_choices(REGION)
    )
    recipient_region_vocabulary = ValidXMLCharField(
        _(u'recipient region vocabulary'), blank=True, max_length=1,
        choices=codelist_choices(REGION_VOCABULARY)
    )

    def __unicode__(self):
        if self.value:
            if self.currency:
                return u'%s %s' % (self.iati_currency().name,
                                   '{:,}'.format(int(self.value)))
            else:
                return u'%s %s' % (self.project.get_currency_display(),
                                   '{:,}'.format(int(self.value)))
        else:
            return u'%s' % _(u'No value specified')

    def iati_currency(self):
        return codelist_value(Currency, self, 'currency')

    def iati_transaction_type(self):
        return codelist_value(TransactionType, self, 'transaction_type')

    def iati_disbursement_channel(self):
        return codelist_value(DisbursementChannel, self, 'disbursement_channel')

    def iati_recipient_country(self):
        return codelist_value(Country, self, 'recipient_country')

    def iati_recipient_region(self):
        return codelist_value(Region, self, 'recipient_region')

    def iati_recipient_region_vocabulary(self):
        return codelist_value(RegionVocabulary, self, 'recipient_region_vocabulary')

    class Meta:
        app_label = 'rsr'
        verbose_name = _(u'transaction')
        verbose_name_plural = _(u'transactions')


class TransactionSector(models.Model):
    transaction = models.ForeignKey(
        'Transaction', verbose_name=_(u'transaction'), related_name='sectors'
    )
    code = ValidXMLCharField(_(u'sector'), blank=True, max_length=5)
    text = ValidXMLCharField(
        _(u'description'), blank=True, max_length=100, help_text=_(u'(max 100 characters)')
    )
    vocabulary = ValidXMLCharField(
        _(u'vocabulary'), blank=True, max_length=5, choices=codelist_choices(SECTOR_VOCABULARY)
    )

    def __unicode__(self):
        if self.code and self.vocabulary in ['1', '2', 'DAC', 'DAC-3']:
            return u'%s' % self.iati_sector().name.capitalize()
        elif self.code and self.text:
            return u'%s - %s' % (self.code, self.text)
        elif self.code:
            return u'%s' % self.code
        else:
            return u'%s' % _(u'No sector code specified')

    def iati_sector(self):
        if self.code and (self.vocabulary == '1' or self.vocabulary == 'DAC'):
            return codelist_value(Sector, self, 'code')
        elif self.code and (self.vocabulary == '2' or self.vocabulary == 'DAC-3'):
            return codelist_value(SectorCategory, self, 'code')
        else:
            return self.code

    def iati_vocabulary(self):
        return codelist_value(SectorVocabulary, self, 'vocabulary')

    class Meta:
        app_label = 'rsr'
        verbose_name = _(u'transaction sector')
        verbose_name_plural = _(u'transaction sectors')
