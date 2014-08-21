# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


from django.db import models
from django.core.validators import MaxValueValidator, MinValueValidator
from django.utils.translation import ugettext_lazy as _

from akvo.utils import RSR_LIMITED_CHANGE

from ..fields import ValidXMLCharField
from ..iati.codelists import codelists_v104 as codelists


class BudgetItemLabel(models.Model):
    TOTAL_BUDGET_LABEL_ID = 14
    label = ValidXMLCharField(_(u'label'), max_length=20, unique=True, db_index=True)

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
    label = models.ForeignKey(BudgetItemLabel, verbose_name=_(u'label'),)
    other_extra = ValidXMLCharField(
        max_length=20, null=True, blank=True, verbose_name=_(u'"Other" labels extra info'),
        help_text=_(u'Extra information about the exact nature of an "other" budget item.'),
    )
    # Translators: This is the amount of an budget item in a currency (€ or $)
    amount = models.DecimalField(_(u'amount'), max_digits=10, decimal_places=2,)

    # Extra IATI fields
    type = ValidXMLCharField(_(u'budget type'), blank=True, max_length=1, choices=codelists.BUDGET_TYPE)
    period_start = models.DateField(_(u'period start'), null=True, blank=True)
    period_start_text = ValidXMLCharField(_(u'period start label'), max_length=50, blank=True)
    period_end = models.DateField(_(u'period end'), null=True, blank=True)
    period_end_text = ValidXMLCharField(_(u'period end label'), max_length=50, blank=True)
    value_date = models.DateField(_(u'value date'), null=True, blank=True)
    currency = ValidXMLCharField(_(u'currency'), max_length=3, blank=True, choices=codelists.CURRENCY)

    def __unicode__(self):
        return self.label.__unicode__()

    def get_label(self):
        "Needed since we have to have a vanilla __unicode__() method for the admin"
        if self.label.label in self.OTHER_LABELS:
            # display "other" if other_extra is empty. Translating here without translating the other labels seems corny
            return u"other" if self.other_extra is None else self.other_extra.strip()
        else:
            return self.__unicode__()

    class Meta:
        app_label = 'rsr'
        ordering = ('label',)
        verbose_name = _(u'budget item')
        verbose_name_plural = _(u'budget items')
        unique_together = ('project', 'label')
        permissions = (
            ("%s_budget" % RSR_LIMITED_CHANGE, u'RSR limited change budget'),
        )


class CountryBudgetItem(models.Model):
    project = models.ForeignKey('Project', verbose_name=_(u'project'), related_name='country_budget_items')
    code = ValidXMLCharField(
        _(u'budget item'), max_length=6, choices=[code[:2] for code in codelists.BUDGET_IDENTIFIER], blank=True
    )
    description = ValidXMLCharField(_(u'description'), max_length=100, blank=True, help_text=_(u'(max 100 characters)'))
    vocabulary = ValidXMLCharField(
        _(u'country budget vocabulary'), blank=True, max_length=1, choices=codelists.BUDGET_IDENTIFIER_VOCABULARY
    )
    percentage = models.DecimalField(_(u'percentage'), blank=True, null=True, max_digits=4, decimal_places=1,
                                     validators=[MaxValueValidator(100), MinValueValidator(0)])

    class Meta:
        app_label = 'rsr'
        verbose_name = _(u'country budget item')
        verbose_name_plural = _(u'country budget items')