# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

from .indicator_period_data import IndicatorPeriodData

from akvo.rsr.fields import ValidXMLTextField
from akvo.rsr.mixins import TimestampsMixin, IndicatorUpdateMixin
from akvo.rsr.models.result.utils import PERCENTAGE_MEASURE, QUALITATIVE
from akvo.rsr.usecases.jobs.aggregation import schedule_aggregation_jobs

from django.db import models
from django.db.models import signals
from django.dispatch import receiver
from django.utils.translation import gettext_lazy as _


class Disaggregation(TimestampsMixin, IndicatorUpdateMixin, models.Model):
    """Model for storing a disaggregated value along one axis of a dimension."""

    # TODO: rename to dimension_axis of simply axis?
    dimension_value = models.ForeignKey(
        'IndicatorDimensionValue', on_delete=models.SET_NULL, null=True, related_name='disaggregations'
    )

    update = models.ForeignKey(IndicatorPeriodData,
                               on_delete=models.CASCADE,
                               verbose_name=_('indicator period update'),
                               related_name='disaggregations')

    # FIXME: Add a type to allow disaggregated values for target/baseline
    # type = models.CharField

    narrative = ValidXMLTextField(_('qualitative narrative'), blank=True)
    incomplete_data = models.BooleanField(_('disaggregation data is incomplete'), default=False)

    class Meta:
        app_label = 'rsr'
        verbose_name = _('disaggregated value')
        verbose_name_plural = _('disaggregated values')
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
            return False, sum([_f for _f in self.siblings().values_list('value', flat=True) if _f])

    def update_incomplete_data(self):
        percentage_measure, disaggregation_total = self.disaggregation_total()
        if not percentage_measure:
            incomplete_data = disaggregation_total != self.update.value
            self.siblings().update(incomplete_data=incomplete_data)

        else:
            numerator, denominator = disaggregation_total
            incomplete_data = (
                numerator != self.update.numerator
                or denominator != self.update.denominator)
            self.siblings().update(incomplete_data=incomplete_data)

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        if self.update.status == IndicatorPeriodData.STATUS_APPROVED_CODE:
            schedule_aggregation_jobs(self.update.period)

    def delete(self, *args, **kwargs):
        old_status = self.update.status
        period = self.update.period
        super().delete(*args, **kwargs)
        if old_status == IndicatorPeriodData.STATUS_APPROVED_CODE:
            schedule_aggregation_jobs(period)


@receiver(signals.post_save, sender=Disaggregation)
def mark_incomplete_disaggregations(sender, **kwargs):
    """Mark disaggregations as incomplete if they don't add up to the period value."""

    # Disable signal handler when loading fixtures
    if kwargs.get('raw', False):
        return

    disaggregation = kwargs['instance']
    if disaggregation.update.period.indicator.type == QUALITATIVE:
        return

    disaggregation.update_incomplete_data()


@receiver(signals.post_save, sender=IndicatorPeriodData)
def mark_incomplete_disaggregations_on_update_change(sender, **kwargs):
    """Mark disaggregations as incomplete if they don't add up to the period value."""

    # Disable signal handler when loading fixtures
    if kwargs.get('raw', False):
        return

    update = kwargs['instance']
    if update.period.indicator.type == QUALITATIVE:
        return

    # Get one disaggregation per dimension value
    disaggregations = {d.dimension_value_id: d for d in update.disaggregations.all()}
    for disaggregation in disaggregations.values():
        disaggregation.update_incomplete_data()
