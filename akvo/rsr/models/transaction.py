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
from akvo.codelists.store.default_codelists import (AID_TYPE_VOCABULARY, CURRENCY,
                                                    DISBURSEMENT_CHANNEL, FINANCE_TYPE, FLOW_TYPE,
                                                    TIED_STATUS, TRANSACTION_TYPE, COUNTRY, REGION,
                                                    REGION_VOCABULARY, SECTOR_VOCABULARY)
from akvo.utils import codelist_choices, codelist_value, codelist_name


class Transaction(models.Model):
    project = models.ForeignKey('Project', verbose_name=_('project'), related_name='transactions')
    reference = ValidXMLCharField(
        _('transaction reference'), blank=True, max_length=25,
        help_text=_('Enter a reference for the transaction (eg. transaction number).')
    )
    aid_type_vocabulary = ValidXMLCharField(
        _('transaction aid type vocabulary'), blank=True, max_length=1, default='1',
        choices=codelist_choices(AID_TYPE_VOCABULARY),
        help_text=_('Enter the type of vocabulary being used to describe the aid type '
                    'For reference, please visit: <a '
                    'href="http://iatistandard.org/203/codelists/AidTypeVocabulary/" target='
                    '"_blank"> http://iatistandard.org/203/codelists/AidTypeVocabulary/</a>.')
    )
    aid_type = ValidXMLCharField(
        _('transaction aid type'), blank=True, max_length=3,
        help_text=_('Enter the type of aid being supplied. For reference, please visit: '
                    '<a href="http://iatistandard.org/202/codelists/AidType/" target="_blank">'
                    'http://iatistandard.org/202/codelists/AidType/</a>.')
    )
    description = ValidXMLCharField(
        _('transaction description'), max_length=255, blank=True,
        help_text=_('Enter additional information for the transaction, if necessary.')
    )
    disbursement_channel = ValidXMLCharField(
        _('transaction disbursement channel'), blank=True, max_length=1,
        choices=codelist_choices(DISBURSEMENT_CHANNEL),
        help_text=_('Enter the channel through which the funds will flow for this transaction, '
                    'from an IATI codelist. For reference, please visit: '
                    '<a href="http://iatistandard.org/202/codelists/DisbursementChannel/" '
                    'target="_blank">http://iatistandard.org/202/codelists/DisbursementChannel/'
                    '</a>.')
    )
    finance_type = ValidXMLCharField(
        _('transaction finance type'), max_length=3, blank=True,
        choices=codelist_choices(FINANCE_TYPE),
        help_text=_('For reference, please visit: '
                    '<a href="http://iatistandard.org/202/codelists/FinanceType/" '
                    'target="_blank">http://iatistandard.org/202/codelists/FinanceType/</a>.')
    )
    flow_type = ValidXMLCharField(
        _('transaction flow type'), max_length=2, blank=True, choices=codelist_choices(FLOW_TYPE),
        help_text=_('For reference, please visit: '
                    '<a href="http://iatistandard.org/202/codelists/FlowType/" target="_blank">'
                    'http://iatistandard.org/202/codelists/FlowType/</a>.')
    )
    tied_status = ValidXMLCharField(
        _('transaction tied status'), blank=True, max_length=1,
        choices=codelist_choices(TIED_STATUS),
        help_text=_('Whether the aid is untied, tied, or partially tied. For reference visit '
                    '<a href="http://iatistandard.org/202/codelists/TiedStatus/" target="_blank">'
                    'http://iatistandard.org/202/codelists/TiedStatus/</a>.')
    )
    transaction_date = models.DateField(
        _('transaction date'), blank=True, null=True,
        help_text=_('Enter the financial reporting date that the transaction was/will be '
                    'undertaken.')
    )
    transaction_type = ValidXMLCharField(
        _('transaction type'), blank=True, max_length=2,
        choices=codelist_choices(TRANSACTION_TYPE),
        help_text=_('Select the type of the transaction (e.g. commitment, disbursement, '
                    'expenditure).')
    )
    value = models.DecimalField(
        _('transaction value'), blank=True, null=True, max_digits=14, decimal_places=2,
        help_text=_('Enter the transaction amount. Use a period to denote decimals.')
    )
    value_date = models.DateField(
        _('transaction value date'), blank=True, null=True,
        help_text=_('The date to be used for determining the exchange rate for currency '
                    'conversions of the transaction.')
    )
    currency = ValidXMLCharField(
        _('currency'), blank=True, max_length=3, choices=codelist_choices(CURRENCY)
    )
    provider_organisation = models.ForeignKey(
        'Organisation', verbose_name=_('provider organisation'),
        related_name='providing_transactions', blank=True, null=True, on_delete=models.SET_NULL
    )
    provider_organisation_activity = ValidXMLCharField(
        _('provider organisation activity id'), blank=True, max_length=100,
        help_text=_('If incoming funds are being provided from the budget of another activity '
                    'that is reported to IATI, it is STRONGLY RECOMMENDED that this should record '
                    'the provider’s unique IATI activity identifier for that activity.')
    )
    receiver_organisation = models.ForeignKey(
        'Organisation', verbose_name=_('receiver organisation'),
        related_name='receiving_transactions', blank=True, null=True, on_delete=models.SET_NULL
    )
    receiver_organisation_activity = ValidXMLCharField(
        _('receiver organisation activity id'), blank=True, max_length=100,
        help_text=_('The internal identifier used by the receiver organisation for its activity '
                    'that receives the funds from this transaction (not to be confused with the '
                    'IATI identifier for the target activity).')
    )
    recipient_country = ValidXMLCharField(
        _('transaction recipient country'), blank=True, max_length=2,
        choices=codelist_choices(COUNTRY, show_code=False),
        help_text=_('Enter the country that will benefit from this transaction. It can only be '
                    'one country per transaction. For reference, please visit: '
                    '<a href="http://iatistandard.org/202/codelists/Country/" target="_blank">'
                    'http://iatistandard.org/202/codelists/Country/</a>.')
    )
    recipient_region = ValidXMLCharField(
        _('transaction recipient region'), blank=True, max_length=25,
        choices=codelist_choices(REGION),
        help_text=_('Enter the supranational geopolitical region (a geographical or '
                    'administrative grouping of countries into a region - e.g. Sub-Saharan '
                    'Africa, Mekong Delta) that will benefit from this transaction. For '
                    'reference, please visit: <a href="http://iatistandard.org/202/codelists/'
                    'Region/" target="_blank">http://iatistandard.org/202/codelists/Region/</a>.')
    )
    recipient_region_vocabulary = ValidXMLCharField(
        _('recipient region vocabulary'), blank=True, max_length=2,
        choices=codelist_choices(REGION_VOCABULARY)
    )
    recipient_region_vocabulary_uri = ValidXMLCharField(
        _('recipient region vocabulary URI'), blank=True, max_length=1000,
        help_text=_('If the vocabulary is 99 (reporting organisation), the URI where this '
                    'internal vocabulary is defined.'))
    humanitarian = models.NullBooleanField(
        _('humanitarian transaction'), help_text=_('Determines whether this transaction relates '
                                                   'entirely or partially to humanitarian aid.'))

    def __unicode__(self):
        if self.value:
            return '%s %s' % (self.iati_currency(),
                              '{:,}'.format(int(self.value)))
        else:
            return '%s' % _('No value specified')

    def provider_organisation_show_link(self):
        if self.provider_organisation:
            return '<a href="{0}">{1}</a>'.format(self.provider_organisation.get_absolute_url(),
                                                  self.provider_organisation.long_name
                                                  or self.provider_organisation.name)
        return ''

    def receiver_organisation_show_link(self):
        if self.receiver_organisation:
            return '<a href="{0}">{1}</a>'.format(self.receiver_organisation.get_absolute_url(),
                                                  self.receiver_organisation.long_name
                                                  or self.receiver_organisation.name)
        return ''

    def get_currency(self):
        if self.currency:
            return self.currency
        else:
            return self.project.currency

    def iati_currency(self):
        if self.currency:
            return codelist_name(Currency, self, 'currency')
        else:
            return codelist_name(Currency, self.project, 'currency')

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
        verbose_name = _('transaction')
        verbose_name_plural = _('transactions')
        ordering = ('pk',)


