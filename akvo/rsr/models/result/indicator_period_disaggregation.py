# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

from django.db import models
from akvo.rsr.mixins import TimestampsMixin, IndicatorUpdateMixin
from django.utils.translation import ugettext_lazy as _


class IndicatorPeriodDisaggregation(TimestampsMixin, IndicatorUpdateMixin, models.Model):
    """
    Model to hold aggregated disaggregation updates
    """

    project_relation = 'results__indicators__periods__disaggregations__in'

    period = models.ForeignKey(
        'IndicatorPeriod',
        verbose_name=_(u'indicator period'),
        related_name='disaggregations'
    )

    dimension_value = models.ForeignKey(
        'IndicatorDimensionValue',
        related_name='period_disaggregations'
    )

    class Meta:
        app_label = 'rsr'
        verbose_name = _(u'period disaggregation')
        verbose_name_plural = _(u'period disaggregations')
        ordering = ('id',)
