# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

from akvo.codelists.models import IndicatorMeasure, IndicatorVocabulary
from akvo.codelists.store.codelists_v202 import INDICATOR_MEASURE, INDICATOR_VOCABULARY
from akvo.rsr.fields import ValidXMLCharField, ValidXMLTextField
from akvo.rsr.mixins import TimestampsMixin
from akvo.utils import codelist_choices
from akvo.utils import codelist_value
from akvo.utils import rsr_image_path
from .result import Result

from decimal import Decimal, InvalidOperation, DivisionByZero

from django.conf import settings
from django.core.exceptions import ValidationError
from django.db import models
from django.utils.translation import ugettext_lazy as _
from django.db.models.signals import post_save
from django.dispatch import receiver

from sorl.thumbnail.fields import ImageField


class Indicator(models.Model):
    result = models.ForeignKey('Result', verbose_name=_(u'result'), related_name='indicators')
    parent_indicator = models.ForeignKey(
        'self', blank=True, null=True, default=None,
        verbose_name=_(u'parent indicator'), related_name='child_indicators'
    )
    title = ValidXMLCharField(
        _(u'indicator title'), blank=True, max_length=500,
        help_text=_(u'Within each result indicators can be defined. Indicators should be items '
                    u'that can be counted and evaluated as the project continues and is completed.')
    )
    measure = ValidXMLCharField(
        _(u'indicator measure'), blank=True, max_length=1,
        choices=codelist_choices(INDICATOR_MEASURE),
        help_text=_(u'Choose how the indicator will be measured (in percentage or units).')
    )
    ascending = models.NullBooleanField(
        _(u'ascending'), blank=True,
        help_text=_(u'Choose ascending if the target value of the indicator is higher than the '
                    u'baseline value (eg. people with access to sanitation). Choose descending if '
                    u'the target value of the indicator is lower than the baseline value '
                    u'(eg. people with diarrhea).'))
    description = ValidXMLCharField(
        _(u'indicator description'), blank=True, max_length=2000,
        help_text=_(u'You can provide further information of the indicator here.')
    )
    baseline_year = models.PositiveIntegerField(
        _(u'baseline year'), blank=True, null=True, max_length=4,
        help_text=_(u'The year the baseline value was taken.')
    )
    baseline_value = ValidXMLCharField(
        _(u'baseline value'), blank=True, max_length=50,
        help_text=_(u'The value of the baseline at the start of the project.')
    )
    baseline_comment = ValidXMLCharField(
        _(u'baseline comment'), blank=True, max_length=2000,
        help_text=_(u'Here you can provide extra information on the baseline value, if needed.')
    )
    order = models.PositiveSmallIntegerField(_(u'indicator order'), null=True, blank=True)
    default_periods = models.NullBooleanField(
        _(u'default indicator periods'), default=False, blank=True,
        help_text=_(u'Determines whether periods of indicator are used by default.')
    )

    def __unicode__(self):
        indicator_unicode = self.title if self.title else u'%s' % _(u'No indicator title')

        if self.periods.all():
            indicator_unicode += u' - %s %s' % (unicode(self.periods.count()),
                                                _(u'period(s)'))

        return indicator_unicode

    def save(self, *args, **kwargs):
        """Update the values of child indicators, if a parent indicator is updated."""
        # Update the values for an existing indicator
        if self.pk:
            for child_indicator in self.child_indicators.all():
                # Always copy title, measure and ascending. They should be the same as the parent.
                child_indicator.title = self.title
                child_indicator.measure = self.measure
                child_indicator.ascending = self.ascending

                # Only copy the description and baseline if the child has none (e.g. new)
                fields = ['description', 'baseline_year', 'baseline_value', 'baseline_comment']
                for field in fields:
                    parent_field_value = getattr(self, field)
                    if not getattr(child_indicator, field) and parent_field_value:
                        setattr(child_indicator, field, parent_field_value)

                child_indicator.save()

        # Create a new indicator when it's added
        else:
            for child_result in self.result.child_results.all():
                child_result.project.add_indicator(child_result, self)

            if Indicator.objects.filter(result_id=self.result.id).exists():
                prev_indicator = Indicator.objects.filter(result_id=self.result.id).reverse()[0]
                if prev_indicator.order:
                    self.order = prev_indicator.order + 1

        super(Indicator, self).save(*args, **kwargs)

    def clean(self):
        validation_errors = {}

        if self.pk and self.is_child_indicator():
            orig_indicator = Indicator.objects.get(pk=self.pk)

            # Don't allow some values to be changed when it is a child indicator
            if self.result != orig_indicator.result:
                validation_errors['result'] = u'%s' % \
                    _(u'It is not possible to update the result of this indicator, '
                      u'because it is linked to a parent result.')
            if self.title != orig_indicator.title:
                validation_errors['title'] = u'%s' % \
                    _(u'It is not possible to update the title of this indicator, '
                      u'because it is linked to a parent result.')
            if self.measure != orig_indicator.measure:
                validation_errors['measure'] = u'%s' % \
                    _(u'It is not possible to update the measure of this indicator, '
                      u'because it is linked to a parent result.')
            if self.ascending != orig_indicator.ascending:
                validation_errors['ascending'] = u'%s' % \
                    _(u'It is not possible to update the ascending value of this indicator, '
                      u'because it is linked to a parent result.')

        if validation_errors:
            raise ValidationError(validation_errors)

    def delete(self, *args, **kwargs):
        """
        Check if indicator is ordered manually, and cascade following indicators if needed
        """
        if self.order:
            sibling_indicators = Indicator.objects.filter(result_id=self.result.id)

            if not self == sibling_indicators.reverse()[0]:
                for ind in range(self.order + 1, len(sibling_indicators)):
                    sibling_indicators[ind].order -= 1
                    sibling_indicators[ind].save()

        super(Indicator, self).delete(*args, **kwargs)

    def iati_measure(self):
        return codelist_value(IndicatorMeasure, self, 'measure')

    def iati_measure_unicode(self):
        return str(self.iati_measure())

    def is_calculated(self):
        return self.result.project.is_impact_project

    def is_child_indicator(self):
        """
        Indicates whether this indicator is linked to a parent indicator.
        """
        return bool(self.parent_indicator)

    def is_parent_indicator(self):
        """
        Indicates whether this indicator has children.
        """
        return self.child_indicators.count() > 0

    @property
    def last_updated(self):
        from akvo.rsr.models import ProjectUpdate
        period_updates = ProjectUpdate.objects.filter(indicator_period__indicator=self)
        return period_updates.order_by('-created_at')[0].time_gmt if period_updates else None

    @property
    def baseline(self):
        """
        Returns the baseline value of the indicator, if it can be converted to a number. Otherwise
        it'll return None.
        """
        try:
            return Decimal(self.baseline_value)
        except (InvalidOperation, TypeError):
            return None

    @property
    def children_aggregate_percentage(self):
        """
        Returns True if this indicator has percentage as a measure and has children that aggregate
        to this indicator.
        """
        if self.measure == '2' and self.is_parent_indicator() and \
                self.result.project.aggregate_children and \
                any([ind.result.project.aggregate_to_parent for ind in self.child_indicators.all()]):
            return True
        return False

    class Meta:
        app_label = 'rsr'
        ordering = ['order', 'id']
        verbose_name = _(u'indicator')
        verbose_name_plural = _(u'indicators')


