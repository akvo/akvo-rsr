# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


from django.db import models
from django.utils.translation import ugettext_lazy as _

from ..fields import ValidXMLCharField

from akvo.codelists.models import (AidType, Currency, DisbursementChannel, TransactionType,
                                   Country, Region, RegionVocabulary, Sector, SectorCategory,
                                   SectorVocabulary, FinanceType, FlowType, TiedStatus)
from akvo.codelists.store.codelists_v202 import (AID_TYPE, CURRENCY, DISBURSEMENT_CHANNEL,
                                                 FINANCE_TYPE, FLOW_TYPE, TIED_STATUS,
                                                 TRANSACTION_TYPE, COUNTRY, REGION,
                                                 REGION_VOCABULARY, SECTOR_VOCABULARY)
from akvo.utils import codelist_choices, codelist_value


class Transaction(models.Model):
    project = models.ForeignKey('Project', verbose_name=_(u'project'), related_name='transactions')
    reference = ValidXMLCharField(
        _(u'transaction reference'), blank=True, max_length=25,
        help_text=_(u'Enter a reference for the transaction (eg. transaction number).')
    )
    aid_type = ValidXMLCharField(
        _(u'transaction aid type'), blank=True, max_length=3, choices=codelist_choices(AID_TYPE),
        help_text=_(u'Enter the type of aid being supplied. For reference, please visit: '
                    u'<a href="http://iatistandard.org/202/codelists/AidType/" target="_blank">'
                    u'http://iatistandard.org/202/codelists/AidType/</a>.')
    )
    description = ValidXMLCharField(
        _(u'transaction description'), max_length=255, blank=True,
        help_text=_(u'Enter additional information for the transaction, if necessary.')
    )
    disbursement_channel = ValidXMLCharField(
        _(u'transaction disbursement channel'), blank=True, max_length=1,
        choices=codelist_choices(DISBURSEMENT_CHANNEL),
        help_text=_(u'Enter the channel through which the funds will flow for this transaction, '
                    u'from an IATI codelist. For reference, please visit: '
                    u'<a href="http://iatistandard.org/202/codelists/DisbursementChannel/" '
                    u'target="_blank">http://iatistandard.org/202/codelists/DisbursementChannel/'
                    u'</a>.')
    )
    finance_type = ValidXMLCharField(
        _(u'transaction finance type'), max_length=3, blank=True,
        choices=codelist_choices(FINANCE_TYPE),
        help_text=_(u'For reference, please visit: '
                    u'<a href="http://iatistandard.org/202/codelists/FinanceType/" '
                    u'target="_blank">http://iatistandard.org/202/codelists/FinanceType/</a>.')
    )
    flow_type = ValidXMLCharField(
        _(u'transaction flow type'), max_length=2, blank=True, choices=codelist_choices(FLOW_TYPE),
        help_text=_(u'For reference, please visit: '
                    u'<a href="http://iatistandard.org/202/codelists/FlowType/" target="_blank">'
                    u'http://iatistandard.org/202/codelists/FlowType/</a>.')
    )
    tied_status = ValidXMLCharField(
        _(u'transaction tied status'), blank=True, max_length=1,
        choices=codelist_choices(TIED_STATUS),
        help_text=_(u'Whether the aid is untied, tied, or partially tied. For reference visit '
                    u'<a href="http://iatistandard.org/202/codelists/TiedStatus/" target="_blank">'
                    u'http://iatistandard.org/202/codelists/TiedStatus/</a>.')
    )
    transaction_date = models.DateField(
        _(u'transaction date'), blank=True, null=True,
        help_text=_(u'Enter the financial reporting date that the transaction was/will be '
                    u'undertaken.')
    )
    transaction_type = ValidXMLCharField(
        _(u'transaction type'), blank=True, max_length=2,
        choices=codelist_choices(TRANSACTION_TYPE),
        help_text=_(u'Select the type of the transaction (e.g. commitment, disbursement, '
                    u'expenditure).')
    )
    value = models.DecimalField(
        _(u'transaction value'), blank=True, null=True, max_digits=14, decimal_places=2,
        help_text=_(u'Enter the transaction amount. Use a period to denote decimals.')
    )
    value_date = models.DateField(
        _(u'transaction value date'), blank=True, null=True,
        help_text=_(u'The date to be used for determining the exchange rate for currency '
                    u'conversions of the transaction.')
    )
    currency = ValidXMLCharField(
        _(u'currency'), blank=True, max_length=3, choices=codelist_choices(CURRENCY)
    )
    provider_organisation = models.ForeignKey(
        'Organisation', verbose_name=_(u'provider organisation'),
        related_name='providing_transactions', blank=True, null=True, on_delete=models.SET_NULL
    )
    provider_organisation_activity = ValidXMLCharField(
        _(u'provider organisation activity id'), blank=True, max_length=100,
        help_text=_(u'If incoming funds are being provided from the budget of another activity '
                    u'that is reported to IATI, it is STRONGLY RECOMMENDED that this should record '
                    u'the provider’s unique IATI activity identifier for that activity.')
    )
    receiver_organisation = models.ForeignKey(
        'Organisation', verbose_name=_(u'receiver organisation'),
        related_name='receiving_transactions', blank=True, null=True, on_delete=models.SET_NULL
    )
    receiver_organisation_activity = ValidXMLCharField(
        _(u'receiver organisation activity id'), blank=True, max_length=100,
        help_text=_(u'The internal identifier used by the receiver organisation for its activity '
                    u'that receives the funds from this transaction (not to be confused with the '
                    u'IATI identifier for the target activity).')
    )
    recipient_country = ValidXMLCharField(
        _(u'transaction recipient country'), blank=True, max_length=2,
        choices=codelist_choices(COUNTRY, show_code=False),
        help_text=_(u'Enter the country that will benefit from this transaction. It can only be '
                    u'one country per transaction. For reference, please visit: '
                    u'<a href="http://iatistandard.org/202/codelists/Country/" target="_blank">'
                    u'http://iatistandard.org/202/codelists/Country/</a>.')
    )
    recipient_region = ValidXMLCharField(
        _(u'transaction recipient region'), blank=True, max_length=25,
        choices=codelist_choices(REGION),
        help_text=_(u'Enter the supranational geopolitical region (a geographical or '
                    u'administrative grouping of countries into a region - e.g. Sub-Saharan '
                    u'Africa, Mekong Delta) that will benefit from this transaction. For '
                    u'reference, please visit: <a href="http://iatistandard.org/202/codelists/'
                    u'Region/" target="_blank">http://iatistandard.org/202/codelists/Region/</a>.')
    )
    recipient_region_vocabulary = ValidXMLCharField(
        _(u'recipient region vocabulary'), blank=True, max_length=2,
        choices=codelist_choices(REGION_VOCABULARY)
    )
    recipient_region_vocabulary_uri = ValidXMLCharField(
        _(u'recipient region vocabulary URI'), blank=True, max_length=1000,
        help_text=_(u'If the vocabulary is 99 (reporting organisation), the URI where this '
                    u'internal vocabulary is defined.'))
    humanitarian = models.NullBooleanField(
        _(u'humanitarian transaction'), help_text=_(u'Determines whether this transaction relates '
                                                    u'entirely or partially to humanitarian aid.'))

    def __unicode__(self):
        if self.value:
            if self.currency:
                return u'%s %s' % (self.iati_currency().name,
                                   '{:,}'.format(int(self.value)))
            else:
                return u'%s %s' % (self.project.currency,
                                   '{:,}'.format(int(self.value)))
        else:
            return u'%s' % _(u'No value specified')

    def provider_organisation_show_link(self):
        if self.provider_organisation:
            return u'<a href="{0}">{1}</a>'.format(self.provider_organisation.get_absolute_url(),
                                                   self.provider_organisation.long_name or
                                                   self.provider_organisation.name)
        return ''

    def receiver_organisation_show_link(self):
        if self.receiver_organisation:
            return u'<a href="{0}">{1}</a>'.format(self.receiver_organisation.get_absolute_url(),
                                                   self.receiver_organisation.long_name or
                                                   self.receiver_organisation.name)
        return ''

    def get_currency(self):
        if self.currency:
            return self.currency
        else:
            return self.project.currency

    def iati_currency(self):
        if self.currency:
            return codelist_value(Currency, self, 'currency')
        else:
            return codelist_value(Currency, self.project, 'currency')

    def iati_currency_unicode(self):
        return str(self.iati_currency())

    def iati_aid_type(self):
        return codelist_value(AidType, self, 'aid_type')

    def iati_aid_type_unicode(self):
        return str(self.iati_aid_type())

    def iati_finance_type(self):
        return codelist_value(FinanceType, self, 'finance_type')

    def iati_finance_type_unicode(self):
        return str(self.iati_finance_type())

    def iati_flow_type(self):
        return codelist_value(FlowType, self, 'flow_type')

    def iati_flow_type_unicode(self):
        return str(self.iati_flow_type())

    def iati_tied_status(self):
        return codelist_value(TiedStatus, self, 'tied_status')

    def iati_tied_status_unicode(self):
        return str(self.iati_tied_status())

    def iati_transaction_type(self):
        return codelist_value(TransactionType, self, 'transaction_type')

    def iati_transaction_type_unicode(self):
        return str(self.iati_transaction_type())

    def iati_disbursement_channel(self):
        return codelist_value(DisbursementChannel, self, 'disbursement_channel')

    def iati_disbursement_channel_unicode(self):
        return str(self.iati_disbursement_channel())

    def iati_recipient_country(self):
        return codelist_value(Country, self, 'recipient_country')

    def iati_recipient_country_unicode(self):
        return str(self.iati_recipient_country())

    def iati_recipient_region(self):
        return codelist_value(Region, self, 'recipient_region')

    def iati_recipient_region_unicode(self):
        return str(self.iati_recipient_region())

    def iati_recipient_region_vocabulary(self):
        return codelist_value(RegionVocabulary, self, 'recipient_region_vocabulary')

    def iati_recipient_region_vocabulary_unicode(self):
        return str(self.iati_recipient_region_vocabulary())

    class Meta:
        app_label = 'rsr'
        verbose_name = _(u'transaction')
        verbose_name_plural = _(u'transactions')


