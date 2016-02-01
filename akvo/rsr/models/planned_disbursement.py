# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


from django.core.exceptions import ValidationError
from django.db import models
from django.utils.translation import ugettext_lazy as _

from ..fields import ValidXMLCharField
from akvo.codelists.models import BudgetType, Currency
from akvo.codelists.store.codelists_v201 import BUDGET_TYPE, CURRENCY
from akvo.utils import codelist_choices, codelist_value


class PlannedDisbursement(models.Model):
    project = models.ForeignKey(
        'Project', verbose_name=_(u'project'), related_name='planned_disbursements'
    )
    value = models.DecimalField(
        _(u'planned disbursement value'), null=True, blank=True, max_digits=14, decimal_places=2,
        help_text=_(u'This should only be used to report specific planned cash transfers. Use a '
                    u'period to denote decimals.')
    )
    value_date = models.DateField(
        _(u'planned disbursement value date'), null=True, blank=True,
        help_text=_(u'Enter the specific date (DD/MM/YYYY) for the planned disbursement value.')
    )
    currency = ValidXMLCharField(
        _(u'currency'), blank=True, max_length=3, choices=codelist_choices(CURRENCY)
    )
    updated = models.DateField(_(u'updated'), null=True, blank=True)
    period_start = models.DateField(
        _(u'planned disbursement period start'), null=True, blank=True,
        help_text=_(u'The exact date of the planned disbursement OR the starting date for the '
                    u'disbursement period (DD/MM/YYYY).')
    )
    period_end = models.DateField(
        _(u'planned disbursement period end'), null=True, blank=True,
        help_text=_(u'Enter the end date (DD/MM/YYYY) for the disbursement period.')
    )
    type = ValidXMLCharField(
        _(u'planned disbursement type'), blank=True, max_length=1,
        choices=codelist_choices(BUDGET_TYPE)
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

    def iati_type(self):
        return codelist_value(BudgetType, self, 'type')

    def clean(self):
        # Don't allow a start date before an end date
        if self.period_start and self.period_end and (self.period_start > self.period_end):
            raise ValidationError(
                {'period_start': u'%s' % _(u'Period start cannot be at a later time than period '
                                           u'end.'),
                 'period_end': u'%s' % _(u'Period start cannot be at a later time than period '
                                           u'end.')}
            )

    class Meta:
        app_label = 'rsr'
        verbose_name = _(u'planned disbursement')
        verbose_name_plural = _(u'planned disbursements')
