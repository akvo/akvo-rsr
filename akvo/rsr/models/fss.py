# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


from django.db import models
from django.utils.translation import ugettext_lazy as _

from ..fields import ValidXMLCharField

from akvo.codelists.models import Currency
from akvo.codelists.store.codelists_v201 import CURRENCY
from akvo.utils import codelist_choices, codelist_value


class Fss(models.Model):
    """
    Items specific to OECD DAC Forward Spending Survey. Can only occur once per project.
    """
    project = models.OneToOneField('Project', primary_key=True)
    extraction_date = models.DateField(_(u'extraction date'), null=True, blank=True)
    priority = models.NullBooleanField(_(u'priority'), blank=True)
    phaseout_year = models.PositiveIntegerField(_(u'phaseout year'), blank=True, null=True,
                                                max_length=4)

    class Meta:
        app_label = 'rsr'
        verbose_name = _(u'FSS')
        verbose_name_plural = _(u'FSS')


class FssForecast(models.Model):
    """
    Forecast items for an OECD DAC Forward Spending Survey item.
    """
    fss = models.ForeignKey('Fss', verbose_name=u'fss', related_name='forecasts')
    year = models.PositiveIntegerField(_(u'year'), blank=True, null=True, max_length=4)
    value_date = models.DateField(_(u'value date'), blank=True, null=True)
    currency = ValidXMLCharField(_(u'currency'), blank=True, max_length=3,
                                 choices=codelist_choices(CURRENCY))
    value = models.DecimalField(_(u'interest received'), max_digits=10, decimal_places=2,
                                blank=True, null=True)

    def iati_currency(self):
        return codelist_value(Currency, self, 'loan_status_currency')

    class Meta:
        app_label = 'rsr'
        verbose_name = _(u'FSS forecast')
        verbose_name_plural = _(u'FSS forecasts')