# Add default indicator periods if necessary
@receiver(post_save, sender=Indicator, dispatch_uid='add_default_periods')
def add_default_periods(sender, instance, created, **kwargs):
    if created:
        project = instance.result.project
        results = Result.objects.filter(project_id=project)
        default_indicator = Indicator.objects.filter(result_id__in=results,
                                                     default_periods=True).first()

        if default_indicator:
            default_periods = IndicatorPeriod.objects.filter(indicator_id=default_indicator)

            for period in default_periods:
                period.pk = None

                # Blank all values except id and locked status
                period.target_value = ''
                period.target_comment = ''
                period.actual_value = ''
                period.actual_comment = ''

                period.indicator_id = instance.id
                period.save()


class IndicatorReference(models.Model):
    indicator = models.ForeignKey(Indicator, verbose_name=_(u'indicator'),
                                  related_name='references')
    reference = ValidXMLCharField(
        _(u'reference code'), blank=True, max_length=25,
        help_text=_(u'A code for an indicator defined in the specified vocabulary specified. '
                    u'For more information on the indicator reference, see the '
                    u'<a href="http://iatistandard.org/202/activity-standard/iati-activities/'
                    u'iati-activity/result/indicator/reference/" target="_blank">IATI '
                    u'codelist</a>.'))
    vocabulary = ValidXMLCharField(
        _(u'reference vocabulary'), blank=True, max_length=2,
        choices=codelist_choices(INDICATOR_VOCABULARY),
        help_text=_(u'This is the code for the vocabulary used to describe the sector. Sectors '
                    u'should be mapped to DAC sectors to enable international comparison. '
                    u'For more information on the indicator reference, see the '
                    u'<a href="http://iatistandard.org/202/codelists/IndicatorVocabulary/" '
                    u'target="_blank">IATI codelist</a>.'))
    vocabulary_uri = ValidXMLCharField(
        _(u'reference indicator URI'), blank=True, max_length=1000,
        help_text=_(u'If the vocabulary is 99 (reporting organisation), the URI where this '
                    u'internal vocabulary is defined.'))

    class Meta:
        app_label = 'rsr'
        verbose_name = _(u'indicator reference')
        verbose_name_plural = _(u'indicator references')

    def __unicode__(self):
        return self.reference

    def iati_vocabulary(self):
        return codelist_value(IndicatorVocabulary, self, 'vocabulary')

    def iati_vocabulary_unicode(self):
        return str(self.iati_vocabulary())


