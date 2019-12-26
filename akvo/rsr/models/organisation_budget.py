# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

from akvo.codelists.models import BudgetStatus, Country, Currency, Region, RegionVocabulary
from akvo.codelists.store.default_codelists import (BUDGET_STATUS, COUNTRY, CURRENCY, REGION,
                                                    REGION_VOCABULARY)
from akvo.rsr.fields import ValidXMLCharField
from akvo.utils import codelist_choices, codelist_value

from django.core.exceptions import ValidationError
from django.db import models
from django.utils.translation import ugettext_lazy as _


class OrganisationFinanceBasic(models.Model):
    currency = ValidXMLCharField(
        _('currency'), max_length=3, blank=True, choices=codelist_choices(CURRENCY)
    )
    value = models.DecimalField(
        _('value'), max_digits=20, decimal_places=2, null=True, blank=True,
        help_text=_('Enter the amount of budget that is set aside for this specific budget. '
                    'Use a period to denote decimals.')
    )
    value_date = models.DateField(
        _('value date'), null=True, blank=True,
        help_text=_('Enter the date (DD/MM/YYYY) to be used for determining the exchange rate for '
                    'currency conversions.')
    )
    period_start = models.DateField(
        _('period start'), null=True, blank=True,
        help_text=_('Enter the start date (DD/MM/YYYY) for the budget period.')
    )
    period_end = models.DateField(
        _('period end'), null=True, blank=True,
        help_text=_('Enter the end date (DD/MM/YYYY) for the budget period.')
    )

    class Meta:
        app_label = 'rsr'
        abstract = True

    def __unicode__(self):
        if self.value and self.currency:
            return '%s %s' % (self.currency, '{:,}'.format(int(self.value)))
        else:
            return '%s' % _('No currency or value specified')

    def clean(self):
        # Don't allow a start date before an end date
        if self.period_start and self.period_end and (self.period_start > self.period_end):
            raise ValidationError(
                {
                    'period_start': '%s' % _('Period start cannot be at a later time than period '
                                             'end.'),
                    'period_end': '%s' % _('Period start cannot be at a later time than period '
                                           'end.')
                }
            )

    def iati_currency(self):
        return codelist_value(Currency, self, 'currency')

    def iati_currency_unicode(self):
        return str(self.iati_currency())


class OrganisationBudget(OrganisationFinanceBasic):
    status = ValidXMLCharField(
        _('status'), max_length=1, blank=True, choices=codelist_choices(BUDGET_STATUS),
        help_text=_('The status explains whether the budget being reported is indicative or has '
                    'been formally committed.')
    )

    class Meta:
        app_label = 'rsr'
        abstract = True

    def iati_status(self):
        return codelist_value(BudgetStatus, self, 'status')

    def iati_status_unicode(self):
        return str(self.iati_status())


class OrganisationTotalBudget(OrganisationBudget):
    organisation = models.ForeignKey(
        'Organisation', verbose_name=_('organisation'), related_name='total_budgets'
    )

    class Meta:
        app_label = 'rsr'
        verbose_name = _('organisation total budget')
        verbose_name_plural = _('organisation total budgets')


class OrganisationRecipientOrgBudget(OrganisationBudget):
    organisation = models.ForeignKey(
        'Organisation', verbose_name=_('organisation'), related_name='recipient_org_budgets'
    )
    recipient_organisation = models.ForeignKey(
        'Organisation', verbose_name=_('recipient organisation'),
        related_name='receiver_org_budgets'
    )

    class Meta:
        app_label = 'rsr'
        verbose_name = _('recipient organisation budget')
        verbose_name_plural = _('recipient organisation budgets')


class OrganisationRegionBudget(OrganisationBudget):
    organisation = models.ForeignKey(
        'Organisation', verbose_name=_('organisation'), related_name='recipient_region_budgets'
    )
    region = ValidXMLCharField(
        _('recipient region'), blank=True, max_length=25, choices=codelist_choices(REGION),
        help_text=_('This identifies the region which concerns the organisation budget.')
    )
    region_vocabulary = ValidXMLCharField(
        _('vocabulary'), blank=True, max_length=2,
        choices=codelist_choices(REGION_VOCABULARY),
        help_text=_('The vocabulary from which the region code is drawn. If it is not present 1 – '
                    '\'OECD DAC\' is assumed.')
    )
    region_vocabulary_uri = ValidXMLCharField(
        _('vocabulary URI'), blank=True, max_length=1000,
        help_text=_('If the vocabulary is 99 (reporting organisation), the URI where this '
                    'internal vocabulary is defined.')
    )
    text = ValidXMLCharField(
        _('description'), blank=True, max_length=100,
        help_text=_('Optionally enter a short description.')
    )

    class Meta:
        app_label = 'rsr'
        verbose_name = _('organisation recipient region budget')
        verbose_name_plural = _('organisation recipient region budgets')

    def iati_region(self):
        return codelist_value(Region, self, 'region')

    def iati_region_unicode(self):
        return str(self.iati_region())

    def iati_region_vocabulary(self):
        return codelist_value(RegionVocabulary, self, 'region_vocabulary')

    def iati_region_vocabulary_unicode(self):
        return str(self.iati_region_vocabulary())


