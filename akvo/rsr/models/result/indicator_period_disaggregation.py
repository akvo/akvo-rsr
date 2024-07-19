# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

from django.db import models
from django.db.models import signals
from django.dispatch import receiver
from akvo.rsr.mixins import TimestampsMixin, IndicatorUpdateMixin
from django.utils.translation import gettext_lazy as _


class IndicatorPeriodDisaggregation(TimestampsMixin, IndicatorUpdateMixin, models.Model):
    """
    Model to hold aggregated disaggregation updates
    """

    project_relation = 'results__indicators__periods__disaggregations__in'

    period = models.ForeignKey(
        'IndicatorPeriod',
        on_delete=models.CASCADE,
        verbose_name=_('indicator period'),
        related_name='disaggregations'
    )

    dimension_value = models.ForeignKey(
        'IndicatorDimensionValue',
        on_delete=models.CASCADE,
        related_name='period_disaggregations'
    )

    class Meta:
        app_label = 'rsr'
        verbose_name = _('period disaggregation')
        verbose_name_plural = _('period disaggregations')
        ordering = ('id',)


@receiver(signals.post_save, sender=IndicatorPeriodDisaggregation)
def handle_disaggregation_contribution_up_to_parent_hierarchy(sender, **kwargs):

    # Disable signal handler when loading fixtures
    if kwargs.get('raw', False):
        return

    from .disaggregation_contribution_handler import DisaggregationContributionHandler
    from .disaggregation_contribution import DisaggregationContribution

    disaggregation = kwargs['instance']
    handler = DisaggregationContributionHandler(
        IndicatorPeriodDisaggregation.objects,
        DisaggregationContribution.objects
    )

    handler.handle(disaggregation)
