# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

from indicator_period import IndicatorPeriod

from akvo.rsr.fields import ValidXMLCharField

from django.db import models
from django.utils.translation import ugettext_lazy as _


class IndicatorPeriodActualDimension(models.Model):
    period = models.ForeignKey(IndicatorPeriod, verbose_name=_(u'indicator period'),
                               related_name='actual_dimensions')
    name = ValidXMLCharField(
        _(u'dimension name'), blank=True, max_length=100,
        help_text=_(u'The name of a category being disaggregated in this actual value of the '
                    u'indicator period (e.g. "Age").'))
    value = ValidXMLCharField(
        _(u'dimension value'), blank=True, max_length=100,
        help_text=_(u'The value that is being being disaggregated (e.g. "Older than 60 years").'))

    class Meta:
        app_label = 'rsr'
        verbose_name = _(u'indicator period actual dimension')
        verbose_name_plural = _(u'indicator period actual dimensions')
        ordering = ('pk',)

    def __unicode__(self):
        return self.name + ': ' + self.value if self.name and self.value else ''
