# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

from django.db import models
from akvo.rsr.mixins import TimestampsMixin
from django.utils.translation import ugettext_lazy as _


class IndicatorPeriodDisaggregation(TimestampsMixin, models.Model):
    """
    Model to hold aggregated disaggregation updates
    """

    period = models.ForeignKey(
        'IndicatorPeriod',
        verbose_name=_(u'indicator period'),
        related_name='disaggregations'
    )

    dimension_value = models.ForeignKey(
        'IndicatorDimensionValue',
        related_name='period_disaggregations'
    )

    value = models.DecimalField(
        _(u'quantitative disaggregated value'),
        max_digits=20,
        decimal_places=2,
        blank=True,
        null=True
    )
    numerator = models.DecimalField(
        _(u'numerator for indicator'),
        max_digits=20, decimal_places=2,
        null=True, blank=True,
        help_text=_(u'The numerator for a percentage value')
    )
    denominator = models.DecimalField(
        _(u'denominator for indicator'),
        max_digits=20, decimal_places=2,
        null=True, blank=True,
        help_text=_(u'The denominator for a percentage value')
    )

    class Meta:
        app_label = 'rsr'
        verbose_name = _(u'period disaggregation')
        verbose_name_plural = _(u'period disaggregations')
        ordering = ('id',)
