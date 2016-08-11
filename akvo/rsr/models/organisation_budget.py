# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

from akvo.codelists.models import BudgetStatus, Country, Currency, Region, RegionVocabulary
from akvo.codelists.store.codelists_v202 import (BUDGET_STATUS, COUNTRY, CURRENCY, REGION,
                                                 REGION_VOCABULARY)
from akvo.rsr.fields import ValidXMLCharField
from akvo.utils import codelist_choices, codelist_value

from django.core.exceptions import ValidationError
from django.db import models
from django.utils.translation import ugettext_lazy as _


class OrganisationFinanceBasic(models.Model):
    currency = ValidXMLCharField(
        _(u'currency'), max_length=3, blank=True, choices=codelist_choices(CURRENCY)
    )
    value = models.DecimalField(
        _(u'value'), max_digits=20, decimal_places=2, null=True, blank=True,
        help_text=_(u'Enter the amount of budget that is set aside for this specific budget. '
                    u'Use a period to denote decimals.')
    )
    value_date = models.DateField(
        _(u'value date'), null=True, blank=True,
        help_text=_(u'Enter the date (DD/MM/YYYY) to be used for determining the exchange rate for '
                    u'currency conversions.')
    )
    period_start = models.DateField(
        _(u'period start'), null=True, blank=True,
        help_text=_(u'Enter the start date (DD/MM/YYYY) for the budget period.')
    )
    period_end = models.DateField(
        _(u'period end'), null=True, blank=True,
        help_text=_(u'Enter the end date (DD/MM/YYYY) for the budget period.')
    )

    class Meta:
        app_label = 'rsr'
        abstract = True

    def __unicode__(self):
        if self.value and self.currency:
            return u'%s %s' % (self.currency, '{:,}'.format(int(self.value)))
        else:
            return u'%s' % _(u'No currency or value specified')

    def clean(self):
        # Don't allow a start date before an end date
        if self.period_start and self.period_end and (self.period_start > self.period_end):
            raise ValidationError(
                {
                    'period_start': u'%s' % _(u'Period start cannot be at a later time than period '
                                              u'end.'),
                    'period_end': u'%s' % _(u'Period start cannot be at a later time than period '
                                            u'end.')
                }
            )

    def iati_currency(self):
        return codelist_value(Currency, self, 'currency')


class OrganisationBudget(OrganisationFinanceBasic):
    status = ValidXMLCharField(
        _(u'status'), max_length=1, blank=True, choices=codelist_choices(BUDGET_STATUS),
        help_text=_(u'The status explains whether the budget being reported is indicative or has '
                    u'been formally committed.')
    )

    class Meta:
        app_label = 'rsr'
        abstract = True

    def iati_status(self):
        return codelist_value(BudgetStatus, self, 'status')


class OrganisationTotalBudget(OrganisationBudget):
    organisation = models.ForeignKey(
        'Organisation', verbose_name=_(u'organisation'), related_name='total_budgets'
    )

    class Meta:
        app_label = 'rsr'
        verbose_name = _(u'organisation total budget')
        verbose_name_plural = _(u'organisation total budgets')


class OrganisationRecipientOrgBudget(OrganisationBudget):
    organisation = models.ForeignKey(
        'Organisation', verbose_name=_(u'organisation'), related_name='recipient_org_budgets'
    )
    recipient_organisation = models.ForeignKey(
        'Organisation', verbose_name=_(u'recipient organisation'),
        related_name='receiver_org_budgets'
    )

    class Meta:
        app_label = 'rsr'
        verbose_name = _(u'recipient organisation budget')
        verbose_name_plural = _(u'recipient organisation budgets')


class OrganisationRegionBudget(OrganisationBudget):
    organisation = models.ForeignKey(
        'Organisation', verbose_name=_(u'organisation'), related_name='recipient_region_budgets'
    )
    region = ValidXMLCharField(
        _(u'recipient region'), blank=True, max_length=25, choices=codelist_choices(REGION),
        help_text=_(u'This identifies the region which concerns the organisation budget.')
    )
    region_vocabulary = ValidXMLCharField(
        _(u'vocabulary'), blank=True, max_length=2,
        choices=codelist_choices(REGION_VOCABULARY),
        help_text=_(u'The vocabulary from which the region code is drawn. If it is not present 1 – '
                    u'\'OECD DAC\' is assumed.')
    )
    region_vocabulary_uri = ValidXMLCharField(
        _(u'vocabulary URI'), blank=True, max_length=1000,
        help_text=_(u'If the vocabulary is 99 (reporting organisation), the URI where this '
                    u'internal vocabulary is defined.')
    )
    text = ValidXMLCharField(
        _(u'description'), blank=True, max_length=100,
        help_text=_(u'Optionally enter a short description.')
    )

    class Meta:
        app_label = 'rsr'
        verbose_name = _(u'organisation recipient region budget')
        verbose_name_plural = _(u'organisation recipient region budgets')

    def iati_region(self):
        return codelist_value(Region, self, 'region')

    def iati_region_vocabulary(self):
        return codelist_value(RegionVocabulary, self, 'region_vocabulary')


