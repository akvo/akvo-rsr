# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

from django.db import models
from django.utils.translation import ugettext_lazy as _


class IndicatorDisaggregationTarget(models.Model):
    project_relation = 'results__indicators__disaggregation_targets__in'

    indicator = models.ForeignKey(
        'Indicator', verbose_name=_('indicator'), related_name='disaggregation_targets'
    )

    dimension_value = models.ForeignKey(
        'IndicatorDimensionValue', null=True, related_name='indicator_disaggregation_targets'
    )

    value = models.DecimalField(
        _('disaggregation target value'),
        max_digits=20,
        decimal_places=2,
        blank=True,
        null=True
    )

    class Meta:
        app_label = 'rsr'
        verbose_name = _('indicator disaggregation target')
        verbose_name_plural = _('indicator disaggregation targets')
        ordering = ('id',)