class IndicatorPeriod(models.Model):
    indicator = models.ForeignKey(Indicator, verbose_name=_(u'indicator'), related_name='periods')
    parent_period = models.ForeignKey('self', blank=True, null=True, default=None,
                                      verbose_name=_(u'parent indicator period'),
                                      related_name='child_periods')
    locked = models.BooleanField(_(u'locked'), default=True, db_index=True)
    period_start = models.DateField(
        _(u'period start'), null=True, blank=True,
        help_text=_(u'The start date of the reporting period for this indicator.')
    )
    period_end = models.DateField(
        _(u'period end'), null=True, blank=True,
        help_text=_(u'The end date of the reporting period for this indicator.')
    )
    target_value = ValidXMLCharField(
        _(u'target value'), blank=True, max_length=50,
        help_text=_(u'The target value for the above period.')
    )
    target_comment = ValidXMLCharField(
        _(u'target value comment'), blank=True, max_length=2000,
        help_text=_(u'Here you can provide extra information on the target value, if needed.')
    )
    actual_value = ValidXMLCharField(
        _(u'actual value'), blank=True, max_length=50,
        help_text=_(u'A record of the achieved result for this period.')
    )
    actual_comment = ValidXMLCharField(
        _(u'actual value comment'), blank=True, max_length=2000,
        help_text=_(u'Here you can provide extra information on the actual value, if needed '
                    u'(for instance, why the actual value differs from the target value).')
    )

    def __unicode__(self):
        if self.period_start:
            period_unicode = unicode(self.period_start)
        else:
            period_unicode = u'%s' % _(u'No start date')

        if self.period_end:
            period_unicode += u' - %s' % unicode(self.period_end)
        else:
            period_unicode += u' - %s' % _(u'No end date')

        if self.actual_value or self.target_value:
            period_unicode += u' ('

            if self.actual_value and self.target_value:
                period_unicode += u'actual: %s / target: %s)' % (unicode(self.actual_value),
                                                                 unicode(self.target_value))
            elif self.actual_value:
                period_unicode += u'actual: %s)' % unicode(self.actual_value)
            else:
                period_unicode += u'target: %s)' % unicode(self.target_value)

        return period_unicode

    def save(self, *args, **kwargs):
        actual_value_changed = False

        # When the general information of a parent period is updated, this information should also
        # be reflected in the child periods.
        if self.pk:
            for child_period in self.child_periods.all():
                # Always copy period start and end. They should be the same as the parent.
                child_period.period_start = self.period_start
                child_period.period_end = self.period_end

                # Only copy the target value and comments if the child has no values (in case the
                # child period is new). Afterwards, it is possible to adjust these values (update
                # the target for the child, for instance) and then these values should not be
                # overwritten.
                if not child_period.target_value and self.target_value:
                    child_period.target_value = self.target_value
                if not child_period.target_comment and self.target_comment:
                    child_period.target_comment = self.target_comment

                child_period.save()

            # Check if the actual value has changed
            orig_period = IndicatorPeriod.objects.get(pk=self.pk)
            if orig_period.actual_value != self.actual_value:
                actual_value_changed = True

        # In case the period is new and the period's indicator does have child indicators, the (new)
        # period should also be copied to the child indicator.
        else:
            for child_indicator in self.indicator.child_indicators.all():
                child_indicator.result.project.add_period(child_indicator, self)

        super(IndicatorPeriod, self).save(*args, **kwargs)

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
                validation_errors['actual_value'] = u'%s' % \
                    _(u'It is not possible to update the actual value of this indicator period, '
                      u'because it is a calculated value. Please update the actual value through '
                      u'a new update.')

            # Don't allow some values to be changed when it is a child period
            if self.is_child_period():
                if self.indicator != orig_period.indicator:
                    validation_errors['indicator'] = u'%s' % \
                        _(u'It is not possible to update the indicator of this indicator period, '
                          u'because it is linked to a parent result.')
                if self.period_start != orig_period.period_start:
                    validation_errors['period_start'] = u'%s' % \
                        _(u'It is not possible to update the start period of this indicator, '
                          u'because it is linked to a parent result.')
                if self.period_end != orig_period.period_end:
                    validation_errors['period_end'] = u'%s' % \
                        _(u'It is not possible to update the end period of this indicator, '
                          u'because it is linked to a parent result.')

        # Don't allow a start date before an end date
        if self.period_start and self.period_end and (self.period_start > self.period_end):
            validation_errors['period_start'] = u'%s' % _(u'Period start cannot be at a later time '
                                                          u'than period end.')
            validation_errors['period_end'] = u'%s' % _(u'Period start cannot be at a later time '
                                                        u'than period end.')

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

        # If this period is a parent period, the sum or average of the children should be
        # re-calculated
        if not only_self and self.is_parent_period() and \
                self.indicator.result.project.aggregate_children:
            return self.recalculate_children(save)

        prev_val = '0'

        # For every approved update, add up the new value (if possible)
        for update in self.data.filter(status='A').order_by('created_at'):
            update.period_actual_value = prev_val
            update.save(recalculate=False)

            if update.relative_data:
                try:
                    # Try to add up the update to the previous actual value
                    prev_val = str(Decimal(prev_val) + Decimal(update.data))
                except InvalidOperation:
                    # If not possible, the update data or previous value is a normal string
                    prev_val = update.data
            else:
                prev_val = update.data

        # For every non-approved update, set the data to the current data
        for update in self.data.exclude(status='A'):
            update.period_actual_value = prev_val
            update.save(recalculate=False)

        # Special case: only_self and no data should give an empty string instead of '0'
        if only_self and not self.data.exists():
            prev_val = ''

        # Finally, update the actual value of the period itself
        if save:
            self.actual_value = prev_val
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
        if self.indicator.measure == '2':
            new_value = self.child_periods_average()
        else:
            new_value = self.child_periods_sum(include_self=True)

        if save:
            self.actual_value = new_value
            self.save()

        return new_value

    def update_actual_comment(self, save=True):
        """
        Set the actual comment to the text of the latest approved update.

        :param save; Boolean, save period if True
        :return Actual comment of period
        """

        approved_updates = self.data.filter(status=IndicatorPeriodData.STATUS_APPROVED_CODE)
        update_texts = [
            u'{}: {}'.format(update.last_modified_at.strftime('%d-%m-%Y'), update.text)
            for update in approved_updates.order_by('-created_at')
        ]
        actual_comment = u' | '.join(update_texts)
        if len(actual_comment) >= 2000:  # max_size
            actual_comment = u'{} ...'.format(actual_comment[:1995])

        self.actual_comment = actual_comment
        if save:
            self.save()

        return self.actual_comment

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

    def child_periods_with_data(self):
        """
        Returns the child indicator periods with numeric data
        """
        children_with_data = []
        for child in self.child_periods.all():
            try:
                Decimal(child.actual_value)
                children_with_data += [child.pk]
            except (InvalidOperation, TypeError):
                pass
        return self.child_periods.filter(pk__in=children_with_data)

    # TODO: refactor child_periods_sum() and child_periods_average() and child_periods_with_data(),
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
        for period in self.child_periods.all():
            if period.indicator.result.project.aggregate_to_parent and period.actual_value:
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

    def child_periods_average(self):
        """
        Returns the average of child indicator periods.

        :return String of the average
        """
        if self.indicator.result.project.aggregate_children:
            child_periods = self.child_periods_with_data()
            for child in child_periods:
                if not (child.indicator.result.project.aggregate_to_parent and child.actual_value):
                    child_periods = child_periods.exclude(pk=child.pk)

            number_of_child_periods = child_periods.count()
            if number_of_child_periods > 0:
                return str(Decimal(self.child_periods_sum()) / number_of_child_periods)
        return '0'

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
    def actual(self):
        """
        Returns the actual value of the indicator period, if it can be converted to a number.
        Otherwise it'll return the baseline value, which is a calculated value.
        """
        try:
            return Decimal(self.actual_value)
        except (InvalidOperation, TypeError):
            return self.actual_value if self.actual_value else self.baseline

    @property
    def target(self):
        """
        Returns the target value of the indicator period, if it can be converted to a number.
        Otherwise it'll return just the target value.
        """
        try:
            return Decimal(self.target_value)
        except (InvalidOperation, TypeError):
            return self.target_value

    @property
    def baseline(self):
        """
        Returns the baseline value of the indicator. The baseline is a calculated value:

        - If the period has no previous periods, then it's the baseline value of the indicator
        - If the period has a previous period, then it's the actual value of that period

        When this baseline value is empty, it returns 0. Otherwise (e.g. 'Available') it just
        returns the baseline value.
        """
        previous_period = self.adjacent_period(False)
        baseline = self.indicator.baseline_value if not previous_period else previous_period.actual

        if not baseline:
            return Decimal(0)
        else:
            try:
                return Decimal(baseline)
            except (InvalidOperation, TypeError):
                return baseline

    class Meta:
        app_label = 'rsr'
        verbose_name = _(u'indicator period')
        verbose_name_plural = _(u'indicator periods')
        ordering = ['period_start']