class TransactionSector(models.Model):
    transaction = models.ForeignKey(
        'Transaction', verbose_name=_(u'transaction'), related_name='sectors'
    )
    code = ValidXMLCharField(
        _(u'transaction sector'), blank=True, max_length=25,
        help_text=_(u'A recognised code, from a recognised vocabulary, classifying the purpose of '
                    u'this transaction. If this element is used then ALL transaction elements '
                    u'should contain a transaction/sector element and iati-activity/sector should '
                    u'NOT be used. This element can be used multiple times, but only one sector '
                    u'can be reported per vocabulary.')
    )
    text = ValidXMLCharField(_(u'transaction sector description'), blank=True, max_length=100)
    vocabulary = ValidXMLCharField(
        _(u'transaction sector vocabulary'), blank=True, max_length=5,
        choices=codelist_choices(SECTOR_VOCABULARY),
        help_text=_(u'An IATI code for the vocabulary (codelist) used for sector classifications. '
                    u'If omitted, OECD DAC 5-digit Purpose Codes are assumed. Note that at '
                    u'transaction level, only one sector per vocabulary can be reported.'))
    vocabulary_uri = ValidXMLCharField(
        _(u'transaction sector vocabulary URI'), blank=True, max_length=1000,
        help_text=_(u'If the vocabulary is 99 (reporting organisation), the URI where this '
                    u'internal vocabulary is defined.'))

    def __unicode__(self):
        return self.text
        # TODO: fix this
        # if self.code and self.vocabulary in ['1', '2', 'DAC', 'DAC-3']:
        #     return u'%s' % self.iati_sector().name.capitalize()
        # elif self.code and self.text:
        #     return u'%s - %s' % (self.code, self.text)
        # elif self.code:
        #     return u'%s' % self.code
        # else:
        #     return u'%s' % _(u'No sector code specified')

    def iati_sector(self):
        if self.code and (self.vocabulary == '1' or self.vocabulary == 'DAC'):
            return codelist_value(Sector, self, 'code')
        elif self.code and (self.vocabulary == '2' or self.vocabulary == 'DAC-3'):
            return codelist_value(SectorCategory, self, 'code')
        else:
            return self.code

    def iati_sector_unicode(self):
        return str(self.iati_sector())

    def iati_vocabulary(self):
        return codelist_value(SectorVocabulary, self, 'vocabulary')

    def iati_vocabulary_unicode(self):
        return str(self.iati_vocabulary())

    class Meta:
        app_label = 'rsr'
        verbose_name = _(u'transaction sector')
        verbose_name_plural = _(u'transaction sectors')