class OrganisationCountryBudget(OrganisationBudget):
    organisation = models.ForeignKey(
        'Organisation', verbose_name=_('organisation'), related_name='recipient_country_budgets'
    )
    country = ValidXMLCharField(
        _('recipient country'), blank=True, max_length=2, choices=codelist_choices(COUNTRY, show_code=False),
        help_text=_('This identifies the country which concerns the organisation budget.')
    )
    text = ValidXMLCharField(
        _('description'), blank=True, max_length=100,
        help_text=_('Optionally enter a short description.')
    )

    class Meta:
        app_label = 'rsr'
        verbose_name = _('organisation recipient country budget')
        verbose_name_plural = _('organisation recipient country budgets')

    def iati_country(self):
        return codelist_value(Country, self, 'country')

    def iati_country_unicode(self):
        return str(self.iati_country())


class OrganisationTotalExpenditure(OrganisationFinanceBasic):
    organisation = models.ForeignKey(
        'Organisation', verbose_name=_('organisation'), related_name='total_expenditures'
    )

    class Meta:
        app_label = 'rsr'
        verbose_name = _('organisation total expenditure')
        verbose_name_plural = _('organisation total expenditures')


class LineBasic(models.Model):
    currency = ValidXMLCharField(
        _('currency'), max_length=3, blank=True, choices=codelist_choices(CURRENCY)
    )
    value = models.DecimalField(
        _('value'), max_digits=20, decimal_places=2, null=True, blank=True,
        help_text=_('Enter the amount of this specific line. Use a period to denote decimals.')
    )
    value_date = models.DateField(
        _('value date'), null=True, blank=True,
        help_text=_('Enter the date (DD/MM/YYYY) to be used for determining the exchange rate for '
                    'currency conversions.')
    )
    reference = ValidXMLCharField(
        _('reference'), blank=True, max_length=50,
        help_text=_('An internal reference that describes the line in the reporting '
                    'organisation\'s own system')
    )
    text = ValidXMLCharField(
        _('description'), blank=True, max_length=1000,
        help_text=_('The description for this line.')
    )

    class Meta:
        app_label = 'rsr'
        abstract = True

    def __unicode__(self):
        if self.value and self.currency:
            return '%s %s' % (self.currency, '{:,}'.format(int(self.value)))
        else:
            return '%s' % _('No currency or value specified')

    def iati_currency(self):
        return codelist_value(Currency, self, 'currency')

    def iati_currency_unicode(self):
        return str(self.iati_currency())


class OrganisationTotalBudgetLine(LineBasic):
    budget = models.ForeignKey(
        OrganisationTotalBudget, verbose_name=_('organisation budget'), related_name='budget_lines'
    )

    class Meta:
        app_label = 'rsr'
        verbose_name = _('total budget line')
        verbose_name_plural = _('total budget lines')


class OrganisationRecipientOrgBudgetLine(LineBasic):
    budget = models.ForeignKey(
        OrganisationRecipientOrgBudget, verbose_name=_('organisation budget'),
        related_name='budget_lines'
    )

    class Meta:
        app_label = 'rsr'
        verbose_name = _('recipient organisation budget line')
        verbose_name_plural = _('recipient organisation budget lines')


class OrganisationRegionBudgetLine(LineBasic):
    budget = models.ForeignKey(
        OrganisationRegionBudget, verbose_name=_('organisation budget'),
        related_name='budget_lines'
    )

    class Meta:
        app_label = 'rsr'
        verbose_name = _('region budget line')
        verbose_name_plural = _('region budget lines')


class OrganisationCountryBudgetLine(LineBasic):
    budget = models.ForeignKey(
        OrganisationCountryBudget, verbose_name=_('organisation budget'),
        related_name='budget_lines'
    )

    class Meta:
        app_label = 'rsr'
        verbose_name = _('country budget line')
        verbose_name_plural = _('country budget lines')


class OrganisationExpenseLine(LineBasic):
    expenditure = models.ForeignKey(
        OrganisationTotalExpenditure, verbose_name=_('organisation expenditure'),
        related_name='expense_lines'
    )

    class Meta:
        app_label = 'rsr'
        verbose_name = _('expense line')
        verbose_name_plural = _('expense lines')