def image_path(instance, file_name):
    """
    Create a path like 'db/indicator_period/<period.id>/data_photo/<data.id>/image_name.ext'.

    :param instance; an IndicatorPeriodData instance
    :param file_name; the name of the file that is to be stored
    """
    path = 'db/indicator_period/%d/data_photo/%%(instance_pk)s/%%(file_name)s' % instance.period.pk
    return rsr_image_path(instance, file_name, path)


def file_path(instance, file_name):
    """
    Create a path like 'db/indicator_period/<period.id>/data_file/<data.id>/image_name.ext'.

    :param instance; an IndicatorPeriodData instance
    :param file_name; the name of the file that is to be stored
    """
    path = 'db/indicator_period/%d/data_file/%%(instance_pk)s/%%(file_name)s' % instance.period.pk
    return rsr_image_path(instance, file_name, path)


class IndicatorPeriodData(TimestampsMixin, models.Model):
    """
    Model for adding data to an indicator period.
    """
    STATUS_NEW = unicode(_(u'new'))
    STATUS_DRAFT = unicode(_(u'draft'))
    STATUS_PENDING = unicode(_(u'pending approval'))
    STATUS_REVISION = unicode(_(u'return for revision'))
    STATUS_APPROVED = unicode(_(u'approved'))

    STATUS_NEW_CODE = u'N'
    STATUS_DRAFT_CODE = u'D'
    STATUS_PENDING_CODE = u'P'
    STATUS_REVISION_CODE = u'R'
    STATUS_APPROVED_CODE = u'A'

    STATUS_CODES_LIST = [STATUS_NEW_CODE, STATUS_DRAFT_CODE, STATUS_PENDING_CODE,
                         STATUS_REVISION_CODE, STATUS_APPROVED_CODE]
    STATUSES_LABELS_LIST = [STATUS_NEW, STATUS_DRAFT, STATUS_PENDING, STATUS_REVISION,
                            STATUS_APPROVED]
    STATUSES = zip(STATUS_CODES_LIST, STATUSES_LABELS_LIST)

    UPDATE_METHODS = (
        ('W', _(u'web')),
        ('M', _(u'mobile')),
    )

    period = models.ForeignKey(IndicatorPeriod, verbose_name=_(u'indicator period'),
                               related_name='data')
    # TODO: rename to created_by when old results framework page is no longer in use
    user = models.ForeignKey(settings.AUTH_USER_MODEL, verbose_name=_(u'user'), db_index=True,
                             related_name='created_period_updates')
    approved_by = models.ForeignKey(
        settings.AUTH_USER_MODEL, verbose_name=_(u'approved by'), db_index=True,
        related_name='approved_period_updates',blank=True, null=True,
    )
    relative_data = models.BooleanField(_(u'relative data'), default=True)
    # TODO: rename to update or period_update; we're using the term Indicator update in the UI
    data = ValidXMLCharField(_(u'data'), max_length=300)
    period_actual_value = ValidXMLCharField(_(u'period actual value'), max_length=50, default='')
    status = ValidXMLCharField(_(u'status'), max_length=1, choices=STATUSES, db_index=True,
                               default=STATUS_NEW_CODE)
    text = ValidXMLTextField(_(u'text'), blank=True)
    photo = ImageField(_(u'photo'), blank=True, upload_to=image_path)
    file = models.FileField(_(u'file'), blank=True, upload_to=file_path)
    update_method = ValidXMLCharField(_(u'update method'), blank=True, max_length=1,
                                      choices=UPDATE_METHODS, db_index=True, default='W')

    class Meta:
        app_label = 'rsr'
        verbose_name = _(u'indicator period data')
        verbose_name_plural = _(u'indicator period data')

    def save(self, recalculate=True, *args, **kwargs):
        super(IndicatorPeriodData, self).save(*args, **kwargs)

        # In case the status is approved, recalculate the period
        if recalculate and self.status == self.STATUS_APPROVED_CODE:
            self.period.recalculate_period()
            self.period.update_actual_comment()

    def delete(self, *args, **kwargs):
        old_status = self.status

        super(IndicatorPeriodData, self).delete(*args, **kwargs)

        # In case the status was approved, recalculate the period
        if old_status == self.STATUS_APPROVED_CODE:
            self.period.recalculate_period()
            self.period.update_actual_comment()

    def clean(self):
        """
        Perform several checks before we can actually save the update data.
        """
        validation_errors = {}

        project = self.period.indicator.result.project

        # Don't allow a data update to an unpublished project
        if not project.is_published():
            validation_errors['period'] = unicode(_(u'Indicator period must be part of a published '
                                                    u'project to add data to it'))
            raise ValidationError(validation_errors)

        # Don't allow a data update to a non-Impact project
        if not project.is_impact_project:
            validation_errors['period'] = unicode(_(u'Indicator period must be part of an RSR '
                                                    u'Impact project to add data to it'))
            raise ValidationError(validation_errors)

        # Don't allow a data update to a locked period
        if self.period.locked:
            validation_errors['period'] = unicode(_(u'Indicator period must be unlocked to add '
                                                    u'data to it'))
            raise ValidationError(validation_errors)

        # Don't allow a data update to an aggregated parent period with 'percentage' as measurement
        if self.period.indicator.children_aggregate_percentage:
            validation_errors['period'] = unicode(
                _(u'Indicator period has an average aggregate of the child projects. Disable '
                  u'aggregations to add data to it'))
            raise ValidationError(validation_errors)

        if self.pk:
            orig = IndicatorPeriodData.objects.get(pk=self.pk)

            # Don't allow for the indicator period to change
            if orig.period != self.period:
                validation_errors['period'] = unicode(_(u'Not allowed to change indicator period '
                                                        u'in a data update'))
        if validation_errors:
            raise ValidationError(validation_errors)

    @property
    def status_display(self):
        """
        Returns the display of the status.
        """
        try:
            return dict(self.STATUSES)[self.status].capitalize()
        except KeyError:
            return u''

    @property
    def photo_url(self):
        """
        Returns the full URL of the photo.
        """
        return self.photo.url if self.photo else u''

    @property
    def file_url(self):
        """
        Returns the full URL of the file.
        """
        return self.file.url if self.file else u''

    def update_new_value(self):
        """
        Returns a string with the new value, taking into account a relative update.
        """
        if self.relative_data:
            try:
                add_up = Decimal(self.data) + Decimal(self.period_actual_value)
                relative = '+' + str(self.data) if self.data >= 0 else str(self.data)
                return "{} ({})".format(str(add_up), relative)
            except (InvalidOperation, TypeError):
                return self.data
        else:
            try:
                substract = Decimal(self.data) - Decimal(self.period_actual_value)
                relative = '+' + str(substract) if substract >= 0 else str(substract)
                return "{} ({})".format(self.data, relative)
            except (InvalidOperation, TypeError):
                return self.data