class OrganisationCountryBudget(OrganisationBudget):
    organisation = models.ForeignKey(
        'Organisation', verbose_name=_(u'organisation'), related_name='recipient_country_budgets'
    )
    country = ValidXMLCharField(
        _(u'recipient country'), blank=True, max_length=2,choices=codelist_choices(COUNTRY, show_code=False),
        help_text=_(u'This identifies the country which concerns the organisation budget.')
    )
    text = ValidXMLCharField(
        _(u'description'), blank=True, max_length=100,
        help_text=_(u'Optionally enter a short description.')
    )

    class Meta:
        app_label = 'rsr'
        verbose_name = _(u'organisation recipient country budget')
        verbose_name_plural = _(u'organisation recipient country budgets')

    def iati_country(self):
        return codelist_value(Country, self, 'country')


class OrganisationTotalExpenditure(OrganisationFinanceBasic):
    organisation = models.ForeignKey(
        'Organisation', verbose_name=_(u'organisation'), related_name='total_expenditures'
    )

    class Meta:
        app_label = 'rsr'
        verbose_name = _(u'organisation total expenditure')
        verbose_name_plural = _(u'organisation total expenditures')


class LineBasic(models.Model):
    currency = ValidXMLCharField(
        _(u'currency'), max_length=3, blank=True, choices=codelist_choices(CURRENCY)
    )
    value = models.DecimalField(
        _(u'value'), max_digits=20, decimal_places=2, null=True, blank=True,
        help_text=_(u'Enter the amount of this specific line. Use a period to denote decimals.')
    )
    value_date = models.DateField(
        _(u'value date'), null=True, blank=True,
        help_text=_(u'Enter the date (DD/MM/YYYY) to be used for determining the exchange rate for '
                    u'currency conversions.')
    )
    reference = ValidXMLCharField(
        _(u'reference'), blank=True, max_length=50,
        help_text=_(u'An internal reference that describes the line in the reporting '
                    u'organisation\'s own system')
    )
    text = ValidXMLCharField(
        _(u'description'), blank=True, max_length=1000,
        help_text=_(u'The description for this line.')
    )

    class Meta:
        app_label = 'rsr'
        abstract = True

    def __unicode__(self):
        if self.value and self.currency:
            return u'%s %s' % (self.currency, '{:,}'.format(int(self.value)))
        else:
            return u'%s' % _(u'No currency or value specified')

    def iati_currency(self):
        return codelist_value(Currency, self, 'currency')


class OrganisationTotalBudgetLine(LineBasic):
    budget = models.ForeignKey(
        OrganisationTotalBudget, verbose_name=_(u'organisation budget'), related_name='budget_lines'
    )

    class Meta:
        app_label = 'rsr'
        verbose_name = _(u'total budget line')
        verbose_name_plural = _(u'total budget lines')


class OrganisationRecipientOrgBudgetLine(LineBasic):
    budget = models.ForeignKey(
        OrganisationRecipientOrgBudget, verbose_name=_(u'organisation budget'),
        related_name='budget_lines'
    )

    class Meta:
        app_label = 'rsr'
        verbose_name = _(u'recipient organisation budget line')
        verbose_name_plural = _(u'recipient organisation budget lines')


class OrganisationRegionBudgetLine(LineBasic):
    budget = models.ForeignKey(
        OrganisationRegionBudget, verbose_name=_(u'organisation budget'),
        related_name='budget_lines'
    )

    class Meta:
        app_label = 'rsr'
        verbose_name = _(u'region budget line')
        verbose_name_plural = _(u'region budget lines')


class OrganisationCountryBudgetLine(LineBasic):
    budget = models.ForeignKey(
        OrganisationCountryBudget, verbose_name=_(u'organisation budget'),
        related_name='budget_lines'
    )

    class Meta:
        app_label = 'rsr'
        verbose_name = _(u'country budget line')
        verbose_name_plural = _(u'country budget lines')


class OrganisationExpenseLine(LineBasic):
    expenditure = models.ForeignKey(
        OrganisationTotalExpenditure, verbose_name=_(u'organisation expenditure'),
        related_name='expense_lines'
    )

    class Meta:
        app_label = 'rsr'
        verbose_name = _(u'expense line')
        verbose_name_plural = _(u'expense lines')
