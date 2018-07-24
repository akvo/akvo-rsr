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
        _(u'extraction date'), null=True, blank=True,
        help_text=_(u'The exact date when the information was collected or extracted from donors\' '
                    u'aid management systems.')
    )
    priority = models.NullBooleanField(
        _(u'priority'), blank=True,
        help_text=_(u'True if the partner country is a priority partner country.')
    )
    phaseout_year = models.PositiveIntegerField(
        _(u'phaseout year'), blank=True, null=True, max_length=4,
        help_text=_(u'If there are plans to phase out operations from the partner country, this '
                    u'shows the projected year of last disbursements.')
    )

    def __unicode__(self):
        return u'%s' % _(u'Forward Spending Survey')

    class Meta:
        app_label = 'rsr'
        verbose_name = _(u'FSS')
        verbose_name_plural = _(u'FSS')


class FssForecast(models.Model):
    """
    Forecast items for an OECD DAC Forward Spending Survey item.
    """
    fss = models.ForeignKey('Fss', verbose_name=_(u'fss'), related_name='forecasts')
    year = models.PositiveIntegerField(
        _(u'year'), blank=True, null=True, max_length=4,
        help_text=_(u'The calendar year that the forward spend covers.')
    )
    value_date = models.DateField(
        _(u'value date'), blank=True, null=True,
        help_text=_(u'Enter the specific date (DD/MM/YYYY) for the forecast value.')
    )
    currency = ValidXMLCharField(
        _(u'currency'), blank=True, max_length=3, choices=codelist_choices(CURRENCY)
    )
    value = models.DecimalField(
        _(u'forecast value'), max_digits=10, decimal_places=2, blank=True, null=True,
        help_text=_(u'The forecast value for each year.')
    )

    def __unicode__(self):
        if self.value and self.currency:
            try:
                return u'{0} {1}'.format(self.iati_currency().name, self.value)
            except AttributeError:
                return u'{0} {1}'.format(self.iati_currency(), self.value)
        else:
            return u'%s' % _(u'No currency or interest received specified')

    def iati_currency(self):
        return codelist_value(Currency, self, 'currency')

    def iati_currency_unicode(self):
        return str(self.iati_currency())

    class Meta:
        app_label = 'rsr'
        verbose_name = _(u'FSS forecast')
        verbose_name_plural = _(u'FSS forecasts')