class IndicatorPeriodDataComment(TimestampsMixin, models.Model):
    """
    Model for adding comments to data of an indicator period.
    """
    data = models.ForeignKey(IndicatorPeriodData, verbose_name=_(u'indicator period data'),
                             related_name='comments')
    user = models.ForeignKey(settings.AUTH_USER_MODEL, verbose_name=_(u'user'), db_index=True)
    comment = ValidXMLTextField(_(u'comment'), blank=True)

    class Meta:
        app_label = 'rsr'
        verbose_name = _(u'indicator period data comment')
        verbose_name_plural = _(u'indicator period data comments')


class IndicatorPeriodTargetLocation(models.Model):
    period = models.ForeignKey(IndicatorPeriod, verbose_name=_(u'indicator period'),
                               related_name='target_locations')
    location = ValidXMLCharField(
        _(u'location'), blank=True, max_length=25,
        help_text=_(u'A location of the target of this indicator period. The location must be the '
                    u'reference of an existing location of the current project.'))

    class Meta:
        app_label = 'rsr'
        verbose_name = _(u'indicator period target location')
        verbose_name_plural = _(u'indicator period target locations')

    def __unicode__(self):
        return self.location


class IndicatorPeriodActualLocation(models.Model):
    period = models.ForeignKey(IndicatorPeriod, verbose_name=_(u'indicator period'),
                               related_name='actual_locations')
    location = ValidXMLCharField(
        _(u'location'), blank=True, max_length=25,
        help_text=_(u'A location of the actual of this indicator period. The location must be the '
                    u'reference of an existing location of the current project.'))

    class Meta:
        app_label = 'rsr'
        verbose_name = _(u'indicator period actual location')
        verbose_name_plural = _(u'indicator period actual locations')

    def __unicode__(self):
        return self.location


class IndicatorPeriodTargetDimension(models.Model):
    period = models.ForeignKey(IndicatorPeriod, verbose_name=_(u'indicator period'),
                               related_name='target_dimensions')
    name = ValidXMLCharField(
        _(u'dimension name'), blank=True, max_length=100,
        help_text=_(u'The name of a category being disaggregated in this target value of the '
                    u'indicator period (e.g. "Age").'))
    value = ValidXMLCharField(
        _(u'dimension value'), blank=True, max_length=100,
        help_text=_(u'The value that is being being disaggregated (e.g. "Older than 60 years").'))

    class Meta:
        app_label = 'rsr'
        verbose_name = _(u'indicator period target dimension')
        verbose_name_plural = _(u'indicator period target dimensions')

    def __unicode__(self):
        return self.name + ': ' + self.value if self.name and self.value else ''


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

    def __unicode__(self):
        return self.name + ': ' + self.value if self.name and self.value else ''
