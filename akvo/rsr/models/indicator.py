# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

from akvo.codelists.models import IndicatorMeasure
from akvo.codelists.store.codelists_v201 import INDICATOR_MEASURE
from akvo.rsr.fields import ValidXMLCharField, ValidXMLTextField
from akvo.rsr.mixins import TimestampsMixin
from akvo.utils import codelist_choices, codelist_value, rsr_image_path, rsr_send_mail

from decimal import Decimal, InvalidOperation, DivisionByZero

from django.conf import settings
from django.contrib.auth.models import Group
from django.core.exceptions import FieldError, ValidationError
from django.db import models
from django.utils.translation import ugettext_lazy as _

from sorl.thumbnail.fields import ImageField


class Indicator(models.Model):
    result = models.ForeignKey('Result', verbose_name=_(u'result'), related_name='indicators')
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
            orig_indicator = Indicator.objects.get(pk=self.pk)
            child_indicators = Indicator.objects.filter(
                result__in=self.result.child_results.all(),
                title=orig_indicator.title,
                measure=orig_indicator.measure,
                ascending=orig_indicator.ascending
            )

            for child_indicator in child_indicators:
                # Always copy title, measure and ascending. They should be the same as the parent.
                child_indicator.title = self.title
                child_indicator.measure = self.measure
                child_indicator.ascending = self.ascending

                # Only copy the description and baseline if the child has none (e.g. new)
                if not child_indicator.description and self.description:
                    child_indicator.description = self.description
                if not child_indicator.baseline_year and self.baseline_year:
                    child_indicator.baseline_year = self.baseline_year
                if not child_indicator.baseline_value and self.baseline_value:
                    child_indicator.baseline_value = self.baseline_value
                if not child_indicator.baseline_comment and self.baseline_comment:
                    child_indicator.baseline_comment = self.baseline_comment

                child_indicator.save()

        # Create a new indicator when it's added
        else:
            for child_result in self.result.child_results.all():
                child_result.project.add_indicator(child_result, self)

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

    def iati_measure(self):
        return codelist_value(IndicatorMeasure, self, 'measure')

    def is_calculated(self):
        return self.result.project.is_impact_project

    def is_child_indicator(self):
        """
        Indicates whether this indicator is linked to a parent result.
        """
        return True if self.result.parent_result else False

    def parent_indicator(self):
        """
        Returns the parent indicator or None.
        """
        if self.is_child_indicator():
            matching_indicators = Indicator.objects.filter(
                result=self.result.parent_result,
                title=self.title,
                measure=self.measure,
                ascending=self.ascending
            )
            if matching_indicators:
                return matching_indicators.first()
        return None

    def is_parent_indicator(self):
        """
        Indicates whether this indicator has children.
        """
        return True if self.child_indicators() else False

    def child_indicators(self):
        """
        Returns the child indicators of this indicator.
        """
        child_results = self.result.child_results.all()
        return Indicator.objects.filter(
            result__in=child_results,
            title=self.title,
            measure=self.measure,
            ascending=self.ascending
        )

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

    class Meta:
        app_label = 'rsr'
        verbose_name = _(u'indicator')
        verbose_name_plural = _(u'indicators')


