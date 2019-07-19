# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

from .indicator_period_data import IndicatorPeriodData

from akvo.rsr.fields import ValidXMLTextField
from akvo.rsr.mixins import TimestampsMixin
from akvo.rsr.models.result.utils import PERCENTAGE_MEASURE, QUALITATIVE

from django.db import models
from django.db.models import signals
from django.dispatch import receiver
from django.utils.translation import ugettext_lazy as _


class Disaggregation(TimestampsMixin, models.Model):
    """Model for storing a disaggregated value along one axis of a dimension."""

    # TODO: rename to dimension_axis of simply axis?
    dimension_value = models.ForeignKey(
        'IndicatorDimensionValue', null=True, related_name='disaggregations'
    )

    update = models.ForeignKey(IndicatorPeriodData,
                               verbose_name=_(u'indicator period update'),
                               related_name='disaggregations')

    # FIXME: Add a type to allow disaggregated values for target/baseline
    # type = models.CharField

    # NOTE: corresponding value field on Update is still a CharField
    value = models.DecimalField(
        _(u'quantitative disaggregated value'),
        max_digits=20,
        decimal_places=2,
        blank=True,
        null=True
    )
    narrative = ValidXMLTextField(_(u'qualitative narrative'), blank=True)
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
    incomplete_data = models.BooleanField(_(u'disaggregation data is incomplete'), default=False)

    class Meta:
        app_label = 'rsr'
        verbose_name = _(u'disaggregated value')
        verbose_name_plural = _(u'disaggregated values')
        ordering = ('id',)

    def siblings(self):
        return Disaggregation.objects.filter(update=self.update, dimension_value__name=self.dimension_value.name)

    def disaggregation_total(self):
        if self.update.period.indicator.type == QUALITATIVE:
            raise NotImplementedError

        if self.update.period.indicator.measure == PERCENTAGE_MEASURE:
            values = self.siblings().values_list('numerator', 'denominator')
            numerator_sum = sum(numerator for (numerator, _) in values if numerator is not None)
            denominator_sum = sum(denominator for (_, denominator) in values if denominator is not None)
            return True, (numerator_sum, denominator_sum)
        else:
            return False, sum(filter(None, self.siblings().values_list('value', flat=True)))

    def update_incomplete_data(self):
        percentage_measure, disaggregation_total = self.disaggregation_total()
        if not percentage_measure:
            incomplete_data = disaggregation_total != self.update.value
            self.siblings().update(incomplete_data=incomplete_data)

        else:
            numerator, denominator = disaggregation_total
            incomplete_data = (
                numerator != self.update.numerator or
                denominator != self.update.denominator)
            self.siblings().update(incomplete_data=incomplete_data)


@receiver(signals.post_save, sender=Disaggregation)
def aggregate_period_disaggregation_up_to_parent_hierarchy(sender, **kwargs):

    from .disaggregation_aggregation import DisaggregationAggregation
    from .indicator_period_disaggregation import IndicatorPeriodDisaggregation

    disaggregation = kwargs['instance']
    disaggregation_aggregation = DisaggregationAggregation(
        Disaggregation.objects,
        IndicatorPeriodDisaggregation.objects
    )
    disaggregation_aggregation.aggregate(
        disaggregation.update.period,
        disaggregation.dimension_value
    )


@receiver(signals.post_save, sender=Disaggregation)
def mark_incomplete_disaggregations(sender, **kwargs):
    """Mark disaggregations as incomplete if they don't add up to the period value."""

    disaggregation = kwargs['instance']
    if disaggregation.update.period.indicator.type == QUALITATIVE:
        return

    disaggregation.update_incomplete_data()


@receiver(signals.post_save, sender=IndicatorPeriodData)
def mark_incomplete_disaggregations_on_update_change(sender, **kwargs):
    """Mark disaggregations as incomplete if they don't add up to the period value."""

    update = kwargs['instance']
    if update.period.indicator.type == QUALITATIVE:
        return

    # Get one disaggregation per dimension value
    disaggregations = {d.dimension_value_id: d for d in update.disaggregations.all()}
    for disaggregation in disaggregations.values():
        disaggregation.update_incomplete_data()
