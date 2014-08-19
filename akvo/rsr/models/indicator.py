# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


from django.db import models
from django.utils.translation import ugettext_lazy as _

from akvo.rsr.fields import ValidXMLCharField
from akvo.rsr.iati.codelists import codelists_v104 as codelists


class Indicator(models.Model):
    result = models.ForeignKey('Result', verbose_name=_(u'result'), related_name='indicators')
    title = ValidXMLCharField(_(u'title'), blank=True, max_length=255, help_text=_(u'(max 255 characters)'))
    measure = ValidXMLCharField(_(u'measure'), blank=True, max_length=1, choices=codelists.INDICATOR_MEASURE)
    ascending = models.NullBooleanField(_(u'ascending'), blank=True)
    description = ValidXMLCharField(_(u'description'), blank=True, max_length=255, help_text=_(u'(max 255 characters)'))
    description_type = ValidXMLCharField(
        _(u'description type'), blank=True, max_length=1, choices=[code[:2] for code in codelists.DESCRIPTION_TYPE]
    )
    baseline_year = models.PositiveIntegerField(_(u'baseline year'), blank=True, max_length=4)
    baseline_value = ValidXMLCharField(
        _(u'baseline value'), blank=True, max_length=50, help_text=_(u'(max 50 characters)')
    )
    baseline_comment = ValidXMLCharField(
        _(u'baseline comment'), blank=True, max_length=255, help_text=_(u'(max 255 characters)')
    )

    def __unicode__(self):
        return self.title

    class Meta:
        app_label = 'rsr'
        verbose_name = _(u'indicator')
        verbose_name_plural = _(u'indicators')


class IndicatorPeriod(models.Model):
    indicator = models.ForeignKey(Indicator, verbose_name=_(u'indicator'), related_name='periods')
    period_start = models.DateField(_(u'period start'), null=True, blank=True)
    period_end = models.DateField(_(u'period end'), null=True, blank=True)
    target_value = ValidXMLCharField(_(u'target value'), blank=True, max_length=50, help_text=_(u'(max 50 characters)'))
    target_comment = ValidXMLCharField(
        _(u'target comment'), blank=True, max_length=255, help_text=_(u'(max 255 characters)')
    )
    actual_value = ValidXMLCharField(_(u'actual value'), blank=True, max_length=50, help_text=_(u'(max 50 characters)'))
    actual_comment = ValidXMLCharField(
        _(u'actual comment'), blank=True, max_length=255, help_text=_(u'(max 255 characters)')
    )

    def __unicode__(self):
        return self.indicator.__unicode__()

    class Meta:
        app_label = 'rsr'
        verbose_name = _(u'indicator period')
        verbose_name_plural = _(u'indicator periods')