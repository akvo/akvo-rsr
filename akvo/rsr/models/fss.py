# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


from django.db import models
from django.utils.translation import ugettext_lazy as _

from ..fields import ValidXMLCharField

from akvo.codelists.models import Currency
from akvo.codelists.store.default_codelists import CURRENCY
from akvo.utils import codelist_choices, codelist_value


class Fss(models.Model):
    """
    Items specific to OECD DAC Forward Spending Survey. Can only occur once per project.
    """
    project = models.OneToOneField('Project', primary_key=True)
    extraction_date = models.DateField(
        _('extraction date'), null=True, blank=True,
        help_text=_('The exact date when the information was collected or extracted from donors\' '
                    'aid management systems.')
    )
    priority = models.NullBooleanField(
        _('priority'), blank=True,
        help_text=_('True if the partner country is a priority partner country.')
    )
    phaseout_year = models.PositiveIntegerField(
        _('phaseout year'), blank=True, null=True,
        help_text=_('If there are plans to phase out operations from the partner country, this '
                    'shows the projected year of last disbursements.')
    )

    def __str__(self):
        return '%s' % _('Forward Spending Survey')

    class Meta:
        app_label = 'rsr'
        verbose_name = _('FSS')
        verbose_name_plural = _('FSS')
        ordering = ('pk',)


class FssForecast(models.Model):
    """
    Forecast items for an OECD DAC Forward Spending Survey item.
    """
    fss = models.ForeignKey('Fss', verbose_name=_('fss'), related_name='forecasts')
    year = models.PositiveIntegerField(
        _('year'), blank=True, null=True,
        help_text=_('The calendar year that the forward spend covers.')
    )
    value_date = models.DateField(
        _('value date'), blank=True, null=True,
        help_text=_('Enter the specific date (DD/MM/YYYY) for the forecast value.')
    )
    currency = ValidXMLCharField(
        _('currency'), blank=True, max_length=3, choices=codelist_choices(CURRENCY)
    )
    value = models.DecimalField(
        _('forecast value'), max_digits=10, decimal_places=2, blank=True, null=True,
        help_text=_('The forecast value for each year.')
    )

    def __str__(self):
        if self.value and self.currency:
            try:
                return '{0} {1}'.format(self.iati_currency().name, self.value)
            except AttributeError:
                return '{0} {1}'.format(self.iati_currency(), self.value)
        else:
            return '%s' % _('No currency or interest received specified')

    def iati_currency(self):
        return codelist_value(Currency, self, 'currency')

    def iati_currency_unicode(self):
        return str(self.iati_currency())

    class Meta:
        app_label = 'rsr'
        verbose_name = _('FSS forecast')
        verbose_name_plural = _('FSS forecasts')
        ordering = ('pk',)
