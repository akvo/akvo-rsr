# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


from django.core.exceptions import ValidationError
from django.db import models
from django.utils.translation import ugettext_lazy as _

from ..fields import ValidXMLCharField
from akvo.codelists.models import BudgetType, Currency
from akvo.codelists.store.default_codelists import BUDGET_TYPE, CURRENCY
from akvo.utils import codelist_choices, codelist_value


class PlannedDisbursement(models.Model):
    project = models.ForeignKey('Project', verbose_name=_('project'),
                                related_name='planned_disbursements')
    value = models.DecimalField(
        _('planned disbursement value'), null=True, blank=True, max_digits=14, decimal_places=2,
        help_text=_('This should only be used to report specific planned cash transfers. Use a '
                    'period to denote decimals.'))
    value_date = models.DateField(
        _('planned disbursement value date'), null=True, blank=True,
        help_text=_('Enter the specific date (DD/MM/YYYY) for the planned disbursement value.'))
    currency = ValidXMLCharField(_('currency'), blank=True, max_length=3,
                                 choices=codelist_choices(CURRENCY))
    updated = models.DateField(_('updated'), null=True, blank=True)
    period_start = models.DateField(
        _('planned disbursement period start'), null=True, blank=True,
        help_text=_('The exact date of the planned disbursement OR the starting date for the '
                    'disbursement period (DD/MM/YYYY).'))
    period_end = models.DateField(
        _('planned disbursement period end'), null=True, blank=True,
        help_text=_('Enter the end date (DD/MM/YYYY) for the disbursement period.'))
    type = ValidXMLCharField(_('planned disbursement type'), blank=True, max_length=1,
                             choices=codelist_choices(BUDGET_TYPE))
    provider_organisation = models.ForeignKey(
        'Organisation', verbose_name=_('provider organisation'),
        related_name='providing_disbursements', blank=True, null=True, on_delete=models.SET_NULL)
    provider_organisation_activity = ValidXMLCharField(
        _('provider organisation activity id'), blank=True, max_length=100,
        help_text=_('If incoming funds are being provided from the budget of another activity '
                    'that is reported to IATI, it is STRONGLY RECOMMENDED that this should record '
                    'the provider’s unique IATI activity identifier for that activity.'))
    receiver_organisation = models.ForeignKey(
        'Organisation', verbose_name=_('receiver organisation'),
        related_name='receiving_disbursements', blank=True, null=True, on_delete=models.SET_NULL)
    receiver_organisation_activity = ValidXMLCharField(
        _('receiver organisation activity id'), blank=True, max_length=100,
        help_text=_('The internal identifier used by the receiver organisation for its activity '
                    'that receives the funds from this disbursement (not to be confused with the '
                    'IATI identifier for the target activity).'))

    def __unicode__(self):
        if self.value:
            if self.currency:
                return '%s %s' % (self.iati_currency().name,
                                  '{:,}'.format(int(self.value)))
            else:
                return '%s %s' % (self.project.currency,
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

    def iati_currency(self):
        if self.currency:
            return codelist_value(Currency, self, 'currency')
        else:
            return codelist_value(Currency, self.project, 'currency')

    def iati_currency_unicode(self):
        return str(self.iati_currency())

    def iati_type(self):
        return codelist_value(BudgetType, self, 'type')

    def iati_type_unicode(self):
        return str(self.iati_type())

    def clean(self):
        # Don't allow a start date before an end date
        if self.period_start and self.period_end and (self.period_start > self.period_end):
            raise ValidationError(
                {'period_start': '%s' % _('Period start cannot be at a later time than period '
                                          'end.'),
                 'period_end': '%s' % _('Period start cannot be at a later time than period '
                                        'end.')}
            )

    class Meta:
        app_label = 'rsr'
        verbose_name = _('planned disbursement')
        verbose_name_plural = _('planned disbursements')
        ordering = ('pk',)
