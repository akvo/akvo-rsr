# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

from decimal import Decimal, InvalidOperation

from django.core.exceptions import ValidationError
from django.db import models
from django.utils.translation import ugettext_lazy as _

from ..fields import ValidXMLCharField
from akvo.codelists.models import IndicatorMeasure
from akvo.codelists.store.codelists_v201 import INDICATOR_MEASURE
from akvo.utils import codelist_choices, codelist_value


class Indicator(models.Model):
    result = models.ForeignKey('Result', verbose_name=_(u'result'), related_name='indicators')
    title = ValidXMLCharField(
        _(u'title'), blank=True, max_length=255,
        help_text=_(u'Enter the title for the indicator from the project result. (255 characters)')
    )
    measure = ValidXMLCharField(
        _(u'measure'), blank=True, max_length=1, choices=codelist_choices(INDICATOR_MEASURE),
        help_text=_(u'Select whether the indicator counts units or evaluates a percentage.')
    )
    ascending = models.NullBooleanField(
        _(u'ascending'), blank=True,
        help_text=_(u'Is the aim of the project to increase or decrease the value of the '
                    u'indicator?'))
    description = ValidXMLCharField(
        _(u'description'), blank=True, max_length=2000,
        help_text=_(u'You can further define the indicator here. (2000 characters)')
    )
    baseline_year = models.PositiveIntegerField(
        _(u'baseline year'), blank=True, null=True, max_length=4,
        help_text=_(u'Enter the year that the baseline information was obtained.')
    )
    baseline_value = ValidXMLCharField(
        _(u'baseline value'), blank=True, max_length=50,
        help_text=_(u'Enter the value of the baseline indicator. (50 characters)')
    )
    baseline_comment = ValidXMLCharField(
        _(u'baseline comment'), blank=True, max_length=2000,
        help_text=_(u'You can further define the baseline here. (2000 characters)')
    )

    def __unicode__(self):
        indicator_unicode = self.title if self.title else u'%s' % _(u'No indicator title')

        if self.periods.all():
            indicator_unicode += u' - %s %s' % (unicode(self.periods.count()),
                                                _(u'period(s)'))

        return indicator_unicode

    def save(self, *args, **kwargs):
        """Update the values of child indicators, if a parent indicator is updated."""
        if self.pk:
            orig_indicator = Indicator.objects.get(pk=self.pk)
            child_results = self.result.child_results.all()
            child_indicators = Indicator.objects.filter(
                result__in=child_results,
                title=orig_indicator.title,
                measure=orig_indicator.measure,
                ascending=orig_indicator.ascending
            )

            for child_indicator in child_indicators:
                child_indicator.title = self.title
                child_indicator.measure = self.measure
                child_indicator.ascending = self.ascending
                child_indicator.save()

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
        Indicates whether this result is linked to a parent result.
        """
        return True if self.result.parent_result else False

    @property
    def last_updated(self):
        from akvo.rsr.models import ProjectUpdate
        period_updates = ProjectUpdate.objects.filter(indicator_period__indicator=self)
        return period_updates.order_by('-created_at')[0].time_gmt if period_updates else None

    class Meta:
        app_label = 'rsr'
        verbose_name = _(u'indicator')
        verbose_name_plural = _(u'indicators')


class IndicatorPeriod(models.Model):
    indicator = models.ForeignKey(Indicator, verbose_name=_(u'indicator'), related_name='periods')
    period_start = models.DateField(
        _(u'period start'), null=True, blank=True,
        help_text=_(u'Enter the start date of the period the indicator is being tracked within.')
    )
    period_end = models.DateField(
        _(u'period end'), null=True, blank=True,
        help_text=_(u'Enter the end date of the period the indicator is being tracked within.')
    )
    target_value = ValidXMLCharField(
        _(u'target value'), blank=True, max_length=50,
        help_text=_(u'Enter the value of the indicator that the project is intending to reach. '
                    u'(50 characters)')
    )
    target_comment = ValidXMLCharField(
        _(u'target comment'), blank=True, max_length=2000,
        help_text=_(u'You can comment on the target value here. (2000 characters)')
    )
    actual_value = ValidXMLCharField(
        _(u'actual value'), blank=True, max_length=50,
        help_text=_(u'Enter the value of the indicator that the project has reached. '
                    u'(50 characters)')
    )
    actual_comment = ValidXMLCharField(
        _(u'actual comment'), blank=True, max_length=2000,
        help_text=_(u'You can comment on the actual value here. (2000 characters)')
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
        if self.pk:
            orig_period = IndicatorPeriod.objects.get(pk=self.pk)
            child_results = self.indicator.result.child_results.all()
            child_periods = IndicatorPeriod.objects.filter(
                indicator__result__in=child_results,
                period_start=orig_period.period_start,
                period_end=orig_period.period_end
            )

            for child_period in child_periods:
                child_period.period_start = self.period_start
                child_period.period_end = self.period_end
                child_period.save()

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

    def update_actual_value(self, update_value):
        """
        :param update_value; String or Integer that should be castable to Decimal

        Updates the actual value of the period.
        """
        try:
            self.actual_value = str(Decimal(self.actual) + Decimal(update_value))
        except (InvalidOperation, TypeError):
            self.actual_value = update_value

        self.save(update_fields=['actual_value'])

        # Update parent period
        parent = self.parent_period()
        if parent:
            parent.update_actual_value(update_value)

    @property
    def percent_accomplishment(self):
        """
        Return the percentage completed for this indicator period. If not possible to convert the
        values to numbers, return 0.
        """
        if not self.target_value:
            return 0

        actual_value = self.actual_value if self.actual_value else self.baseline
        baseline = self.baseline
        try:
            return round(
                (Decimal(actual_value) - Decimal(baseline)) /
                (Decimal(self.target_value) - Decimal(baseline)) *
                100, 1
            )
        except (InvalidOperation, TypeError):
            return 0

    @property
    def percent_accomplishment_100(self):
        """
        Similar to the percent_accomplishment property. However, it won't return any number bigger
        than 100.
        """
        return 100 if self.percent_accomplishment > 100 else self.percent_accomplishment

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
        Returns the baseline value of the indicator, if it can be converted to a number. Otherwise
        it'll return 0.
        """
        baseline = 0

        ordered_periods = self.indicator.periods.exclude(period_start=None).order_by('period_start')
        if ordered_periods.exists() and self == ordered_periods[0]:
            baseline = self.indicator.baseline_value
        elif self in ordered_periods:
            prev_period = None
            for period in ordered_periods:
                if not self == period:
                    prev_period = period
                else:
                    baseline = prev_period.actual
                    break

        try:
            return Decimal(baseline)
        except (InvalidOperation, TypeError):
            return Decimal(0)

    class Meta:
        app_label = 'rsr'
        verbose_name = _(u'indicator period')
        verbose_name_plural = _(u'indicator periods')
        ordering = ['period_start']