class IndicatorPeriod(models.Model):
    indicator = models.ForeignKey(Indicator, verbose_name=_(u'indicator'), related_name='periods')
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
        """Update the values of child periods, if a parent period is updated."""
        # Update period when it's edited
        if self.pk:
            orig_period = IndicatorPeriod.objects.get(pk=self.pk)
            child_results = self.indicator.result.child_results.all()
            child_periods = IndicatorPeriod.objects.filter(
                indicator__result__in=child_results,
                period_start=orig_period.period_start,
                period_end=orig_period.period_end
            )

            for child_period in child_periods:
                # Always copy period start and end. They should be the same as the parent.
                child_period.period_start = self.period_start
                child_period.period_end = self.period_end

                # Only copy the target value and comments if the child has no values (e.g. new)
                if not child_period.target_value and self.target_value:
                    child_period.target_value = self.target_value
                if not child_period.target_comment and self.target_comment:
                    child_period.target_comment = self.target_comment
                if not child_period.target_value and self.target_value:
                    child_period.target_value = self.target_value

                child_period.save()

        # Create a new period when it's added
        else:
            for child_indicator in self.indicator.child_indicators():
                child_indicator.result.project.add_period(child_indicator, self)

        super(IndicatorPeriod, self).save(*args, **kwargs)

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

        if validation_errors:
            raise ValidationError(validation_errors)

    def is_calculated(self):
        """
        When a project is set as an RSR Impact project, the actual values of the indicator
        periods are calculated through updates.
        """
        return self.indicator.result.project.is_impact_project

    def is_child_period(self):
        """
        Indicates whether this result is linked to a parent result.
        """
        return True if self.indicator.result.parent_result else False

    def parent_period(self):
        """
        Returns the parent indicator period, in case this period is a child period.
        """
        if self.is_child_period():
            matching_periods = IndicatorPeriod.objects.filter(
                indicator__result=self.indicator.result.parent_result,
                period_start=self.period_start,
                period_end=self.period_end
            )
            if matching_periods.exists():
                return matching_periods.first()
        return None

    def is_parent_period(self):
        """
        Indicates whether this result has child periods linked to it.
        """
        return True if self.child_periods() else False

    def child_periods(self):
        """
        Returns the child indicator periods, in case this period is a parent period.
        """
        child_results = self.indicator.result.child_results.all()
        return IndicatorPeriod.objects.filter(
            indicator__result__in=child_results,
            period_start=self.period_start,
            period_end=self.period_end
        )

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

    def update_actual_value(self, data, relative_data):
        """
        Updates the actual value of this period and related periods (parent period and next period).

        :param data; String or Integer that represents the new actual value data of the period
        :param relative_data; Boolean indicating whether the data should be updated based on the
        relative value of the current actual value (True) or overwrite the actual value (False)
        """
        self.actual_value = str(self.actual + Decimal(data)) if relative_data else data
        self.save(update_fields=['actual_value'])

        # Update parent period
        parent = self.parent_period()
        if parent:
            parent.update_actual_value(data, relative_data)

    @property
    def percent_accomplishment(self):
        """
        Return the percentage completed for this indicator period. If not possible to convert the
        values to numbers, return None.
        """
        if not (self.target_value and self.actual_value):
            return None

        try:
            return round(
                (Decimal(self.actual_value) - Decimal(self.baseline)) /
                (Decimal(self.target_value) - Decimal(self.baseline)) *
                100, 1
            )
        except (InvalidOperation, TypeError, DivisionByZero):
            return None

    @property
    def percent_accomplishment_100(self):
        """
        Similar to the percent_accomplishment property. However, it won't return any number bigger
        than 100.
        """
        if self.percent_accomplishment and self.percent_accomplishment > 100:
            return 100
        return self.percent_accomplishment

    @property
    def actual(self):
        """
        Returns the actual value of the indicator period, if it can be converted to a number.
        Otherwise it'll return 0.
        """
        try:
            return Decimal(self.actual_value)
        except (InvalidOperation, TypeError):
            return Decimal(self.baseline)

    @property
    def target(self):
        """
        Returns the target value of the indicator period, if it can be converted to a number.
        Otherwise it'll return 0.
        """
        try:
            return Decimal(self.target_value)
        except (InvalidOperation, TypeError):
            return Decimal(self.baseline)

    @property
    def baseline(self):
        """
        Returns the baseline value of the indicator. The baseline is a calculated value:

        - If the period has no previous periods, then it's the baseline value of the indicator
        - If the period has a previous period, then it's the actual value of that period
        - In all other cases, the baseline defaults to 0
        """
        previous_period = self.adjacent_period(False)
        baseline = self.indicator.baseline_value if not previous_period else previous_period.actual

        try:
            return Decimal(baseline)
        except (InvalidOperation, TypeError):
            return Decimal(0)

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
    user = models.ForeignKey(settings.AUTH_USER_MODEL, verbose_name=_(u'user'), db_index=True)
    relative_data = models.BooleanField(_(u'relative data'), default=False)
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

    def save(self, *args, **kwargs):
        """
        Process approved data updates.
        """
        # Set the actual value of the indicator period to 0 if it's not present yet
        if self.period.actual_value == '':
            self.period.actual_value = '0'
            self.period.save(update_fields=['actual_value'])

        # Always copy the period's actual value to the period_actual_value field.
        self.period_actual_value = self.period.actual_value

        if not self.pk:
            # Newly added data update
            if self.status == self.STATUS_APPROVED_CODE:
                # Update is immediately approved. Scenario that probably does not happen very often.
                self.period.update_actual_value(self.data, self.relative_data)
        else:
            orig = IndicatorPeriodData.objects.get(pk=self.pk)

            # Mail admins of a paying partner when an update needs to be approved
            if orig.status != self.STATUS_PENDING_CODE and \
                    self.status == self.STATUS_PENDING_CODE:
                me_managers_group = Group.objects.get(name='M&E Managers')
                me_managers = self.period.indicator.result.project.publishing_orgs.employments().\
                    approved().filter(group=me_managers_group)

                rsr_send_mail(
                    [empl.user.email for empl in me_managers],
                    subject='results_framework/approve_update_subject.txt',
                    message='results_framework/approve_update_message.txt',
                    html_message='results_framework/approve_update_message.html',
                    msg_context={'update': self}
                )

            # Mail the user that created the update when an update needs revision
            elif orig.status != self.STATUS_REVISION_CODE and \
                    self.status == self.STATUS_REVISION_CODE:
                rsr_send_mail(
                    [self.user.email],
                    subject='results_framework/revise_update_subject.txt',
                    message='results_framework/revise_update_message.txt',
                    html_message='results_framework/revise_update_message.html',
                    msg_context={'update': self}
                )

            # Process data when the update has been approved and mail the user about it
            elif orig.status != self.STATUS_APPROVED_CODE and \
                    self.status == self.STATUS_APPROVED_CODE:
                self.period.update_actual_value(self.data, self.relative_data)
                rsr_send_mail(
                    [self.user.email],
                    subject='results_framework/approved_subject.txt',
                    message='results_framework/approved_message.txt',
                    html_message='results_framework/approved_message.html',
                    msg_context={'update': self}
                )

        super(IndicatorPeriodData, self).save(*args, **kwargs)

    def clean(self):
        """
        Perform several checks before we can actually save the update data.
        """
        validation_errors = {}
        # Don't allow a data update to a non-Impact project
        if not self.period.indicator.result.project.is_impact_project:
            validation_errors['period'] = unicode(_(u'Indicator period must be part of an RSR '
                                                    u'Impact project to add data to it'))

        # Don't allow a data update to a locked period
        if self.period.locked:
            validation_errors['period'] = unicode(_(u'Indicator period must be unlocked to add '
                                                    u'data to it'))

        if self.pk:
            orig = IndicatorPeriodData.objects.get(pk=self.pk)
            # Don't allow an approved data update to be changed
            if orig.status == self.STATUS_APPROVED_CODE:
                validation_errors['status'] = unicode(_(u'Not allowed to change approved data '
                                                        u'updates'))

            # Don't allow to approve an update that has a different actual value of the period
            elif self.status == self.STATUS_APPROVED_CODE and \
                    self.period_actual_value != self.period.actual_value:
                validation_errors['period_actual_value'] = unicode(
                    _(u'The actual value of the period has changed, please save the update first '
                      u'before approving it')
                )

            # Don't allow for the indicator period to change
            if orig.period != self.period:
                validation_errors['period'] = unicode(_(u'Not allowed to change indicator period '
                                                        u'in a data update'))
        if validation_errors:
            raise ValidationError(validation_errors)

    def delete(self, *args, **kwargs):
        """
        Check if the data update was already approved. Approved data updates should not be
        deleted, because it could lead to strange scenarios.
        """
        if self.status == self.STATUS_APPROVED_CODE:
            raise FieldError(unicode(_(u'It is not possible to delete an approved data update')))
        super(IndicatorPeriodData, self).delete(*args, **kwargs)

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
