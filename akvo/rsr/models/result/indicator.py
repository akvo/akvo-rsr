# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

from akvo.codelists.models import IndicatorMeasure
from akvo.codelists.store.default_codelists import INDICATOR_MEASURE as IM
from akvo.rsr.fields import ValidXMLCharField
from akvo.utils import codelist_choices, codelist_value

from django.contrib.postgres.fields import ArrayField
from django.core.exceptions import ValidationError
from django.db import models
from django.utils.translation import gettext_lazy as _
from django.db.models.signals import post_save, m2m_changed
from django.dispatch import receiver

from .default_period import DefaultPeriod
from .indicator_period import IndicatorPeriod
from .indicator_label import IndicatorLabel
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

    result = models.ForeignKey('Result', on_delete=models.CASCADE, verbose_name=_('result'), related_name='indicators')
    parent_indicator = models.ForeignKey(
        'self', blank=True, null=True, default=None,
        on_delete=models.SET_NULL,
        verbose_name=_('parent indicator'), related_name='child_indicators'
    )
    title = ValidXMLCharField(
        _('indicator title'), blank=True, max_length=500,
        help_text=_('Within each result indicators can be defined. Indicators should be items '
                    'that can be counted and evaluated as the project continues and is completed.')
    )
    # NOTE: type and measure should probably only be one field measure, wit the values Unit,
    # Percentage and Qualitative. However since the project editor design splits the choice we use
    # two fields, type and measure to simplify the interaction between front and back end.
    type = models.PositiveSmallIntegerField(
        _('indicator type'), choices=INDICATOR_TYPES, default=QUANTITATIVE
    )
    measure = ValidXMLCharField(
        _('indicator measure'), blank=True, max_length=1,
        choices=codelist_choices(INDICATOR_MEASURE),
        help_text=_('Choose how the indicator will be measured (in percentage or units).')
    )
    ascending = models.BooleanField(
        _('ascending'), blank=True, null=True,
        help_text=_('Choose ascending if the target value of the indicator is higher than the '
                    'baseline value (eg. people with access to sanitation). Choose descending if '
                    'the target value of the indicator is lower than the baseline value '
                    '(eg. people with diarrhea).'))
    cumulative = models.BooleanField(
        _('cumulative'), default=False,
        help_text=_('Select if indicators report a running total so that each reported actual '
                    'includes the previously reported actual and adds any progress made since '
                    'the last reporting period.')
    )
    description = ValidXMLCharField(
        _('indicator description'), blank=True, max_length=2000,
        help_text=_('You can provide further information of the indicator here.')
    )
    baseline_year = models.PositiveIntegerField(
        _('baseline year'), blank=True, null=True,
        help_text=_('The year the baseline value was taken.')
    )
    baseline_value = ValidXMLCharField(
        _('baseline value'), blank=True, max_length=200,
        help_text=_('The value of the baseline at the start of the project.')
    )
    baseline_comment = ValidXMLCharField(
        _('baseline comment'), blank=True, max_length=2000,
        help_text=_('Here you can provide extra information on the baseline value, if needed.')
    )
    target_value = models.DecimalField(
        _('target value'), max_digits=20, decimal_places=2, null=True, blank=True,
        help_text=_('The target value for all reporting periods in this indicator.')
    )
    target_comment = ValidXMLCharField(
        _('target value comment'), blank=True, max_length=2000,
        help_text=_('Here you can provide extra information on the target value, if needed.')
    )
    order = models.PositiveSmallIntegerField(_('indicator order'), null=True, blank=True)
    export_to_iati = models.BooleanField(
        _('Include indicator in IATI exports'), default=True,
        help_text=_('Choose whether this indicator will be included in IATI exports. '
                    'If you are not exporting to IATI, you may ignore this option.')
    )
    dimension_names = models.ManyToManyField('IndicatorDimensionName', related_name='indicators')
    scores = ArrayField(models.CharField(max_length=1000), default=list)
    baseline_score = models.SmallIntegerField(_('baseline score'), null=True, blank=True)
    target_score = models.SmallIntegerField(_('target score'), null=True, blank=True)
    enumerators = models.ManyToManyField('User', related_name='assigned_indicators')

    def __str__(self):
        indicator_unicode = self.title if self.title else '%s' % _('No indicator title')

        if self.periods.all():
            indicator_unicode += ' - %s %s' % (str(self.periods.count()),
                                               _('period(s)'))

        indicator_unicode += ' - %s' % dict(self.INDICATOR_TYPES)[self.type]

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
                validation_errors['result'] = '%s' % \
                    _('It is not possible to update the result of this indicator, '
                      'because it is linked to a parent result.')
            if self.title != orig_indicator.title:
                validation_errors['title'] = '%s' % \
                    _('It is not possible to update the title of this indicator, '
                      'because it is linked to a parent result.')
            if self.measure != orig_indicator.measure:
                validation_errors['measure'] = '%s' % \
                    _('It is not possible to update the measure of this indicator, '
                      'because it is linked to a parent result.')
            if self.ascending != orig_indicator.ascending:
                validation_errors['ascending'] = '%s' % \
                    _('It is not possible to update the ascending value of this indicator, '
                      'because it is linked to a parent result.')

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
                    if sibling_indicators[ind].order:
                        sibling_indicators[ind].order -= 1
                        sibling_indicators[ind].save()

        super(Indicator, self).delete(*args, **kwargs)

    def descendants(self, depth=None):
        family = {self.pk}
        children = {self.pk}
        search_depth = 0
        while depth is None or search_depth < depth:
            children = Indicator.objects.filter(parent_indicator__in=children).values_list('pk', flat=True)
            if family.union(children) == family:
                break
            family = family.union(children)
            search_depth += 1
        return Indicator.objects.filter(pk__in=family)

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

    def is_cumulative(self):
        """
        The cumulative setting is ignored if the indicator is a percentage measure
        because the percentage measure can only be updated once per period.
        """
        return self.cumulative and self.measure != PERCENTAGE_MEASURE

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
        verbose_name = _('indicator')
        verbose_name_plural = _('indicators')
        unique_together = ('result', 'parent_indicator')


# Add default indicator periods if necessary
@receiver(post_save, sender=Indicator, dispatch_uid='add_default_periods')
def add_default_periods(sender, instance, created, **kwargs):
    # Disable signal handler when loading fixtures
    if kwargs.get('raw', False):
        return

    if created and instance.parent_indicator is None:
        project = instance.result.project
        default_periods = DefaultPeriod.objects.filter(project=project)
        periods = [
            IndicatorPeriod(
                indicator=instance, period_start=period.period_start, period_end=period.period_end)
            for period in default_periods
        ]
        IndicatorPeriod.objects.bulk_create(periods)


@receiver(m2m_changed, sender=Indicator.dimension_names.through)
def add_dimension_names_to_children(sender, instance, action, **kwargs):
    # Disable signal handler when loading fixtures
    if kwargs.get('raw', False):
        return

    if not action.startswith('post_'):
        return

    if not instance.child_indicators.exists():
        return

    dimension_name = kwargs['model'].objects.filter(id__in=kwargs['pk_set']).first()
    for indicator in instance.child_indicators.all():
        child_dimension_name = indicator.result.project.copy_dimension_name(dimension_name, set_parent=True)

        if action == 'post_add':
            indicator.dimension_names.add(child_dimension_name)

        elif action == 'post_remove':
            indicator.dimension_names.remove(child_dimension_name)
