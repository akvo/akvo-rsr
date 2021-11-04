# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

from decimal import Decimal, InvalidOperation, DivisionByZero

from django.core.exceptions import ValidationError
from django.contrib.postgres.fields import ArrayField
from django.db import models
from django.utils.translation import ugettext_lazy as _

from .indicator_period_data import IndicatorPeriodData
from .utils import calculate_percentage, PERCENTAGE_MEASURE, QUALITATIVE
from akvo.rsr.fields import ValidXMLCharField, ValidXMLTextField


class IndicatorPeriod(models.Model):

    project_relation = 'results__indicators__periods__in'

    indicator = models.ForeignKey('Indicator', on_delete=models.CASCADE, verbose_name=_('indicator'), related_name='periods')
    parent_period = models.ForeignKey('self', on_delete=models.SET_NULL, blank=True, null=True, default=None,
                                      verbose_name=_('parent indicator period'),
                                      related_name='child_periods')
    locked = models.BooleanField(_('locked'), default=True, db_index=True)
    period_start = models.DateField(
        _('period start'), null=True, blank=True,
        help_text=_('The start date of the reporting period for this indicator.')
    )
    period_end = models.DateField(
        _('period end'), null=True, blank=True,
        help_text=_('The end date of the reporting period for this indicator.')
    )
    target_value = ValidXMLCharField(
        _('target value'), blank=True, max_length=50,
        help_text=_('The target value for the above period.')
    )
    target_comment = ValidXMLCharField(
        _('target value comment'), blank=True, max_length=2000,
        help_text=_('Here you can provide extra information on the target value, if needed.')
    )
    target_score = models.SmallIntegerField(_('target score'), null=True, blank=True)
    actual_value = ValidXMLCharField(
        _('actual value'), blank=True, max_length=50,
        help_text=_('A record of the achieved result for this period.')
    )
    actual_comment = ValidXMLCharField(
        _('actual value comment'), blank=True, max_length=2000,
        help_text=_('Here you can provide extra information on the actual value, if needed '
                    '(for instance, why the actual value differs from the target value).')
    )
    numerator = models.DecimalField(
        _('numerator for indicator'),
        max_digits=20, decimal_places=2,
        null=True, blank=True,
        help_text=_('The numerator for a calculated percentage')
    )
    denominator = models.DecimalField(
        _('denominator for indicator'),
        max_digits=20, decimal_places=2,
        null=True, blank=True,
        help_text=_('The denominator for a calculated percentage')
    )
    narrative = ValidXMLTextField(_('qualitative indicator narrative'), blank=True)
    score_index = models.SmallIntegerField(_('score index'), null=True, blank=True)
    score_indices = ArrayField(models.SmallIntegerField(), default=[])

    label = models.ForeignKey('IndicatorPeriodLabel', null=True,
                              verbose_name=_('label'), related_name='periods',
                              on_delete=models.deletion.SET_NULL)

    def __str__(self):
        if self.period_start:
            period_unicode = str(self.period_start)
        else:
            period_unicode = '%s' % _('No start date')

        if self.period_end:
            period_unicode += ' - %s' % str(self.period_end)
        else:
            period_unicode += ' - %s' % _('No end date')

        if self.actual_value or self.target_value:
            period_unicode += ' ('

            if self.actual_value and self.target_value:
                period_unicode += 'actual: %s / target: %s)' % (str(self.actual_value),
                                                                str(self.target_value))
            elif self.actual_value:
                period_unicode += 'actual: %s)' % str(self.actual_value)
            else:
                period_unicode += 'target: %s)' % str(self.target_value)

        return period_unicode

    def save(self, *args, **kwargs):
        actual_value_changed = False
        new_period = not self.pk

        if (
            self.indicator.measure == PERCENTAGE_MEASURE
            and self.numerator is not None
            and self.denominator not in {0, '0', None}
        ):
            percentage = calculate_percentage(self.numerator, self.denominator)
            self.actual_value = str(percentage)

        if not new_period:
            # Check if the actual value has changed
            orig_period = IndicatorPeriod.objects.get(pk=self.pk)
            if orig_period.actual_value != self.actual_value:
                actual_value_changed = True

        super(IndicatorPeriod, self).save(*args, **kwargs)

        child_indicators = self.indicator.child_indicators.select_related(
            'result',
            'result__project',
        )

        for child_indicator in child_indicators.all():
            if new_period:
                child_indicator.result.project.copy_period(child_indicator, self, set_parent=True)
            else:
                child_indicator.result.project.update_period(child_indicator, self)

        # If the actual value has changed, the period has a parent period and aggregations are on,
        # then the the parent should be updated as well
        if actual_value_changed and self.is_child_period() and \
                self.parent_period.indicator.result.project.aggregate_children and \
                self.indicator.result.project.aggregate_to_parent:
            self.parent_period.recalculate_period()

    def clean(self):
        validation_errors = {}

        if self.pk:
            orig_period = IndicatorPeriod.objects.get(pk=self.pk)

            # Don't allow an actual value to be changed when the indicator period is calculated
            if self.is_calculated() and self.actual_value != orig_period.actual_value:
                validation_errors['actual_value'] = '%s' % \
                    _('It is not possible to update the actual value of this indicator period, '
                      'because it is a calculated value. Please update the actual value through '
                      'a new update.')

            # Don't allow some values to be changed when it is a child period
            if self.is_child_period():
                if self.indicator != orig_period.indicator:
                    validation_errors['indicator'] = '%s' % \
                        _('It is not possible to update the indicator of this indicator period, '
                          'because it is linked to a parent result.')
                if self.period_start != orig_period.period_start:
                    validation_errors['period_start'] = '%s' % \
                        _('It is not possible to update the start period of this indicator, '
                          'because it is linked to a parent result.')
                if self.period_end != orig_period.period_end:
                    validation_errors['period_end'] = '%s' % \
                        _('It is not possible to update the end period of this indicator, '
                          'because it is linked to a parent result.')

        # Don't allow a start date before an end date
        if self.period_start and self.period_end and (self.period_start > self.period_end):
            validation_errors['period_start'] = '%s' % _('Period start cannot be at a later time '
                                                         'than period end.')
            validation_errors['period_end'] = '%s' % _('Period start cannot be at a later time '
                                                       'than period end.')

        # TODO: add validation that prevents creating a period for a child indicator
        if validation_errors:
            raise ValidationError(validation_errors)

    def recalculate_period(self, save=True, only_self=False):
        """
        Re-calculate the values of all updates from the start. This will prevent strange values,
        for example when an update is deleted or edited after it has been approved.

        :param save; Boolean, saves actual value to period if True
        :param only_self; Boolean, to take into account if this is a parent or just re-calculate
        this period only
        :return Actual value of period
        """

        # If this period is a parent period, the sum or average of the children
        # should be re-calculated
        if not only_self and self.is_parent_period() and \
                self.indicator.result.project.aggregate_children:
            return self.recalculate_children(save)

        prev_val = '0'
        if self.indicator.measure == PERCENTAGE_MEASURE:
            prev_num = '0'
            prev_den = '0'

        # For every approved update, add up the new value (if possible)
        for update in self.data.filter(status='A').order_by('created_at'):
            if self.indicator.measure == PERCENTAGE_MEASURE:
                update.period_numerator = prev_num
                update.period_denominator = prev_den
            update.period_actual_value = prev_val
            update.save(recalculate=False)

            if update.value is None:
                continue

            try:
                # Try to add up the update to the previous actual value
                if self.indicator.measure == PERCENTAGE_MEASURE:
                    prev_num = str(Decimal(prev_num) + Decimal(update.numerator))
                    prev_den = str(Decimal(prev_den) + Decimal(update.denominator))
                    prev_val = str(calculate_percentage(float(prev_num), float(prev_den)))
                else:
                    prev_val = str(Decimal(prev_val) + Decimal(update.value))
            except (InvalidOperation, TypeError):
                # If not possible, the update data or previous value is a normal string
                if self.indicator.measure == PERCENTAGE_MEASURE:
                    prev_num = update.numerator
                    prev_den = update.denominator
                prev_val = update.value

        # For every non-approved update, set the value to the current value
        for update in self.data.exclude(status='A'):
            update.period_actual_value = prev_val
            if self.indicator.measure == PERCENTAGE_MEASURE:
                update.period_numerator = prev_num
                update.period_denominator = prev_den
            update.save(recalculate=False)

        # Special case: only_self and no data should give an empty string instead of '0'
        if only_self and not self.data.exists():
            prev_val = ''
            # FIXME: Do we need a special case here with numerator and denominator???

        # Finally, update the actual value of the period itself
        if save:
            self.actual_value = prev_val
            if self.indicator.measure == PERCENTAGE_MEASURE:
                self.numerator = prev_num
                self.denominator = prev_den
            self.save()

        # Return the actual value of the period itself
        return prev_val

    def recalculate_children(self, save=True):
        """
        Re-calculate the actual value of this period based on the actual values of the child
        periods.

        In case the measurement is 'Percentage', it should be an average of all child periods.
        Otherwise, the child period values can just be added up.

        :param save; Boolean, saves to period if True
        :return Actual value of period
        """
        if self.indicator.measure == PERCENTAGE_MEASURE:
            numerator, denominator = self.child_periods_percentage()
            new_value = calculate_percentage(numerator, denominator)
        else:
            new_value = self.child_periods_sum(include_self=True)

        if save:
            self.actual_value = new_value
            if self.indicator.measure == PERCENTAGE_MEASURE:
                self.numerator = numerator
                self.denominator = denominator
            self.save()

        return new_value

    def update_actual_comment(self, save=True):
        """
        Set the actual comment to the text of the latest approved update.

        :param save; Boolean, save period if True
        :return Actual comment of period
        """
        update_texts = [
            '{}: {}'.format(update.last_modified_at.strftime('%d-%m-%Y'), update.text)
            for update in self.approved_updates.order_by('-created_at')
            if update.text.strip()
        ]
        actual_comment = ' | '.join(update_texts)
        if len(actual_comment) >= 2000:  # max_size
            actual_comment = '{} ...'.format(actual_comment[:1995])

        self.actual_comment = actual_comment
        if save:
            self.save()

        return self.actual_comment

    def update_score(self, save=True):
        """Set the score of the period to the score of the latest approved update."""

        if self.indicator.type != QUALITATIVE or not self.indicator.scores:
            return

        latest_update = self.approved_updates.order_by('-created_at').first()
        score_index = latest_update.score_index if latest_update is not None else None
        score_changed = self.score_index != score_index
        self.score_index = score_index

        if score_changed and save:
            self.save(update_fields=['score_index'])

        score_indices = latest_update.score_indices if latest_update is not None else []
        score_indices_changed = self.score_indices != score_indices
        self.score_indices = score_indices

        if score_indices_changed and save:
            self.save(update_fields=['score_indices'])

    def is_calculated(self):
        """
        When a period has got indicator updates, we consider the actual value to be a
        'calculated' value, meaning that it's not possible to update the actual value directly.
        Only through indicator updates.
        """
        return self.data.exists()

    def actual_value_is_decimal(self):

        try:
            Decimal(self.actual_value)
            return True
        except (InvalidOperation, TypeError):
            return not self.actual_value

    def is_child_period(self):
        """
        Indicates whether this period is linked to a parent period
        """
        return bool(self.parent_period)

    def is_parent_period(self):
        """
        Indicates whether this result has child periods linked to it.
        """
        return self.child_periods.count() > 0

    def can_save_update(self, update_id=None):
        """Return True if an update can be created/updated on the indicator period.

        If no update_id is passed, we check if a new update can be created. If
        an update_id is passed, we verify that the update can be modified.

        Non percentage indicators can have multiple updates. If the indicator
        is a percentage indicator, we check that no other update is present,
        other than the one currently being created or changed.

        """
        return (
            self.indicator.measure != PERCENTAGE_MEASURE
            or self.data.exclude(id=update_id).count() == 0
        )

    def child_periods_with_data(self, only_aggregated=False):
        """
        Returns the child indicator periods with numeric values
        """
        children_with_data = []
        for child in self.child_periods.all():
            try:
                Decimal(child.actual_value)
                children_with_data += [child.pk]
            except (InvalidOperation, TypeError):
                pass
        child_periods = self.child_periods.filter(pk__in=children_with_data)
        if only_aggregated:
            child_periods = child_periods.filter(
                indicator__result__project__aggregate_to_parent=True
            )
        return child_periods

    # TODO: refactor child_periods_sum() and child_periods_with_data(),
    # they use each other in very inefficient ways I think
    def child_periods_sum(self, include_self=False):
        """
        Returns the sum of child indicator periods.

        :param include_self; Boolean to include the updates on the period itself, as well as its'
        children
        :return String of the sum
        """
        period_sum = 0

        # Loop through the child periods and sum up all the values
        for period in self.child_periods_with_data(only_aggregated=True):
            try:
                period_sum += Decimal(period.actual_value)
            except (InvalidOperation, TypeError):
                pass

        if include_self:
            try:
                period_sum += Decimal(self.recalculate_period(save=False, only_self=True))
            except (InvalidOperation, TypeError):
                pass

        return str(period_sum)

    def child_periods_percentage(self):
        """Returns percentage calculated from the child periods.

        :return String of numerator and denominator

        """
        period_numerator = 0
        period_denominator = 0
        for period in self.child_periods_with_data(only_aggregated=True):
            try:
                period_numerator += Decimal(period.numerator)
                period_denominator += Decimal(period.denominator)
            except (InvalidOperation, TypeError):
                pass
        return str(period_numerator), str(period_denominator)

    def adjacent_period(self, next_period=True):
        """
        Returns the next or previous indicator period, if we can find one with a start date,
        and we have a start date ourselves.

        :param next_period; Boolean indicating either the next (True) or previous (False) period.
        """
        if not self.period_start:
            return None
        elif next_period:
            return self.indicator.periods.exclude(period_start=None).filter(
                period_start__gt=self.period_start).order_by('period_start').first()
        else:
            return self.indicator.periods.exclude(period_start=None).filter(
                period_start__lt=self.period_start).order_by('-period_start').first()

    @property
    def percent_accomplishment(self):
        """
        Return the percentage completed for this indicator period. If not possible to convert the
        values to numbers, return None.
        """
        try:
            return round(Decimal(self.actual_value) / Decimal(self.target_value) * 100, 1)
        except (InvalidOperation, TypeError, DivisionByZero):
            return None

    @property
    def percent_accomplishment_100(self):
        """
        Similar to the percent_accomplishment property. However, it won't return any number bigger
        than 100.
        """
        return max(self.percent_accomplishment, 100) if self.percent_accomplishment else None

    @property
    def approved_updates(self):
        return self.data.filter(status=IndicatorPeriodData.STATUS_APPROVED_CODE)

    class Meta:
        app_label = 'rsr'
        verbose_name = _('indicator period')
        verbose_name_plural = _('indicator periods')
        ordering = ['period_start', 'period_end']
        unique_together = ('indicator', 'parent_period')
