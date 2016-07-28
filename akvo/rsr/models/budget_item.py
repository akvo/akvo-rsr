# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


from django.core.exceptions import ValidationError
from django.core.validators import MaxValueValidator, MinValueValidator
from django.db import models
from django.utils.translation import ugettext_lazy as _

from ..fields import ValidXMLCharField

from akvo.codelists.models import BudgetIdentifier, BudgetStatus, BudgetType, Currency
from akvo.codelists.store.codelists_v202 import (BUDGET_IDENTIFIER, BUDGET_TYPE, BUDGET_STATUS,
                                                 CURRENCY)
from akvo.utils import codelist_choices, codelist_value


class BudgetItemLabel(models.Model):
    TOTAL_BUDGET_LABEL_ID = 14
    label = ValidXMLCharField(_(u'label'), max_length=30, unique=True, db_index=True)

    def __unicode__(self):
        return self.label

    class Meta:
        app_label = 'rsr'
        ordering = ('label',)
        verbose_name = _(u'budget item label')
        verbose_name_plural = _(u'budget item labels')


class BudgetItem(models.Model):
    # DON'T translate. Need model translations for this to work
    OTHER_LABELS = [u'other 1', u'other 2', u'other 3']

    project = models.ForeignKey('Project', verbose_name=_(u'project'), related_name='budget_items')
    label = models.ForeignKey(
        BudgetItemLabel, verbose_name=_(u'budget item'), null=True, blank=True,
        help_text=_(u'Select the budget item(s) to indicate how the project budget is divided. '
                    u'Use the ‘Other’ fields to add custom budget items.')
    )
    other_extra = ValidXMLCharField(
        max_length=30, null=True, blank=True, verbose_name=_(u'other label extra info'),
        help_text=_(u'Enter a description for an "other" budget item.'),
    )
    # Translators: This is the amount of an budget item in a currency (€ or $)
    amount = models.DecimalField(
        _(u'budget item value'), max_digits=14, decimal_places=2, null=True, blank=True,
        help_text=_(u'Enter the amount of budget that is set aside for this specific budget item. '
                    u'Use a period to denote decimals.')
    )

    # Extra IATI fields
    type = ValidXMLCharField(
        _(u'budget type'), blank=True, max_length=1, choices=codelist_choices(BUDGET_TYPE),
        help_text=_(u'Select whether this is an original or revised budget of the project.')
    )
    period_start = models.DateField(
        _(u'budget item period start'), null=True, blank=True,
        help_text=_(u'Enter the start date (DD/MM/YYYY) for the budget period.')
    )
    period_end = models.DateField(
        _(u'budget item period end'), null=True, blank=True,
        help_text=_(u'Enter the end date (DD/MM/YYYY) for the budget period.')
    )
    value_date = models.DateField(
        _(u'budget item value date'), null=True, blank=True,
        help_text=_(u'Enter the date (DD/MM/YYYY) to be used for determining the exchange rate for '
                    u'currency conversions.')
    )
    currency = ValidXMLCharField(_(u'currency'), max_length=3, blank=True,
                                 choices=codelist_choices(CURRENCY))
    status = ValidXMLCharField(
        _(u'status'), max_length=1, blank=True, choices=codelist_choices(BUDGET_STATUS),
        help_text=_(u'The status explains whether the budget being reported is indicative or has '
                    u'been formally committed.'))

    def __unicode__(self):
        if self.label:
            if self.label.label == 'Other' and self.other_extra:
                budget_unicode = self.other_extra
            else:
                budget_unicode = self.label.label
        else:
            budget_unicode = u'%s' % _(u'No budget item specified')

        if self.amount and self.currency:
            budget_unicode += u' - %s %s' % (unicode('{:,}'.format(int(self.amount))), self.currency)

        elif self.amount and not self.currency:
            budget_unicode += u' - %s %s' % (unicode('{:,}'.format(int(self.amount))), self.project.currency)

        else:
            budget_unicode += u' - %s' % _(u'No amount specified')

        if self.type == '2':
            budget_unicode += u' %s' % _(u'(Revised)')

        return budget_unicode

    def clean(self):
        # Don't allow a start date before an end date
        if self.period_start and self.period_end and (self.period_start > self.period_end):
            raise ValidationError(
                {'period_start': u'%s' % _(u'Period start cannot be at a later time than period '
                                           u'end.'),
                 'period_end': u'%s' % _(u'Period start cannot be at a later time than period '
                                           u'end.')}
            )

    def get_label(self):
        "Needed since we have to have a vanilla __unicode__() method for the admin"
        if self.label and self.label.label in self.OTHER_LABELS:
            # display "other" if other_extra is empty.
            # Translating here without translating the other labels seems corny
            return u"other" if self.other_extra is None else self.other_extra.strip()
        elif self.label and self.label.label:
            return self.label.label
        else:
            return self.__unicode__()

    def get_currency(self):
        if self.currency:
            return self.currency
        else:
            return self.project.currency

    def iati_type(self):
        return codelist_value(BudgetType, self, 'type')

    def iati_type_unicode(self):
        return str(self.iati_type())

    def iati_currency(self):
        if self.currency:
            return codelist_value(Currency, self, 'currency')
        else:
            return codelist_value(Currency, self.project, 'currency')

    def iati_currency_unicode(self):
        return str(self.iati_currency())

    def iati_status(self):
        return codelist_value(BudgetStatus, self, 'status')

    class Meta:
        app_label = 'rsr'
        ordering = ('label',)
        verbose_name = _(u'budget item')
        verbose_name_plural = _(u'budget items')


class CountryBudgetItem(models.Model):
    project = models.ForeignKey('Project', verbose_name=_(u'project'), related_name='country_budget_items')
    code = ValidXMLCharField(
        _(u'country budget item'), max_length=10, blank=True,
        choices=codelist_choices(BUDGET_IDENTIFIER),
        help_text=_(u'This item encodes the alignment of activities with both the functional and '
                    u'administrative classifications used in the recipient country’s Chart of '
                    u'Accounts. This applies to both on- and off-budget activities.')
    )
    description = ValidXMLCharField(
        _(u'country budget item description'), max_length=100, blank=True,
    )
    percentage = models.DecimalField(
        _(u'country budget item percentage'), blank=True, null=True, max_digits=4, decimal_places=1,
        validators=[MaxValueValidator(100), MinValueValidator(0)],
        help_text=_(u'If more than one identifier is reported, the percentage share must be '
                    u'reported and all percentages should add up to 100 percent. Use a period to '
                    u'denote decimals.')
    )

    def __unicode__(self):
        return self.iati_code().name if self.code else u'%s' % _(u'No code specified')

    def iati_code(self):
        return codelist_value(BudgetIdentifier, self, 'code')

    class Meta:
        app_label = 'rsr'
        verbose_name = _(u'country budget item')
        verbose_name_plural = _(u'country budget items')