class TransactionSector(models.Model):

    project_relation = 'transactions__sectors__in'

    transaction = models.ForeignKey(
        'Transaction', verbose_name=_('transaction'), related_name='sectors'
    )
    code = ValidXMLCharField(
        _('transaction sector'), blank=True, max_length=25,
        help_text=_('A recognised code, from a recognised vocabulary, classifying the purpose of '
                    'this transaction. If this element is used then ALL transaction elements '
                    'should contain a transaction/sector element and iati-activity/sector should '
                    'NOT be used. This element can be used multiple times, but only one sector '
                    'can be reported per vocabulary.')
    )
    text = ValidXMLCharField(_('transaction sector description'), blank=True, max_length=100)
    vocabulary = ValidXMLCharField(
        _('transaction sector vocabulary'), blank=True, max_length=5,
        choices=codelist_choices(SECTOR_VOCABULARY),
        help_text=_('An IATI code for the vocabulary (codelist) used for sector classifications. '
                    'If omitted, OECD DAC 5-digit Purpose Codes are assumed. Note that at '
                    'transaction level, only one sector per vocabulary can be reported.'))
    vocabulary_uri = ValidXMLCharField(
        _('transaction sector vocabulary URI'), blank=True, max_length=1000,
        help_text=_('If the vocabulary is 99 (reporting organisation), the URI where this '
                    'internal vocabulary is defined.'))

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
        verbose_name = _('transaction sector')
        verbose_name_plural = _('transaction sectors')
        ordering = ('pk',)
