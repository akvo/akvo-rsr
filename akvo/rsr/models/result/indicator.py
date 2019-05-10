# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

from akvo.codelists.models import IndicatorMeasure
from akvo.codelists.store.default_codelists import INDICATOR_MEASURE as IM
from akvo.rsr.fields import ValidXMLCharField
from akvo.utils import codelist_choices, codelist_value

from decimal import Decimal, InvalidOperation

from django.core.exceptions import ValidationError
from django.db import models
from django.utils.translation import ugettext_lazy as _
from django.db.models.signals import post_save
from django.dispatch import receiver

from .indicator_period import IndicatorPeriod
from .indicator_label import IndicatorLabel
from .result import Result
from .utils import PERCENTAGE_MEASURE, QUALITATIVE, QUANTITATIVE

# Currently we support only Unit, Percentage measures. Qualitative is
# implemented as a different Indicator type, and hence we drop that from the
# measure list. We also drop nominal and ordinal since we don't support those.
INDICATOR_MEASURE = IM[:3]


class Indicator(models.Model):
    project_relation = 'results__indicators__in'

    INDICATOR_TYPES = (
        (QUANTITATIVE, _('Quantitative')),
        (QUALITATIVE, _('Qualitative')),
    )

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
    # NOTE: type and measure should probably only be one field measure, wit the values Unit,
    # Percentage and Qualitative. However since the project editor design splits the choice we use
    # two fields, type and measure to simplify the interaction between front and back end.
    type = models.PositiveSmallIntegerField(
        _('indicator type'), choices=INDICATOR_TYPES, default=QUANTITATIVE
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
        _(u'baseline year'), blank=True, null=True,
        help_text=_(u'The year the baseline value was taken.')
    )
    baseline_value = ValidXMLCharField(
        _(u'baseline value'), blank=True, max_length=200,
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
    export_to_iati = models.BooleanField(
        _(u'Include indicator in IATI exports'), default=True,
        help_text=_(u'Choose whether this indicator will be included in IATI exports. '
                    u'If you are not exporting to IATI, you may ignore this option.')
    )

    def __unicode__(self):
        indicator_unicode = self.title if self.title else u'%s' % _(u'No indicator title')

        if self.periods.all():
            indicator_unicode += u' - %s %s' % (unicode(self.periods.count()),
                                                _(u'period(s)'))

        indicator_unicode += u' - %s' % dict(self.INDICATOR_TYPES)[self.type]

        return indicator_unicode

    def save(self, *args, **kwargs):
        """Update the values of child indicators, if a parent indicator is updated."""

        new_indicator = not self.pk

        if new_indicator and Indicator.objects.filter(result_id=self.result.id).exists():
            prev_indicator = Indicator.objects.filter(result_id=self.result.id).reverse()[0]
            if prev_indicator.order:
                self.order = prev_indicator.order + 1

        # HACK: Delete IndicatorLabels on non-qualitative indicators
        if new_indicator and self.type != QUALITATIVE:
            IndicatorLabel.objects.filter(indicator=self).delete()

        super(Indicator, self).save(*args, **kwargs)

        for child_result in self.result.child_results.all():
            if new_indicator:
                child_result.project.copy_indicator(child_result, self, set_parent=True)
            else:
                child_result.project.update_indicator(child_result, self)

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
        if self.measure == PERCENTAGE_MEASURE and self.is_parent_indicator() and \
                self.result.project.aggregate_children and \
                any(self.child_indicators.values_list('result__project__aggregate_to_parent', flat=True)):
            return True
        return False

    class Meta:
        app_label = 'rsr'
        ordering = ['order', 'id']
        verbose_name = _(u'indicator')
        verbose_name_plural = _(u'indicators')
        unique_together = ('result', 'parent_indicator')


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
